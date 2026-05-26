# What changed, file by file

Every file from the old project has a counterpart in the new project. Three categories:

## 🟢 Copied verbatim (zero changes)

These are pure JavaScript with no DOM, no router, no storage. They moved across as-is:

- `src/data/alphabet.js`
- `src/data/course.js`
- `src/data/lessons.js`
- `src/data/quizzes.js`
- `src/data/toneDrill.js`
- `src/data/vocabulary.js` (all 3800+ lines)
- `src/hooks/useQuizState.js` (pure reducer)
- `src/hooks/useProgress.js` (one-line re-export)

**Lesson:** if you keep data files free of imports from `react-router-dom` / `react-dom` / browser globals, they're permanently free.

## 🟡 Logic preserved, adapter swapped

The shape of the file is identical — only the platform-specific calls changed:

| File | Change |
|---|---|
| `src/lib/supabase.js` | Added AsyncStorage adapter and `react-native-url-polyfill`. Env var prefix changed from `VITE_` to `EXPO_PUBLIC_`. |
| `src/lib/storage.js` | **New file.** Tiny `loadJSON` / `saveJSON` wrapper around AsyncStorage so the contexts don't repeat the same `try { JSON.parse(...) }` boilerplate. |
| `src/context/AuthContext.jsx` | Unchanged — Supabase handles its own storage now. |
| `src/context/ProgressContext.jsx` | `localStorage` calls → `loadJSON` / `saveJSON`. Save is now async (debounced via `setTimeout`, same as before). |
| `src/context/NotebookContext.jsx` | Same swap. Also added a `hydrated` gate so we don't overwrite real storage with the empty default before the first load completes. |
| `src/context/SubscriptionContext.jsx` | Same swap. |
| `src/hooks/useAudio.js` | `HTMLAudioElement` → `expo-av`'s `Audio.Sound`. Properly unloads sounds on unmount. |

## 🔴 Fully rewritten UI

These changed shape because they used DOM elements:

| Old file | New file | What changed |
|---|---|---|
| `src/components/Layout.jsx` | same path | `<div>` → `<View>`, wraps a `ScrollView` so the page scrolls naturally on mobile. The router's `<Outlet />` became Expo Router's `<Slot />`. |
| `src/components/Navbar.jsx` | same path | `<NavLink>` → custom Pressable using `usePathname()` to compute active state. Nav row wrapped in a horizontal `<ScrollView>` so tabs scroll on narrow screens. |
| `src/components/Footer.jsx` | same path | Plain RN port. |
| `src/components/Tabs.jsx` | same path | Plain RN port. |
| **All `src/pages/*.jsx`** | now in `app/**` | Pages moved into the Expo Router file structure. See [04-routing-expo-router.md](04-routing-expo-router.md). |
| **All `src/components/**/*.jsx`** | same paths | Each rewritten with RN primitives + NativeWind classes. The component contracts (props, behavior) are the same so the call sites in pages didn't need rewriting. |

## 🆕 New helpers (not in the old project)

- `src/components/ui/Button.jsx` — a single Pressable+Text component with `primary` / `secondary` / `ghost` variants, replacing the `.btn-primary` etc. CSS classes which don't work the same in RN.
- `src/components/ui/Surface.jsx` — `View` with the `.surface` look. Optional `elevated` adds the warm shadow.
- `src/components/ui/Picker.jsx` — a modal-based replacement for `<select>`. Tap to open, tap a row to pick.
