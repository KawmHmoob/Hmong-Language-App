# Supabase Schema, RLS, and the Signup Trigger

The SQL lives in **`instructions/supabase-schema.sql`** — paste it into the
Supabase SQL editor and run once. It's idempotent, so re-running is safe.

This note is the *why*.

---

## What the app actually needs — two env vars, two tables

```
VITE_SUPABASE_URL       ← in .env.local
VITE_SUPABASE_ANON_KEY  ← in .env.local
```

That's the entire configuration. **No `DATABASE_URL`, no service-role key.**
Supabase from a browser is an HTTP API, not a Postgres connection: there's no
driver, no connection string, no pooling.

### ⚠️ The service-role key must never be in this repo
It **bypasses RLS entirely** — full read/write/delete on every row for anyone
holding it. There is no server in this app, so there is nowhere safe to use it.

It was briefly added to `.env`, and `.gitignore` covered `*.local` but **not a
plain `.env`** — so it was one `git add -A` from being committed. Verified never
committed on any branch; `.gitignore` now covers `.env` and `.env.*`.

If admin operations are ever needed (deleting orphaned auth users), they belong
in a **Supabase Edge Function** where the key lives in Supabase's own secret
store — never in the client bundle.

### Why a public key is fine
The anon key ships in the JS bundle and is *meant* to be public. **RLS policies
are the security boundary, not key secrecy.** Which is why the policies below
aren't optional hardening — without them, "public key + no policies" means
anyone can `curl` your entire `profiles` table, emails included.

---

## The tables, and why they're shaped this way

Both derived from what the code literally reads/writes — nothing speculative:

| Table | Columns | Used by |
|---|---|---|
| `profiles` | `id, username, display_name, email, dialect_preference, joined_at` | `AuthContext.rowToUser` |
| `progress` | `user_id, data (jsonb), updated_at` | `ProgressContext` load/save |

### Why `progress.data` is one jsonb blob
The app treats progress as a single atomic object — load all on boot, save all
on a debounce. Nothing ever queries *into* it. Normalizing it would mean a
migration every time a field is added (and this session alone added
`seasonPoints`, `dailyEarned`, `weekEarned`, `clipsContributed`) for zero query
benefit.

**This is the right call here and the wrong call for the voice corpus.** That
needs per-utterance rows, real columns, and the ability to query by score and
`scorer_version` (future-implementations/03). Don't extend this blob for it.

### Constraints that carry meaning
- `dialect_preference check (in ('white','green'))` — a typo can't silently
  create a third dialect that no content exists for.
- **Case-insensitive unique username** via `unique index on lower(username)`.
  `Devv` and `devv` are the same handle. The "that username is taken" error in
  `AuthContext` assumes this constraint exists — without it the message is a
  lie, because the insert would succeed.
- `on delete cascade` on both foreign keys — deleting an auth user cleans up
  their rows, no orphans.

---

## RLS: six policies, and one trap

Every policy is `auth.uid() = <owner column>`. Notable choices:

**Both INSERT and UPDATE on `progress`.** `ProgressContext` uses `upsert()`,
which is an insert that *may* become an update. Granting only one silently
breaks half the saves — and it'd look like "progress sometimes doesn't stick,"
which is miserable to debug.

**No DELETE policy anywhere.** Nothing in the app deletes rows, and an absent
policy means denied. Least privilege by default.

### ⚠️ The leaderboard will fight the profiles SELECT policy
`profiles` SELECT is restricted to your own row. The moment the leaderboard
reads real users, it needs *other people's* usernames — and the tempting fix is
`using (true)`.

**Don't.** That exposes every user's email address. Use a view that projects
only the public columns (`username`, points), or a column-scoped policy. Written
here because this is exactly the shortcut taken under deadline pressure.

---

## The signup trigger — why it's not optional

Registration was two independent writes:

```
supabase.auth.signUp()          → auth.users row created
supabase.from('profiles')...    → could still fail
```

Fail the second and the account is **unrecoverable from the UI**: the email is
taken so they can't re-register, and with no profile the app can't identify
them. Cleaning that up needs the service-role key, which the browser must never
hold.

`on_auth_user_created` creates the profile in the **same transaction** as the
signup. Two details that matter:

- **`security definer`** — runs as the function owner, so it can write a row the
  brand-new user has no session for yet.
- **`set search_path = ''`** — prevents search-path hijacking, which is the
  standard footgun in definer functions.

`register()` now passes `username / display_name / dialect_preference` as signup
**metadata** (`options.data`), which is what the trigger reads. Without it the
trigger still fires but has to invent a username from the email local-part.

### The bug this restructure caught
With email confirmation **ON**, `signUp()` returns a user but **no session**. The
original code then ran the client-side `profiles` upsert — with `auth.uid()`
null, so the RLS insert policy rejects it, and **registration throws even though
it succeeded.**

Fixed by returning `{ pendingConfirmation: true }` *before* touching `profiles`.
The trigger has already created the row server-side, which is precisely why it
has to be the primary mechanism and the client write only a fallback.

The client upsert stays, deliberately: it's what makes the app work against a
database where the trigger hasn't been run — a contributor's fresh project. With
the trigger installed it's a harmless no-op re-write of identical values.

### Duplicate usernames now fail at the trigger
Because the unique index is enforced inside the trigger's insert, a taken
username makes **`signUp()` itself** fail. So the friendly error had to be
handled on the `signUp` result too, not just on the upsert.

---

---

## "Database error saving new user" — the real cause

Hit during first testing. Worth documenting in full, because the error message
is actively unhelpful and the root cause is a trap that will recur.

### The message tells you nothing on purpose
Supabase does **not** forward trigger errors to the client — they can leak
schema details. So any failure inside `handle_new_user()` surfaces as the same
generic string, whatever actually went wrong. **The real message only exists in
Dashboard → Logs → Postgres Logs.** Check there first, always.

### The chain
1. A `profiles` table already existed, created by hand before this script.
2. **`create table if not exists` does NOTHING when the table exists** — not
   "adds the missing bits", *nothing*. So the column definitions, the
   `on delete cascade`, and the CHECK constraint in this file were all silently
   skipped. (Confirmed by inspection: `dialect_preference` and `joined_at` came
   back nullable, where this file declares them `not null`.)
3. That hand-made table's foreign key had **no `on delete cascade`**. Deleting
   the auth user during testing left the profile row behind.
4. The orphan kept holding its username.
5. The next signup with that username hit the case-insensitive unique index
   **inside the trigger** → the insert threw → the whole signup transaction
   rolled back → generic error.

The atomicity worked exactly as designed — no orphaned *auth* user was created.
The orphan was on the other side, and predated the trigger.

### The fix: sections 1b and 2b
`create table if not exists` can't be trusted to converge an existing table, so
both tables now get an explicit reconcile block that runs unconditionally:

- `add column if not exists` for every column
- **backfill nulls, then** tighten to `not null` (the reverse order fails)
- re-assert defaults
- **drop and re-add the FK with `on delete cascade`** — the orphan fix
- drop and re-add the dialect CHECK — so an older two-value constraint accepts
  new dialects
- **delete existing orphans BEFORE creating the unique index** — a duplicate
  orphan would otherwise make the index build fail

Every statement is a no-op on a table this file just created, so the script
stays safe to run on a fresh project.

### Two smaller traps handled inside that block
- **Order matters within the migration.** `set not null` on a column containing
  nulls errors, so each backfill `update` precedes its `alter`.
- **The username backfill can collide.** `a@x.com` and `a@y.com` both reduce to
  `a`, which would fail the unique index build. It appends a slice of the uuid.

### And one I caused writing it
The `progress` reconcile block was originally placed in section 1 — **before**
`create table public.progress` in section 2. It would have failed on a fresh
database with "relation does not exist". Caught by a script that parses the file
and checks nothing is altered before it's created; the block moved to 2b.

> `IF NOT EXISTS` makes a script safe to re-run. It does **not** make it
> converge. Those are different properties, and assuming the first gives you the
> second is how a schema silently drifts from its definition.

## Testing checklist (run in this order)

1. **Run the SQL**, then the three verify queries at the bottom of the file —
   `rowsecurity = true` on both tables, 6 policies, 1 trigger.
2. **Register a new account.** Confirm in the dashboard: a row in `auth.users`
   AND a matching row in `profiles` with your chosen username.
3. **Register again with the same username, different email** → should fail with
   "That username is already taken," and create **no** partial account.
4. **Log out and back in** → profile hydrates, header shows your username.
5. **Earn some progress** (finish a lesson step), reload → it persists. Check
   the `progress` row's `data` column.
6. **Guest adoption:** log out, do something as a guest, register a *new*
   account → the guest progress should carry over (notes/36).
7. **RLS proof:** with two accounts, confirm account A cannot read B's row. In
   the SQL editor: `select * from profiles;` as anon should return 0 rows.

Step 7 is the one people skip. It's the only one that actually proves the data
is protected.

## Files
- `instructions/supabase-schema.sql` — the script
- `src/context/AuthContext.jsx` — signup metadata, confirmation-path reorder
- `.gitignore` — `.env` / `.env.*` now covered
