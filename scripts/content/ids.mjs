import { fileURLToPath } from 'node:url'
import { readdirSync, readFileSync } from 'node:fs'

// Guards the id uniqueness the whole app assumes.
//
// IDs ARE PROGRESS KEYS. Two lessons sharing a step id means finishing one
// marks the other complete; two categories sharing an id means one is
// unreachable. Both have already happened here (notes/56, and the
// time-explained lesson shipped with `numbers-time-*` step ids copied from
// time.js), and neither shows up as a build error — the app just quietly
// misbehaves. Hence a check.

const DIR = fileURLToPath(new URL('../../src/data/lessons', import.meta.url))
let bad = 0

// ── lesson + step ids across every lesson file ──────────────────────────────
const stepOwners = new Map()
const lessonOwners = new Map()
const exportOwners = new Map()

// Commented-out steps are still TEXT. Several lessons keep their retired
// quick-checks in `/* … */` blocks (notes/37), and scanning raw source counted
// those ids as real — reporting a duplicate that doesn't exist at runtime. A
// checker that cries wolf gets ignored, so strip block comments first.
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '')

for (const f of readdirSync(DIR).filter((x) => x.endsWith('.js'))) {
  const src = strip(readFileSync(`${DIR}/${f}`, 'utf8'))

  // `export const <name> =` — two files exporting the same name collide on import.
  for (const m of src.matchAll(/^export const (\w+)\s*=/gm)) {
    if (!exportOwners.has(m[1])) exportOwners.set(m[1], [])
    exportOwners.get(m[1]).push(f)
  }

  const lessonId = src.match(/^\s{2}id: '([^']+)'/m)?.[1]
  if (lessonId) {
    if (!lessonOwners.has(lessonId)) lessonOwners.set(lessonId, [])
    lessonOwners.get(lessonId).push(f)
  }

  // step ids are indented deeper than the lesson id
  for (const m of src.matchAll(/^\s{6}id: '([^']+)'/gm)) {
    if (!stepOwners.has(m[1])) stepOwners.set(m[1], [])
    stepOwners.get(m[1]).push(f)
  }
}

const report = (label, map) => {
  for (const [id, files] of map) {
    if (files.length > 1) {
      console.log(`  DUP ${label} '${id}' in ${[...new Set(files)].join(', ')}`)
      bad++
    }
  }
}
report('export', exportOwners)
report('lesson id', lessonOwners)
report('step id', stepOwners)

// ── vocabulary category + word ids ──────────────────────────────────────────
const { categories } = await import('../../src/data/vocabulary.js')
const catIds = new Map()
const wordIds = new Map()
for (const c of categories) {
  catIds.set(c.id, (catIds.get(c.id) || 0) + 1)
  for (const w of c.words) wordIds.set(w.id, (wordIds.get(w.id) || 0) + 1)
}
for (const [id, n] of catIds) if (n > 1) { console.log(`  DUP category id '${id}' ×${n}`); bad++ }
for (const [id, n] of wordIds) if (n > 1) { console.log(`  DUP word id '${id}' ×${n}`); bad++ }

// ── word family ids ─────────────────────────────────────────────────────────
const { wordFamilies } = await import('../../src/data/wordFamilies.js')
const famIds = new Map()
for (const f of wordFamilies) famIds.set(f.id, (famIds.get(f.id) || 0) + 1)
for (const [id, n] of famIds) if (n > 1) { console.log(`  DUP family id '${id}' ×${n}`); bad++ }

// ── every speak-drill step points at a family that exists ───────────────────
const famSet = new Set(wordFamilies.map((f) => f.id))
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.js'))) {
  const src = strip(readFileSync(`${DIR}/${f}`, 'utf8'))
  for (const m of src.matchAll(/familyId: '([^']+)'/g)) {
    if (!famSet.has(m[1])) { console.log(`  BROKEN familyId '${m[1]}' in ${f}`); bad++ }
  }
}

console.log(bad ? `\n${bad} id problems` : '\nall ids unique, all familyIds resolve')
process.exit(bad ? 1 : 0)
