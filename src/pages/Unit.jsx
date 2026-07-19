import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import LessonCard from '../components/learn/LessonCard.jsx'
import { ArrowRightIcon } from '../components/icons/index.jsx'
import { getUnit, lessonProgress } from '../data/lessons.js'
import { useProgress } from '../hooks/useProgress.js'

// One unit's full lesson list — /learn/:unitId. The Learn hub previews two
// lessons per unit and links here for the rest.
//
// Route note: this sits ABOVE /learn/:unitId/:lessonId in App.jsx. React
// Router v6+ ranks by specificity, not order, so the two-segment lesson route
// still wins for its own URLs — but keeping them adjacent makes that obvious
// to the next reader.

export default function Unit() {
  const { unitId } = useParams()
  const navigate = useNavigate()
  const unit = getUnit(unitId)
  const { completedSteps } = useProgress()

  if (!unit) {
    return (
      <div>
        <p className="text-stone-900">Unit not found.</p>
        <button onClick={() => navigate('/learn')} className="mt-4 btn-primary">
          Back to Learn
        </button>
      </div>
    )
  }

  const total = unit.lessons.length
  const done = unit.lessons.filter((l) => lessonProgress(l, completedSteps).complete).length
  const pct = total ? Math.round((done / total) * 100) : 0

  // First lesson that isn't finished — the natural "continue here" target.
  const next = unit.lessons.find((l) => !lessonProgress(l, completedSteps).complete)

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Learn', to: '/learn' },
          { label: unit.title },
        ]}
      />

      <div className="mb-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-seafoam-500" aria-hidden="true" />
          Unit
        </p>
        <h2 className="font-display text-4xl text-stone-900 mb-2">{unit.title}</h2>
        <p className="text-stone-700 max-w-2xl">{unit.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-clay-600 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm text-stone-700 whitespace-nowrap">
              {done} of {total} lessons
            </span>
          </div>
          {next && (
            <Link to={`/learn/${unit.id}/${next.id}`} className="btn-primary gap-2">
              {done === 0 ? 'Start unit' : 'Continue'}
              <ArrowRightIcon size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* A unit may be split into headed sections (`groups`) — Foundations is,
          so the alphabet reads as: word structure → consonants → vowels →
          tones. Units without groups render one flat grid, unchanged. */}
      {unit.groups ? (
        <div className="space-y-10">
          {unit.groups.map((g) => (
            <section key={g.id} aria-labelledby={`group-${g.id}`}>
              <div className="mb-4">
                <h3
                  id={`group-${g.id}`}
                  className="font-display text-2xl text-stone-900"
                >
                  {g.title}{' '}
                  <span className="text-stone-400 text-base font-normal">
                    ({g.lessons.length})
                  </span>
                </h3>
                {g.blurb && <p className="text-sm text-stone-600">{g.blurb}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {g.lessons.map((lesson) => (
                  <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {unit.lessons.map((lesson) => (
            <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  )
}
