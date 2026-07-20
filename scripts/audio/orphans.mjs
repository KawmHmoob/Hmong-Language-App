import { fileURLToPath } from 'node:url'
import { readdirSync, statSync } from 'node:fs'

// Finds recordings on disk that NOTHING references.
//
// The other direction (data pointing at a missing file) is a 404 you hear the
// first time you tap the button. THIS direction is silent forever: the clip
// never appears anywhere, and the only symptom is a letter or word quietly
// absent from the app. It has already happened — `hmong-double-vowels-oi.mp3`
// was recorded, but "oi" was missing from the `vowels` list entirely, so it was
// invisible in Reference, Search, the quiz, the lesson grid, and the drill.
// See notes/60.
//
// It IMPORTS the data rather than grepping source text. The first version
// grepped, and reported every templated path as an orphan — the tones build
// their filenames with `${marker}`, so the literal string appears nowhere.
// A checker that reports 7 phantom problems gets ignored (notes/58).

const REPO = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\$/, '')
const AUDIO = `${REPO}/public/assets/audio`
const LESSONS = `${REPO}/src/data/lessons`

// Deep-walk any value, collecting every string that looks like an audio path.
function collect(value, out = new Set(), seen = new Set()) {
  if (typeof value === 'string') {
    if (value.includes('.mp3')) out.add(value.split('/').pop())
    return out
  }
  if (!value || typeof value !== 'object' || seen.has(value)) return out
  seen.add(value)
  for (const v of Object.values(value)) collect(v, out, seen)
  return out
}

const referenced = new Set()
const modules = [
  '../../src/data/reference.js',
  '../../src/data/vocabulary.js',
  '../../src/data/wordFamilies.js',
  '../../src/data/speak.js',
  ...readdirSync(LESSONS)
    .filter((f) => f.endsWith('.js'))
    .map((f) => `../../src/data/lessons/${f}`),
]

for (const m of modules) {
  try {
    const mod = await import(m)
    for (const name of Object.keys(mod)) collect(mod[name], referenced)
  } catch (err) {
    console.log(`  (skipped ${m}: ${err.message.split('\n')[0]})`)
  }
}

function allAudioFiles(dir, base = '') {
  let out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`
    const rel = base ? `${base}/${e.name}` : e.name
    if (statSync(p).isDirectory()) out = out.concat(allAudioFiles(p, rel))
    else if (e.name.endsWith('.mp3')) out.push(rel)
  }
  return out
}

const files = allAudioFiles(AUDIO)
const orphans = files.filter((f) => !referenced.has(f.split('/').pop()))

// Group by folder — orphans cluster, and "this whole folder is unwired" is a
// different (and much more actionable) message than 40 individual lines.
const byFolder = new Map()
for (const o of orphans) {
  const folder = o.split('/').slice(0, -1).join('/') || '.'
  if (!byFolder.has(folder)) byFolder.set(folder, [])
  byFolder.get(folder).push(o.split('/').pop())
}
for (const [folder, list] of [...byFolder].sort()) {
  console.log(`  ${folder}/  — ${list.length} unreferenced`)
  for (const f of list.slice(0, 3)) console.log(`      ${f}`)
  if (list.length > 3) console.log(`      … and ${list.length - 3} more`)
}

console.log(
  orphans.length
    ? `\n${orphans.length} of ${files.length} recordings are referenced by nothing`
    : `\nall ${files.length} recordings are referenced`
)
