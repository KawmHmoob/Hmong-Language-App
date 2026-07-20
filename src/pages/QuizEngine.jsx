import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getQuizConfig, getQuizDataset } from '../data/quizzes.js'
import { useQuizState } from '../hooks/useQuizState.js'
import { useProgress } from '../hooks/useProgress.js'
import AudioButton from '../components/common/AudioButton.jsx'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import PaywallGate from '../components/common/PaywallGate.jsx'
import QuizResults from '../components/quiz/QuizResults.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import { FlameIcon, StarIcon, CheckIcon, LockIcon, BookIcon } from '../components/icons/index.jsx'
import { quizUnlock } from '../lib/access.js'

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
    // MATCHING DISABLED — every question falls through to multiple-choice.
    // `types` is still read above so re-enabling is a matter of uncommenting
    // this block plus the questionTypes in quizzes.js and the render case below.
    // const type = types[i % types.length]
    // if (type === 'matching') {
    //   const pairs = shuffle(dataset).slice(0, Math.min(4, dataset.length))
    //   if (!pairs.find((p) => p.prompt === item.prompt)) {
    //     pairs[0] = item
    //   }
    //   return {
    //     type: 'matching',
    //     prompt: 'Match each Hmong term to its meaning.',
    //     pairs,
    //     answer: pairs.map((p) => `${p.prompt}=${p.answer}`).join('|'),
    //   }
    // }
    // Distractors must have DISTINCT answers, not just distinct items.
    // The tone drill has ~30 words but only 8 tone names, so picking 3 random
    // non-matching words routinely produced options like
    // [Mid, High, High, High] — duplicate, unanswerable choices. Dedupe by
    // answer text, and stop early if the dataset has fewer than 4 distinct
    // answers (then the question just has fewer options). See notes/51.
    const seenAnswers = new Set([item.answer])
    const distractors = []
    for (const d of shuffle(dataset)) {
      if (seenAnswers.has(d.answer)) continue
      seenAnswers.add(d.answer)
      distractors.push(d)
      if (distractors.length === 3) break
    }
    const options = shuffle([item, ...distractors]).map((d) => d.answer)
    // `audio` and `blurb` are optional and pass straight through from the
    // dataset adapter, so any quiz whose data has a recording gets a working
    // play button (see notes/48).
    return {
      type: 'multiple-choice',
      prompt: item.prompt,
      answer: item.answer,
      audio: item.audio,
      blurb: item.blurb,
      options,
    }
  })
}

export default function QuizEngine() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const config = getQuizConfig(topicId)
  const dataset = getQuizDataset(topicId)
  const { state, start, answer, next, review, reset } = useQuizState()
  const { recordQuizScore, vocabProgress } = useProgress()
  const unlock = quizUnlock(topicId, vocabProgress)
  const [feedback, setFeedback] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [savedThisRun, setSavedThisRun] = useState(false)
  const [showQuit, setShowQuit] = useState(false)
  // Which option the learner chose — needed to highlight a WRONG pick in red
  // (the correct answer alone going green doesn't show what they got wrong).
  const [picked, setPicked] = useState(null)

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

  // Study-before-quiz gate. The menu hides locked quizzes behind a "Study
  // first" card, but this guard is what actually enforces it — otherwise a
  // direct link to /quiz/vocab-<cat> walks straight past the menu. See notes/52.
  if (unlock.gated && !unlock.unlocked) {
    return (
      <div className="surface-elevated p-6 sm:p-10 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-cream-100 text-clay-700 mb-4">
          <LockIcon size={26} />
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-stone-900 mb-3">
          Study the words first
        </h2>
        <p className="text-stone-700 mb-3 leading-relaxed">
          Testing words you haven’t seen is guessing, not practice. Learn the{' '}
          {unlock.category.title} words, then come back to test yourself.
        </p>

        {/* Progress toward unlock — a bar makes "how close am I" instant. */}
        <div className="max-w-xs mx-auto mb-6">
          <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
            <div
              className="h-full bg-clay-600 transition-all"
              style={{ width: `${(unlock.studied / unlock.needed) * 100}%` }}
            />
          </div>
          <p className="text-sm text-stone-600 mt-2">
            {unlock.studied} of {unlock.needed} studied · {unlock.remaining} to go
          </p>
        </div>

        {/* One clear primary action. Full-width on mobile so it's an easy tap. */}
        <Link
          to={`/vocabulary/${unlock.category.id}`}
          className="btn-primary w-full sm:w-auto gap-2 text-base"
        >
          <BookIcon size={18} />
          Study the {unlock.category.title} words
        </Link>
        <div className="mt-4">
          <Link to="/quiz" className="text-sm text-stone-600 hover:text-clay-700 underline">
            Back to Quizzes
          </Link>
        </div>
      </div>
    )
  }

  const confirmQuit = () => {
    setShowQuit(false)
    reset()
    navigate('/quiz')
  }

  if (state.status === 'finished' || state.status === 'reviewing') {
    return (
      <PaywallGate tier={config.tier} contentLabel={`${config.title} is a Pro quiz`}>
      <>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Words', to: '/words' },
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
            setPicked(null)
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
          { label: 'Words', to: '/words' },
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
          <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1 text-clay-700">
            <FlameIcon size={12} /> {state.streak}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-stone-800">
            <StarIcon size={12} /> {state.score}
          </span>
        </div>
      </div>

      {/* Always-available study link for vocab quizzes — a learner mid-quiz
          who realizes they need the words shouldn't have to quit to find them.
          Only vocab quizzes carry `unlock.category`. See notes/63. */}
      {unlock.category && (
        <Link
          to={`/vocabulary/${unlock.category.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-clay-700 hover:text-clay-800 mb-3"
        >
          <BookIcon size={15} />
          Study the {unlock.category.title} words
        </Link>
      )}

      <div className="surface p-4 sm:p-8">
        {q.type === 'multiple-choice' && (
          <MultipleChoice
            question={q}
            feedback={feedback}
            picked={picked}
            onPick={(opt) => {
              if (feedback) return
              const isCorrect = opt === q.answer
              setPicked(opt)
              answer(opt, isCorrect)
              setFeedback(isCorrect ? 'correct' : 'incorrect')
            }}
          />
        )}
        {/* MATCHING DISABLED — see buildQuestions above.
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
        */}
      </div>

      {feedback && (
        <div
          className={`mt-4 rounded-md p-4 flex flex-wrap justify-between items-center gap-3 shadow-warm ${
            feedback === 'correct'
              ? 'bg-success-50 text-success-900'
              : 'bg-danger-50 text-danger-900'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 font-medium">
            {feedback === 'correct' && <CheckIcon size={15} />}
            {feedback === 'correct' ? 'Correct' : `Not quite — answer: ${q.answer}`}
          </span>
          <button
            onClick={() => {
              setFeedback(null)
              setPicked(null) // don't carry the last pick into the next question
              next()
            }}
            className="btn-secondary"
          >
            {state.currentIndex + 1 >= state.questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      )}

      <div className="mt-6">
        <button onClick={() => setShowQuit(true)} className="text-sm text-stone-700 underline hover:text-clay-700">
          Quit quiz
        </button>
      </div>

      <ConfirmModal
        open={showQuit}
        title="Quit quiz?"
        message="Are you sure you want to quit? Your progress on this attempt won’t be saved."
        confirmLabel="Quit quiz"
        cancelLabel="Keep going"
        onConfirm={confirmQuit}
        onCancel={() => setShowQuit(false)}
      />
    </div>
    </PaywallGate>
  )
}

function MultipleChoice({ question, feedback, picked, onPick }) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <AudioButton audioSrc={question.audio} wordId={question.prompt} size="lg" />
          <h3 className="font-display text-2xl sm:text-3xl text-stone-900 break-words min-w-0">
            {question.prompt}
          </h3>
        </div>
        {/* Transcript of the recording — lets the learner SEE what they're
            hearing (e.g. the tone's Hmong name, "Cim Siab"). */}
        {question.blurb && (
          <p className="text-sm text-stone-600 italic mt-2">{question.blurb}</p>
        )}
      </div>
      {/* Single column on phones (full-width, thumb-reachable), two columns
          from sm up. Options are the primary tap target, so they get a
          comfortable min-height and base text — p-3/text-sm was cramped on
          touch. See notes/63. */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {question.options.map((opt) => {
          const isAnswer = opt === question.answer
          const showResult = Boolean(feedback)
          // After answering: correct → success, the learner's WRONG pick →
          // danger, everything else dimmed. Mirrors PracticeStep in Lesson.jsx.
          //
          // Each state sets its OWN text color rather than inheriting. The
          // inherited color is what broke this in dark mode: a fixed near-white
          // `emerald-50` chip under near-white inherited text hid the answer.
          // Surface and text now come from the same inverting scale, so they
          // can never drift apart. See notes/55.
          let cls = 'border-cream-300 bg-cream-50 hover:border-clay-500 text-stone-800'
          if (showResult && isAnswer) cls = 'border-success-500 bg-success-50 text-success-900 font-medium'
          else if (showResult && opt === picked) cls = 'border-danger-500 bg-danger-50 text-danger-900 font-medium'
          else if (showResult) cls = 'border-cream-200 bg-cream-50 text-stone-700 opacity-60'
          return (
            <button
              key={opt}
              onClick={() => onPick(opt)}
              className={`text-left rounded-lg border p-4 min-h-[3.25rem] text-base transition active:scale-[0.99] ${cls}`}
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

// MATCHING DISABLED — kept intact for re-enabling. To bring it back:
//   1. uncomment this component
//   2. uncomment the `matching` branch in buildQuestions()
//   3. uncomment the `q.type === 'matching'` render case
//   4. restore the `questionTypes: [..., 'matching']` lines in src/data/quizzes.js
/*
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
      <h3 className="font-display text-xl text-stone-900 mb-1">{question.prompt}</h3>
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
                    ? 'border-success-500 bg-success-50 text-success-900'
                    : isWrong
                    ? 'border-danger-500 bg-danger-50 text-danger-900'
                    : isSel
                    ? 'border-clay-500 bg-cream-100'
                    : matched
                    ? 'border-cream-300 bg-cream-100 opacity-70'
                    : 'border-cream-300 bg-cream-50 hover:border-clay-500'
                }`}
              >
                <div className="font-medium text-clay-700">{l}</div>
                {matched && <div className="text-xs text-stone-500">→ {matched}</div>}
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
*/
