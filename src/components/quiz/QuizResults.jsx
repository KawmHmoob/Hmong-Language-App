export default function QuizResults({
  config,
  questions,
  answers,
  score,
  elapsed,
  onRetry,
  onReview,
  onBack,
  reviewing,
}) {
  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const missed = answers.filter((a) => !a.isCorrect)

  return (
    <div className="surface p-8">
      <h2 className="font-serif text-3xl text-stone-900 mb-1">{config.title}</h2>
      <p className="text-sm text-stone-600 mb-8">Time: {elapsed}s</p>

      <div className="flex items-center gap-6 mb-8">
        <CircularProgress percent={accuracy} />
        <div>
          <div className="font-serif text-4xl text-stone-900">
            {score} <span className="text-stone-400">/ {questions.length}</span>
          </div>
          <div className="text-sm text-stone-600 mt-1">{accuracy}% accuracy</div>
        </div>
      </div>

      {reviewing && missed.length > 0 && (
        <div className="mb-8">
          <h3 className="font-serif text-xl text-stone-900 mb-3">Missed Questions</h3>
          <ul className="space-y-2">
            {missed.map((m, i) => {
              const q = questions[m.questionIndex]
              return (
                <li key={i} className="rounded border border-red-200 bg-red-50/60 p-4 text-sm">
                  <div className="font-medium text-stone-900 mb-1">{q.prompt}</div>
                  <div className="text-stone-700">
                    Your answer: <span className="text-red-700">{String(m.selected)}</span>
                  </div>
                  <div className="text-stone-700">
                    Correct: <span className="text-emerald-700">{String(q.answer)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={onRetry} className="btn-primary">Retry</button>
        {!reviewing && missed.length > 0 && (
          <button onClick={onReview} className="btn-secondary">
            Review Mistakes
          </button>
        )}
        <button onClick={onBack} className="btn-ghost">Back to Quizzes</button>
      </div>
    </div>
  )
}

function CircularProgress({ percent }) {
  const r = 36
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
      <circle cx="48" cy="48" r={r} stroke="#ECDCC0" strokeWidth="10" fill="none" />
      <circle
        cx="48"
        cy="48"
        r={r}
        stroke="#9C4F33"
        strokeWidth="10"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="48"
        y="52"
        textAnchor="middle"
        className="text-sm font-bold fill-stone-900"
        transform="rotate(90 48 48)"
      >
        {percent}%
      </text>
    </svg>
  )
}
