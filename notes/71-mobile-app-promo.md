# Mobile App Promo — winding the web app down (but not yet)

## What changed
The website now says, everywhere, that Kawm Hmoob is going mobile:

- **`AppPromo`** — a dismissible banner in `Layout`, under `WarningRibbon`, on every page except `/app`.
- **`/app`** (`GetTheApp.jsx`) — the mobile app's home on the web: what's in it, how to get it, and what's still web-only.
- **Footer** — a "Mobile app" link next to Privacy / Terms / Contact.
- **`data/mobileApp.js`** — the single switch for "is the app out yet?"

Nothing was removed. Every learning route still works.

## Why it isn't fully retired yet
The plan is to retire the web app in favor of the React Native app (`../KawmHmoob-rn`). Checking the RN app turned up one blocker:

**Tone scoring is web-only.** The RN app has the Speak screens, but they're listen-and-self-mark. Its `PronounceStep` says *"Recording & tone scoring are coming to the app"* and `tone-eval.jsx` is a placeholder. RN's `src/lib/` doesn't have `yin.js`, `toneScore.js`, `pronounceScore.js`, or `audioSamples.js`. Retiring the web app now would switch off the app's main differentiator.

The app also isn't in the stores yet (`version 0.0.1`, no store URLs, an empty `eas submit` config), so a download button would have nowhere to go.

What's already done: the RN app has every web route (36 screens), and its **content is ahead of the web's**. It has `daily-life`, `introductions`, and `politeness` vocabulary the web lacks. **Treat RN's `src/data/` as the source of truth from now on.** Don't add content to the web copy.

## Why not "pull the mobile data into the web app"?
`src/data/*.js` is plain JS, so it would port. A shared package would stop *data* drift, but React DOM and React Native share no UI primitives, so every screen would still get built twice. Since the web app is being retired, that cost isn't worth paying.

The better long-term version runs the other way: **let the RN app become the website.** RN already has `react-native-web` and `"build:web": "expo export --platform web"`. Known blockers for that: `react-native-purchases` is native-only, and `expo-audio` recording on web isn't guaranteed.

## The roadmap this sets up
1. **Now (done):** promote the app; web stays fully working.
2. **Port the scorer to RN.** The DSP (`yin.js`, `toneScore.js`) is pure math and ports as-is. Only the audio *decode* (`audioSamples.js`, Web Audio API) needs an `expo-audio` replacement.
3. **App ships:** paste store URLs into `data/mobileApp.js`. The banner and `/app` page switch from "coming soon" to real download buttons on their own.
4. **Strip the web app** to a landing page + `/app` + `/privacy` + `/terms` + `/contact`. **Keep `/privacy` live forever:** the App Store and Play Store both require a public privacy-policy URL.
5. (Optional) Serve the RN web export at kawmhmoob.com.

## Code anatomy

### One switch: `src/data/mobileApp.js`
```js
export const MOBILE_APP = { ios: null, android: null, notifyEmail: 'techkage@proton.me' }
export const isShipped = Boolean(MOBILE_APP.ios || MOBILE_APP.android)
```
`isShipped` is **derived** (it's never stored as a separate flag). If you set a URL, it flips. If you forget, nothing claims you shipped.

### Never a dead button
`GetTheApp`'s `Downloads()` renders store buttons only for URLs that exist. While both are `null`, it shows an **"Email me at launch"** `mailto:` button instead. A download button that goes nowhere reads as broken; "coming soon" is honest.

### Dismissal that resets on launch
```js
const KEY = `kh:appPromoDismissed:${isShipped ? 'live' : 'soon'}`
```
Dismissing hides the banner per browser. The key includes the ship state, so on launch day the key changes and people who dismissed "coming soon" see "out now" once. You don't need to clear anything by hand.

`localStorage` **can throw** (private windows, blocked storage), so both the read and the write are in `try/catch`. If storage fails, the banner shows again next visit.

### Hidden on `/app`
The banner returns `null` when `pathname === '/app'`, so the page doesn't advertise itself.

### Theming
`bg-ocean-300/70` + `text-stone-900` are tokens, so it themes in light/dark/neon. The pair is in `scripts/theme/contrast.mjs`: AAA in every theme (7.02 / 8.27 / 9.28 : 1). It's tested at full opacity because the `/70` alpha only blends toward the lighter seafoam page.

### New icon
`PhoneIcon` in `components/icons/index.jsx`, following the icon rules (24 grid, stroke 2, accent fill ≤ 0.2).

## On launch day: checklist
1. Paste the store URLs into `src/data/mobileApp.js`.
2. Build and deploy. The banner and `/app` update themselves.
3. Once the scorer is in RN, delete the "Still on the web: tone scoring" section in `GetTheApp.jsx` (it's marked with a comment).

## Files
- `src/data/mobileApp.js`: store URLs + derived `isShipped`
- `src/components/common/AppPromo.jsx`: dismissible banner
- `src/pages/GetTheApp.jsx`: `/app` page
- `src/components/Layout.jsx`: renders `<AppPromo />`
- `src/App.jsx`: `/app` route
- `src/components/Footer.jsx`: "Mobile app" link
- `src/components/icons/index.jsx`: `PhoneIcon`
- `scripts/theme/contrast.mjs`: banner contrast pair

---

## Update: live on Google Play
The Android app is in the Play Store:
`https://play.google.com/store/apps/details?id=com.kawmhmoob.app`

That URL is now in `MOBILE_APP.android`, so `isShipped` is `true`. The banner says "The Kawm Hmoob app is here. Now on Google Play." `/app` shows "Out now" and a **Get it on Google Play** button. iOS is still `null`, so no iOS button appears.

**Use the clean store URL.** The Play Store's Share button adds `&pcampaignid=web_share`. That only tags the click as coming from a share, and it would misfile every visit from the website. Keep just `?id=<package>`. The `id` is the app's `package` in `app.json`; if the two don't match, the link is wrong.

### Copy derived from what's live: `storeNames`
```js
export const storeNames = [
  MOBILE_APP.ios && 'the App Store',
  MOBILE_APP.android && 'Google Play',
].filter(Boolean).join(' and ')
```
Earlier copy said "iOS and Android", but only Android is live. The banner and `/app` now build that wording from whichever URLs exist, so they can't name a platform that isn't live. When iOS ships, paste its URL and the copy becomes "the App Store and Google Play". No other edits are needed.

### Tone scoring stays web-only
The scorer isn't being ported. It depends on the browser's Web Audio pipeline, and the native app works differently. The `/app` section is now titled **"Only on the web: tone scoring"** and tells people to use the app for lessons and review and come to the website to get their tones scored. Ignore roadmap steps 2 and 5 above. Step 4 changes too: if you ever cut the website down, keep `/speak` along with `/privacy`.
