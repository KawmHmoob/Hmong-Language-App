# The Showcase Rebuild — web app archived, site rebuilt to sell the mobile app

## What happened
1. **The full web app was archived** (lessons, words, quizzes, Speak + the tone scorer, accounts, leaderboard, season pass). It's frozen at:
   - git tag **`webapp-v1`**
   - git branch **`archive/webapp-v1`**

   Both point at commit `61e5e8b`, "Final web app state before showcase rebuild".
2. **`main` was rebuilt as a one-page showcase** for the Android app, plus Contact, Privacy, and Terms.

The mobile app (`../KawmHmoob-rn`) is now **the** product and the source of truth for all content.

## Getting the old web app back
Nothing was lost. Everything removed from `main` lives in the tag.

```bash
git switch archive/webapp-v1        # look at / run the old app
npm install && npm run dev

git checkout webapp-v1 -- src/lib/yin.js   # pull ONE old file into main
```

**Making the archive reachable online.** Push the branch (`git push origin archive/webapp-v1 webapp-v1`). Vercel builds a **preview deployment** for every pushed branch, so the old app (tone scorer included) gets its own URL with no extra setup. Give that preview a subdomain like `classic.kawmhmoob.com` in Vercel → Domains if you want a permanent link.

> Until it's pushed, the archive exists **only on this computer**. Push it.

**Update:** there's now an admin page for this. `/admin` signs you in and links to that archive deployment (admins only). Setup and security details are in [notes/74](74-admin-archive.md).

## The site map now
| Path | What |
|---|---|
| `/` | `Landing.jsx`: hero, stats, tone player, features, course, screenshots, story, FAQ, download |
| `/contact`, `/privacy`, `/terms` | text pages in a shared padded column (`PageContainer` in `App.jsx`) |
| `/privacy#delete-account` | account deletion steps. **Google Play asks for this URL.** Don't rename the id |
| `/app/*` | **reserved** for a future web version of the app. Redirects to `/#download` for now |
| old app paths (`/speak`, `/learn/...`) | `NotFound` recognizes them and shows "Kawm Hmoob lives on your phone now" + the Play button |
| anything else | plain 404 |

## Where to edit what
| To change… | Edit |
|---|---|
| any wording, features, FAQ | `src/data/showcase.js` |
| a screenshot | drop a PNG in `public/assets/screens/`, set `src` in `showcase.js` → `screens` |
| store links (iOS later) | `src/data/mobileApp.js` |
| the numbers (lessons, words, recordings…) | **don't type them.** Run the sync script (below) |

### Screenshots
```js
// src/data/showcase.js
{ id: 'home', label: 'Home', caption: 'Your day at a glance', src: '/assets/screens/home.png' },
```
While `src` is `null`, `PhoneFrame` draws a phone-shaped placeholder with the label and "Screenshot coming soon". Use portrait phone shots; the frame is `aspect-[9/19.5]` and the image is `object-cover`, so other ratios get cropped. The first entry is also the hero phone (`heroScreen`).

## Numbers come from the app: `sync-app-content.mjs`
```bash
node scripts/showcase/sync-app-content.mjs            # assumes ../KawmHmoob-rn
node scripts/showcase/sync-app-content.mjs D:/path/to/KawmHmoob-rn
```
It writes `src/data/appContent.json` (stats, unit list, the 8 tones, the date, and the RN commit it read). **Re-run it after adding lessons or words to the app, then commit the JSON.** The site never hand-types a count, because the old Home page's hardcoded "429 words" was already wrong when it was written (notes/56).

**How it loads RN's files.** RN data files use extensionless imports (`'./lessons/pronouns'`), which plain Node can't resolve. The script uses **esbuild**, which Vite already depends on (no new package), to bundle them in memory, imports the result, and counts. The only things taken from RN are numbers and the tone list.

**What it checks.** Every tone clip the page plays must exist in this site's `public/assets/audio/tones/`. If one is missing, it exits with an error.

**Gotcha hit while writing it:** the shell turned `\\` into `\` inside a heredoc and broke a regex. The script now builds the backslash with `String.fromCharCode(92)` instead of typing it.

## The tone player (`ToneDemo.jsx`)
This is the one interactive piece on the page, and the strongest pitch: you hear why Hmong needs real audio.
- **One shared `Audio` object** for the whole grid. Tapping a second tone stops the first instead of playing over it.
- `playing` holds the path of the clip currently sounding (`null` means silence). `onended` resets it.
- `audio.play()` returns a promise that **rejects** if the browser blocks playback or the file fails. We catch it and reset, so a button never gets stuck on "playing".
- The cleanup effect pauses the sound when you navigate away mid-clip.
- The labels come from the app's `reference.js` via the sync: marker letter, name, and `example2`.

## In-page links (`/#tones`) need help in React Router
React Router changes the URL but **doesn't scroll to a hash**. `SiteLayout` does it: if the URL has a hash, it calls `scrollIntoView`; otherwise it scrolls to the top. Without that, opening `/terms` from the bottom of the landing page would land you at the bottom of Terms. Sections have `scroll-mt-20/24` so the sticky header doesn't cover their headings.

Header links are `/#id`, not bare `#id`, so they work from `/privacy` too.

## Legal pages: rewritten for the app
Both pages now cover **the app and the website**, and were checked against RN's code:
- **Accounts + progress:** Supabase (`profiles`, `progress`).
- **Onboarding:** the same optional questions as before, including the age range "Under 18" and ethnicity (a special category).
- **Microphone:** Android lists `RECORD_AUDIO` because the `expo-audio` plugin adds it, but **no RN code records**. The policy says exactly that. Update it if recording ever ships.
- **Purchases:** RevenueCat is wired with a **test key** only, so nothing is sold. The text is conditional ("if paid features are offered…"), with billing through Google Play and cancellation in Play settings.
- **Website:** no accounts, no analytics. localStorage holds only the theme.

**Account deletion.** Google Play requires apps with sign-up to give a **web URL** for requesting account deletion. That's `https://kawmhmoob.com/privacy#delete-account`. Paste it into Play Console → App content → Data safety. `LegalLayout`'s `Section` now takes an `id` prop for this.

⚠️ Still **not legal advice**. The Terms governing-law line is a placeholder; set your state.

## Contrast fix: dark-theme `clay-700`
The guard (`scripts/theme/contrast.mjs`) got 13 new showcase pairs. They showed that in **dark** mode `clay-700` text measured only **3.63–4.00:1** on the page and cards. That passes for big text but fails for small text, including every `text-clay-700` link (the legal pages had this problem before too; the old guard just never modeled it).

Fix at the token, not per component: dark `--c-clay-700` went from `178 94 61` to **`214 126 90`**. Two notes on why that's right:
- In dark mode the scales **invert**, so a 700 *lighter* than the 600 (`206 114 78`) is consistent.
- In dark mode `cream-50` is the **dark** color, so `.btn-primary:hover` (dark text on a `clay-700` background) also got *more* readable: 3.6 → 5.6:1.

The worst pair across all themes is now 4.70:1 (neon), and everything passes AA.

## What was removed from `main`
`src/context/*`, `src/lib/*` (incl. the tone scorer), every old page except Contact/Privacy/Terms/NotFound, the old Layout/Navbar/Footer/PrimaryNav, all learning components, all content data, and `scripts/audio/*` and `scripts/content/*` (they validated the content data, which is gone).

**Kept:** the token system (`index.css`, `tailwind.config.js`), icons (now with `SunIcon`, `MoonIcon`, `SparkIcon`, and `PauseIcon`), `useTheme`, `Breadcrumbs`, `LegalLayout`, `public/` (logos and all audio), `vercel.json` + `_redirects` (notes/70), and the contrast guard.

`package.json` still lists `@supabase/supabase-js` and other packages. Nothing imports them, so they never reach the bundle (verified: no `supabase` in `dist/`). They're harmless, and kept so the archive branch still installs cleanly. Remove them when you're sure.

## If the app comes back to the web
The goal is "same or similar features as the app", without building every screen twice (notes/71). Options, best first:
1. **Expo web export of the RN app.** RN already has `react-native-web` and `"build:web": "expo export --platform web"`. Deploy that build as its own Vercel project at `app.kawmhmoob.com`, or mount it under the reserved `/app/*` with a Vercel rewrite. One codebase, phone and browser. Known blockers: `react-native-purchases` is native-only (guard it with `Platform.OS !== 'web'`), and audio needs testing on web.
2. **Bring archived pages back** from `webapp-v1` under `/app/*`, wrapping them in their old providers inside that route only.

Either way, **the showcase stays dependency-free.** No providers wrap the marketing pages (see the comment in `App.jsx`), so the app can come and go without touching them.

## Files
- `src/App.jsx`: routes, `PageContainer`, reserved `/app/*`
- `src/pages/Landing.jsx`: the showcase page
- `src/pages/NotFound.jsx`: retired-route message + 404
- `src/pages/PrivacyPolicy.jsx`, `src/pages/Terms.jsx`: rewritten for the app
- `src/components/site/`: `SiteLayout`, `SiteHeader`, `SiteFooter`, `PlayButton`, `PhoneFrame`, `ToneDemo`
- `src/data/showcase.js`: all copy + screenshot slots
- `src/data/appContent.json`: GENERATED from RN; don't hand-edit
- `src/data/mobileApp.js`: store links
- `scripts/showcase/sync-app-content.mjs`: the generator
- `src/index.css`: dark `clay-700` fix
- `index.html`: title, description, Open Graph tags
