import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/Tabs.jsx'
import { grammar, everyday, readings } from '../data/course.js'
import { useProgress } from '../hooks/useProgress.js'

const tabs = [
  { id: 'grammar', label: 'Grammar' },
  { id: 'everyday', label: 'Everyday' },
  { id: 'reading', label: 'Reading' },
]

const lessonIdMap = {
  grammar: 'course-grammar',
  everyday: 'course-everyday',
  reading: 'course-reading',
}

const quizMap = {
  grammar: 'grammar-pronouns',
  everyday: 'everyday-greetings',
  reading: null,
}

export default function Course() {
  const { tab } = useParams()
  const { completedLessons, markLessonComplete } = useProgress()
  const lessonId = lessonIdMap[tab]
  const quizId = quizMap[tab]
  const completed = lessonId && completedLessons.includes(lessonId)

  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Course</h2>
        <p className="text-stone-700">
          Grammar, everyday speech, and reading practice.
        </p>
      </div>

      <Tabs basePath="/course" tabs={tabs} />

      {tab === 'grammar' && <GrammarSection sections={grammar} />}
      {tab === 'everyday' && <PhraseList groups={everyday} />}
      {tab === 'reading' && <ReadingList items={readings} />}

      {lessonId && (
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            onClick={() => markLessonComplete(lessonId)}
            disabled={completed}
            className={
              completed
                ? 'inline-flex items-center justify-center px-4 py-2 rounded bg-emerald-700 text-cream-50 font-medium text-sm shadow-warm'
                : 'btn-secondary'
            }
          >
            {completed ? 'âœ“ Completed' : 'Mark Complete (+10 XP)'}
          </button>
          {quizId && (
            <Link to={`/quiz/${quizId}`} className="btn-primary">
              Take Quiz
            </Link>
          )}
        </div>
      )}
    </>
  )
}

function GrammarSection({ sections }) {
  return (
    <div className="space-y-5">
      {sections.map((s) => (
        <div key={s.title} className="surface p-6">
          <h3 className="font-serif text-xl text-stone-900 mb-1">{s.title}</h3>
          <p className="text-sm text-stone-500 mb-3 italic">{s.note}</p>
          <ul className="divide-y divide-cream-200">
            {s.items.map((it) => (
              <li key={it.hmong} className="flex justify-between py-2 text-sm">
                <span className="font-medium text-clay-700">{it.hmong}</span>
                <span className="text-stone-600">{it.english}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function PhraseList({ groups }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {groups.map((g) => (
        <div key={g.title} className="surface p-6">
          <h3 className="font-serif text-xl text-stone-900 mb-3">{g.title}</h3>
          <ul className="space-y-2">
            {g.items.map((p) => (
              <li key={p.hmong} className="flex justify-between text-sm">
                <span className="font-medium text-clay-700">{p.hmong}</span>
                <span className="text-stone-600">{p.english}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ReadingList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((r) => (
        <article key={r.title} className="surface p-6">
          <h3 className="font-serif text-xl text-stone-900 mb-1">{r.title}</h3>
          <p className="text-xs uppercase tracking-wider text-clay-600 mb-3">
            {r.level}
          </p>
          <p className="text-stone-800 italic mb-2 leading-relaxed">{r.hmong}</p>
          <p className="text-sm text-stone-600 leading-relaxed">{r.english}</p>
        </article>
      ))}
    </div>
  )
}
