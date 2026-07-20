import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const css = readFileSync(fileURLToPath(new URL('../../src/index.css', import.meta.url)), 'utf8')

// Pull each theme block's token values.
function block(sel) {
  const i = css.indexOf(sel)
  const open = css.indexOf('{', i)
  const end = css.indexOf('\n  }', open)
  const out = {}
  for (const m of css.slice(open, end).matchAll(/--c-([\w-]+):\s*([\d]+) ([\d]+) ([\d]+);/g)) {
    out[m[1]] = [+m[2], +m[3], +m[4]]
  }
  return out
}

const themes = {
  light: block(':root {'),
  dark: block('.dark {'),
  neon: block("[data-theme='neon'] {"),
}
// dark/neon only override some tokens; fall back to light for the rest
for (const k of ['dark', 'neon']) themes[k] = { ...themes.light, ...themes[k] }

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

const PAIRS = [
  ['success-50', 'success-900', 'correct chip / option'],
  ['danger-50', 'danger-900', 'wrong chip / option'],
  ['success-700', 'cream-50', 'solid success badge'],
  ['cream-50', 'stone-800', 'neutral option (baseline)'],
  // Ocean. The dark end exists to carry light text, so that's what's checked —
  // a scale nobody has verified text against is a scale that will eventually
  // get used for a button and fail silently in one theme.
  ['ocean-600', 'cream-50', 'ocean button (light text on deep)'],
  ['ocean-700', 'cream-50', 'ocean button, darkest step'],
  ['ocean-50', 'stone-900', 'ocean tint surface, ink text'],
  // The header band. Every one of these sits on ocean-200 in Navbar.jsx.
  ['ocean-200', 'stone-800', 'header: nav text'],
  ['ocean-200', 'stone-900', 'header: logo wordmark'],
  ['stone-800', 'ocean-200', 'header: ACTIVE nav pill (inverted)'],
  // The badges carry their OWN bg-cream-200, so their text never touches the
  // header band — an earlier version of this list paired clay-700 against
  // ocean-200 and reported a 2.74:1 failure for a combination that is never
  // rendered. Model the pair the component actually produces, not the one the
  // surrounding element suggests.
  ['cream-200', 'stone-900', 'header: xp / streak badge text'],
  ['clay-600', 'cream-50', 'header: level badge'],
]

let worst = 99
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n${name}`)
  for (const [bg, fg, label] of PAIRS) {
    const r = ratio(t[bg], t[fg])
    worst = Math.min(worst, r)
    const tag = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA ' : r >= 3 ? 'AA-lg' : 'FAIL'
    console.log(`  ${tag}  ${r.toFixed(2)}:1   ${label}  (${bg} on ${fg})`)
  }
}
console.log(`\nworst pair: ${worst.toFixed(2)}:1  ${worst >= 4.5 ? '— all pass AA' : '— BELOW AA'}`)
process.exit(worst >= 4.5 ? 0 : 1)

