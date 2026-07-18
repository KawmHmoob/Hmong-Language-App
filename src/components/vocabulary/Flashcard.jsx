import { useState } from 'react'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'

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
          the card over. Keyboard-accessible: it's a button, Enter/Space flip. */}
      <div className="flip-scene">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? `${word.english}. Tap to see the Hmong.` : `${word.hmongRPA}. Tap to reveal the meaning.`}
          className={`flip-card w-full min-h-[280px] cursor-pointer text-left ${flipped ? 'is-flipped' : ''}`}
        >
          {/* FRONT — Hmong */}
          <div className="flip-face surface p-12 min-h-[280px] flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 mb-3">
              {/* stopPropagation so tapping the speaker doesn't flip the card */}
              <span onClick={(e) => e.stopPropagation()}>
                <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
              </span>
              <h3 className="font-display text-5xl text-clay-700">{word.hmongRPA}</h3>
            </div>
            <p className="text-sm text-stone-500 italic">Tap to flip</p>
          </div>

          {/* BACK — English + example */}
          <div className="flip-face flip-face-back surface p-12 min-h-[280px] flex flex-col items-center justify-center">
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
              ? 'bg-emerald-700 text-cream-50'
              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
          }`}
        >
          Mark Known
        </button>
      </div>
    </div>
  )
}
