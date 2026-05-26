# Supabase + storage on React Native

## The two changes to `lib/supabase.js`

```js
// 1. URL polyfill — RN's URL implementation is incomplete, so supabase-js
//    needs this polyfill imported BEFORE createClient.
import 'react-native-url-polyfill/auto'

// 2. AsyncStorage adapter — RN has no localStorage, so we tell supabase-js
//    to persist the auth session in AsyncStorage instead.
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,  // RN doesn't have URL-based OAuth callbacks
  },
})
```

Everything else in `AuthContext.jsx` is **identical** to the web version. The `signInWithPassword` / `signUp` / `onAuthStateChange` APIs don't change — supabase-js abstracts the storage layer.

## Env var prefix

Vite used `VITE_*`. Expo uses `EXPO_PUBLIC_*`. Both are "yes, please inline this into the client bundle." Other env vars stay server-side.

- Old: `import.meta.env.VITE_SUPABASE_URL`
- New: `process.env.EXPO_PUBLIC_SUPABASE_URL`

## The custom `loadJSON` / `saveJSON` helper

The old contexts used `localStorage.getItem(...)` / `setItem(...)`. `AsyncStorage` is the RN equivalent, but **async**. We wrap it in `src/lib/storage.js`:

```js
export async function loadJSON(key, fallback) { ... }
export async function saveJSON(key, value) { ... }
```

Every place that used to be:
```js
const raw = localStorage.getItem(key)
if (!raw) return fallback
return JSON.parse(raw)
```

Becomes:
```js
return (await loadJSON(key, fallback))
```

The pattern in each context: load on userId change → `setState(loaded)` → `setHydrated(true)`. A `hydrated` boolean gates the save effect so the very first render (which has empty state) doesn't overwrite real saved data.

## What about offline?

AsyncStorage is offline-first by nature — reads/writes don't hit the network. So:
- **Guest progress** works fully offline (same as web).
- **Logged-in progress** writes to Supabase via `upsert` — those calls **need network**. If you want offline-tolerant sync, you'd add a queue that retries on connectivity change. Out of scope for this initial port.
