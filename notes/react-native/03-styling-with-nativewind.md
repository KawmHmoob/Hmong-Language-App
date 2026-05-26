# Styling with NativeWind

NativeWind v4 lets you write Tailwind classes on React Native primitives:

```jsx
<View className="rounded-md bg-cream-50 border border-cream-200 p-5">
  <Text className="font-serif text-xl text-stone-900">Hello</Text>
</View>
```

Behind the scenes it generates RN `StyleSheet`s. On web, it compiles to actual Tailwind CSS — so your styles are identical across platforms.

## Things that DON'T work the same as the web

You'll hit these eventually. Mental cheat-sheet:

### Layout

| Web Tailwind | On native | Use instead |
|---|---|---|
| `block` / `inline-block` | — | RN is always flex. Just use `<View>`. |
| `grid grid-cols-2` | ❌ no-op | `flex-row flex-wrap` + width classes (`w-1/2`), or build a 2-column View manually. |
| `space-y-3` | ❌ no-op | `gap-3` — works on both. |
| `divide-y` | ❌ no-op | Add `border-t border-cream-200` to non-first children manually (the lesson page does this). |

### Hover / focus

| Class | Native behavior |
|---|---|
| `hover:*` | No-op on iOS/Android (no cursor). Still works on web. Use Pressable's `style={({ pressed }) => ...}` for press feedback that works on all platforms. |
| `focus:*` | Works for `TextInput` on all platforms. |
| `cursor-pointer` | No-op on native. |
| `transition`, `duration-*`, `ease-*` | No-op on native. For real animations use `react-native-reanimated`. |

### Sizing

| Class | Notes |
|---|---|
| `min-h-screen` | No-op on native — use `flex-1` inside a parent View that has known height. Layout.jsx does this. |
| `h-screen` / `w-screen` | Same caveat. |
| `aspect-*` | Works via `aspectRatio` style — works on native. |

### Typography

- `text-` color classes work.
- `font-family` only works if the font is loaded (web pulls Google Fonts from `index.html`; on native you'd need `expo-font` + a font file). For now mobile shows the system font; the *layout* still works.
- `line-clamp-*` doesn't exist on RN. Use `numberOfLines={3}` prop on `<Text>` instead.

## Useful patterns

### Pressable with press feedback
```jsx
<Pressable
  onPress={...}
  className="rounded bg-clay-600 px-4 py-2"
  style={({ pressed }) => pressed && { opacity: 0.85 }}
>
  <Text className="text-cream-50 font-semibold">Tap me</Text>
</Pressable>
```

### Active route highlighting
The web's `NavLink` `({ isActive }) =>` API doesn't exist. Get pathname yourself:
```jsx
import { usePathname } from 'expo-router'

const pathname = usePathname() || '/'
const active = pathname === href || pathname.startsWith(href + '/')
```

### Link wrapping a Pressable
The recipe Expo Router prefers — `asChild` forwards the navigation handler to the inner Pressable:
```jsx
<Link href="/learn" asChild>
  <Pressable className="...">
    <Text>Learn</Text>
  </Pressable>
</Link>
```
