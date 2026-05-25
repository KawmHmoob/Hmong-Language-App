import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress.js'
import { selectDueWords } from '../../context/ProgressContext.jsx'
import { categories } from '../../data/vocabulary.js'
import { quizzes } from '../../data/quizzes.js'

export default function TodayCard() {
  const { vocabSchedule, quizScores, streakData } = useProgress()

  const allWords = categories.flatMap((c) => c.words)
  const dueCount = selectDueWords(allWords, vocabSchedule).length

  const today = new Date().toISOString().slice(0, 10)
  const doneTodayQuizIds = new Set(
    quizScores.filter((s) => s.date.slice(0, 10) === today).map((s) => s.quizId)
  )
  const suggestedQuiz = quizzes.find((q) => !doneTodayQuizIds.has(q.id))

  const suggestions = []
  if (dueCount > 0) {
    suggestions.push({
      label: `Review ${dueCount} word${dueCount === 1 ? '' : 's'} due`,
      cta: 'Review',
      to: '/review',
    })
  }
  if (suggestedQuiz) {
    suggestions.push({
      label: `Try the ${suggestedQuiz.title} quiz`,
      cta: 'Quiz',
      to: `/quiz/${suggestedQuiz.id}`,
    })
  }
  suggestions.push({
    label: 'Jot down something you learned today',
    cta: 'Notebook',
    to: '/notebook/notes',
  })

  return (
    <div className="surface-elevated p-7">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-serif text-2xl text-stone-900">Today</h3>
        <span className="text-sm text-stone-600">
          {streakData.currentStreak > 0
            ? `${streakData.currentStreak}-day streak`
            : 'Start your streak'}
        </span>
      </div>
      <ul className="divide-y divide-cream-200">
        {suggestions.map((s) => (
          <li key={s.to} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <span className="text-stone-700">{s.label}</span>
            <Link to={s.to} className="text-sm text-clay-700 font-medium hover:text-clay-800 whitespace-nowrap">
              {s.cta} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
