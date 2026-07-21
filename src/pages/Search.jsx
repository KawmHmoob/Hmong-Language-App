import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { consonants, vowels, tones, grammar } from '../data/reference.js'
import { categories } from '../data/vocabulary.js'
import { allPhrases } from '../data/speak.js'
import { units } from '../data/lessons.js'

function normalize(s) {
  return (s || '').toLowerCase().trim()
}

// Build the search index once at module load — data is static.
function buildIndex() {
  const items = []
  for (const c of consonants) {
    items.push({ kind: 'reference', label: c.letter, hint: c.sound,
      to: '/reference/consonants', haystack: `${c.letter} ${c.sound}` })
  }
  for (const v of vowels) {
    items.push({ kind: 'reference', label: v.letter, hint: v.sound,
      to: '/reference/vowels', haystack: `${v.letter} ${v.sound}` })
  }
  for (const t of tones) {
    items.push({ kind: 'reference', label: t.marker || '(no marker)', hint: t.name,
      to: '/reference/tones', haystack: `${t.marker} ${t.name} ${t.description}` })
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
        to: '/reference/grammar', haystack: `${it.hmong} ${it.english}` })
    }
  }
  // Speak phrases (absorbed the old course "everyday" lists).
  for (const p of allPhrases()) {
    items.push({ kind: 'speak', label: p.hmong, hint: p.english,
      to: `/speak/${p.id}`, haystack: `${p.hmong} ${p.english}` })
  }
  // Readings are lessons now — index their passages + glossaries.
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      for (const step of lesson.steps) {
        if (step.kind !== 'reading') continue
        items.push({ kind: 'reading', label: step.title, hint: step.english.slice(0, 80),
          to: `/learn/${unit.id}/${lesson.id}`,
          haystack: `${step.title} ${step.hmong} ${step.english}` })
      }
    }
  }
  return items.map((i) => ({ ...i, haystack: normalize(i.haystack) }))
}

const INDEX = buildIndex()

const KIND_LABEL = {
  reference: 'Reference',
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  speak: 'Speak',
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
      <h2 className="font-display text-4xl text-stone-900 mb-6">Search</h2>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search words, phrases, letters…"
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
              {KIND_LABEL[kind] || kind} · {items.length}
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
