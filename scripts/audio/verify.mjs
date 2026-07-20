import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { categories } from '../../src/data/vocabulary.js'
import { FOLDERS, norm } from './match.mjs'

const REPO = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\$/, '')
const AUDIO = `${REPO}/public/assets/audio`
const prefixOf = Object.fromEntries(Object.entries(FOLDERS).map(([f, [p]]) => [f, p]))

let bad = 0, ok = 0

// Does path `grammar/<folder>/<prefix><token>.mp3` spell the same word as `hmong`?
function agrees(path, hmong) {
  // Folders can be NESTED (`grammar/conversations/sib-reciporcals/x.mp3`), so
  // take everything between 'grammar/' and the filename as the folder key —
  // a fixed 3-part split silently produced `undefined` on those.
  // Folder keys now carry their own top-level segment ('grammar/adjectives',
  // 'vocabulary/timeframes'), so the folder is everything but the filename.
  const parts = path.split('/')
  const file = parts[parts.length - 1]
  const folder = parts.slice(0, -1).join('/')
  const prefix = prefixOf[folder]
  if (!prefix) return false // unknown folder — treat as a mismatch, not a crash

  // Compare on the BASE token so alternate takes still count as agreeing:
  // `nyob-zoo-2` is a second recording of "Nyob zoo", not a different word.
  // Uses match.mjs's `norm` — the SAME rule the matcher used to accept it.
  const token = file.slice(prefix.length, -4).replace(/-\d+$/, '')
  return norm(token) === norm(hmong)
}

console.log('â”€â”€ vocabulary.js â”€â”€')
for (const c of categories) {
  for (const w of c.words) {
    // Only the wired-by-script paths. Alphabet audio is absolute
    // ('/assets/audio/...') and hand-authored, so it isn't this script's job.
    if (!w.audioFile || w.audioFile.startsWith('/')) continue
    if (!existsSync(`${AUDIO}/${w.audioFile}`)) { console.log(`  404  ${w.id} -> ${w.audioFile}`); bad++; continue }
    if (!agrees(w.audioFile, w.hmongRPA)) {
      console.log(`  MISMATCH ${w.id}: text "${w.hmongRPA}" but file ${w.audioFile}`); bad++
    } else ok++
  }
}

console.log('â”€â”€ lesson examples â”€â”€')
for (const f of ['pronouns', 'possessive-pronouns', 'action-verbs', 'tense-markers',
                 'noun-classifiers', 'pronouns-demonstratives', 'yog-to-be',
                 'sib-reciprocals', 'greetings-farewells']) {
  const src = readFileSync(`${REPO}/src/data/lessons/${f}.js`, 'utf8')
  for (const m of src.matchAll(/hmong: '([^']+)', audio: '([^']+)'/g)) {
    const [, hmong, path] = m
    if (!existsSync(`${AUDIO}/${path}`)) { console.log(`  404  ${f}: ${hmong} -> ${path}`); bad++; continue }
    if (!agrees(path, hmong)) { console.log(`  MISMATCH ${f}: "${hmong}" but file ${path}`); bad++ }
    else ok++
  }
}

console.log(`\n${ok} verified, ${bad} problems`)
process.exit(bad ? 1 : 0)


