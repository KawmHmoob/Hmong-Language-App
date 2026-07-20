import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { buildIndex, lookupAll } from './match.mjs'

// Wires `audio:` onto the items of each lesson's `examples` step.
//
// Re-runnable: an existing `, audio: '...'` is REPLACED, not duplicated.
//
// Handles repeated phrases positionally. The greetings lesson lists "Nyob zoo"
// twice — once as hello, once as the farewell — and there are two recordings
// (`nyob-zoo`, `nyob-zoo-2`). The Nth occurrence takes the Nth take, clamped to
// the last available so a single-take phrase repeats rather than going silent.

const REPO = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\$/, '')
const idx = buildIndex()

// lesson file -> category key in the index
const LESSONS = {
  'pronouns.js': 'pronouns',
  'possessive-pronouns.js': 'pronouns',
  'action-verbs.js': 'verbs',
  'tense-markers.js': 'tense-markers',
  'noun-classifiers.js': 'classifiers',
  'pronouns-demonstratives.js': 'demonstratives',
  'yog-to-be.js': 'yog-to-be',
  'sib-reciprocals.js': 'reciprocals',
  'greetings-farewells.js': 'greetings',
  // Never listed — the two time lessons had recordings sitting in
  // vocabulary/timeframes/ since the batch-3 wire, but nobody added them here,
  // so their `examples` items stayed silent while the word bank next to them
  // played fine. Same class of gap as notes/56, just for audio instead of data.
  'time.js': 'timeframes',
  'time-explained.js': 'timeframes',
  'numbers.js': 'numbers',
  'how-much.js': 'money',
  // Listed BEFORE the recordings exist. Once the matching folder is added to
  // FOLDERS in match.mjs, these wire with no edit here — the loop below skips
  // any category that has no index yet instead of crashing.
  'adjectives.js': 'descriptions',
  'conjunctions.js': 'conjunctions',
}

// `hmong: 'X'` optionally already followed by an audio field.
const ITEM_RE = /hmong: '([^']+)'(?:, audio: '[^']*')?/g

let grand = 0
for (const [file, cat] of Object.entries(LESSONS)) {
  // No recordings for this set yet — nothing to wire, and nothing wrong.
  if (!idx[cat]) { console.log(`  -  ${file}: no '${cat}' recordings yet`); continue }

  const path = `${REPO}/src/data/lessons/${file}`
  const src = readFileSync(path, 'utf8')

  // Only touch the examples step — `hmong:` also appears in exampleSentence
  // and reading passages, which must never get an audio field.
  const start = src.indexOf("kind: 'examples'")
  if (start === -1) { console.log(`  -  ${file}: no examples step`); continue }
  let end = src.indexOf('kind:', start + 10)
  if (end === -1) end = src.length

  const takeCount = new Map()
  let n = 0
  const misses = []

  const patched = src.slice(start, end).replace(ITEM_RE, (whole, hmong) => {
    const hit = lookupAll(idx[cat], hmong)
    if (!hit) { misses.push(hmong); return whole }
    const i = takeCount.get(hit.key) || 0
    takeCount.set(hit.key, i + 1)
    const chosen = hit.paths[Math.min(i, hit.paths.length - 1)]
    n++
    return `hmong: '${hmong}', audio: '${chosen}'`
  })

  writeFileSync(path, src.slice(0, start) + patched + src.slice(end), 'utf8')
  grand += n
  console.log(`+${String(n).padStart(2)}  ${file}${misses.length ? `   (no file: ${misses.join(', ')})` : ''}`)
}
console.log(`\n${grand} lesson items wired`)
