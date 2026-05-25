# Supabase — First-Time Setup (Teaching Guide)

This is the **before-you-write-any-code** walkthrough. Once you've finished it, you'll have a working Supabase project, env vars in place, the right tables created, and a basic understanding of how the pieces fit together. Then you can follow [supabase-integration.md](supabase-integration.md) to wire it into the app's contexts.

If you've used Supabase before, skim this and jump to the [SQL section](#5-create-the-database-tables). If this is your first time touching a backend, read top-to-bottom.

---

## 0. What Supabase actually is (one sentence)

**Supabase is a hosted Postgres database with built-in user authentication, file storage, and an auto-generated REST/realtime API — all secured by row-level security rules you write in SQL.**

That's the whole product. The reason it shows up in tutorials is that for a small app like Kawm Hmoob, those four things (database, auth, storage, API) are 90% of what you'd otherwise build yourself.

What we'll use:
- **Auth** — sign-up / login (replaces the current localStorage-only `AuthContext`).
- **Database** — store user profiles, progress, and subscription tier.
- **Row-Level Security (RLS)** — make sure user A can never read user B's data, enforced *inside the database*, not in your client code.

What we'll skip for now:
- Storage — eventually for audio files, but not today.
- Edge Functions — eventually for the Stripe webhook, but not today.
- Realtime subscriptions — not needed for this app.

---

## 1. Create your account and project

1. Go to [supabase.com](https://supabase.com) → "Start your project" → sign in with GitHub.
2. You'll land in an **organization**. Think of an organization as your company / team. For a solo project, the default one Supabase creates is fine.
3. Click **New Project** inside the organization.

Fill in:

| Field | What to pick | Why |
|---|---|---|
| Name | `kawm-hmoob` | Just an internal label. |
| Database password | Click "Generate" and **save it in a password manager** | This is the Postgres superuser password. You'll need it if you ever connect via a SQL client or run migrations from the CLI. You **cannot** retrieve it later — only reset. |
| Region | Closest to your users (likely US-West or US-East for Hmong-American audience) | Latency. Pick once; moving regions later means a database dump + restore. |
| Pricing plan | Free | The free tier is enough for thousands of users. Upgrade when you need to. |

Click **Create new project**. It takes ~2 minutes to provision.

---

## 2. Find your project's URL and keys

Once the project is up, go to **Project Settings → API** (gear icon in the left sidebar).

You'll see three things that matter:

### Project URL
Looks like `https://abcdefghij.supabase.co`. **Safe to ship to the client.** It's just an address.

### `anon` `public` key
A long JWT (`eyJhbGc...`). **Safe to ship to the client.** This key, on its own, lets you do *nothing* — it just identifies which project the request is for. Real permission to read/write data is decided by the RLS policies you'll write in step 6.

> **The most important mental model in this whole guide:** the anon key is not a password. It's a project ID. It is *designed* to be public. What stops random people on the internet from reading your database is **RLS policies**, not key secrecy. Get this wrong and you'll either be paranoid about exposing the anon key (you don't need to be) or careless about RLS (you really, really need to be).

### `service_role` `secret` key
Another long JWT. **NEVER ship this to the client. NEVER commit it to git.** This key bypasses all RLS policies and can read/write/delete anything in the database. Its only legitimate uses are: (a) server-side code like your Stripe webhook handler, (b) one-off admin scripts you run locally.

If this key ever leaks, regenerate it immediately from this same dashboard page.

---

## 3. Set up your local env vars

In your project root (next to `package.json`), copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:
```
VITE_SUPABASE_URL=https://abcdefghij.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Three things to understand:

**Why `.env.local` and not `.env`?** Vite reads both, but `.env.local` is gitignored by default (via the `*.local` line in `.gitignore`). The convention: `.env` would be checked-in defaults; `.env.local` is your personal overrides with real secrets. We only need the latter.

**Why the `VITE_` prefix?** Vite only exposes env vars prefixed with `VITE_` to the client bundle. This is a safety guardrail: a stray `DATABASE_PASSWORD=xxx` in your env file will *not* end up shipped to users' browsers because it lacks the prefix. Don't fight the prefix — it exists to protect you.

**Why is it OK to expose `VITE_SUPABASE_ANON_KEY` to users?** Re-read the box in step 2. Anon key + no RLS = total compromise. Anon key + correct RLS = totally safe. The scary part is the RLS rules, not the key.

> There's already a file in your repo root named `env` (no extension). That's not what Vite reads — it'll be ignored. Move whatever you've put there into `.env.local`. Optionally delete the `env` file once it's empty, or add it to `.gitignore` as a safety net.

---

## 4. Install the SDK

```bash
npm install @supabase/supabase-js
```

Then open [src/lib/supabase.js](../src/lib/supabase.js). Replace the bottom of the file:

```js
// Before:
export const supabase = stubClient

// After:
import { createClient } from '@supabase/supabase-js'
export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey)
  : stubClient
```

The `isSupabaseConfigured()` ternary means: if env vars are missing (e.g. a contributor cloned the repo without `.env.local`), the app falls back to the stub instead of crashing. The real client only takes over when both env vars are present.

Restart your dev server (`npm run dev`) — Vite reads env vars at startup, so changes to `.env.local` need a restart to take effect.

---

## 5. Create the database tables

Go to **SQL Editor** in the Supabase dashboard (looks like a database icon with code brackets). Click **New query**.

You'll paste a bunch of SQL here. SQL might look intimidating if you haven't written it before, but you're doing three things:

1. Telling Postgres what tables to create and what columns each one has.
2. Turning on row-level security so the tables are locked down.
3. Writing policies that say "a user can only see their own rows."

Paste this and click **Run**:

```sql
-- ─────────────────────────────────────────────────────────
-- profiles: extra info about each user, 1:1 with auth.users
-- ─────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  email text,
  dialect_preference text default 'white',
  joined_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- progress: one row per user, all progress stored as JSON
-- ─────────────────────────────────────────────────────────
create table progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- subscriptions: one row per user, tier comes from Stripe
-- ─────────────────────────────────────────────────────────
create table subscriptions (
  user_id uuid primary key references auth.users on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  expires_at timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- Turn on RLS for all three. Without this, anon key holders
-- could read/write everything. THIS LINE IS THE LOCK.
-- ─────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table progress enable row level security;
alter table subscriptions enable row level security;
```

### What each table is for

**`profiles`** — Supabase's built-in `auth.users` table only stores email + password. Anything *app-specific* about a user (display name, dialect preference) goes in `profiles`. The `id` column references `auth.users.id`, which creates the 1:1 relationship. `on delete cascade` means: if a user deletes their account, their profile row is auto-deleted too.

**`progress`** — A single JSON blob per user, holding the state that's currently in `localStorage`'s `kawmhmoob.progress.<userId>` key. We use JSON (`jsonb`) instead of separate columns for each field because the progress shape is small, evolves frequently, and is only ever read/written as a whole. Once you have a million users and want analytics on "what % completed Foundations", you'll regret JSON — but you'll also have the budget to migrate.

**`subscriptions`** — Tier state. Note that `tier` has a `check` constraint: only `'free'` or `'pro'` are accepted. If you try to insert `'gold'`, Postgres refuses. **Always encode invariants in the database when you can** — relying on the client to "only send valid values" fails the moment you have two clients.

### What `enable row level security` actually does

By default, Postgres lets anyone with valid credentials read/write any row. RLS flips this: once enabled, **nobody can read anything until you write a policy that says they can**. The default is now deny-all. This is why we enable it on every table — forgetting one is the exact pattern that causes data leaks in headlines.

---

## 6. Write the RLS policies

Still in the SQL Editor, paste this and run:

```sql
-- profiles: users can read & update their own profile
create policy "self read profiles"
  on profiles for select using (auth.uid() = id);

create policy "self update profiles"
  on profiles for update using (auth.uid() = id);

create policy "self insert profiles"
  on profiles for insert with check (auth.uid() = id);

-- progress: full read/write on your own row
create policy "self rw progress"
  on progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- subscriptions: read your own row, but NEVER write from the client
-- (writes only happen via the service-role key in the Stripe webhook)
create policy "self read subscriptions"
  on subscriptions for select using (auth.uid() = user_id);
```

### Reading a policy

A policy is shaped like:

```
create policy "<name>"
  on <table>
  for <operation>          -- select, insert, update, delete, or all
  using (<read filter>)    -- "which rows can this user SEE?"
  with check (<write filter>); -- "which rows can this user WRITE?"
```

The expression `auth.uid()` is a Supabase function that returns the current user's UUID, or `null` if the request is unauthenticated. So `auth.uid() = id` reads as: "this row is allowed if the row's id matches the logged-in user's id."

### The crucial detail about `subscriptions`

Notice that the subscriptions table has only one policy — `for select`. There is **no** insert/update/delete policy. That means: a logged-in user can read their own subscription row, but **cannot create or modify any row in this table**, ever.

Who can write to it, then? Only the **service-role key** can — because the service role bypasses RLS by design. The only place we'll use the service-role key is in the Stripe webhook handler (server-side, hidden behind an HTTPS endpoint you control).

This is the **trust boundary**. The client can't grant itself Pro. Only Stripe (via your webhook) can.

---

## 7. Verify it works

Back in the dashboard, go to **Authentication → Users** and click **Add user** → **Create new user**. Email: `test@example.com`, password: anything. Don't worry about email confirmation for now.

Then go to **Table Editor → profiles** and click **Insert row**. Set:
- `id`: paste the UUID of the user you just created (find it under Authentication → Users)
- `username`: `testuser`
- everything else: defaults

Now in your local app, you can `npm run dev` and try logging in with that email + password. If the AuthContext is wired (see [supabase-integration.md](supabase-integration.md)), you should see "@testuser" in the navbar instead of "Guest."

If you haven't migrated AuthContext yet, you can still test the bare connection from the browser console:
```js
// in devtools, on any page of your running app:
const { supabase } = await import('/src/lib/supabase.js')
const { data } = await supabase.from('profiles').select('*')
console.log(data)
```
If RLS is working correctly, this returns `[]` because you're not logged in — the policy filters out every row. **An empty array here is a success signal**, not a failure. If you see your test user's row, RLS is broken; check that you ran the `enable row level security` lines.

---

## 8. The mental model — three things to remember

1. **The anon key is public. RLS is what protects your data.** If you find yourself trying to hide the anon key, you're solving the wrong problem. Fix the RLS policies instead.

2. **Default-deny is the safe posture.** `enable row level security` turns every table into a vault. You then poke specific holes with `create policy`. The opposite (allow-by-default, deny exceptions) is how data breaches happen.

3. **The service-role key is your "act as God" key.** It bypasses RLS entirely. It belongs server-side, in webhook handlers and admin scripts, and *nowhere else*. Treat it like a database root password.

---

## 9. What to do next

Once steps 1–7 above are working, move to [supabase-integration.md](supabase-integration.md) for the code-side migration:
- Swap `AuthContext` from localStorage to Supabase Auth.
- Swap `ProgressContext` from localStorage to the `progress` table.
- (Later) Swap `SubscriptionContext` from localStorage to the `subscriptions` table.

Each of those is shippable independently. You can do auth this week, progress next week, and subscriptions when you're ready to charge money. Don't try to do all three in one PR — they touch different contexts and break for different reasons.

---

## 10. Common mistakes and how to recover

| Symptom | Likely cause | Fix |
|---|---|---|
| `Invalid API key` | Typo in `VITE_SUPABASE_ANON_KEY`, or didn't restart dev server after editing `.env.local` | Re-copy from dashboard; restart `npm run dev` |
| Queries return `[]` even when you can see rows in the dashboard | RLS policy is too restrictive, or you're not logged in | Check `auth.uid()` is non-null; review your policies |
| Queries return data the user shouldn't see | RLS not enabled on the table | Run `alter table <name> enable row level security;` |
| Service-role key shows up in browser network tab | You accidentally put it in `.env.local` with the `VITE_` prefix | Remove it. Regenerate the key from the dashboard. Audit who could have seen it. |
| `relation "profiles" does not exist` | SQL didn't run, or ran against wrong project | Re-run the schema SQL in step 5 |

If you regenerate the service-role key, anything that was using it (webhook handlers, admin scripts) needs the new value. There is no rotate-gracefully feature — flip everything at once.
