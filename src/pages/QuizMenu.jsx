import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizzes } from '../data/quizzes.js'
import { useProgress } from '../hooks/useProgress.js'
import { CheckIcon, LockIcon } from '../components/icons/index.jsx'

// Quiz menu, grouped by category. There are 35+ quizzes (one per vocab
// category alone), so a flat grid was unreadable — same clog Learn had.
// Big categories collapse to a preview + "Show all" (see notes/33, notes/35).

const PREVIEW_COUNT = 6

export default function QuizMenu() {
  const { quizScores } = useProgress()

  // Best accuracy per quiz — turns the menu into a scoreboard rather than
  // an undifferentiated wall of links.
  const bestByQuiz = useMemo(() => {
    const best = {}
    for (const s of quizScores) {
      if (best[s.quizId] == null || s.accuracy > best[s.quizId]) {
        best[s.quizId] = s.accuracy
      }
    }
    return best
  }, [quizScores])

  const groups = useMemo(() => {
    const byCategory = new Map()
    for (const q of quizzes) {
      if (!byCategory.has(q.category)) byCategory.set(q.category, [])
      byCategory.get(q.category).push(q)
    }
    return [...byCategory.entries()]
  }, [])

  const takenCount = Object.keys(bestByQuiz).length

  return (
    <>
      <div className="mb-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-blush-500" aria-hidden="true" />
          Quizzes
        </p>
        <h2 className="font-display text-4xl text-stone-900 mb-2">Test what you’ve learned.</h2>
        <p className="text-stone-700">
          {takenCount > 0
            ? `You’ve taken ${takenCount} of ${quizzes.length} quizzes.`
            : `${quizzes.length} quizzes across the whole course.`}
        </p>
      </div>

      <div className="space-y-10">
        {groups.map(([category, list]) => (
          <QuizGroup
            key={category}
            category={category}
            list={list}
            bestByQuiz={bestByQuiz}
          />
        ))}
      </div>
    </>
  )
}

function QuizGroup({ category, list, bestByQuiz }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? list : list.slice(0, PREVIEW_COUNT)
  const hidden = list.length - shown.length

  return (
    <section aria-labelledby={`quizcat-${category}`}>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h3 id={`quizcat-${category}`} className="font-display text-2xl text-stone-900">
          {category}
        </h3>
        <p className="text-xs text-stone-600">
          {list.length} quiz{list.length === 1 ? '' : 'zes'}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((q) => (
          <QuizCard key={q.id} quiz={q} best={bestByQuiz[q.id]} />
        ))}
      </div>

      {hidden > 0 && (
        <button onClick={() => setExpanded(true)} className="btn-ghost mt-4 w-full sm:w-auto">
          Show all {list.length} {category.toLowerCase()} quizzes
        </button>
      )}
      {expanded && list.length > PREVIEW_COUNT && (
        <button onClick={() => setExpanded(false)} className="btn-ghost mt-4 w-full sm:w-auto">
          Show fewer
        </button>
      )}
    </section>
  )
}

function QuizCard({ quiz, best }) {
  const taken = best != null
  return (
    <Link to={`/quiz/${quiz.id}`} className="surface surface-hover p-5 block group">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h4 className="font-display text-lg text-stone-900 group-hover:text-clay-700 transition">
          {quiz.title}
        </h4>
        <span className="shrink-0 flex items-center gap-1">
          {quiz.tier === 'pro' && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-clay-600 text-cream-50 px-2 py-0.5">
              <LockIcon size={10} /> Pro
            </span>
          )}
          {taken && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                best >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-cream-200 text-stone-700'
              }`}
              title={`Best score: ${best}%`}
            >
              {best >= 80 && <CheckIcon size={10} />}
              {best}%
            </span>
          )}
        </span>
      </div>
      <p className="text-sm text-stone-600 mb-3 leading-relaxed line-clamp-2">
        {quiz.description}
      </p>
      <p className="text-xs text-stone-500">{quiz.questionCount} questions</p>
    </Link>
  )
}
