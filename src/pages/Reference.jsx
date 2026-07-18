import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/Tabs.jsx'
import { consonantGroups, vowels, tones, grammar } from '../data/reference.js'
import AudioButton from '../components/common/AudioButton.jsx'
import { ArrowRightIcon } from '../components/icons/index.jsx'

// Reference — the LOOK-IT-UP surface (was /alphabet, and absorbed the old
// /course grammar tables). Everything here is a table you consult and leave.
//
// Deliberately has NO "Mark Complete / +10 XP" button: you don't finish a
// cheat sheet. Progress belongs to Learn. See notes/34.

const tabs = [
  { id: 'consonants', label: 'Consonants' },
  { id: 'vowels', label: 'Vowels' },
  { id: 'tones', label: 'Tones' },
  { id: 'grammar', label: 'Grammar' },
]

export default function Reference() {
  const { tab } = useParams()

  return (
    <>
      <div className="mb-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-cream-600" aria-hidden="true" />
          Reference
        </p>
        <h2 className="font-display text-4xl text-stone-900 mb-2">Look it up.</h2>
        <p className="text-stone-700 max-w-2xl">
          Letters, tones, and grammar at a glance — for when you know the concept
          and just need the word. Each table links to the lesson that explains it.
        </p>
      </div>

      <Tabs basePath="/reference" tabs={tabs} />

      {tab === 'consonants' && <GroupedConsonants groups={consonantGroups} />}
      {tab === 'vowels' && <Grid items={vowels} />}
      {tab === 'tones' && <ToneList items={tones} />}
      {tab === 'grammar' && <GrammarTables sections={grammar} />}
    </>
  )
}

function Grid({ items }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {items.map((it) => (
        <div key={it.letter} className="surface p-3 text-center">
          <div className="flex justify-end mb-1">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </div>
          <div className="font-display text-2xl text-clay-700">{it.letter}</div>
          {it.sound && <div className="text-xs text-stone-500 mt-1">{it.sound}</div>}
        </div>
      ))}
    </div>
  )
}

// Consonants split into Single / Double / Triple / Quadruple sections. Each is
// the same Grid, under a subheading with a count.
function GroupedConsonants({ groups }) {
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`cons-${g.id}`}>
          <div className="mb-3">
            <h3 id={`cons-${g.id}`} className="font-display text-xl text-stone-900">
              {g.title} <span className="text-stone-400 text-base">({g.items.length})</span>
            </h3>
            <p className="text-sm text-stone-600">{g.blurb}</p>
          </div>
          <Grid items={g.items} />
        </section>
      ))}
    </div>
  )
}

function ToneList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((t) => (
        <div key={t.name} className="surface flex items-center gap-4 p-4">
          <div className="w-10 font-display text-2xl text-clay-700 text-center">
            {t.marker || '–'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-stone-800">{t.name}</div>
            <div className="text-sm text-stone-600">{t.description}</div>
          </div>
          <AudioButton audioSrc={t.audio} wordId={t.name} />
          <div className="text-sm text-stone-700 italic hidden sm:block">{t.example}</div>
        </div>
      ))}
    </div>
  )
}

function GrammarTables({ sections }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {sections.map((s) => (
        <div key={s.title} className="surface p-6 flex flex-col">
          <h3 className="font-display text-xl text-stone-900 mb-1">{s.title}</h3>
          <p className="text-sm text-stone-500 mb-3 italic">{s.note}</p>
          <ul className="divide-y divide-cream-200 flex-1">
            {s.items.map((it) => (
              <li key={it.hmong} className="flex justify-between gap-3 py-2 text-sm">
                <span className="font-medium text-clay-700">{it.hmong}</span>
                <span className="text-stone-600 text-right">{it.english}</span>
              </li>
            ))}
          </ul>
          {/* The other half of the job split: this table STATES it, the
              lesson EXPLAINS it. */}
          {s.lesson && (
            <Link
              to={`/learn/${s.lesson.unitId}/${s.lesson.lessonId}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-clay-700 hover:text-clay-600 transition-colors"
            >
              Learn this
              <ArrowRightIcon size={14} />
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
