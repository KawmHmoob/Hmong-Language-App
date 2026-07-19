import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { quizzes } from '../data/quizzes.js'
import { categoryGroups } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import { quizUnlock } from '../lib/access.js'
import { CheckIcon, LockIcon } from '../components/icons/index.jsx'

// Quiz menu. ~35 quizzes, 33 of them one-per-vocab-category, so a flat list is
// a wall — and grouping by the `category` field alone just moved the wall into
// a "Vocabulary" heading.
//
// So: non-vocab quizzes group by their own category (Alphabet, Tones, …), and
// the vocab quizzes are SUB-GROUPED by the same themes the Vocabulary page uses
// (`categoryGroups`) — one organizing scheme across both pages. See notes/53.

export default function QuizMenu() {
  const { quizScores, vocabProgress } = useProgress()

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

  // Non-vocab quizzes, grouped by their declared category.
  const otherGroups = useMemo(() => {
    const byCategory = new Map()
    for (const q of quizzes) {
      if (q.id.startsWith('vocab-')) continue
      if (!byCategory.has(q.category)) byCategory.set(q.category, [])
      byCategory.get(q.category).push(q)
    }
    return [...byCategory.entries()]
  }, [])

  // Vocab quizzes, arranged by the vocabulary THEMES so the Quizzes page and
  // the Vocabulary page tell the same story. A quiz whose category isn't in a
  // theme still surfaces — categoryGroups sweeps leftovers into "More".
  const vocabThemes = useMemo(
    () =>
      categoryGroups
        .map((g) => ({
          id: g.id,
          title: g.title,
          items: g.items
            .map((c) => quizzes.find((q) => q.id === `vocab-${c.id}`))
            .filter(Boolean),
        }))
        .filter((g) => g.items.length > 0),
    []
  )

  const vocabCount = vocabThemes.reduce((n, g) => n + g.items.length, 0)
  const takenCount = Object.keys(bestByQuiz).length

  return (
    <>
      {/* Quizzes is a sub-page of Words, not a top-level section — so it gets a
          breadcrumb trail (and the Back button that comes with it) rather than
          the section eyebrow the real hubs use. See notes/41, /51. */}
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Quizzes' },
        ]}
      />
      <div className="mb-8">
        <h2 className="font-display text-4xl text-stone-900 mb-2">Test what you’ve learned.</h2>
        <p className="text-stone-700">
          {takenCount > 0
            ? `You’ve taken ${takenCount} of ${quizzes.length} quizzes.`
            : `${quizzes.length} quizzes across the whole course.`}
        </p>
      </div>

      {/* Course quizzes first — they're few and they're the ones tied to the
          alphabet lessons. */}
      <div className="space-y-10">
        {otherGroups.map(([category, list]) => (
          <QuizGroup
            key={category}
            title={category}
            list={list}
            bestByQuiz={bestByQuiz}
            vocabProgress={vocabProgress}
          />
        ))}
      </div>

      {/* Vocabulary — kept as ONE section, sub-grouped by the same themes as
          the Vocabulary page so both read the same way. */}
      {vocabThemes.length > 0 && (
        <section className="mt-14" aria-labelledby="quiz-vocab">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-cream-200 pb-3">
            <h3 id="quiz-vocab" className="font-display text-2xl text-stone-900">
              Vocabulary
            </h3>
            <p className="text-xs text-stone-600">{vocabCount} quizzes by theme</p>
          </header>

          <div className="space-y-10">
            {vocabThemes.map((g) => (
              <QuizGroup
                key={g.id}
                title={g.title}
                list={g.items}
                bestByQuiz={bestByQuiz}
                vocabProgress={vocabProgress}
                small
              />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

// One headed grid of quiz cards. `small` renders it as a sub-section (used for
// the themes nested under Vocabulary) rather than a top-level group.
function QuizGroup({ title, list, bestByQuiz, vocabProgress, small = false }) {
  const headingId = `quizgrp-${title.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <section aria-labelledby={headingId}>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h4
          id={headingId}
          className={
            small
              ? 'font-display text-lg text-stone-900'
              : 'font-display text-2xl text-stone-900'
          }
        >
          {title}
        </h4>
        <p className="text-xs text-stone-600">
          {list.length} quiz{list.length === 1 ? '' : 'zes'}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((q) => (
          <QuizCard
            key={q.id}
            quiz={q}
            best={bestByQuiz[q.id]}
            unlock={quizUnlock(q.id, vocabProgress)}
          />
        ))}
      </div>
    </section>
  )
}

function QuizCard({ quiz, best, unlock }) {
  const taken = best != null
  const locked = unlock?.gated && !unlock.unlocked

  // A locked card still links — but to the word bank, not the quiz. A lock
  // with no path forward is a wall; this one points at the way through.
  const to = locked ? `/vocabulary/${unlock.category.id}` : `/quiz/${quiz.id}`

  return (
    <Link
      to={to}
      className={`surface surface-hover p-5 block group ${locked ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h4 className="font-display text-lg text-stone-900 group-hover:text-clay-700 transition">
          {quiz.title}
        </h4>
        <span className="shrink-0 flex items-center gap-1">
          {locked && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-cream-200 text-stone-600 px-2 py-0.5">
              <LockIcon size={10} /> Study first
            </span>
          )}
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
      {locked ? (
        <p className="text-xs text-clay-700 font-medium">
          Study {unlock.remaining} more word{unlock.remaining === 1 ? '' : 's'} to unlock →
        </p>
      ) : (
        <p className="text-xs text-stone-500">{quiz.questionCount} questions</p>
      )}
    </Link>
  )
}
