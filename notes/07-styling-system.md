# Styling System

## What
The design tokens and utility classes that make the app look cohesive. Set up in [tailwind.config.js](../tailwind.config.js) and [src/index.css](../src/index.css). Use these instead of one-off Tailwind classes so the look stays consistent.

## Files
- `tailwind.config.js` — color tokens, font families, custom shadows
- `src/index.css` — base typography, `.surface` / `.btn-*` utility classes
- `index.html` — Google Fonts `<link>` for Fraunces + Inter

## Color tokens

Defined in `tailwind.config.js` under `theme.extend.colors`:

```js
cream: {
  50:  '#FBF6EC',  // lightest — card backgrounds
  100: '#F5EBD9',  // hover/section backgrounds
  200: '#ECDCC0',  // borders
  300: '#E0C8A0',  // stronger borders, hover borders
  400: '#D9B38C',  // your original tan — accent only
  500: '#C99A6F',
  600: '#A87A52',
},
clay: {
  500: '#B25E3D',  // primary accent (terracotta)
  600: '#9C4F33',  // primary buttons, active nav
  700: '#7E3F28',  // hover state for primary
},
```

**When to use which:**
- **Backgrounds**: `bg-cream-50` for cards, `bg-cream-100` for nested zones, the page itself uses a gradient (set in `Layout.jsx`).
- **Borders**: `border-cream-200` for subtle, `border-cream-300` for hover.
- **Accents/CTAs**: `bg-clay-600` for primary, `bg-clay-500` for less aggressive accents (audio button).
- **Text on dark accents**: `text-cream-50`.
- **Body text**: `text-stone-900` (default in `@layer base`); muted is `text-stone-700` or `text-stone-600`.

## Typography

Two fonts loaded in `index.html`:
- **Fraunces** — warm display serif. Used for all headings.
- **Inter** — clean sans. Used for body.

Applied globally via `@layer base` in `index.css`:

```css
@layer base {
  body {
    font-family: 'Inter', system-ui, sans-serif;
    color: #1c1917;
  }
  h1, h2, h3, h4 {
    font-family: 'Fraunces', 'Lora', Georgia, serif;
    letter-spacing: -0.015em;
    font-weight: 600;
  }
}
```

You usually don't need to set `font-serif` or `font-sans` manually — defaults are correct. Override with `font-serif` if you want a non-heading element to use the serif (e.g. a decorative letter on the home cards).

## Utility classes

Defined in `@layer components` in `index.css`. These are real classes, so you can `className="surface"`:

```css
.surface              /* card: rounded-2xl, cream bg, light border, NO shadow at rest */
.surface-hover        /* combine with .surface — adds shadow on hover */
.surface-elevated     /* surface that always has the warm shadow — for hero / focal panels */
.btn-primary          /* clay-600 button (terracotta) */
.btn-secondary        /* stone-900 button (dark) */
.btn-ghost            /* outlined button on cream bg */
```

**Pick the right surface variant:**
- `surface` — default for list items, sections, secondary panels. Calm, no shadow.
- `surface surface-hover` — interactive cards that should lift on hover (home cards, vocab list rows, quiz menu items).
- `surface-elevated` — focal panels that should clearly stand out without needing interaction (TodayCard, login forms, results screens).

The "no shadow at rest" choice is intentional — stacking shadow + border on every card was making lists feel crowded. Reserve elevation for things that earn it.

**Usage example:**

```jsx
<div className="surface surface-hover p-6">
  <h3 className="font-serif text-xl text-stone-900 mb-2">Title</h3>
  <p className="text-stone-700 mb-4">Body</p>
  <div className="flex gap-2">
    <button className="btn-primary">Primary</button>
    <button className="btn-secondary">Secondary</button>
    <button className="btn-ghost">Ghost</button>
  </div>
</div>
```

## Custom shadows

```js
boxShadow: {
  warm:    '0 4px 14px -2px rgba(120,80,40,0.12), 0 2px 4px -2px rgba(120,80,40,0.08)',
  'warm-lg': '0 12px 28px -8px rgba(120,80,40,0.18), 0 4px 8px -4px rgba(120,80,40,0.1)',
}
```

Use `shadow-warm` for resting state, `shadow-warm-lg` for hover/elevated. The brown tint matches the warm palette — stock `shadow-md` looks gray and out-of-place.

## Background gradient

The page background lives in `Layout.jsx`. It's an inline `style` (not Tailwind) because it uses `radial-gradient` with custom color stops:

```jsx
<div
  className="min-h-screen"
  style={{
    background:
      'radial-gradient(1200px 600px at 50% -200px, #F5EBD9 0%, #ECDCC0 45%, #D9B38C 100%)',
    backgroundAttachment: 'fixed',
  }}
>
```

To change the page background, edit this style block. `backgroundAttachment: 'fixed'` keeps the gradient in place during scroll — remove it if you want it to scroll with content.

## Adding a new color or utility

### A new color (e.g. forest green for a "nature" theme)

1. Open `tailwind.config.js`. Add to `theme.extend.colors`:
   ```js
   forest: {
     500: '#3D7E5C',
     600: '#2F6448',
   },
   ```
2. Use anywhere as `bg-forest-500`, `text-forest-600`, etc.
3. Restart `npm run dev` if Tailwind doesn't pick it up immediately.

### A new utility class

1. Open `src/index.css`.
2. Add to `@layer components`:
   ```css
   .pill {
     @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold;
   }
   ```
3. Use as `<span className="pill bg-clay-100 text-clay-700">…</span>`.

## Migration cheat sheet (when you add a new component)

When writing a new component, prefer the design tokens. The mapping from "stock Tailwind reach" to "use this instead":

| Don't use | Use |
|---|---|
| `border-stone-300 bg-white shadow-sm` | `surface` (and `surface-hover` if interactive) |
| `bg-amber-600 text-white hover:bg-amber-700 px-4 py-2 rounded-lg` | `btn-primary` |
| `bg-stone-900 text-white hover:bg-stone-800 …` | `btn-secondary` |
| `border border-stone-400 text-stone-800 hover:bg-stone-100 …` | `btn-ghost` |
| `text-amber-700` / `text-amber-800` (Hmong word emphasis) | `text-clay-700` |
| `text-amber-600` (small labels) | `text-clay-600` |
| `bg-amber-200 text-amber-900` (subtle badge) | `bg-cream-200 text-clay-700` |
| `divide-stone-100` | `divide-cream-200` |
| `border-stone-200` (input borders) | `border-cream-300` + `focus:border-clay-500` |
| `text-3xl font-bold text-stone-900` (heading) | `font-serif text-3xl text-stone-900` (or just `text-3xl text-stone-900` since `@layer base` sets serif on `h2`) |

The whole app has been migrated to this system as of the last styling pass. If you find a file still using the old palette, it was added after that pass — please update it.
