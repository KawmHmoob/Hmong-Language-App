-- ============================================================================
-- KawmHmoob — Supabase schema, RLS, and signup trigger
--
-- Paste the whole file into the Supabase SQL editor and run it once.
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / DROP first).
--
-- Derived from what the code ACTUALLY reads and writes — nothing speculative:
--   AuthContext      profiles: id, username, display_name, email,
--                              dialect_preference, joined_at
--   ProgressContext  progress: user_id, data (jsonb), updated_at
--
-- See notes/68-supabase-schema.md for why each piece exists.
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES — 1:1 with auth.users, holds app-specific fields
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  -- Same id as auth.users. ON DELETE CASCADE means deleting the auth user
  -- cleans up the profile automatically — no orphan rows.
  id                 uuid primary key references auth.users(id) on delete cascade,
  username           text not null,
  display_name       text,
  email              text,
  -- 'white' | 'green' | 'dananshan'. Constrained so a typo can't silently
  -- create a dialect no content exists for.
  --
  -- ⚠️ THIS LIST MUST MATCH src/components/common/DialectSelect.jsx. If the UI
  -- offers a value the constraint rejects, the signup trigger's insert fails
  -- and Supabase reports the generic "Database error saving new user" — with
  -- the real cause only visible in the Postgres logs. See notes/68.
  dialect_preference text not null default 'white'
                       check (dialect_preference in ('white', 'green', 'dananshan')),
  joined_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 1b. RECONCILE AN EXISTING PROFILES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
-- ⚠️ `create table if not exists` does NOTHING when the table already exists.
-- Not "adds the missing bits" — nothing. A table made by hand (or by an older
-- version of this file) therefore keeps its own columns, nullability, foreign
-- keys and constraints, and everything above is silently skipped.
--
-- That bit us for real: a hand-made `profiles` had a foreign key WITHOUT
-- `on delete cascade`, so deleting an auth user left the profile behind. The
-- orphan kept holding its username, and the next signup with that username hit
-- the unique index INSIDE the trigger → transaction rollback → the opaque
-- "Database error saving new user".
--
-- So: bring an existing table up to spec explicitly. Every statement is a no-op
-- on a table this file just created.

-- Columns (a table from an older revision may be missing some entirely).
alter table public.profiles add column if not exists username           text;
alter table public.profiles add column if not exists display_name       text;
alter table public.profiles add column if not exists email              text;
alter table public.profiles add column if not exists dialect_preference text;
alter table public.profiles add column if not exists joined_at          timestamptz;

-- Backfill before tightening — a NOT NULL on a column holding nulls fails.
update public.profiles set dialect_preference = 'white' where dialect_preference is null;
update public.profiles set joined_at = now()             where joined_at is null;
-- Backfilling from the email's local part can COLLIDE (a@x.com and a@y.com both
-- become "a"), and the unique index below would then fail to build. Append a
-- slice of the uuid so every backfilled handle is distinct. Only touches rows
-- that were already broken (null/empty username).
update public.profiles
  set username = split_part(coalesce(email, 'user'), '@', 1) || '-' || left(id::text, 8)
  where username is null or username = '';

-- Defaults + nullability to match the definition above.
alter table public.profiles alter column dialect_preference set default 'white';
alter table public.profiles alter column dialect_preference set not null;
alter table public.profiles alter column joined_at          set default now();
alter table public.profiles alter column joined_at          set not null;
alter table public.profiles alter column username           set not null;

-- FOREIGN KEY with ON DELETE CASCADE — the orphan fix. Without this, deleting
-- an auth user leaves a profile row squatting on its username forever.
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

-- Dialect CHECK — re-added so an older two-value constraint accepts new values.
alter table public.profiles drop constraint if exists profiles_dialect_preference_check;
alter table public.profiles
  add constraint profiles_dialect_preference_check
  check (dialect_preference in ('white', 'green', 'dananshan'));

-- CLEAN UP EXISTING ORPHANS — profiles whose auth user is already gone. Must
-- run BEFORE the unique index, or a duplicate orphan makes the index fail.
delete from public.profiles p
where not exists (select 1 from auth.users u where u.id = p.id);

-- Usernames must be unique — the leaderboard shows them, and two identical
-- handles make rankings ambiguous. AuthContext's "that username is taken"
-- error message assumes this constraint exists.
-- Case-insensitive: 'Devv' and 'devv' are the same person's handle.
create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username));




-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PROGRESS — one row per user, the whole progress blob as JSON
-- ─────────────────────────────────────────────────────────────────────────────
-- Deliberately a single jsonb column rather than normalized tables. The app
-- treats progress as one atomic object (load all / save all, debounced), and
-- the shape changes often. Normalizing it would mean a migration every time a
-- field is added, for zero query benefit — nothing ever queries INTO it.
--
-- NOTE: this is the wrong shape for the future voice corpus, which needs its
-- own table with per-utterance rows. See notes/future-implementations/03.
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2b. RECONCILE AN EXISTING PROGRESS TABLE — same reasoning as 1b: the
-- `create table if not exists` above is a no-op on a table that already exists,
-- so bring an older one up to spec explicitly.
alter table public.progress add column if not exists data       jsonb;
alter table public.progress add column if not exists updated_at timestamptz;

update public.progress set data = '{}'::jsonb where data is null;
update public.progress set updated_at = now()  where updated_at is null;

alter table public.progress alter column data       set default '{}'::jsonb;
alter table public.progress alter column data       set not null;
alter table public.progress alter column updated_at set default now();
alter table public.progress alter column updated_at set not null;

alter table public.progress drop constraint if exists progress_user_id_fkey;
alter table public.progress
  add constraint progress_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

delete from public.progress p
where not exists (select 1 from auth.users u where u.id = p.user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY — the part that actually secures the app
-- ─────────────────────────────────────────────────────────────────────────────
-- The anon key is PUBLIC (it ships in the JS bundle). Without RLS, anyone can
-- read every row with one curl. These policies are the real security boundary.
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- Drop-then-create so re-running this file doesn't error on existing policies.
drop policy if exists "own profile: select" on public.profiles;
drop policy if exists "own profile: insert" on public.profiles;
drop policy if exists "own profile: update" on public.profiles;

-- SELECT is restricted to your OWN row.
--
-- ⚠️ If/when the leaderboard reads real users, it will need to see other
-- people's usernames — do that with a VIEW exposing only (username, points),
-- or a policy scoped to those columns. Do NOT widen this to `using (true)`:
-- that would expose every user's email address.
create policy "own profile: select" on public.profiles
  for select using (auth.uid() = id);

create policy "own profile: insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "own profile: update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own progress: select" on public.progress;
drop policy if exists "own progress: insert" on public.progress;
drop policy if exists "own progress: update" on public.progress;

create policy "own progress: select" on public.progress
  for select using (auth.uid() = user_id);

-- Both insert AND update are needed: ProgressContext uses upsert(), which is
-- an insert that may become an update. Granting only one breaks half the saves.
create policy "own progress: insert" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "own progress: update" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- No DELETE policy anywhere, on purpose: nothing in the app deletes rows, and
-- an absent policy means the operation is denied. Least privilege by default.


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. SIGNUP TRIGGER — create the profile atomically with the auth user
-- ─────────────────────────────────────────────────────────────────────────────
-- Without this, registration is two independent writes: signUp() then an
-- insert. If the second fails, the account is orphaned — email taken, no
-- profile, unrecoverable from the UI (notes/67 §2). The trigger makes profile
-- creation part of the same transaction as the signup.
--
-- security definer: runs as the function owner so it can write to a table the
-- brand-new user has no session for yet.
-- set search_path = '': prevents search_path hijacking in a definer function.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username, display_name, dialect_preference)
  values (
    new.id,
    new.email,
    -- Fall back to the email's local part so username is never null, even if
    -- the client forgot to send metadata.
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce(nullif(new.raw_user_meta_data->>'dialect_preference', ''), 'white')
  )
  -- If a profile already exists (retry, or the client also inserted), leave it
  -- alone rather than failing the whole signup.
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. VERIFY — run these after, to confirm it took
-- ─────────────────────────────────────────────────────────────────────────────
-- Both tables should report rowsecurity = true:
--   select tablename, rowsecurity from pg_tables
--    where schemaname = 'public' and tablename in ('profiles','progress');
--
-- Should list 6 policies:
--   select tablename, policyname, cmd from pg_policies
--    where schemaname = 'public' order by tablename, policyname;
--
-- Should list the trigger:
--   select tgname from pg_trigger where tgname = 'on_auth_user_created';
