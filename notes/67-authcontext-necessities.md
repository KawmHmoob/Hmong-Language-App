# AuthContext — What It Needs Before Going Live

Four problems found reviewing `AuthContext` ahead of the Supabase wiring. Three
are fixed here; the fourth needs a DB change and is specified below.

---

## 1. ⚠️ A failed profile read turned an account into "guest" — FIXED

```js
if (error || !data) {
  setUser(guestUser)   // ← the bug
  return null
}
```

If the `profiles` read failed for **any** reason — RLS misconfigured, row
missing, transient network — an authenticated user with a valid session was
presented as a guest.

**Why that's worse than it looks.** `ProgressContext` keys storage off
`user?.id || 'guest'`:

```js
const userId = user?.id || 'guest'
```

So a real user whose profile read hiccuped would start writing progress to the
**guest key** — shared with everyone else on that device, and eligible to be
*adopted into the next account created there* by the guest-adoption path
(notes/36). One transient error and two people's study history merge.

**Fix:** a failed read no longer demotes to guest. The auth id is real and
unique, so we keep an authed identity with that id (progress still keys
correctly) and expose a new `profileError` so the UI can say "your account is in
a broken state" instead of lying about who you are.

> Losing a profile is recoverable. Silently becoming a different identity is not.

`profileError` is cleared on sign-out and on a successful hydrate.

## 2. ⚠️ Registration can orphan an account — PARTIALLY FIXED, needs SQL

`register()` does two independent writes:

```
supabase.auth.signUp()        → auth.users row created
supabase.from('profiles')...  → can still fail
```

If the second fails, the account is **unusable and unrecoverable from the UI**:
the email is taken so they can't re-register, and with no profile the app can't
identify them. Deleting an auth user requires the service-role key, which the
browser must never hold.

**Done here:** `insert` → `upsert({ onConflict: 'id' })`, so retrying the same
signup is idempotent instead of failing on a duplicate id, and the error message
is human-readable ("That username is already taken") rather than a raw Postgres
string.

**Still needed — the real fix is a trigger** so the profile is created in the
same transaction as the signup, and the client never has to do a second write:

```sql
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, username, display_name, dialect_preference)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce(new.raw_user_meta_data->>'dialect_preference', 'white')
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

Then `signUp` passes the fields as metadata:

```js
supabase.auth.signUp({ email, password, options: { data: { username, display_name, dialect_preference } } })
```

…and the client-side insert can be deleted entirely. **Do this before real
signups happen** — orphaned accounts can't be cleaned up afterward without
admin access.

## 3. ⚠️ The "works without Supabase" stub was broken — FIXED

`supabase.js` promises the app runs with no env vars. It didn't:

```js
from: (table) => ({
  select: () => stubResult(...),   // returns a PROMISE
  eq: function () { return this }, // ...but eq lives on the object, not the promise
})
```

`from('profiles').select('*').eq('id', uid)` called `.eq` **on a Promise** →
`TypeError: eq is not a function`. Any chained query crashed rather than
degrading.

Replaced with a **thenable query builder** — every method returns `this`, and
`then/catch/finally` resolve the stub result. Chains of any length now work.

Not hit today (`.env.local` is configured) but it meant a fresh clone crashed
instead of running, which is exactly what the stub existed to prevent.

## 4. `loading` is exposed but nothing consumes it — OPEN

```js
const [loading, setLoading] = useState(true)   // provided, never read
```

`getSession()` is async, so on every page load the first render has
`user = guestUser` even for a signed-in user. Consequences:

- A logged-in user sees "Guest" in the header for a beat.
- `AccountGate` briefly blocks content they've paid for / signed up for.
- Guest-limit UI (`isPhraseGuestAllowed`) flashes locks that then disappear.

Not corrupting — `ProgressContext` re-runs its load effect when `userId`
changes, and its `hydrated` flag already guards the save path. It's a
flash-of-wrong-state, not data loss.

**Decision needed:** gate the app's first paint on `loading` (a beat of skeleton,
no wrong state) or let it flash. Session reads come from local storage, so the
delay is short — I'd gate it, but it's a UX call, not a correctness one.

---

## Also worth doing before launch

- **Username uniqueness** needs a `unique` constraint on `profiles.username`.
  Without it two people can take the same handle and the leaderboard gets
  ambiguous. The error message added in §2 assumes the constraint exists.
- **RLS policies** — `profiles` and `progress` must be readable/writable only by
  their owner. See `instructions/supabase-first-time-setup.md`.
- **`updateProfile` reads the session** rather than closing over `user`, which
  is correct — keep it that way if it's refactored.

## Files
- `src/context/AuthContext.jsx` — no-guest-fallback, `profileError`, upsert + friendly errors
- `src/lib/supabase.js` — thenable stub query builder
