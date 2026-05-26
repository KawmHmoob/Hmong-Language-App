# React Native Migration — KawmHmoob-rn

The original web app (this folder, `KawmHmoob/`) was ported to a React Native + Expo project that runs on **iOS, Android, AND the web** from a single codebase. The new project lives at:

    c:\Users\Devan Chuyen Lee\Documents\KawmHmoob-rn

This `notes/react-native/` folder explains how the port works, what changed, and how to keep the two projects in sync (or eventually, replace this one).

## Read these in order

1. [01-getting-started.md](01-getting-started.md) — install deps, run the app on web + mobile.
2. [02-what-changed.md](02-what-changed.md) — file-by-file map of how each web concept became RN.
3. [03-styling-with-nativewind.md](03-styling-with-nativewind.md) — Tailwind classes that DON'T work on RN, and what to use instead.
4. [04-routing-expo-router.md](04-routing-expo-router.md) — how `react-router-dom` routes map to Expo Router's `app/` folder.
5. [05-supabase-and-storage.md](05-supabase-and-storage.md) — localStorage → AsyncStorage, env var changes.
6. [06-audio-on-native.md](06-audio-on-native.md) — HTMLAudioElement → expo-av.
7. [07-known-rough-edges.md](07-known-rough-edges.md) — what's not perfect yet and what to verify in a browser/simulator.

## TL;DR

| Web (`KawmHmoob/`) | React Native (`KawmHmoob-rn/`) |
|---|---|
| Vite | Expo (Metro bundler) |
| `<div>`, `<p>`, `<button>` | `<View>`, `<Text>`, `<Pressable>` |
| `react-router-dom` | `expo-router` (file-based, like Next.js) |
| Tailwind (web) | NativeWind (Tailwind for RN) |
| `localStorage` | `AsyncStorage` (via a tiny wrapper) |
| `HTMLAudioElement` | `expo-av` |
| `import.meta.env.VITE_…` | `process.env.EXPO_PUBLIC_…` |
| `<input>`, `<textarea>`, `<select>` | `<TextInput>`, custom `<Picker>` modal |
| `window.alert` / `window.confirm` | `Alert.alert(...)` |
| Blob download (data export) | `console.log` for now — needs `expo-file-system` later |

**What did NOT change:** every file in `src/data/`, every hook's logic, all the SRS / streak / XP math in `ProgressContext`. Pure JavaScript ports straight across — that's why splitting "logic" from "UI" pays off in projects like this.
