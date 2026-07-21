import { useState } from 'react'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'

// Status badge shown ON the card, so a learner can tell at a glance whether
// they've already marked this word. Without it the only signal was which
// button looked active — and that's below the card, easy to miss, and invisible
// while you're reading the word itself. See notes/66.
//
// `new` is the default for any word with no vocabProgress entry, so an
// unstudied card says so rather than showing nothing.
const STATUS = {
  new: { label: 'New', cls: 'bg-cream-200 text-stone-700' },
  learning: { label: 'Learning', cls: 'bg-clay-600 text-cream-50' },
  known: { label: 'Known', cls: 'bg-success-700 text-cream-50' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new
  return (
    <span
      className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

// onAdvance: optional. If provided, called ~250ms after marking so the
// review flow can auto-advance to the next card.
export default function Flashcard({ word, onAdvance }) {
  const [flipped, setFlipped] = useState(false)
  const { vocabProgress, setVocabStatus } = useProgress()
  const status = vocabProgress[word.id] || 'new'

  const mark = (next) => {
    setVocabStatus(word.id, next)
    if (onAdvance) setTimeout(onAdvance, 250)
  }

  return (
    <div>
      {/* 3D flip. Both faces are always rendered; the .is-flipped class turns
          the card over. Keyboard-accessible: it's a button, Enter/Space flip.
          The status badge sits inside this button, but an explicit aria-label
          overrides inner text — so the status is repeated in the label below,
          or screen-reader users lose it entirely. */}
      <div className="flip-scene">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={
            (flipped
              ? `${word.english}. Tap to see the Hmong.`
              : `${word.hmongRPA}. Tap to reveal the meaning.`) +
            ` Status: ${(STATUS[status] || STATUS.new).label}.`
          }
          className={`flip-card w-full min-h-[280px] cursor-pointer text-left ${flipped ? 'is-flipped' : ''}`}
        >
          {/* FRONT — Hmong */}
          <div className="flip-face surface relative p-12 min-h-[280px] flex flex-col items-center justify-center">
            <StatusBadge status={status} />
            <div className="flex items-center gap-3 mb-3">
              {/* stopPropagation so tapping the speaker doesn't flip the card */}
              <span onClick={(e) => e.stopPropagation()}>
                <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
              </span>
              <h3 className="font-display text-5xl text-clay-700">{word.hmongRPA}</h3>
            </div>
            <p className="text-sm text-stone-500 italic">Tap to flip</p>
          </div>

          {/* BACK — English + example. Badge repeated: either face can be the
              one you're looking at, so the status has to be on both. */}
          <div className="flip-face flip-face-back surface p-12 min-h-[280px] flex flex-col items-center justify-center">
            <StatusBadge status={status} />
            <h3 className="font-display text-3xl text-stone-900 mb-2">{word.english}</h3>
            {word.exampleSentence && (
              <div className="text-center text-sm text-stone-600 mt-4 max-w-md">
                <p className="italic text-clay-700 mb-1">{word.exampleSentence.hmong}</p>
                <p>{word.exampleSentence.english}</p>
              </div>
            )}
          </div>
        </button>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        <button
          onClick={() => mark('learning')}
          className={`px-4 py-2 rounded text-sm font-medium transition shadow-warm ${
            status === 'learning'
              ? 'bg-clay-600 text-cream-50'
              : 'bg-cream-200 text-clay-700 hover:bg-cream-300'
          }`}
        >
          Mark Learning
        </button>
        <button
          onClick={() => mark('known')}
          className={`px-4 py-2 rounded text-sm font-medium transition shadow-warm ${
            status === 'known'
              ? 'bg-success-700 text-cream-50'
              : 'bg-success-50 text-success-900 hover:bg-success-200'
          }`}
        >
          Mark Known
        </button>
      </div>
    </div>
  )
}
