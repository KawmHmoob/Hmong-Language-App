import { Link } from 'react-router-dom'
import { lessonProgress } from '../../data/lessons.js'
import { useProgress } from '../../hooks/useProgress.js'
import { useSubscription, canAccess } from '../../context/SubscriptionContext.jsx'
import { LockIcon, CheckIcon } from '../icons/index.jsx'

// One lesson tile — used by the Learn hub (previews) and the Unit pages
// (full lists). It reads its own progress/tier state so callers just pass
// the lesson + its unit; there is exactly one place to restyle a lesson.

export default function LessonCard({ unit, lesson }) {
  const { completedSteps } = useProgress()
  const { tier: userTier } = useSubscription()

  const p = lessonProgress(lesson, completedSteps)
  const requiredTier = lesson.tier || unit.tier || 'free'
  const locked = !canAccess(requiredTier, userTier)

  return (
    <Link
      to={`/learn/${unit.id}/${lesson.id}`}
      className="surface surface-hover p-5 block group"
    >
      <div className="flex justify-between items-start mb-2 gap-3">
        <h4 className="font-serif text-xl text-stone-900 group-hover:text-clay-700 transition">
          {lesson.title}
        </h4>
        {locked ? (
          <span className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold rounded-full bg-clay-600 text-cream-50 px-2 py-0.5">
            <LockIcon size={11} /> Pro
          </span>
        ) : p.complete ? (
          <span className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold rounded-full bg-emerald-700 text-cream-50 px-2 py-0.5">
            <CheckIcon size={11} /> Done
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
}

function ProgressBar({ ratio }) {
  const pct = Math.round(ratio * 100)
  return (
    <div className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-clay-600 transition-all duration-500"
        style={{ width: `${pct}%` }}
        aria-label={`${pct}% complete`}
      />
    </div>
  )
}
