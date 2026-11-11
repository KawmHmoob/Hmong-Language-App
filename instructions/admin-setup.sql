-- ════════════════════════════════════════════════════════════════════════════
-- ADMIN ACCESS for kawmhmoob.com/admin  (see notes/74-admin-archive.md)
--
-- Run in: Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS / ON CONFLICT).
--
-- Two tables:
--   admins          who is an admin. A user can read ONLY their own row, so the
--                   site can ask "am I an admin?" and nothing more.
--   admin_settings  key/value settings only admins can read — e.g. the URL of
--                   the archived web app. Keeping the URL here (not in the
--                   site's JavaScript) is what makes the admin page a real gate:
--                   the site's code is public, this table is not.
--
-- Nobody can make themselves an admin from the app or site: there are NO
-- insert/update/delete policies, so only this SQL editor (or the service role)
-- can change either table.
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Admins ──────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins: read own row" on public.admins;
create policy "admins: read own row"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- 2. Admin-only settings ─────────────────────────────────────────────────────
create table if not exists public.admin_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_settings enable row level security;

drop policy if exists "admin_settings: admins read" on public.admin_settings;
create policy "admin_settings: admins read"
  on public.admin_settings for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 3. Make YOURSELF an admin ─────────────────────────────────────────────────
-- Replace the email with the one you sign in to the app with. (Kept as a
-- placeholder on purpose — this file is committed to the repo.)
insert into public.admins (user_id)
select id from auth.users where email = 'YOUR_EMAIL_HERE'
on conflict (user_id) do nothing;

-- 4. Point the admin page at the archive ────────────────────────────────────
-- After pushing the archive branch, Vercel gives it a stable "branch URL":
--   Vercel → your project → Deployments → the archive/webapp-v1 deployment →
--   Domains → the one containing "git-archive-webapp-v1".
-- Paste it below and run this statement (re-run it any time to change it).
insert into public.admin_settings (key, value)
values ('archive_url', 'https://PASTE-THE-ARCHIVE-BRANCH-URL-HERE.vercel.app')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ── Check it worked ─────────────────────────────────────────────────────────
-- select a.user_id, u.email from public.admins a join auth.users u on u.id = a.user_id;
-- select * from public.admin_settings;
--
-- ── Remove an admin ─────────────────────────────────────────────────────────
-- delete from public.admins where user_id = (select id from auth.users where email = '...');
