import { fileURLToPath } from 'node:url'
import { readdirSync, readFileSync } from 'node:fs'
import { getCategory } from '../../src/data/vocabulary.js'

const DIR = fileURLToPath(new URL('../../src/data/lessons', import.meta.url))
const norm = (s) => s.toLowerCase().replace(/[?.,!]/g, '').replace(/\s+/g, ' ').trim()

for (const f of readdirSync(DIR).filter((x) => x.endsWith('.js'))) {
  const src = readFileSync(`${DIR}/${f}`, 'utf8')
  const vocab = src.match(/^\s*vocab: '([^']+)'/m)?.[1]
  if (!vocab) continue
  const cat = getCategory(vocab)
  if (!cat) { console.log(`${f}: vocab '${vocab}' NOT FOUND`); continue }

  // the examples step: from `kind: 'examples'` to the next `kind:`
  const start = src.indexOf("kind: 'examples'")
  if (start === -1) continue
  let end = src.indexOf('kind:', start + 10)
  if (end === -1) end = src.length
  const taught = [...src.slice(start, end).matchAll(/hmong: '([^']+)'/g)].map((m) => m[1])

  const inBank = new Set(cat.words.map((w) => norm(w.hmongRPA)))
  const gap = taught.filter((t) => !inBank.has(norm(t)))
  const status = gap.length ? `GAP ${gap.length}` : 'ok  '
  console.log(`${status}  ${f.padEnd(28)} ${taught.length} taught / ${cat.words.length} in '${vocab}'`)
  if (gap.length) console.log(`        not in word bank: ${gap.join(', ')}`)
}

