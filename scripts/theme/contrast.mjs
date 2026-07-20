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

