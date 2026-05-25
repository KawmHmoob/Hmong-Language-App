import { Link } from 'react-router-dom'
import { quizzes } from '../../data/quizzes.js'

export default function QuizMenu() {
  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Quizzes</h2>
        <p className="text-stone-700">Test what you've learned.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((q) => (
          <Link key={q.id} to={`/quiz/${q.id}`} className="surface surface-hover p-6 block">
            <div className="text-xs font-semibold uppercase tracking-wider text-clay-600 mb-2">
              {q.category}
            </div>
            <h3 className="font-serif text-xl text-stone-900 mb-1">{q.title}</h3>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">{q.description}</p>
            <div className="text-xs text-stone-500">
              {q.questionCount} questions · {q.questionTypes.join(', ')}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
