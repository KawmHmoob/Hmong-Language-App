import { Link } from 'react-router-dom'
import { units, lessonProgress } from '../data/lessons.js'
import { useProgress } from '../hooks/useProgress.js'
import { useSubscription, canAccess } from '../context/SubscriptionContext.jsx'

export default function Learn() {
  const { completedSteps } = useProgress()
  const { tier: userTier } = useSubscription()

  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Learn</h2>
        <p className="text-stone-700">
          Structured units. Each lesson walks you through an intro, examples, a quick check, and a mini-quiz.
        </p>
      </div>

      <div className="space-y-10">
        {units.map((unit) => (
          <section key={unit.id}>
            <header className="mb-4">
              <h3 className="font-serif text-2xl text-stone-900">{unit.title}</h3>
              <p className="text-sm text-stone-600">{unit.description}</p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              {unit.lessons.map((lesson) => {
                const p = lessonProgress(lesson, completedSteps)
                const requiredTier = lesson.tier || unit.tier || 'free'
                const locked = !canAccess(requiredTier, userTier)
                return (
                  <Link
                    key={lesson.id}
                    to={`/learn/${unit.id}/${lesson.id}`}
                    className="surface surface-hover p-5 block group"
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <h4 className="font-serif text-xl text-stone-900 group-hover:text-clay-700 transition">
                        {lesson.title}
                      </h4>
                      {locked ? (
                        <span className="text-xs font-semibold rounded-full bg-clay-600 text-cream-50 px-2 py-0.5">
                          ◆ Pro
                        </span>
                      ) : p.complete ? (
                        <span className="text-xs font-semibold rounded-full bg-emerald-700 text-cream-50 px-2 py-0.5">
                          ✓ Done
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-stone-600 mb-4 leading-relaxed">{lesson.summary}</p>
                    <ProgressBar ratio={p.ratio} />
                    <p className="text-xs text-stone-500 mt-2">
                      {p.done} / {p.total} steps
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

function ProgressBar({ ratio }) {
  const pct = Math.round(ratio * 100)
  return (
    <div className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-clay-600 transition-all"
        style={{ width: `${pct}%` }}
        aria-label={`${pct}% complete`}
      />
    </div>
  )
}
