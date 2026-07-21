import { fileURLToPath } from 'node:url'
import { readFileSync, readdirSync, statSync } from 'node:fs'

// Guards icon usage: every <SomethingIcon /> in JSX must actually be imported.
//
// WHY THIS EXISTS: an icon used without an import is a RUNTIME crash, not a
// build error — Vite bundles it happily and the page dies white when a user
// opens it. It happened swapping "→" text arrows for <ArrowRightIcon/>: two
// files got the component but not the import, and `npm run build` passed.
//
// Only checks names ending in `Icon`, which is the convention across the app.

const SRC = fileURLToPath(new URL('../../src', import.meta.url))

function walk(dir) {
  let out = []
  for (const e of readdirSync(dir)) {
    const p = `${dir}/${e}`
    if (statSync(p).isDirectory()) out = out.concat(walk(p))
    else if (/\.jsx$/.test(e)) out.push(p)
  }
  return out
}

let bad = 0
for (const file of walk(SRC)) {
  const src = readFileSync(file, 'utf8')

  // Strip comments so a commented-out example doesn't count as usage.
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

  // Used as a JSX element: <FooIcon …>
  const used = new Set([...code.matchAll(/<([A-Z]\w*Icon)\b/g)].map((m) => m[1]))
  if (used.size === 0) continue

  // Imported (named or default) or defined locally in this file.
  const imported = new Set()
  for (const m of code.matchAll(/import\s+(?:(\w+)\s*,\s*)?\{([^}]*)\}\s*from/g)) {
    if (m[1]) imported.add(m[1])
    for (const n of m[2].split(',')) {
      const name = n.trim().split(/\s+as\s+/).pop().trim()
      if (name) imported.add(name)
    }
  }
  for (const m of code.matchAll(/import\s+(\w+)\s+from/g)) imported.add(m[1])
  for (const m of code.matchAll(/function\s+(\w*Icon)\b/g)) imported.add(m[1])
  for (const m of code.matchAll(/(?:const|let)\s+(\w*Icon)\s*=/g)) imported.add(m[1])

  for (const name of used) {
    if (!imported.has(name)) {
      console.log(`  MISSING import: <${name}/> in ${file.slice(SRC.length + 1)}`)
      bad++
    }
  }
}

console.log(bad ? `\n${bad} icons used without an import` : '\nevery icon used is imported')
process.exit(bad ? 1 : 0)
