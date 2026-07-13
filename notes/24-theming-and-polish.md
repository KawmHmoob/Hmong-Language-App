# Theming Engine & 2026 Polish Pass (dark mode, tokens, glass, micro-interactions)

## What
The app now has **two full themes** — dark (primary/default) and light (the original
warm palette, hex-for-hex) — toggled by a sun/moon button in the header, persisted per
browser, with **zero layout or structure changes**. Alongside it: refined corner radii
(12px cards / 8px buttons), press states, frosted-glass floating chrome, deeper
typography settings, and theme-aware shadows.

Nothing moved. Every screen (Speak, Words, Learn, Alphabet, Vocabulary, Quiz…) kept
its exact layout, hierarchy, and branding — the *rendering* of the same tokens changed.

## Why (and the key concept: semantic tokens)
The naive way to add dark mode is to write `dark:bg-stone-800 dark:text-white` next to
every class in every component — hundreds of edits, easy to miss one, and every future
component must remember to do it. We did something structurally better:

> **A color class in this app no longer means a color. It means a *role*.**
> `bg-cream-50` means "card surface." `text-stone-900` means "ink." The THEME decides
> what those roles look like.

That's called a **semantic token system**, and it's how Linear/Notion-class apps theme.
One definition change restyles the whole app; components stay theme-ignorant.

## How it works — the full chain, step by step

### 1. Tailwind classes resolve to CSS variables (tailwind.config.js)
```js
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`
colors: { cream: { 50: v('cream-50'), … }, stone: { 900: v('stone-900'), … } }
```
When you write `bg-cream-50`, Tailwind now emits
`background-color: rgb(var(--c-cream-50) / 1)`. The actual numbers live in a CSS
variable — a value the browser looks up **at render time**, not at build time.

Two subtleties worth understanding:
- **Why RGB triplets (`251 246 236`) instead of hex?** Because of opacity modifiers.
  `bg-cream-50/85` compiles to `rgb(var(--c-cream-50) / 0.85)` — the browser needs the
  raw channels to mix alpha in. A hex string in the variable would break every `/50`,
  `/85` in the codebase. `<alpha-value>` is Tailwind's placeholder for that slot.
- **We overrode Tailwind's built-in `stone`.** Components already said
  `text-stone-900` everywhere, so instead of a find-and-replace across the app, the
  scale itself became ours to remap. Same classes, new meaning.

### 2. Each theme is just a set of variable values (src/index.css)
```css
:root  { --c-cream-50: 251 246 236; --c-stone-900: 28 25 23;   … } /* light */
.dark  { --c-cream-50: 33 29 26;    --c-stone-900: 243 238 230; … } /* dark  */
```
`:root` is the light theme — the app's **original hexes, unchanged** (brand identity
preserved exactly). Adding class `dark` to `<html>` swaps every variable at once; CSS
cascade does the "re-render." No React involved.

### 3. The dark palette isn't inversion — it's *role-aware* remapping
Naively inverting colors produces garbage (light text becomes dark text on dark
surfaces…). Each scale was remapped by what it's *for*:

| Scale | Role | Dark treatment |
|---|---|---|
| `cream` | surfaces, borders, tracks | warm **charcoal ladder** (#211D1A → lighter as the scale rises, same direction as light mode: higher number = stronger border) |
| `stone` | text | **inverted**: 900 stays "ink" — near-black on light, warm white on dark; 700/600 remain "secondary/tertiary text" in both |
| `clay` | accent | **brightened** (#9C4F33 → #C86A45) — see the contrast trick below |
| `seafoam` | page bg, header band | deepened into near-black blue-green (#0F1517) so the warm cards float on a cool ground, same relationship as light mode |
| `blush` | warnings | dark maroon surfaces, slightly brightened text tones |
| shadows | depth | brown → **black**; warm brown shadows look muddy on dark ground |

**The contrast trick that makes it all hold together:** `btn-primary` is
`bg-clay-600 text-cream-50`. In dark mode `cream-50` becomes near-black — so button
text would vanish on the old clay. Instead of special-casing the button, **clay
brightens in dark mode**, giving dark-text-on-bright-terracotta (the Linear/Vercel
"black text on vivid accent" look). Likewise the `bg-stone-900 text-cream-50` active
nav pill self-inverts into a light pill with dark text — a classic dark-UI pattern —
purely as a consequence of the role mapping. Zero component edits.

### 4. No flash of wrong theme (index.html)
CSS variables flip instantly, but *when* do we add the `dark` class? If React did it,
users would see a light flash before mount. So a tiny inline `<script>` in
`index.html` runs **before first paint**: read `localStorage['kawmhmoob.theme']`,
default to `'dark'` (dark is the primary theme), set the class. React never races it.

### 5. The toggle (src/hooks/useTheme.js + Navbar)
The hook's source of truth is the class on `<html>` — the one the inline script set.
`toggle()` flips the class, saves the choice, and updates local state so the sun/moon
icon swaps. **No ThemeProvider**: only the button itself needs to re-render; every
other pixel updates via CSS. Also in `index.css`: `color-scheme: dark` on
`html.dark`, which makes *native* UI (scrollbars, form controls) match.

### 6. Two places CSS variables couldn't reach
- **Canvas (LevelMeter):** `ctx.fillStyle` is a raw string, not a CSS class. Trick:
  put `text-clay-500` on the `<canvas>` element and read
  `getComputedStyle(canvas).color` — the browser resolves the themed variable for us,
  once per recording.
- **SVG strokes (QuizResults ring):** `stroke="#9C4F33"` → `className="text-clay-600"
  stroke="currentColor"`. `currentColor` means "whatever CSS `color` is here," which
  is now themed.

Rule to remember: **hardcoded hex in JS/SVG is invisible to the theme.** Route color
through CSS (`currentColor` / computed style) whenever something draws its own pixels.

## The polish details (and why each)
- **Radii: cards 12px (`rounded-xl`), buttons 8px (`rounded-lg`)** — containers
  rounder than the controls inside them reads as "considered," not bubbly. Changed
  once in `.surface*` / `.btn-*`, inherited everywhere.
- **Press states:** `active:scale-[0.98]` on all buttons — the "give" that makes taps
  feel physical. The global `prefers-reduced-motion` kill-switch (note 21) disables it
  for users who ask.
- **Hover lift:** `.surface-hover` now adds `-translate-y-0.5` with its shadow, so
  interactive cards *rise*, static ones don't move — motion = affordance.
- **Glass:** new `.glass` utility (`bg-cream-50/85 backdrop-blur-md`), applied only to
  **floating chrome** — header, mobile tab bar, More sheet. Content scrolling under a
  frosted bar is the depth cue; glass on regular cards would be clutter.
- **Typography:** `font-feature-settings: 'cv02','cv03','cv04','cv11'` turns on
  Inter's more legible alternates (open digits, curved l); `text-rendering:
  optimizeLegibility` enables kerning. Fraunces stays the display voice for Hmong
  text — it *is* the "elegant display font" of this brand.
- **Skeletons/empty states:** `SkeletonCard` and every empty state were already token-
  built, so they got dark mode for free — proof the token system works.

## React Native consciousness (for the Expo migration)
This was designed to port:
- **The token JSON is the asset.** RN has no CSS variables — the light/dark triplets in
  `index.css` become two plain JS theme objects (or NativeWind `vars()`), same names,
  same values. The *role system* (surface/ink/accent) transfers unchanged; only the
  delivery mechanism differs.
- `useTheme` becomes a small ThemeContext + `Appearance.getColorScheme()` instead of
  an `<html>` class; the localStorage key maps to AsyncStorage (the RN port already
  wraps it — see `notes/react-native/05-supabase-and-storage.md`).
- `backdrop-blur` (glass) needs `expo-blur`'s `<BlurView>` on native; budget that or
  fall back to translucent solids.
- `color-scheme`, `:focus-visible`, and the reduced-motion media query are web-only;
  RN equivalents are `useColorScheme()`, focus handled by the platform, and
  `AccessibilityInfo.isReduceMotionEnabled()`.

## How to extend
- **New component?** Use role tokens (`bg-cream-50`, `text-stone-900`, `border-cream-200`)
  and it's automatically dual-theme. Never write a hex, never write `dark:`.
- **New color?** Add the variable to BOTH `:root` and `.dark` in `index.css`, then the
  `v()` mapping in `tailwind.config.js`. A token missing from `.dark` silently renders
  its light value — that's the one failure mode to watch.
- **Tune the dark theme:** edit `.dark` values in `index.css` only. Light mode is
  frozen brand; dark is where taste adjustments live.
- **Flip the default to light:** one word in the `index.html` script (`|| 'dark'`).

## Gotchas
- `emerald-*` / `red-*` (quiz right/wrong feedback) are still Tailwind statics: in dark
  mode they appear as light chips with dark text — readable and intentional-looking,
  but re-tokenize them (`--c-success-*`, `--c-danger-*`) if they bother you.
- The old `bg-[#C7DEE0]`-style arbitrary hexes would have silently escaped theming —
  they were already tokenized in the note-21 pass. Keep it that way.
- Test the toggle on a page with a quiz ring and the Speak level meter — those are the
  two "self-drawing" components and the first places a theming regression would show.

## Files
- `tailwind.config.js` — var-backed palette (+ `stone` override), `darkMode: 'class'`, shadow vars
- `src/index.css` — `:root`/`.dark` token sets, `color-scheme`, typography features, radii/press/glass utilities
- `index.html` — pre-paint theme script
- `src/hooks/useTheme.js` — **new** toggle hook (no provider)
- `src/components/Navbar.jsx` — sun/moon toggle, frosted band
- `src/components/PrimaryNav.jsx` — glass tab bar + More sheet
- `src/components/speak/LevelMeter.jsx`, `src/components/quiz/QuizResults.jsx` — themed via `currentColor`/computed style
