# Admin Page — sign in to open the archived web app

## What it is
`kawmhmoob.com/admin` is an unlisted page where you sign in with your Kawm Hmoob account. If that account is an admin, you get a dashboard with an **"Open the archive"** button that opens the original web app (frozen at tag `webapp-v1`, notes/72) in a new tab.

Anyone else who signs in sees "This account isn't an admin". Nothing links to the page, and it's marked `noindex`.

## Where the security actually is (read this first)
**Not in the React code.** Everything in `src/` is sent to every visitor's browser. Anyone can open DevTools and read it, edit it, or skip an `if (isAdmin)` check. A browser-only admin check only hides things from people who weren't looking.

The real gate is **Supabase Row Level Security**, which the database enforces before data leaves the server:

| Table | Who can read it | Why |
|---|---|---|
| `admins` | each user, **only their own row** | the site asks "am I an admin?" and can learn nothing else |
| `admin_settings` | **only users with a row in `admins`** | holds `archive_url` |

So the archive's URL is **never in the site's JavaScript**. A non-admin who signs in gets zero rows from `admin_settings`, and someone reading the bundle finds nothing. Neither table has insert, update, or delete policies, so **no one can make themselves an admin** from the app or the site. Only the Supabase SQL editor (or the service role) can.

### The second lock: Vercel Deployment Protection
The archive is a Vercel deployment of the `archive/webapp-v1` branch. If someone learned its URL (for example, from your browser history), the admin page couldn't stop them from opening it directly. What can stop them is **Vercel → Settings → Deployment Protection → Vercel Authentication**: only people logged into your Vercel account can view preview deployments. New projects usually have it on for previews by default. **Check that it's on.** If Vercel asks you to log in when you open the archive, that's this lock working.

Taken together, the admin page is the convenient way in, and Supabase plus Vercel are what keep others out.

## Setup (once)
1. **Push the archive:**
   `git push origin archive/webapp-v1 webapp-v1`
   Vercel builds a preview deployment for the branch automatically.
2. **Give the archive its environment variables.** In Vercel → Settings → Environment Variables, make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are enabled for **Preview** as well as Production, then redeploy the archive. Without them the old app runs in its built-in stub mode: the pages work, but sign-in and saving don't.
   ⚠️ With them, the archive talks to the **real** database. Signing up or practicing there writes real rows.
3. **Copy the archive's stable URL.** Vercel → Deployments → the `archive/webapp-v1` deployment → Domains → the one containing `git-archive-webapp-v1`. That "branch URL" stays the same across redeploys, unlike the per-deployment URLs.
4. **Run `instructions/admin-setup.sql`** in Supabase → SQL Editor, after replacing:
   - `YOUR_EMAIL_HERE` → the email you sign in to the app with
   - `PASTE-THE-ARCHIVE-BRANCH-URL-HERE` → the URL from step 3

   It's safe to re-run. To change the URL later, re-run step 4 of the file alone.
5. Go to `/admin` and sign in.

(If you skip step 4, the page says "The admin tables don't exist yet". If the URL is missing or isn't `https://`, the dashboard says so instead of showing a broken button.)

## Code anatomy

### `src/pages/Admin.jsx`: phases
```
unavailable   no VITE_SUPABASE_* vars in this build
signed-out    → <SignIn> (email + password)
checking      asking Supabase
admin         dashboard
not-admin     signed in, no row in `admins`
setup-needed  the tables don't exist (PostgREST code PGRST205, or Postgres 42P01)
error         anything else, with Supabase's message
```
The admin check, `verify(user)`, runs two queries:
```js
supabase.from('admins').select('user_id').eq('user_id', u.id).maybeSingle()   // row → admin
supabase.from('admin_settings').select('key, value')                          // only admins get rows
```
`maybeSingle()` returns `null` (not an error) when there's no row. That's exactly what "not an admin" looks like.

### Never trust a URL from the database
```js
function safeHttps(value) { const u = new URL(value); return u.protocol === 'https:' ? u.href : null }
```
An `href` of `javascript:…` runs code when clicked. Only admins can set `archive_url`, but the page still validates it before linking. That's standard practice for any value that ends up in `href`. The link also uses `rel="noopener noreferrer"` so the archive tab can't reach back into this one.

### Sessions: memory only, one hour of tokens, auto-refreshed
The page reuses the client in `src/lib/supabase.js` (built for password reset, notes/73). Two settings matter here:
- `persistSession: false`: the session lives in memory, so **closing or reloading the tab signs you out.** That's on purpose for an admin page: nothing sits in localStorage on a shared computer.
- `autoRefreshToken: true` (**changed** from `false`): access tokens expire after about an hour, and without refresh every query would start failing. It makes no difference to the short reset flow.

If a refresh fails, Supabase emits `SIGNED_OUT`, and the page returns to the sign-in form.

### Lazy and unlisted
- `Admin` is `React.lazy` in `App.jsx`, inside the same `PageContainer` + `<Suspense>` as the reset pages. Its 2.5 kB chunk and supabase-js load only on `/admin`.
- `vercel.json` now sends `X-Robots-Tag: noindex, nofollow` for `/admin*`. Search engines get the header even though the page is client-rendered, because Vercel attaches it to the HTML response.
- Not in the header, footer, or sitemap. Being unlisted is a courtesy, not security; the security is the two locks above.

### Fixed facts on the dashboard
The tag, branch, and commit (`webapp-v1`, `archive/webapp-v1`, `61e5e8b`) are constants in `Admin.jsx`. They're safe to hardcode because a tag doesn't move. The dashboard also shows the run-it-locally commands.

## Adding more admin tools later
- **Another setting:** `insert into public.admin_settings (key, value) values ('my_key', '…')`, then read `settings.my_key` in `Admin.jsx`.
- **Admin-only data** (e.g. user counts): create a view or table with an RLS policy that uses the same check, `exists (select 1 from public.admins a where a.user_id = auth.uid())`. Copy it from `admin_settings`.
- **Never** use the service-role key in the site. It bypasses RLS, and anything in `VITE_*` ships to every browser. It belongs only in `.env` (server-side, never prefixed `VITE_`).

## Files
- `src/pages/Admin.jsx`: sign-in, admin check, dashboard
- `instructions/admin-setup.sql`: `admins` + `admin_settings` tables, RLS, grant yourself admin, set the archive URL
- `src/App.jsx`: lazy `/admin` route
- `src/lib/supabase.js`: `autoRefreshToken: true`, comments updated
- `vercel.json`: `noindex` header for `/admin*`
- `scripts/theme/contrast.mjs`: fact-box pair (`cream-100` on `stone-900`)
