# Known rough edges + verification checklist

This was a one-pass port. The architecture is solid but some things deserve a manual check in a browser + simulator before you ship.

## Things to verify visually

The web app used custom fonts (Inter, Fraunces from Google Fonts). On native, fonts aren't loaded automatically — text renders in the system default. To match the web look exactly on mobile you'd need to:

1. Add `expo-font` and download Inter + Fraunces TTFs into `assets/fonts/`.
2. Call `Font.loadAsync({ ... })` in the root layout before rendering.

It still looks fine without — just less "branded."

## What's clearly different (intentional)

| Web | RN port | Why |
|---|---|---|
| Data export downloads a JSON file | `console.log`s the data | RN has no `Blob` / `URL.createObjectURL`. Add `expo-file-system` + `expo-sharing` if you want real exports. |
| `window.confirm("Delete?")` | `Alert.alert(...)` | RN has no `window`. `Alert.alert` is the equivalent native dialog. |
| `<input>` validation via `required` | Manual `if (!email)` checks | RN's `TextInput` has no `required` attribute. The forms still guard against empty submits. |
| The SVG logo (`/assets/KawmHmoobSvg1svgexport.svg`) | Replaced with text "Kawm Hmoob" in Navbar/Footer | RN can't `<img src="...svg">` directly. To use the SVG, install `react-native-svg-transformer` and import it as a component. Cheap improvement. |
| Tailwind's `grid grid-cols-3` | Just `flex-row flex-wrap` + width classes | RN has no real CSS grid. The layouts are close but not pixel-identical on tiny screens. |

## Behaviors to test on mobile specifically

These work on web but should be sanity-checked on iOS/Android:

- **Auth flow**: register → email confirmation → login. Make sure the session persists across app restarts (it should, AsyncStorage handles this).
- **Quiz timer**: the `setInterval` in `QuizEngine.jsx` keeps running while the quiz is active. If the user backgrounds the app then returns, the timer is still based on `Date.now() - startedAt` so it'll just jump forward. Probably fine.
- **Vocabulary search** (`/search`): builds the entire index in module scope on first import. On a slow phone this is one-time cost but it's blocking. If it ever feels slow, defer it to a `useMemo` inside the component.
- **Long vocabulary lists**: the `Animals`/`Family`/`Classifiers` lists render every word as a separate `<View>`. Once you cross ~300 words in one category, switch to `<FlatList>` for virtualization (only renders visible rows).

## Where the port is best

- All four contexts (`Auth`, `Progress`, `Notebook`, `Subscription`) — clean, async-safe, hydration-gated.
- The Supabase wiring — same external API as web, AsyncStorage hooked in correctly.
- Quiz logic — pure reducer, no changes needed, works identically.

## Next steps if you keep going

1. **Add a Tabs nav at the bottom for mobile** — most mobile language apps use a tab bar instead of the top scroll nav. Expo Router supports this via `app/(tabs)/_layout.tsx` — see https://docs.expo.dev/router/advanced/tabs/.
2. **Bring back the SVG logo** with `react-native-svg-transformer`.
3. **Add fonts** with `expo-font` (Inter + Fraunces).
4. **Wire up real audio** — the plumbing is done, just populate `audioFile` fields in vocabulary.js.
5. **Test the Supabase login on a real device** — auth flows have platform-specific edge cases (deep links for OAuth, etc.) that don't surface until you're on the metal.
