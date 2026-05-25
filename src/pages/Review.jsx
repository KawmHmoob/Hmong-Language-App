import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectDueWords } from '../context/ProgressContext.jsx'
import Flashcard from '../components/vocabulary/Flashcard.jsx'

export default function Review() {
  const { vocabSchedule } = useProgress()

  // Snapshot the due list at mount so words don't disappear from the queue
  // mid-session as their schedule updates.
  const dueWords = useMemo(() => {
    const allWords = categories.flatMap((c) => c.words)
    return selectDueWords(allWords, vocabSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [idx, setIdx] = useState(0)

  if (dueWords.length === 0) {
    return (
      <div className="surface p-12 text-center">
        <h2 className="font-serif text-3xl text-stone-900 mb-2">All caught up.</h2>
        <p className="text-stone-700 mb-6">
          No words due for review right now. Browse vocabulary to add new ones, or come back later.
        </p>
        <Link to="/vocabulary" className="btn-primary">Browse Vocabulary</Link>
      </div>
    )
  }

  if (idx >= dueWords.length) {
    return (
      <div className="surface p-12 text-center">
        <h2 className="font-serif text-3xl text-stone-900 mb-2">Done.</h2>
        <p className="text-stone-700 mb-6">
          You reviewed {dueWords.length} word{dueWords.length === 1 ? '' : 's'}.
        </p>
        <Link to="/" className="btn-primary">Home</Link>
      </div>
    )
  }

  const word = dueWords[idx]
  const advance = () => setIdx((i) => i + 1)

  return (
    <>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-4xl text-stone-900 mb-1">Review</h2>
          <p className="text-stone-700">{idx + 1} of {dueWords.length} due</p>
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
    </>
  )
}
