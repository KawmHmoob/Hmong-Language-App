# Neon Theme & Bento Home (the "vibrant 2026" pass)

## What
Two things shipped:
1. **A third theme, "Neon"** — deep violet surfaces, coral accent, electric teal
   secondary, and glow-tinted shadows — cycling in the header: **Light → Dark →
   Neon** (sun → moon → spark icons). Dark stays the default; Neon is an opt-in skin.
2. **Home rebuilt as a bento dashboard** — phrase-of-the-day hero card (deep-links
   into Speak), streak/XP stat tiles, the two front doors with a live due-count,
   the Today suggestions card, and compact Explore chips. Plus a `.text-gradient`
   display utility used on the hero greeting.

## Why (and the design judgment call — read this part)
The request behind this was a "vibrant Gen-Z, neon, completely refresh the layouts"
brief — which directly contradicts this app's established identity (warm, editorial,
cultural — see [07-styling-system.md](07-styling-system.md) and the guardrails in
[20-modernization-prompt.md](20-modernization-prompt.md)). Repainting the brand
would have thrown away three passes of deliberate work.

The resolution: **a brand is a default, and a theme is a choice.** The token engine
from [24-theming-and-polish.md](24-theming-and-polish.md) makes "new look" a data
problem, not a redesign problem — so the vibrant aesthetic became a third token set
users can *choose*, while the warm palette remains who the app *is*. The only layout
actually rebuilt was Home, which genuinely was stale: it predated the Speak/Words
split (didn't link either front door!) and carried hardcoded `text-[#fff]` hacks
that fought the theme engine.

This is the pattern to remember when a prompt conflicts with the codebase's own
rules: find the mechanism that satisfies the request *without* breaking the
invariant. Here that mechanism already existed.

## How the third theme works

### One engine, N skins
Note 24 built: Tailwind classes → CSS variables → `:root` (light) and `.dark`
values. Neon is **one more block of the same variables**:

```css
[data-theme='neon'] { --c-cream-50: 23 21 38; --c-clay-600: 255 99 72; … }
```

On `<html>`, Neon is expressed as **two markers together**:
`class="dark" data-theme="neon"`. Why both?
- `.dark` keeps everything that means "this is a dark theme" working —
  `color-scheme: dark` (native scrollbars/inputs), any future `dark:` variants.
- `data-theme="neon"` swaps *which* dark it is.

**Cascade subtlety:** `.dark` (class) and `[data-theme='neon']` (attribute) have
equal specificity (0,1,0). They set the same variables on the same element, so the
winner is whichever rule comes **later in the stylesheet** — the neon block sits
after `.dark` in `index.css` deliberately. Move it above and Neon silently becomes
plain Dark. This is the kind of invisible ordering dependency worth a comment in
the CSS (it has one).

### Role-aware remap, again
Same discipline as the dark palette (note 24 §3) — each scale keeps its *role*:
`cream` = surfaces (now violet-charcoal), `stone` = text (inverted, cool-tinted),
`clay` = accent (vivid coral `#FF6347`-family, so `btn-primary` becomes dark text
on hot coral), `seafoam` = ground (near-black indigo)… with one new trick:
**`seafoam-500` was an unused slot, so it became the electric teal** secondary
accent. The gradient utility picks it up automatically.

### The glow is just a shadow
"Neon glow" sounds like it needs new components. It doesn't — shadows were already
variables, so Neon's `--shadow-warm` appends a soft purple bloom
(`0 0 12px rgba(167,139,250,.18)`) to the black drop shadow. Every existing
`shadow-warm` card glows in Neon and doesn't in the other themes. Zero component
edits — the same lesson as note 24's clay-brightening trick.

### Cycling three states
`useTheme` grew from a boolean toggle to a cycle: `THEMES = ['light','dark','neon']`,
`cycle()` reads the current theme **off the DOM** (`readTheme()`) and applies the
next — the DOM stays the single source of truth, same as before. The pre-paint
script in `index.html` learned the same two-marker encoding, so a saved Neon
preference paints correctly before React mounts (no flash).

## How the bento Home works
- **Grid math:** `grid-cols-2 lg:grid-cols-4` with one `col-span-2 row-span-2`
  hero (phrase of the day) — on mobile that's a full-width hero over paired tiles;
  on desktop a 2×2 anchor with tiles flowing around it. Bento = one grid, varied
  spans; no absolute positioning.
- **Phrase of the day is deterministic, not random:** the ISO date string is
  hashed (sum of char codes) into an index over `allPhrases()` from
  [src/data/speak.js](../src/data/speak.js). Same phrase all day (feels curated,
  refresh-proof), new one tomorrow, **nothing stored**. Same derive-don't-store
  philosophy as the Words daily goal ([23-words-section.md](23-words-section.md)).
- **Live due-count on the Words door** reuses `selectDueWords`; the tile deep-links
  to `/words/session` when work is waiting, `/words` when clear.
- **`TodayCard` was reused, not rebuilt** — it slots into the grid as a full-width
  tile; its stale `/review` link was updated to `/words/session`.
- **`.text-gradient`** (index.css): `background-image: linear-gradient(clay-500 →
  seafoam-500)` + `background-clip: text` + transparent color. Because the stops
  are *tokens*, warm themes render a tasteful terracotta→sea-glass and Neon renders
  coral→electric-teal — one class, theme decides the drama. (RN note: no
  background-clip there — use `MaskedView` or accept a solid accent.)

## How to extend
- **Fourth theme?** Add a `[data-theme='<name>']` variable block *below* the
  existing ones, add the name to `THEMES` in `useTheme.js`, an icon + label in
  Navbar's `THEME_META`, and the pre-paint script's attribute handling covers it.
  That's the whole checklist.
- **A tile in the bento:** add a `surface` (static) or `surface surface-hover`
  (interactive) block; span with `col-span-*`/`row-span-*`. Keep stats derived.
- **Retiring the cycle button:** if themes grow past three, swap the header cycle
  for a picker in Settings — cycling four+ states blind is bad UX.

## Gotchas
- The neon block's **position in index.css is load-bearing** (cascade tie-break —
  see above).
- `text-gradient` text is invisible if the gradient fails — it sets
  `color: transparent`. If you ever see blank hero text, the background-clip line
  was lost.
- The hero greeting uses the gradient on **`Nyob zoo.` only** — gradients on body
  text read as noise; reserve the class for display-size type.
- Emoji tile icons (🔥 ✨ 🎙️ 🃏) render differently per platform — acceptable here;
  swap for the inline-SVG set if it starts to bother you.

## Files
- `src/index.css` — `[data-theme='neon']` token block, `.text-gradient` utility
- `src/hooks/useTheme.js` — three-theme cycle, DOM as source of truth
- `index.html` — pre-paint script handles the neon attribute
- `src/components/Navbar.jsx` — cycle button (sun/moon/spark), `THEME_META`
- `src/pages/Home.jsx` — bento dashboard rebuild
- `src/components/home/TodayCard.jsx` — `/review` → `/words/session` link fix
