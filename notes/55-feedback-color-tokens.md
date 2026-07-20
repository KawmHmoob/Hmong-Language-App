# Answer Feedback Colors — the `success` / `danger` Tokens

## What
Quiz and lesson answer feedback (right → green, wrong → red) now runs on two new
**semantic token scales**, `success` and `danger`, instead of raw Tailwind
`emerald-*` / `red-*`. 46 class replacements across 12 files.

## The bug
In dark mode the correct/incorrect chips rendered as near-white blocks with
near-white text — **the answer was invisible**.

```jsx
// before
if (showResult && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
```

`bg-emerald-50` is a **fixed** color: RGB 236 253 245, near-white, in every
theme. The button's text color was *inherited*, and the inherited value comes
from the `stone` scale — which **inverts**, so in dark mode it's near-white too.

> Near-white text on a near-white surface. Each half was individually correct;
> they were only wrong **together**, and only in one theme.

This is exactly what convention #5 in `00-architecture.md` — *"Tokens only —
never a hex, never `dark:`"* — exists to prevent. `emerald-50` isn't a hex, so it
didn't *look* like a violation, but it's the same mistake: a color that can't
respond to the theme, sitting next to one that does.

## The fix: name for meaning, invert like `stone`
```css
:root {                    .dark {                   [data-theme='neon'] {
  --c-success-50:  236 253 245;  --c-success-50:  18 44 34;   --c-success-50:  14 44 46;
  --c-success-900:   6  78  59;  --c-success-900: 167 243 208; --c-success-900: 168 250 240;
```

**50 is always the surface; 900 is always the text on that surface.** Both flip
together, so `bg-success-50 text-success-900` is legible in all three themes —
the pair can't drift apart because they move as one scale.

The names say **success/danger, not green/red**, because the hue isn't stable:
neon's success is *electric teal* and its danger is *hot pink-red*, chosen to sit
in the cyber palette rather than dropping a stock green into it. A token named
`green` that renders teal is the `blush-200` trap from notes/21 all over again —
**name the job, not the appearance.**

Five stops, each with a job:

| Stop | Job |
|---|---|
| `50` | filled surface (chips, selected options) |
| `200` | subtle border on a filled surface |
| `500` | border / accent on the surface |
| `700` | solid badge background, pairs with `text-cream-50` |
| `900` | text **on** the `50` surface |

## Don't inherit the text color
The surface swap alone would have fixed it, but the fragility remains if text
color comes from a parent. So every feedback state now sets its own:

```jsx
let cls = 'border-cream-300 bg-cream-50 hover:border-clay-500 text-stone-800'
if (showResult && isAnswer)      cls = 'border-success-500 bg-success-50 text-success-900 font-medium'
else if (showResult && picked)   cls = 'border-danger-500 bg-danger-50 text-danger-900 font-medium'
else if (showResult)             cls = 'border-cream-200 bg-cream-50 text-stone-700 opacity-60'
```

**A state that sets background but not foreground is a half-specified state.** It
only works while some ancestor happens to supply a compatible color — which is a
dependency nobody wrote down and nobody will remember to check.

`font-medium` on the two answered states also means the result is legible
*without* relying on color, which matters for red/green color blindness.

## Verify contrast, don't eyeball it
`scripts/theme/contrast.mjs` parses the three theme blocks straight out of
`index.css` and computes real WCAG ratios. Exits 1 below AA:

```
light  AAA  9.23:1  correct chip     dark  AAA 11.62:1     neon  AAA 12.41:1
light  AAA  9.16:1  wrong chip       dark  AAA 10.91:1     neon  AAA 11.00:1
light  AA   5.09:1  solid badge      dark  AAA 10.97:1     neon  AAA 12.99:1
worst pair: 5.09:1 — all pass AA
```

Run it after touching any token. Three themes is more color combinations than
anyone can hold in their head, and "looks fine on my monitor" is how the original
bug shipped.

## What was left alone
`.btn-danger` still uses literal `bg-red-600 text-white`. That's deliberate and
already commented in `index.css`: it's a solid destructive button whose contrast
doesn't depend on the surface behind it, so it reads correctly in every theme
without tokens.

## How to extend
- **New feedback state** (e.g. "partially correct"): add a `--c-warning-*` scale
  to **all three** theme blocks, map it in `tailwind.config.js`, add it to
  `PAIRS` in the contrast script. Skipping a theme leaves it inheriting light
  values against a dark surface — the bug, rebuilt.
- **Never** reach for `emerald-*` / `red-*` / `green-*` again. If a semantic
  token doesn't exist for what you need, add one.
- Grep for leftovers: `(emerald|red|green|amber)-(50|100|...|900)` should only
  ever match `.btn-danger`.

## Files
- `src/index.css` — the two scales × three themes
- `tailwind.config.js` — `success` / `danger` color mappings
- `src/pages/{QuizEngine,Lesson,QuizMenu,WordDetail,VocabList,Speak,LoginForm,RegisterForm,Notebook}.jsx`
- `src/components/{quiz/QuizResults,vocabulary/Flashcard,learn/LessonCard}.jsx`
- `scripts/theme/contrast.mjs` — the WCAG guard
