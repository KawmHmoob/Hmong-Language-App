import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectSession } from '../context/ProgressContext.jsx'
import Flashcard from '../components/vocabulary/Flashcard.jsx'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons/index.jsx'

// Today's session over the SRS queue: every due review, then a capped
// handful of new words (see notes/35 — uncapped, day one was 391 cards).
//
// The queue is snapshotted at mount so cards don't vanish mid-session as
// their schedules update.

export default function WordsSession() {
  const { vocabSchedule, streakData } = useProgress()

  const { queue, reviews } = useMemo(() => {
    const allWords = categories.flatMap((c) => c.words)
    return selectSession(allWords, vocabSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [idx, setIdx] = useState(0)

  if (queue.length === 0) {
    return (
      <SessionEnd
        title="All caught up."
        body="No reviews due and no new words waiting. Browse vocabulary to go deeper, or come back tomorrow."
      />
    )
  }

  if (idx >= queue.length) {
    return (
      <SessionEnd
        celebrate
        title="Session complete! 🎉"
        body={`You worked through ${queue.length} word${queue.length === 1 ? '' : 's'} — streak: ${streakData.currentStreak} day${streakData.currentStreak === 1 ? '' : 's'}. Come back tomorrow to keep it going.`}
      />
    )
  }

  const word = queue[idx]
  // Reviews are first in the queue, so anything past their count is new.
  const isNew = idx >= reviews.length
  const advance = () => setIdx((i) => i + 1)

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Session' },
        ]}
      />

      <div className="mb-6 flex justify-between items-end gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-4xl text-stone-900 mb-1">Today’s words</h2>
          <p className="text-stone-700">
            {idx + 1} of {queue.length}
            <span
              className={`ml-2 inline-block align-[1px] text-[10px] uppercase tracking-wider font-semibold rounded-full px-2 py-0.5 ${
                isNew ? 'bg-clay-600 text-cream-50' : 'bg-cream-200 text-stone-700'
              }`}
            >
              {isNew ? 'New' : 'Review'}
            </span>
          </p>
        </div>
        <div className="h-2 w-32 bg-cream-200 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-clay-600 transition-all duration-300"
            style={{ width: `${((idx + 1) / queue.length) * 100}%` }}
          />
        </div>
      </div>

      <Flashcard word={word} key={word.id} onAdvance={advance} />

      {/* Back + Skip. The session previously only went FORWARD — misjudge a
          card and there was no way to return to it, which made every tap feel
          irreversible. Marking still auto-advances; these are the manual
          overrides. Matched to the deck controls in VocabList. See notes/66. */}
      <div className="flex justify-between items-center mt-5 gap-3">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          aria-label="Previous word"
          className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-cream-200 text-stone-800 hover:bg-cream-300 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <ArrowLeftIcon size={20} />
        </button>

        <span className="text-xs text-stone-600">
          Mark the card to advance, or skip it
        </span>

        <button
          onClick={advance}
          aria-label="Skip this word"
          className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-cream-200 text-stone-800 hover:bg-cream-300 active:scale-95 transition"
        >
          <ArrowRightIcon size={20} />
        </button>
      </div>
    </div>
  )
}

function SessionEnd({ title, body, celebrate = false }) {
  return (
    <div className={`p-12 text-center max-w-xl mx-auto ${celebrate ? 'surface-elevated' : 'surface'}`}>
      <h2 className="font-display text-3xl text-stone-900 mb-2">{title}</h2>
      <p className="text-stone-700 mb-6 leading-relaxed">{body}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/words" className="btn-primary">Back to Words</Link>
        {celebrate ? (
          <Link to="/quiz/tone-drill" className="btn-ghost">Bonus: tone drill</Link>
        ) : (
          <Link to="/vocabulary" className="btn-ghost">Browse vocabulary</Link>
        )}
      </div>
    </div>
  )
}
