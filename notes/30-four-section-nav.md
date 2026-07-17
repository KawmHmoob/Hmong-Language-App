# Four-Section Navigation — Priority 1 of the "2011 fix"

> **Superseded in part:** Alphabet was promoted to its own (fifth) section shortly
> after this note — it's reference material, not coursework. See
> [32-alphabet-section-and-mojibake.md](32-alphabet-section-and-mojibake.md). The
> IA mechanics below (match functions, sliding indicator, accent-vs-contrast) all
> still apply; the "never add a fifth tab" rule is now "five is the ceiling."

## What
The nav went from **2 tabs + a "More" sheet hiding seven pages** to **four
always-visible sections** — Home · Learn · Speak · Words — with no hidden
destinations at all. Each section has an identity accent (Learn = seafoam,
Speak = clay, Words = blush) shown in a **sliding indicator** on the mobile tab
bar, a **tinted pill** on the desktop rail, and a **dot eyebrow** on each hub.
The section stays lit anywhere inside its territory: browsing `/vocabulary`
highlights Words; reading `/alphabet` highlights Learn.

Priority 1 of [29-navigation-and-visual-system-prompt.md](29-navigation-and-visual-system-prompt.md).
Priorities 2–5 are NOT run yet — stopped for IA review as the prompt requires.

## Why — the IA reasoning
- **Discovery beats memory.** A "More" sheet is where features go to be
  forgotten. Seven destinations were hidden; several overlapped (Alphabet /
  Course / Learn are all *study*; Vocabulary / Quiz / Notebook are all *words*).
  Grouping them under two umbrella sections means four tabs cover everything.
- **Section membership is a *match function*, not a route.** The old nav lit up
  only on exact tab routes; now each section declares which paths belong to it:

  ```js
  { id: 'words', match: (p) =>
      ['/words', '/vocabulary', '/quiz', '/notebook'].some((r) => p.startsWith(r)) }
  ```
  This is the core idea of the whole rebuild: *orientation comes from mapping
  every URL to a section*, not from adding more nav bars.
- **No routes changed, no ids changed** — pages were re-*labeled* as sub-views,
  not moved. `/alphabet` still works; it's just Learn territory now.

## How the pieces work

### The sliding indicator (mobile)
One absolutely-positioned bar, width `1/4`, moved with a transform:
```jsx
<div className="absolute top-0 h-0.5 w-1/4 transition-transform duration-300"
     style={{ transform: `translateX(${active * 100}%)` }} />
```
Why transform instead of animating `left`: transforms run on the GPU compositor
(no layout recalculation) — and `transform` is exactly what React Native's
Animated API ports to later. `translateX(100%)` of an element that is 1/4 wide
moves it one slot. The global reduced-motion kill-switch (notes/21) flattens the
transition automatically. When no section matches (e.g. /settings), the bar gets
`opacity-0` — no tab pretends to be active.

### The accent-vs-contrast decision (read this — it's a real a11y tradeoff)
The prompt suggested coloring the active icon/label with the section accent. We
deliberately did NOT: seafoam-500 text on cream-50 is ~2.3:1 contrast in the
light theme — an accessibility failure. Instead:
- **active text/icon = ink** (`text-stone-900`) + heavier weight + filled icon,
- **the accent lives in non-text signals**: the indicator bar, the rail pill
  tint (`bg-seafoam-500/15` — token opacity keeps it theme-correct), and the
  hub eyebrow dot.
Color says *where you are*, weight says *what's selected*. If you ever want
accent-colored labels, add darker accent steps to the palette first.

### Tailwind JIT gotcha (why the config repeats class strings)
Section accents are written literally (`ind: 'bg-clay-600'`) instead of composed
(`bg-${accent}-600`). Tailwind's compiler statically scans source for class
names — a template string produces a class that was never generated, which
fails silently (and only in the themes you didn't test). Literal strings in a
config object are the standard workaround.

### Filled-icon active state without a second icon set
Each icon takes a `filled` prop and switches `fill` from `none` to
`currentColor` with a low `fillOpacity` — one SVG serves both states. This is
the seed of the Priority-2 icon system (24×24 viewBox, currentColor, 2px round
strokes).

### The rest
- **Tabs.jsx** (Alphabet/Course/Notebook sub-tabs) got the segmented-control
  treatment — pill track, `min-h-[40px]` targets, `aria-current` via NavLink —
  same API, so no caller changed.
- **Learn.jsx** grew a "Reference" row: entry cards to Alphabet and Course, which
  is how the fold-in is *discoverable* (the nav only makes it *legible*).
- **Deviation from the prompt, flagged:** no persistent segment bar for
  sub-views. Alphabet/Course/Notebook already have their own tab rows; a second
  stacked pill row would be nav noise. Hub entries + section-aware highlighting
  do the job with less chrome.

## How to extend
- **New page?** Decide its section, add its path to that section's `match`, link
  it from the section hub. That's the whole checklist.
- **Never add a fifth tab** without deleting or merging something — the 4-slot
  grid (`grid-cols-4`, `w-1/4` indicator) and the IA itself assume four.
- **Changing a section accent:** update `ind` + `pill` in PrimaryNav's config and
  the hub eyebrow dot — three literal class strings, by design.

## Files
- `src/components/PrimaryNav.jsx` — rewritten: section config + match functions,
  sliding indicator, rail pills, filled icons; "More" sheet deleted
- `src/components/Tabs.jsx` — segmented-control upgrade, same API
- `src/pages/Learn.jsx` — section eyebrow + Reference fold-in cards
- `src/pages/Speak.jsx`, `src/pages/Words.jsx` — accent eyebrow dots
