import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getLesson, getUnit, allStepIds } from '../data/lessons.js'
import { useProgress } from '../hooks/useProgress.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import PaywallGate from '../components/common/PaywallGate.jsx'

export default function Lesson() {
  const { unitId, lessonId } = useParams()
  const navigate = useNavigate()
  const unit = getUnit(unitId)
  const lesson = getLesson(unitId, lessonId)
  const { completedSteps, quizScores, markStepComplete } = useProgress()
  const [index, setIndex] = useState(0)

  // Auto-mark mini-quiz steps complete when a quiz score for that quizId exists.
  useEffect(() => {
    if (!lesson) return
    lesson.steps.forEach((step) => {
      if (step.kind !== 'mini-quiz') return
      if (completedSteps.includes(step.id)) return
      const taken = quizScores.some((s) => s.quizId === step.quizId)
      if (taken) {
        const ids = allStepIds(lesson)
        const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
        markStepComplete(step.id, {
          lessonId: lesson.id,
          lessonComplete: remaining.length === 0,
        })
      }
    })
  }, [lesson, completedSteps, quizScores, markStepComplete])

  if (!unit || !lesson) {
    return (
      <div>
        <p className="text-stone-900">Lesson not found.</p>
        <button onClick={() => navigate('/learn')} className="mt-4 btn-primary">
          Back to Learn
        </button>
      </div>
    )
  }

  const step = lesson.steps[index]
  const isLast = index === lesson.steps.length - 1
  // Effective tier: lesson overrides unit, both default to free.
  const requiredTier = lesson.tier || unit.tier || 'free'

  const handleAdvance = () => {
    if (!completedSteps.includes(step.id)) {
      const ids = allStepIds(lesson)
      const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
      markStepComplete(step.id, {
        lessonId: lesson.id,
        lessonComplete: remaining.length === 0,
      })
    }
    if (isLast) {
      navigate('/learn')
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    <PaywallGate tier={requiredTier} contentLabel={`${lesson.title} is Pro`}>
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Learn', to: '/learn' },
          { label: unit.title, to: '/learn' },
          { label: lesson.title },
        ]}
      />

      <StepHeader lesson={lesson} index={index} />

      <div className="surface p-6 sm:p-8">
        {step.kind === 'intro' && <IntroStep step={step} />}
        {step.kind === 'examples' && <ExamplesStep step={step} />}
        {step.kind === 'practice' && (
          <PracticeStep step={step} onAdvance={handleAdvance} />
        )}
        {step.kind === 'mini-quiz' && (
          <MiniQuizStep step={step} taken={quizScores.some((s) => s.quizId === step.quizId)} />
        )}
      </div>

      {step.kind !== 'practice' && step.kind !== 'mini-quiz' && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="text-sm text-stone-700 underline disabled:opacity-40 disabled:no-underline"
          >
            Back
          </button>
          <button onClick={handleAdvance} className="btn-primary">
            {isLast ? 'Finish' : 'Continue'}
          </button>
        </div>
      )}
    </div>
    </PaywallGate>
  )
}

function StepHeader({ lesson, index }) {
  const total = lesson.steps.length
  const pct = Math.round(((index + 1) / total) * 100)
  return (
    <div className="mb-6">
      <h2 className="font-serif text-3xl text-stone-900 mb-1">{lesson.title}</h2>
      <p className="text-sm text-stone-600 mb-3">
        Step {index + 1} of {total}
      </p>
      <div className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
        <div className="h-full bg-clay-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function IntroStep({ step }) {
  return (
    <>
      <h3 className="font-serif text-2xl text-stone-900 mb-4">{step.title}</h3>
      <div className="space-y-4 text-stone-800 leading-relaxed">
        {step.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </>
  )
}

function ExamplesStep({ step }) {
  return (
    <>
      <h3 className="font-serif text-2xl text-stone-900 mb-2">{step.title}</h3>
      {step.intro && <p className="text-sm text-stone-600 mb-4 italic">{step.intro}</p>}
      <ul className="divide-y divide-cream-200">
        {step.items.map((it) => (
          <li key={it.hmong} className="py-3">
            <div className="flex justify-between items-baseline gap-3">
              <span className="font-medium text-clay-700 text-lg">{it.hmong}</span>
              <span className="text-stone-700 text-sm">{it.english}</span>
              <span>

                <button
                  onClick={() => new Audio(it.audio).play}
                >
                  🔊
                </button>

              </span>
            </div>
            {it.note && <p className="text-xs text-stone-500 mt-1 italic">{it.note}</p>}
          </li>
        ))}
      </ul>
    </>
  )
}

function PracticeStep({ step, onAdvance }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === step.answer

  return (
    <>
      <h3 className="font-serif text-2xl text-stone-900 mb-4">{step.title}</h3>
      <p className="text-stone-800 mb-5">{step.prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {step.options.map((opt) => {
          const isAnswer = opt === step.answer
          let cls = 'border-cream-300 bg-cream-50 hover:border-clay-500'
          if (picked && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
          if (picked && opt === picked && !isAnswer) cls = 'border-red-500 bg-red-50'
          if (picked && opt !== picked && !isAnswer) cls = 'border-cream-200 bg-cream-50 opacity-60'
          return (
            <button
              key={opt}
              onClick={() => !picked && setPicked(opt)}
              disabled={Boolean(picked)}
              className={`text-left rounded border p-3 text-sm transition ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {picked && (
        <div
          className={`mt-5 rounded-md p-4 flex flex-wrap justify-between items-center gap-3 shadow-warm ${
            correct ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
          }`}
        >
          <span className="font-medium">
            {correct ? 'Correct âœ“' : `Not quite â€” answer: ${step.answer}`}
          </span>
          <button onClick={onAdvance} className="btn-secondary">Continue</button>
        </div>
      )}
    </>
  )
}

function MiniQuizStep({ step, taken }) {
  return (
    <>
      <h3 className="font-serif text-2xl text-stone-900 mb-2">{step.title}</h3>
      <p className="text-stone-700 mb-5">
        {taken
          ? "You've taken this quiz â€” you can retake it for more practice. The lesson is marked complete."
          : 'Time to put it to the test. Take the mini-quiz to finish this lesson.'}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to={`/quiz/${step.quizId}`} className="btn-primary">
          {taken ? 'Retake quiz' : 'Take quiz'}
        </Link>
        <Link to="/learn" className="btn-secondary">
          Back to Learn
        </Link>
      </div>
    </>
  )
}
