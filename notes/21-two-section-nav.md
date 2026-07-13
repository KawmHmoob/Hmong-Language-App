# Two-Section Navigation & Palette Rationalization

## What
The app now has **two front doors** — **Speak** (`/speak`) and **Words** (`/words`) —
with every other page demoted to a secondary "More" list. Navigation lives in a new
`PrimaryNav` component: a **left rail on desktop** and a **fixed bottom tab bar on
mobile**. The old top-navbar link row and hamburger menu are gone; the Navbar is now a
slim identity/status header (logo, XP, streak, search/settings/account).

Also in this change: the `blush` palette bug was fixed and the blue-green tones got a
real name (`seafoam`), plus app-wide keyboard focus rings and `prefers-reduced-motion`
support in [src/index.css](../src/index.css).

## Why
- A first-time user should instantly see what the app *is*: you **speak** and you
  **learn words**. Seven equal-weight nav links buried that.
- Mobile thumbs live at the bottom of the screen — a bottom tab bar beats a hamburger
  for the two actions we want used daily.
- `blush-200` held a powder-blue hex (`#B0E0E6`) inside a "dusty rose" scale — a trap
  for anyone styling by name. The blue-greens were also hard-coded (`#C7DEE0`,
  `#9CBFC2`) in Navbar/Footer, invisible to Tailwind tooling.

## Files
- `src/components/PrimaryNav.jsx` — **new**; both nav form factors, one links source
- `src/components/Layout.jsx` — flex row (rail + content), `pb-28` so the tab bar
  never covers content, background token swap
- `src/components/Navbar.jsx` — slimmed to identity/status; nav removed
- `src/components/Footer.jsx` — hex → `seafoam` tokens
- `tailwind.config.js` — `seafoam` scale added; `blush-200` fixed to `#F2C4BD`
- `src/index.css` — global `:focus-visible` outline; `prefers-reduced-motion` kill-switch
- `src/App.jsx` — routes for `/speak`, `/speak/:phraseId`, `/words`, `/words/session`;
  `/review` → redirect to `/words/session`

## Code anatomy

**One links source, two renderings.** `PrimaryNav` defines `primary` (2 items) and
`secondary` arrays once, then renders `<SideRail />` (`hidden md:block`, sticky) and
`<TabBar />` (`md:hidden`, `fixed bottom-0`). A `fixed` element doesn't care where it
sits in the DOM, so Layout mounts `PrimaryNav` once inside the content row:

```jsx
// Layout.jsx
<div className="mx-auto max-w-6xl flex gap-6">
  <PrimaryNav />                 {/* rail shows md+; tab bar fixes itself bottom */}
  <main className="flex-1 min-w-0 … pb-28 md:pb-16">
    <Outlet />
  </main>
</div>
```
`min-w-0` on `<main>` matters: without it a wide child (table, long word) can't shrink
inside a flex row and forces horizontal scroll.

**The mobile "More" sheet** is plain state, no portal:

```jsx
const [moreOpen, setMoreOpen] = useState(false)
useEffect(() => { setMoreOpen(false) }, [location.pathname]) // close on nav
// Escape closes and returns focus to the button (a11y):
// aria-expanded + aria-controls tie button and sheet together for screen readers
```

**Safe-area padding** for phones with home-indicator bars:
`pb-[env(safe-area-inset-bottom)]` on the tab bar container.

**Palette decision (the `blush` bug).** The blue tones were *load-bearing* (page
background, header band) — renaming, not removing, was the fix:

```js
// tailwind.config.js
blush:   { …, 200: '#F2C4BD', … },   // now a real rose between 100 and 300
seafoam: { 200: '#C7DEE0',           // header/footer band (was hard-coded)
           300: '#B0E0E6',           // page background (was blush-200!)
           400: '#9CBFC2', … },      // band borders (was hard-coded)
```
Visual result: identical colors, honest names. `bg-blush-200` in Layout became
`bg-seafoam-300` (same hex).

**Focus + motion (index.css, @layer base).** One `:focus-visible` outline (clay-600)
for links/buttons/inputs app-wide — keyboard users get rings, mouse users don't. A
`prefers-reduced-motion` block flattens all animations/transitions to ~0ms globally,
so individual components rarely need their own handling (LevelMeter still lowers its
redraw rate — see [22-speak-section.md](22-speak-section.md)).

## How to extend
- **Add a secondary page to the nav:** append to `secondary` in `PrimaryNav.jsx`;
  it appears in the rail's More list and the mobile sheet automatically.
- **Never add a third primary tab** without a design rethink — the grid is
  `grid-cols-3` (two tabs + More) and the whole point is two front doors.
- **New seafoam/blush usage:** always the tokens, never hex — that's what the rename
  bought us.

## Gotchas
- The Navbar no longer contains page links. If you add a page, users find it via
  PrimaryNav's More — don't re-grow the header.
- Old `/review` bookmarks still work (redirect in App.jsx).
- `src/pages/Review.jsx` is now **unrouted dead code**, superseded by
  `WordsSession.jsx` ([23-words-section.md](23-words-section.md)). Delete it when
  you're confident.
