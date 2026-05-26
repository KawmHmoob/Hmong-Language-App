# Getting started with KawmHmoob-rn

## One-time setup

Open a terminal in the new project:

```powershell
cd "c:\Users\Devan Chuyen Lee\Documents\KawmHmoob-rn"
npm install
```

That installs Expo, React Native, NativeWind, Supabase, AsyncStorage, etc. (see `package.json`).

## Configure Supabase

Copy `.env.example` to `.env.local` and fill in your project URL + anon key:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

> Note the `EXPO_PUBLIC_` prefix — it's how Expo decides which env vars to inline into the JS bundle. The web app used `VITE_…`; this is the same idea with a different framework.

If you skip this step, the app still runs — every Supabase call resolves to a "not configured" error and the UI falls back to guest mode. Same behavior as the web app.

## Run it

| Where | Command | Notes |
|---|---|---|
| **Web** (browser) | `npm run web` | Opens at http://localhost:8081. This is the "still a web app" part — your existing users can keep using it like a website. |
| **iOS simulator** | `npm run ios` | Requires Xcode on a Mac. |
| **Android emulator** | `npm run android` | Requires Android Studio. |
| **Physical phone** | `npm start`, scan the QR | Install **Expo Go** from the App Store / Play Store first. |

For everyday development on Windows, **`npm run web` + Expo Go on your phone via QR** is the smoothest combo.

## Building for production

- **Web (static site):** `npm run build:web` — outputs `dist/` you can host anywhere (Vercel, Netlify, Cloudflare Pages).
- **Mobile (app stores):** use `eas build` (Expo Application Services). That's a separate flow with credentials, signing, etc. — out of scope for this initial port.
