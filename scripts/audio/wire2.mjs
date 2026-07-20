import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { categories } from '../../src/data/vocabulary.js'
import { buildIndex, lookup } from './match.mjs'

const REPO = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\$/, '')
const idx = buildIndex()
const vocabPath = `${REPO}/src/data/vocabulary.js`
let vocab = readFileSync(vocabPath, 'utf8')

// Build the full plan FIRST, against the pristine text, recording absolute
// offsets. Then apply back-to-front so no edit shifts a later offset.
const edits = []
const missing = []
let unchanged = 0

// Matches BOTH `audioFile: null` and an already-wired `audioFile: 'path'`, so
// the script is RE-RUNNABLE. The first version only knew `null` and threw on
// the second run — which meant every new batch of recordings needed the script
// edited before it could be used.
//
// No trailing comma in the pattern: the last field of an object is written
// `audioFile: null }`, and requiring the comma silently skipped those words and
// stole the NEXT word's slot instead (notes/54).
const FIELD_RE = /audioFile: (?:null|'[^']*')/

for (const [cat, map] of Object.entries(idx)) {
  const c = categories.find((x) => x.id === cat)
  // Lesson-only sets (greetings) have no vocabulary category — skip here;
  // they're wired into the lesson file instead.
  if (!c) continue

  for (const w of c.words) {
    const m = lookup(map, w.hmongRPA)
    if (!m) { missing.push(`${w.id} ("${w.hmongRPA}")`); continue }

    const at = vocab.indexOf(`id: '${w.id}',`)
    if (at === -1) throw new Error(`id not found: ${w.id}`)

    // BOUND: this word's object ends where the next object begins.
    let end = vocab.indexOf("{ id: '", at)
    if (end === -1) end = vocab.length
    const nextId = vocab.indexOf("id: '", at + 5)
    if (nextId !== -1 && nextId < end) end = nextId

    const window = vocab.slice(at, end)
    const hit = FIELD_RE.exec(window)
    if (!hit) {
      throw new Error(`no audioFile field inside ${w.id}'s own object (bounded ${at}..${end})`)
    }
    const replacement = `audioFile: '${m.path}'`
    if (hit[0] === replacement) { unchanged++; continue }
    edits.push({ at: at + hit.index, len: hit[0].length, wordId: w.id, path: m.path })
  }
}

// Guard: no two words may target the same offset.
const seen = new Map()
for (const e of edits) {
  if (seen.has(e.at)) throw new Error(`COLLISION at ${e.at}: ${seen.get(e.at)} and ${e.wordId}`)
  seen.set(e.at, e.wordId)
}

edits.sort((a, b) => b.at - a.at)
for (const e of edits) {
  vocab = vocab.slice(0, e.at) + `audioFile: '${e.path}'` + vocab.slice(e.at + e.len)
}
writeFileSync(vocabPath, vocab, 'utf8')
console.log(`wired ${edits.length} words (${unchanged} already correct), no collisions`)
console.log(`still silent (no recording): ${missing.join(', ') || 'none'}`)


