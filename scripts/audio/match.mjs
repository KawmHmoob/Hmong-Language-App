import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import { categories } from '../../src/data/vocabulary.js'

// The AUDIO ROOT, not the grammar folder — recordings now live under
// vocabulary/ too, so folder keys below carry their own top-level segment.
const ROOT = fileURLToPath(new URL('../../public/assets/audio', import.meta.url))

// folder on disk -> [filename prefix, category key]
//
// The category key is a vocabulary category id.
//
// ⚠️ These folder names must match the RECORDING PIPELINE's export paths. Two
// were previously misspelled on disk (`classifers`, `sib-reciporcals`) and have
// been renamed here and on disk. If an export ever recreates the old spelling,
// the files land in a folder nothing reads and every clip goes silently 404 —
// which is the exact failure mode notes/42 is about. `verify.mjs` catches it.
export const FOLDERS = {
  'grammar/action-verbs': ['hmong-action-verbs-', 'verbs'],
  'grammar/adjectives': ['hmong-common-adjectives-', 'descriptions'],
  'grammar/classifiers': ['hmong-classifiers-', 'classifiers'],
  'grammar/common-demonstratives': ['hmong-demonstratives-', 'demonstratives'],
  'grammar/conjunctions': ['hmong-conjunctions-', 'conjunctions'],
  'grammar/pronouns': ['hmong-pronouns-', 'pronouns'],
  'grammar/tense-markers': ['hmong-tense-markers-', 'tense-markers'],
  'grammar/yog-to-be': ['hmong-yog-to-be-', 'yog-to-be'],
  'grammar/conversations/sib-reciprocals': ['hmong-sib-reciprocals-', 'reciprocals'],
  'grammar/conversations/greetings-and-farewells': ['hmonggreetingsandfarewells-', 'greetings'],
  'vocabulary/timeframes': ['hmong-time-', 'timeframes'],
  'vocabulary/numbers': ['hmong-numbers-', 'numbers'],
  // TWO folders, one category — buildIndex merges rather than overwrites.
  'vocabulary/money/hmong-money': ['hmong-money-', 'money'],
  'vocabulary/money/hmong-how-much': ['how-much-', 'money'],
  // NOT listed, deliberately:
  //   vocabulary/adjectives  — byte-for-byte copy of grammar/adjectives, kept
  //                            by the author for dataset building
  //   vocabulary/time        — identical copy of vocabulary/timeframes
  // Listing either would wire the same recording twice under two paths.
}

// base token -> ['grammar/<folder>/<file>.mp3', …], per category.
//
// An ARRAY, not a single path, because one phrase can have several takes:
// `nyob-zoo.mp3` and `nyob-zoo-2.mp3` are both "Nyob zoo" (the greeting and
// the farewell — same words, two senses). A Map<token, path> silently dropped
// one of them. Trailing `-<n>` is stripped to group them, then sorted so the
// unnumbered take is always first.
// Take number from a token: `nyob-zoo` -> 1, `nyob-zoo-2` -> 2.
const takeNo = (token) => {
  const m = /-(\d+)$/.exec(token)
  return m ? Number(m[1]) : 1
}

export function buildIndex() {
  const byCat = {}

  // PASS 1 — collect raw {take, path} entries. A category can be fed by more
  // than one folder (`money` is split across two with different prefixes), so
  // this merges into whatever is already there.
  for (const [folder, [prefix, cat]] of Object.entries(FOLDERS)) {
    const map = byCat[cat] ?? new Map()
    for (const f of readdirSync(`${ROOT}/${folder}`)) {
      if (!f.endsWith('.mp3')) continue
      const token = f.slice(prefix.length, -4)
      const base = token.replace(/-\d+$/, '')
      if (!map.has(base)) map.set(base, [])
      map.get(base).push({ take: takeNo(token), path: `${folder}/${f}` })
    }
    byCat[cat] = map
  }

  // PASS 2 — normalize ONCE, after every folder has contributed.
  //
  // This used to run at the end of each folder's loop, which broke merging:
  // the second folder's pass re-processed the first folder's already-converted
  // string entries, and `x.path` on a string is `undefined`. Every path from
  // the first-listed money folder silently became undefined.
  //
  // Sort by TAKE NUMBER, not filename. A plain string sort puts
  // `nyob-zoo-2.mp3` BEFORE `nyob-zoo.mp3`, because '-' (0x2D) sorts before
  // '.' (0x2E) — so take 2 would be handed out first.
  for (const map of Object.values(byCat)) {
    for (const [base, list] of map) {
      list.sort((a, b) => a.take - b.take)
      map.set(base, list.map((x) => x.path))
    }
  }
  return byCat
}

// A Hmong string -> the two spellings the files might use. Kept for reporting
// ("tried X / Y") — actual matching uses `norm` below.
export function keysFor(hmong) {
  const base = hmong.toLowerCase().replace(/[?.,!]/g, '').trim()
  return [base.replace(/\s+/g, '-'), base.replace(/\s+/g, '')]
}

// SEPARATOR-INSENSITIVE key. Filenames collapse spaces inconsistently — the
// same batch has `teev-sij`, `tavsu-dua` (half collapsed), and `tagkis-no` —
// so exact-key lookup missed real matches.
//
// It strips ONLY separators, punctuation, and the `...` in split conjunctions.
// It must never touch letters: a trailing `-s`/`-b`/`-j` is a TONE MARKER, so
// "hmo" and "hmos" are different words. Fuzzy-matching those would reintroduce
// the wrong-audio bug from notes/54 in the one place it does most damage.
// EXPORTED so verify.mjs compares with the exact same rule. When the matcher
// and the verifier normalize differently, the verifier reports phantom
// mismatches on everything the matcher deliberately accepted — which is what
// happened the first time this ran.
export const norm = (s) =>
  s.toLowerCase().replace(/\.\.\./g, ' ').replace(/[?.,!]/g, '').replace(/[\s-]+/g, '')

// Small maps (≤25 entries), so a scan is fine and far more robust than trying
// to pre-generate every spelling variant a filename might use.
function find(map, hmong) {
  const want = norm(hmong)
  for (const [key, paths] of map) if (norm(key) === want) return { key, paths }
  return null
}

// First take for this phrase.
export function lookup(map, hmong) {
  const hit = find(map, hmong)
  return hit?.paths.length ? { key: hit.key, path: hit.paths[0] } : null
}

// Every take, in order. Callers that render the same phrase twice (the
// greetings lesson) consume these positionally.
export function lookupAll(map, hmong) {
  const hit = find(map, hmong)
  return hit?.paths.length ? { key: hit.key, paths: hit.paths } : null
}

if (process.argv[1].endsWith('match.mjs')) {
  const idx = buildIndex()
  let hit = 0, miss = 0
  const usedByCat = {}
  for (const [cat, map] of Object.entries(idx)) {
    const c = categories.find((x) => x.id === cat)
    const files = [...map.values()].flat().length
    if (!c) {
      console.log(`\n### ${cat}  (${files} files / NO vocabulary category — lesson-only)`)
      continue
    }
    console.log(`\n### ${cat}  (${files} files / ${c.words.length} words)`)
    usedByCat[cat] = new Set()
    for (const w of c.words) {
      const m = lookup(map, w.hmongRPA)
      if (m) { hit++; usedByCat[cat].add(m.key); console.log(`  ok   ${w.id}  <- ${m.path}`) }
      else { miss++; console.log(`  MISS ${w.id}  "${w.hmongRPA}"  (tried ${keysFor(w.hmongRPA).join(' / ')})`) }
    }
    const unused = [...map.keys()].filter((k) => !usedByCat[cat].has(k))
    if (unused.length) console.log(`  unused files: ${unused.join(', ')}`)
  }
  console.log(`\nmatched ${hit}, missing ${miss}`)
}


