// Pulls the showcase's facts FROM THE MOBILE APP, so the website never
// hand-types a number that goes stale.
//
//   node scripts/showcase/sync-app-content.mjs [path-to-KawmHmoob-rn]
//
// Defaults to the sibling folder ../KawmHmoob-rn. Writes src/data/appContent.json,
// which the landing page imports. Re-run after adding lessons/words to the app,
// then commit the JSON. See notes/72.
//
// How: the RN data files use extensionless imports ('./lessons/pronouns'),
// which plain Node ESM can't load. esbuild (already installed — Vite depends on
// it, so no new package) bundles them into one module in memory, we import that,
// and count. Nothing from RN is copied into the site except the numbers and the
// eight tones.

import { build } from 'esbuild'
import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const rn = resolve(process.argv[2] ?? join(root, '../KawmHmoob-rn'))
const data = join(rn, 'src/data')
if (!existsSync(data)) {
  console.error(`No RN data at ${data}. Pass the KawmHmoob-rn path as an argument.`)
  process.exit(1)
}

// Windows paths -> forward slashes for the import specifiers (char 92 = backslash).
const SEP = String.fromCharCode(92)
const entry = ['lessons', 'vocabulary', 'reference', 'speak', 'quizzes']
  .map((m) => `export * as ${m} from ${JSON.stringify(join(data, `${m}.js`).replaceAll(SEP, '/'))}`)
  .join('\n')

const out = await build({
  stdin: { contents: entry, resolveDir: data, loader: 'js' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  loader: { '.js': 'jsx' },
  logLevel: 'silent',
})
const file = join(mkdtempSync(join(tmpdir(), 'kh-sync-')), 'data.mjs')
writeFileSync(file, out.outputFiles[0].text)
const { lessons, vocabulary, reference, speak, quizzes } = await import(pathToFileURL(file).href)

// Dedupe categories by id the way getCategory() resolves them — count what a
// learner can actually reach (same rule as the old Home vocabStats, notes/56).
const firstById = new Map()
for (const c of vocabulary.categories) if (!firstById.has(c.id)) firstById.set(c.id, c)
const cats = [...firstById.values()]

function countAudio(dir) {
  if (!existsSync(dir)) return 0
  return readdirSync(dir).reduce((n, f) => {
    const p = join(dir, f)
    return n + (statSync(p).isDirectory() ? countAudio(p) : /\.(mp3|m4a|wav)$/i.test(f) ? 1 : 0)
  }, 0)
}

let commit = null
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: rn }).toString().trim()
} catch {
  /* not a git checkout — fine, it's provenance only */
}

const content = {
  generatedAt: new Date().toISOString().slice(0, 10),
  source: { repo: 'KawmHmoob-rn', commit },
  stats: {
    units: lessons.units.length,
    lessons: lessons.units.reduce((n, u) => n + u.lessons.length, 0),
    words: cats.reduce((n, c) => n + c.words.length, 0),
    categories: cats.length,
    phrases: speak.allPhrases().length,
    quizzes: quizzes.quizzes.length,
    recordings: countAudio(join(rn, 'assets/audio')),
  },
  units: lessons.units.map((u) => ({ title: u.title, lessons: u.lessons.length })),
  // Same shape the app uses; `audio` is a site path the website serves from
  // public/assets/audio (the files exist on both sides under the same path).
  tones: reference.tones.map(({ marker, name, example, example2, audio }) => ({
    marker, name, example, example2, audio,
  })),
}

const dest = join(root, 'src/data/appContent.json')
writeFileSync(dest, JSON.stringify(content, null, 2) + '\n')
console.log(`wrote ${dest}`)
console.log(content.stats)

// Every tone clip the page will play must exist in THIS site's public folder.
const missing = content.tones.filter((t) => !existsSync(join(root, 'public', t.audio)))
if (missing.length) {
  console.error('MISSING tone audio in public/:', missing.map((t) => t.audio))
  process.exit(1)
}
console.log('all tone clips present in public/')
