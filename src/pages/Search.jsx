import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { consonants, vowels, tones } from '../data/alphabet.js'
import { categories } from '../data/vocabulary.js'
import { grammar, everyday, readings } from '../data/course.js'

function normalize(s) {
  return (s || '').toLowerCase().trim()
}

// Build the search index once at module load â€” data is static.
function buildIndex() {
  const items = []
  for (const c of consonants) {
    items.push({ kind: 'alphabet', label: c.letter, hint: c.sound,
      to: '/alphabet/consonants', haystack: `${c.letter} ${c.sound}` })
  }
  for (const v of vowels) {
    items.push({ kind: 'alphabet', label: v.letter, hint: v.sound,
      to: '/alphabet/vowels', haystack: `${v.letter} ${v.sound}` })
  }
  for (const t of tones) {
    items.push({ kind: 'alphabet', label: t.marker || '(no marker)', hint: t.name,
      to: '/alphabet/tones', haystack: `${t.marker} ${t.name} ${t.description}` })
  }
  for (const cat of categories) {
    for (const w of cat.words) {
      items.push({ kind: 'vocab', label: w.hmongRPA, hint: w.english,
        to: `/vocabulary/${cat.id}/${w.id}`,
        haystack: `${w.hmongRPA} ${w.english} ${(w.tags || []).join(' ')}` })
    }
  }
  for (const g of grammar) {
    for (const it of g.items) {
      items.push({ kind: 'grammar', label: it.hmong, hint: it.english,
        to: '/course/grammar', haystack: `${it.hmong} ${it.english}` })
    }
  }
  for (const e of everyday) {
    for (const it of e.items) {
      items.push({ kind: 'everyday', label: it.hmong, hint: it.english,
        to: '/course/everyday', haystack: `${it.hmong} ${it.english}` })
    }
  }
  for (const r of readings) {
    items.push({ kind: 'reading', label: r.title, hint: r.english.slice(0, 80),
      to: '/course/reading', haystack: `${r.title} ${r.hmong} ${r.english}` })
  }
  return items.map((i) => ({ ...i, haystack: normalize(i.haystack) }))
}

const INDEX = buildIndex()

const KIND_LABEL = {
  alphabet: 'Alphabet',
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  everyday: 'Everyday',
  reading: 'Reading',
}

export default function Search() {
  const [q, setQ] = useState('')

  const grouped = useMemo(() => {
    const norm = normalize(q)
    if (!norm) return null
    const hits = INDEX.filter((i) => i.haystack.includes(norm)).slice(0, 80)
    return hits.reduce((acc, h) => {
      acc[h.kind] = acc[h.kind] || []
      acc[h.kind].push(h)
      return acc
    }, {})
  }, [q])

  return (
    <>
      <h2 className="font-serif text-4xl text-stone-900 mb-6">Search</h2>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search words, phrases, lettersâ€¦"
        autoFocus
        className="w-full rounded border border-cream-300 bg-cream-50 px-4 py-3 text-base focus:outline-none focus:border-clay-500 mb-6"
      />
      {!grouped && (
        <p className="text-stone-600 italic">
          Type to search across the alphabet, vocabulary, course, and readings.
        </p>
      )}
      {grouped && Object.keys(grouped).length === 0 && (
        <p className="text-stone-600 italic">No results.</p>
      )}
      {grouped &&
        Object.entries(grouped).map(([kind, items]) => (
          <section key={kind} className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-clay-600 mb-2">
              {KIND_LABEL[kind] || kind} Â· {items.length}
            </h3>
            <ul className="space-y-1.5">
              {items.map((r, i) => (
                <li key={`${r.to}-${i}`}>
                  <Link
                    to={r.to}
                    className="surface p-3 flex justify-between items-center hover:border-clay-500 transition"
                  >
                    <span className="font-medium text-clay-700">{r.label}</span>
                    <span className="text-stone-600 text-sm text-right">{r.hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </>
  )
}
