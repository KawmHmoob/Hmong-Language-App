import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectDueWords } from '../context/ProgressContext.jsx'
import Flashcard from '../components/vocabulary/Flashcard.jsx'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'

// Today's flashcard session over the SRS due queue. Supersedes the old
// /review page (that route now redirects here) — same engine, new home
// inside the Words section, plus a celebratory finish.
//
// The due list is snapshotted at mount so cards don't vanish mid-session
// as their schedules update (same trick the old Review page used).

export default function WordsSession() {
  const { vocabSchedule, streakData } = useProgress()

  const dueWords = useMemo(() => {
    const allWords = categories.flatMap((c) => c.words)
    return selectDueWords(allWords, vocabSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [idx, setIdx] = useState(0)

  if (dueWords.length === 0) {
    return (
      <SessionEnd
        title="All caught up."
        body="No words due right now. Browse vocabulary to add new ones, or come back later."
      />
    )
  }

  if (idx >= dueWords.length) {
    return (
      <SessionEnd
        celebrate
        title="Session complete! 🎉"
        body={`You reviewed ${dueWords.length} word${dueWords.length === 1 ? '' : 's'} — streak: ${streakData.currentStreak} day${streakData.currentStreak === 1 ? '' : 's'}. Come back tomorrow to keep it going.`}
      />
    )
  }

  const word = dueWords[idx]
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

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-4xl text-stone-900 mb-1">Today’s words</h2>
          <p className="text-stone-700">
            {idx + 1} of {dueWords.length} due
          </p>
        </div>
        <div className="h-2 w-32 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-clay-600 transition-all"
            style={{ width: `${((idx + 1) / dueWords.length) * 100}%` }}
          />
        </div>
      </div>

      <Flashcard word={word} key={word.id} onAdvance={advance} />

      <div className="mt-4 text-center">
        <button onClick={advance} className="btn-ghost text-sm">
          Skip →
        </button>
      </div>
    </div>
  )
}

function SessionEnd({ title, body, celebrate = false }) {
  return (
    <div className={`p-12 text-center max-w-xl mx-auto ${celebrate ? 'surface-elevated' : 'surface'}`}>
      <h2 className="font-serif text-3xl text-stone-900 mb-2">{title}</h2>
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
