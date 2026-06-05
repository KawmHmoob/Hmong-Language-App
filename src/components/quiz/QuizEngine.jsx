import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuizConfig, getQuizDataset } from '../../data/quizzes.js'
import { useQuizState } from '../../hooks/useQuizState.js'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import PaywallGate from '../common/PaywallGate.jsx'
import QuizResults from './QuizResults.jsx'

function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestions(config, dataset) {
  if (!dataset || dataset.length === 0) return []
  const types = config.questionTypes || ['multiple-choice']
  const count = Math.min(config.questionCount, dataset.length)
  const pool = shuffle(dataset).slice(0, count)
  return pool.map((item, i) => {
    const type = types[i % types.length]
    if (type === 'matching') {
      const pairs = shuffle(dataset).slice(0, Math.min(4, dataset.length))
      if (!pairs.find((p) => p.prompt === item.prompt)) {
        pairs[0] = item
      }
      return {
        type: 'matching',
        prompt: 'Match each Hmong term to its meaning.',
        pairs,
        answer: pairs.map((p) => `${p.prompt}=${p.answer}`).join('|'),
      }
    }
    const distractors = shuffle(dataset.filter((d) => d.answer !== item.answer)).slice(0, 3)
    const options = shuffle([item, ...distractors]).map((d) => d.answer)
    return { type: 'multiple-choice', prompt: item.prompt, answer: item.answer, options }
  })
}

export default function QuizEngine() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const config = getQuizConfig(topicId)
  const dataset = getQuizDataset(topicId)
  const { state, start, answer, next, review, reset } = useQuizState()
  const { recordQuizScore } = useProgress()
  const [feedback, setFeedback] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [savedThisRun, setSavedThisRun] = useState(false)

  const questions = useMemo(() => (config ? buildQuestions(config, dataset) : []), [config, dataset])

  useEffect(() => {
    if (config && questions.length > 0 && state.status === 'idle') {
      start(questions)
    }
  }, [config, questions, start, state.status])

  useEffect(() => {
    if (state.status !== 'active') return
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - state.startedAt) / 1000)),
      1000
    )
    return () => clearInterval(id)
  }, [state.status, state.startedAt])

  useEffect(() => {
    if (state.status === 'finished' && !savedThisRun) {
      const accuracy =
        state.questions.length > 0
          ? Math.round((state.score / state.questions.length) * 100)
          : 0
      recordQuizScore({
        quizId: topicId,
        score: state.score,
        maxScore: state.questions.length,
        accuracy,
      })
      setSavedThisRun(true)
    }
  }, [state.status, state.score, state.questions.length, topicId, recordQuizScore, savedThisRun])

  if (!config) {
    return (
      <div>
        <p className="text-stone-900">Quiz not found.</p>
        <button onClick={() => navigate('/quiz')} className="mt-4 btn-primary">
          Back to Quizzes
        </button>
      </div>
    )
  }

  if (dataset.length === 0) {
    return (
      <div>
        <p className="text-stone-900">No data available for this quiz yet.</p>
        <button onClick={() => navigate('/quiz')} className="mt-4 btn-primary">
          Back to Quizzes
        </button>
      </div>
    )
  }

  const handleQuit = () => {
    if (window.confirm('Quit this quiz? Progress for this attempt will be lost.')) {
      reset()
      navigate('/quiz')
    }
  }

  if (state.status === 'finished' || state.status === 'reviewing') {
    return (
      <PaywallGate tier={config.tier} contentLabel={`${config.title} is a Pro quiz`}>
      <>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Quizzes', to: '/quiz' },
            { label: config.title },
          ]}
        />
        <QuizResults
          config={config}
          questions={state.questions}
          answers={state.answers}
          score={state.score}
          elapsed={elapsed}
          onRetry={() => {
            reset()
            setSavedThisRun(false)
            setElapsed(0)
            setFeedback(null)
          }}
          reviewing={state.status === 'reviewing'}
          onReview={review}
          onBack={() => navigate('/quiz')}
        />
      </>
      </PaywallGate>
    )
  }

  const q = state.questions[state.currentIndex]
  if (!q) return null

  return (
    <PaywallGate tier={config.tier} contentLabel={`${config.title} is a Pro quiz`}>
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Quizzes', to: '/quiz' },
          { label: config.title },
        ]}
      />

      <div className="flex flex-wrap justify-between items-center mb-5 gap-2">
        <div className="text-sm text-stone-700">
          Question {state.currentIndex + 1} / {state.questions.length}
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="rounded-full bg-cream-200 px-3 py-1 text-clay-700">⏱ {elapsed}s</span>
          <span className="rounded-full bg-orange-200 px-3 py-1 text-orange-900">🔥 {state.streak}</span>
          <span className="rounded-full bg-cream-100 px-3 py-1 text-stone-800">★ {state.score}</span>
        </div>
      </div>

      <div className="surface p-8">
        {q.type === 'multiple-choice' && (
          <MultipleChoice
            question={q}
            feedback={feedback}
            onPick={(opt) => {
              if (feedback) return
              const isCorrect = opt === q.answer
              answer(opt, isCorrect)
              setFeedback(isCorrect ? 'correct' : 'incorrect')
            }}
          />
        )}
        {q.type === 'matching' && (
          <Matching
            question={q}
            feedback={feedback}
            onComplete={(isCorrect) => {
              if (feedback) return
              answer('matching', isCorrect)
              setFeedback(isCorrect ? 'correct' : 'incorrect')
            }}
          />
        )}
      </div>

      {feedback && (
        <div
          className={`mt-4 rounded-md p-4 flex flex-wrap justify-between items-center gap-3 shadow-warm ${
            feedback === 'correct'
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-red-100 text-red-900'
          }`}
        >
          <span className="font-medium">
            {feedback === 'correct' ? 'Correct âœ“' : `Not quite â€” answer: ${q.answer}`}
          </span>
          <button
            onClick={() => {
              setFeedback(null)
              next()
            }}
            className="btn-secondary"
          >
            {state.currentIndex + 1 >= state.questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      )}

      <div className="mt-6">
        <button onClick={handleQuit} className="text-sm text-stone-700 underline hover:text-clay-700">
          Quit quiz
        </button>
      </div>
    </div>
    </PaywallGate>
  )
}

function MultipleChoice({ question, feedback, onPick }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <AudioButton audioSrc={null} wordId={question.prompt} />
        <h3 className="font-serif text-3xl text-stone-900">{question.prompt}</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((opt) => {
          const isAnswer = opt === question.answer
          const showResult = Boolean(feedback)
          let cls = 'border-cream-300 bg-cream-50 hover:border-clay-500'
          if (showResult && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
          if (showResult && !isAnswer) cls = 'border-cream-200 bg-cream-50 opacity-60'
          return (
            <button
              key={opt}
              onClick={() => onPick(opt)}
              className={`text-left rounded border p-3 text-sm transition ${cls}`}
              disabled={showResult}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </>
  )
}

function Matching({ question, feedback, onComplete }) {
  const [leftSel, setLeftSel] = useState(null)
  const [pairs, setPairs] = useState({})
  const lefts = question.pairs.map((p) => p.prompt)
  const rights = useMemo(() => shuffle(question.pairs.map((p) => p.answer)), [question])

  const handleRight = (right) => {
    if (!leftSel || feedback) return
    const nextPairs = { ...pairs, [leftSel]: right }
    setPairs(nextPairs)
    setLeftSel(null)
    if (Object.keys(nextPairs).length === lefts.length) {
      const allCorrect = question.pairs.every(
        (p) => nextPairs[p.prompt] === p.answer
      )
      onComplete(allCorrect)
    }
  }

  return (
    <>
      <h3 className="font-serif text-xl text-stone-900 mb-1">{question.prompt}</h3>
      <p className="text-sm text-stone-600 mb-4 italic">
        Click a Hmong word, then click its English meaning.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {lefts.map((l) => {
            const matched = pairs[l]
            const isSel = leftSel === l
            const correctAns = question.pairs.find((p) => p.prompt === l)?.answer
            const isCorrect = feedback && matched === correctAns
            const isWrong = feedback && matched && !isCorrect
            return (
              <button
                key={l}
                onClick={() => !matched && !feedback && setLeftSel(l)}
                disabled={Boolean(matched) || Boolean(feedback)}
                className={`w-full text-left rounded border p-3 transition ${
                  isCorrect
                    ? 'border-emerald-500 bg-emerald-50'
                    : isWrong
                    ? 'border-red-500 bg-red-50'
                    : isSel
                    ? 'border-clay-500 bg-cream-100'
                    : matched
                    ? 'border-cream-300 bg-cream-100 opacity-70'
                    : 'border-cream-300 bg-cream-50 hover:border-clay-500'
                }`}
              >
                <div className="font-medium text-clay-700">{l}</div>
                {matched && <div className="text-xs text-stone-500">â†’ {matched}</div>}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rights.map((r) => {
            const used = Object.values(pairs).includes(r)
            return (
              <button
                key={r}
                onClick={() => handleRight(r)}
                disabled={used || Boolean(feedback)}
                className={`w-full text-left rounded border p-3 transition ${
                  used
                    ? 'border-cream-300 bg-cream-100 opacity-50'
                    : 'border-cream-300 bg-cream-50 hover:border-clay-500'
                }`}
              >
                {r}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
