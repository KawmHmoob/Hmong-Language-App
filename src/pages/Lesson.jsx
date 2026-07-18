import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getLesson, getUnit, allStepIds } from '../data/lessons.js'
import { getCategory } from '../data/vocabulary.js'
import { CheckIcon, LockIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/icons/index.jsx'
import { useProgress } from '../hooks/useProgress.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import PaywallGate from '../components/common/PaywallGate.jsx'
import AccountGate from '../components/common/AccountGate.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import { isLessonGuestAllowed, GUEST_LESSON_LIMIT } from '../lib/access.js'

export default function Lesson() {
  const { unitId, lessonId } = useParams()
  const navigate = useNavigate()
  const unit = getUnit(unitId)
  const lesson = getLesson(unitId, lessonId)
  const { completedSteps, quizScores, markStepComplete } = useProgress()
  const [index, setIndex] = useState(0)

  // Auto-mark a quiz step complete once a score for its quiz exists — even if
  // the user took the quiz on its own page and never clicked "Finish".
  //   - 'mini-quiz' points at an explicit step.quizId
  //   - 'quiz' (the study→quiz flow) derives it from the lesson's vocab category
  useEffect(() => {
    if (!lesson) return
    lesson.steps.forEach((step) => {
      let quizId = null
      if (step.kind === 'mini-quiz') quizId = step.quizId
      else if (step.kind === 'quiz' && lesson.vocab) quizId = `vocab-${lesson.vocab}`
      else return
      if (completedSteps.includes(step.id)) return
      const taken = quizScores.some((s) => s.quizId === quizId)
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
      // Finishing returns to the unit, not the hub — you're likely doing the
      // next lesson in the same unit.
      navigate(`/learn/${unit.id}`)
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    // Account gate OUTSIDE the paywall: you can't subscribe without an account,
    // so the cheaper ask always comes first. See notes/36.
    <AccountGate
      allowed={isLessonGuestAllowed(lesson.id)}
      contentLabel="Create a free account to keep learning"
      blurb={`The first ${GUEST_LESSON_LIMIT} lessons are open to everyone. Creating an account is free — it unlocks the rest of the course and keeps your streak going.`}
    >
    <PaywallGate tier={requiredTier} contentLabel={`${lesson.title} is Pro`}>
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Learn', to: '/learn' },
          { label: unit.title, to: `/learn/${unit.id}` },
          { label: lesson.title },
        ]}
      />

      <StepHeader lesson={lesson} index={index} />

      <div className="surface p-6 sm:p-8">
        {step.kind === 'intro' && <IntroStep step={step} />}
        {step.kind === 'examples' && <ExamplesStep step={step} lesson={lesson} />}
        {step.kind === 'reading' && <ReadingStep key={step.id} step={step} />}
        {step.kind === 'quiz' && <QuizStep step={step} lesson={lesson} />}
        {step.kind === 'practice' && (
          <PracticeStep step={step} onAdvance={handleAdvance} />
        )}
        {step.kind === 'mini-quiz' && (
          <MiniQuizStep step={step} taken={quizScores.some((s) => s.quizId === step.quizId)} />
        )}
      </div>

      {/* Back is ALWAYS available — it used to vanish on practice/mini-quiz
          steps, which stranded you with no way backward. Only Continue is
          conditional: those two steps supply their own forward action. */}
      <div className="mt-6 flex justify-between items-center gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="btn-ghost gap-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ArrowLeftIcon size={16} />
          Back
        </button>

        {step.kind !== 'practice' && step.kind !== 'mini-quiz' && step.kind !== 'quiz' && (
          <button onClick={handleAdvance} className="btn-primary gap-2">
            {isLast ? 'Finish' : 'Continue'}
            <ArrowRightIcon size={16} />
          </button>
        )}
      </div>
    </div>
    </PaywallGate>
    </AccountGate>
  )
}

function StepHeader({ lesson, index }) {
  const total = lesson.steps.length
  const pct = Math.round(((index + 1) / total) * 100)
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h2 className="font-display text-3xl text-stone-900">{lesson.title}</h2>
        {/* Two doors to the same knowledge: this lesson EXPLAINS it, the
            reference table STATES it. See notes/34. */}
        {lesson.reference && (
          <Link
            to={`/reference/${lesson.reference}`}
            className="text-sm font-medium text-clay-700 hover:text-clay-600 transition-colors whitespace-nowrap"
          >
            Cheat sheet →
          </Link>
        )}
      </div>
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
      <h3 className="font-display text-2xl text-stone-900 mb-4">{step.title}</h3>
      <div className="space-y-4 text-stone-800 leading-relaxed">
        {step.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </>
  )
}

function ExamplesStep({ step, lesson }) {
  return (
    <>
      <h3 className="font-display text-2xl text-stone-900 mb-2">{step.title}</h3>
      {step.intro && <p className="text-sm text-stone-600 mb-4 italic">{step.intro}</p>}
      <ul className="divide-y divide-cream-200">
        {step.items.map((it) => (
          <li key={it.hmong} className="py-3">
            <div className="flex justify-between items-baseline gap-3">
              <span className="font-medium text-clay-700 text-lg">{it.hmong}</span>
              {/* Vocabulary lessons carry `english`; the consonant lessons carry
                  `hmongExample` (an example word) instead. Show whichever exists. */}
              <span className="text-stone-700 text-sm">{it.english || it.hmongExample}</span>
              <AudioButton audioSrc={it.audio} wordId={it.hmong} />
            </div>
            {(it.note || it.englishSound) && (
              <p className="text-xs text-stone-500 mt-1 italic">{it.note || it.englishSound}</p>
            )}
          </li>
        ))}
      </ul>

      {/* When the lesson maps to a word set, the examples step is the jumping-off
          point: study the full set in the word bank. Doing so unlocks the quiz
          on the next step (see QuizStep). */}
      {lesson?.vocab && <StudyHandoff lesson={lesson} />}
    </>
  )
}

// The studied flag — a completedSteps entry set when the learner heads off to
// study. Separate from any real step id; it only gates the quiz step.
function studiedFlag(lesson) {
  return `${lesson.id}-studied`
}

// Shared "go study" action, used on the examples step AND on the locked quiz
// step. Marks the flag, then opens the category's word bank.
function useStudyHandoff(lesson) {
  const navigate = useNavigate()
  const { markStepComplete } = useProgress()
  return () => {
    markStepComplete(studiedFlag(lesson)) // no lessonId → doesn't touch completion
    navigate(`/vocabulary/${lesson.vocab}`)
  }
}

function StudyHandoff({ lesson }) {
  const { completedSteps } = useProgress()
  const category = getCategory(lesson.vocab)
  const studied = completedSteps.includes(studiedFlag(lesson))
  const goStudy = useStudyHandoff(lesson)
  if (!category) return null

  return (
    <div className="mt-6 pt-5 border-t border-cream-200">
      <button onClick={goStudy} className="btn-primary gap-2 w-full sm:w-auto">
        Study the {category.words.length} words
        <ArrowRightIcon size={16} />
      </button>
      <p className="text-xs text-stone-600 mt-2">
        {studied
          ? '✓ Studied — the quiz is unlocked on the next step.'
          : 'Study these in your word bank to unlock the quiz.'}
      </p>
    </div>
  )
}

// A reading passage. The translation starts HIDDEN on purpose: if the English
// is visible, the eye reads it first and the Hmong becomes decoration. Making
// the learner ask for it turns reading into an attempt, not a glance.
// The glossary is always visible — it's a crutch for words, not for meaning.
function ReadingStep({ step }) {
  const [showEnglish, setShowEnglish] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h3 className="font-display text-2xl text-stone-900">{step.title}</h3>
        {step.level && (
          <span className="text-[10px] uppercase tracking-[0.15em] font-semibold rounded-full bg-cream-200 text-stone-700 px-2.5 py-1">
            {step.level}
          </span>
        )}
      </div>
      {step.intro && <p className="text-sm text-stone-600 mb-5 italic">{step.intro}</p>}

      {/* The passage — the hero of this step */}
      <p className="font-display text-2xl sm:text-3xl text-clay-700 leading-relaxed mb-5">
        {step.hmong}
      </p>

      {showEnglish ? (
        <div className="rounded-lg bg-cream-100 border border-cream-200 p-4 mb-6">
          <p className="text-xs uppercase tracking-[0.15em] text-stone-600 mb-1.5">
            Translation
          </p>
          <p className="text-stone-800 leading-relaxed">{step.english}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowEnglish(true)}
          className="btn-ghost mb-6"
        >
          Reveal translation
        </button>
      )}

      {step.glossary?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-stone-600 mb-2">
            Words in this passage
          </p>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {step.glossary.map((g) => (
              <li
                key={g.hmong}
                className="flex justify-between gap-3 py-1.5 text-sm border-b border-cream-200"
              >
                <span className="font-medium text-clay-700">{g.hmong}</span>
                <span className="text-stone-600 text-right">{g.english}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

// The lesson's final step: the quiz for its words — but LOCKED until the
// learner has studied (the flag set by StudyHandoff on the examples step).
// You study first, then you're tested. It links to the same vocab-<cat> quiz
// the Words section uses; taking it there auto-completes this step (see the
// effect in Lesson). See notes/37.
function QuizStep({ lesson }) {
  const { unitId } = useParams()
  const { completedSteps, quizScores } = useProgress()
  const category = getCategory(lesson.vocab)
  const goStudy = useStudyHandoff(lesson)

  if (!category) {
    return (
      <p className="text-stone-700">
        This lesson doesn’t have a word set yet. Head back to{' '}
        <Link to="/learn" className="text-clay-700 underline">Learn</Link>.
      </p>
    )
  }

  const studied = completedSteps.includes(studiedFlag(lesson))
  const quizId = `vocab-${category.id}`
  const best = quizScores
    .filter((s) => s.quizId === quizId)
    .reduce((m, s) => Math.max(m, s.accuracy), -1)
  const taken = best >= 0

  // Locked — study is the prerequisite.
  if (!studied) {
    return (
      <div className="text-center py-4">
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cream-100 text-stone-500 mb-4">
          <LockIcon size={22} />
        </span>
        <h3 className="font-display text-2xl text-stone-900 mb-2">Study the words first</h3>
        <p className="text-stone-700 mb-6 max-w-md mx-auto leading-relaxed">
          The quiz unlocks once you’ve studied the {category.words.length} words in{' '}
          {category.title}. Head to your word bank, then come back.
        </p>
        <button onClick={goStudy} className="btn-primary gap-2">
          Study the words
          <ArrowRightIcon size={16} />
        </button>
      </div>
    )
  }

  // Unlocked.
  return (
    <div className="text-center py-4">
      <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cream-100 text-clay-700 mb-4">
        <CheckIcon size={22} />
      </span>
      <h3 className="font-display text-2xl text-stone-900 mb-2">
        {taken ? 'Quiz unlocked' : 'Ready when you are'}
      </h3>
      <p className="text-stone-700 mb-6 max-w-md mx-auto leading-relaxed">
        {Math.min(10, category.words.length)} questions drawn from the {category.title}{' '}
        words you studied.
        {taken && ` Your best so far: ${best}%.`}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to={`/quiz/${quizId}`} className="btn-primary gap-2">
          {taken ? 'Retake quiz' : 'Take the quiz'}
          <ArrowRightIcon size={16} />
        </Link>
        {taken && (
          <Link to={`/learn/${unitId}`} className="btn-ghost">
            Finish lesson
          </Link>
        )}
      </div>
    </div>
  )
}

function PracticeStep({ step, onAdvance }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === step.answer

  return (
    <>
      <h3 className="font-display text-2xl text-stone-900 mb-4">{step.title}</h3>
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
            {correct ? 'Correct ✓' : `Not quite — answer: ${step.answer}`}
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
      <h3 className="font-display text-2xl text-stone-900 mb-2">{step.title}</h3>
      <p className="text-stone-700 mb-5">
        {taken
          ? "You've taken this quiz — you can retake it for more practice. The lesson is marked complete."
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
