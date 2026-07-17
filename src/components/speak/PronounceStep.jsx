import { useEffect, useRef, useState } from 'react'
import { usePronunciation } from '../../hooks/usePronunciation.js'
import LevelMeter from './LevelMeter.jsx'
import { VolumeIcon, PlayIcon, SwapIcon, RefreshIcon, CheckIcon } from '../icons/index.jsx'

// The Speak practice loop for one phrase:
//   Listen (native MP3) → Record → Hear your take → A/B compare → self-rate.
//
// Scoring is deliberately NOT here yet — self-rating ships first, the DSP
// tone score arrives later (notes/18, notes/19). `onDone` fires when the
// learner says their take sounds close; the parent records progress.
//
// Reference audio may be missing (audio: '') — the loop still works, the
// learner just compares against their own ear/memory.

export default function PronounceStep({ phrase, done, onDone }) {
  const { status, clip, analyser, start, stop, supported } = usePronunciation()
  const [playing, setPlaying] = useState(null) // 'ref' | 'take' | 'ab' | null
  const playersRef = useRef([])

  const hasReference = Boolean(phrase.audio)
  const recording = status === 'recording'

  // Stop any comparison playback when leaving or re-recording.
  const stopPlayback = () => {
    playersRef.current.forEach((a) => {
      a.onended = null
      a.pause()
    })
    playersRef.current = []
    setPlaying(null)
  }
  useEffect(() => stopPlayback, [])

  const playOne = (src, label) => {
    stopPlayback()
    const a = new Audio(src)
    playersRef.current = [a]
    setPlaying(label)
    a.onended = () => setPlaying(null)
    a.play().catch(() => setPlaying(null))
  }

  // A/B: native first, learner's take right after it ends.
  const playAB = () => {
    stopPlayback()
    const ref = new Audio(phrase.audio)
    const take = new Audio(clip.url)
    playersRef.current = [ref, take]
    setPlaying('ab')
    ref.onended = () => take.play().catch(() => setPlaying(null))
    take.onended = () => setPlaying(null)
    ref.play().catch(() => setPlaying(null))
  }

  if (!supported) {
    return (
      <div className="text-center text-stone-700 py-8">
        <p className="mb-2 font-medium">This browser can’t record audio.</p>
        <p className="text-sm">Try a current version of Chrome, Firefox, or Safari.</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      {/* The phrase */}
      <p className="font-serif text-3xl sm:text-4xl text-stone-900">{phrase.hmong}</p>
      <p className="text-stone-600 mt-1">{phrase.english}</p>
      {phrase.tip && (
        <p className="mt-3 mx-auto max-w-md text-sm text-stone-700 bg-cream-100 border border-cream-200 rounded-md px-4 py-2.5">
          <span className="font-medium text-clay-700">Tone tip:</span> {phrase.tip}
        </p>
      )}

      {/* Step 1 — listen */}
      <div className="mt-8">
        {hasReference ? (
          <button
            type="button"
            onClick={() => playOne(phrase.audio, 'ref')}
            className="btn-secondary gap-2"
            aria-label={`Play native recording of ${phrase.hmong}`}
          >
            <VolumeIcon size={16} />
            {playing === 'ref' ? 'Playing…' : 'Listen to a native speaker'}
          </button>
        ) : (
          <p className="inline-block text-xs text-stone-600 bg-cream-100 border border-cream-200 rounded-full px-3 py-1.5">
            Native recording coming soon — practice from the tone tip for now
          </p>
        )}
      </div>

      {/* Step 2 — record */}
      <div className="mt-8">
        {status === 'denied' ? (
          <div className="mx-auto max-w-sm text-sm text-stone-700 bg-blush-50 border border-blush-200 rounded-md px-4 py-3">
            <p className="font-medium mb-1">Microphone blocked.</p>
            <p>
              Allow mic access for this site in your browser’s address-bar
              permissions, then try again.
            </p>
          </div>
        ) : recording ? (
          <div className="space-y-4">
            <LevelMeter analyser={analyser} />
            <button
              type="button"
              onClick={stop}
              aria-label="Stop recording"
              className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-stone-900 text-cream-50 shadow-warm-lg hover:bg-stone-800 transition motion-safe:animate-pulse"
            >
              <StopIcon />
            </button>
            <p className="text-sm text-stone-700">
              Say it out loud, then tap to stop.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                stopPlayback()
                start()
              }}
              aria-label={clip ? 'Record again' : 'Start recording'}
              className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-clay-600 text-cream-50 shadow-warm-lg hover:bg-clay-700 hover:scale-105 transition"
            >
              <MicIcon />
            </button>
            <p className="text-sm text-stone-700">
              {clip ? 'Record another take' : 'Tap to record yourself'}
            </p>
          </div>
        )}
      </div>

      {/* Step 3 — compare + self-rate */}
      {clip && !recording && (
        <div className="mt-8 pt-6 border-t border-cream-200 space-y-5">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => playOne(clip.url, 'take')}
              className="btn-secondary gap-2"
            >
              <PlayIcon size={16} />
              {playing === 'take' ? 'Playing…' : 'Your take'}
            </button>
            {hasReference && (
              <button type="button" onClick={playAB} className="btn-secondary gap-2">
                <SwapIcon size={16} />
                {playing === 'ab' ? 'A/B…' : 'A/B compare'}
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                stopPlayback()
                start()
              }}
              className="btn-ghost gap-2"
            >
              <RefreshIcon size={16} />
              Try again
            </button>
            <button type="button" onClick={onDone} className="btn-primary gap-2">
              <CheckIcon size={16} />
              {done ? 'Practiced — mark again' : 'Sounds close'}
            </button>
          </div>
          <p className="text-xs text-stone-600">
            Automatic tone scoring is on the way — for now, trust your ear.
          </p>
        </div>
      )}
    </div>
  )
}

function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}
