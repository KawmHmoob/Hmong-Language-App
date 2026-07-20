import { useEffect, useRef, useState } from 'react'
import { usePronunciation } from '../../hooks/usePronunciation.js'
import LevelMeter from './LevelMeter.jsx'
import ToneCurve from './ToneCurve.jsx'
import { scoreTake } from '../../lib/pronounceScore.js'
import { VolumeIcon, PlayIcon, SwapIcon, RefreshIcon, CheckIcon } from '../icons/index.jsx'

// The Speak practice loop for one phrase:
//   Listen (native MP3) → Record → see your pitch vs the native curve → A/B.
//
// Tone scoring runs when a reference CONTOUR exists (getContour); otherwise it
// falls back to the learner's own curve + self-rating. The score is shown as
// FEEDBACK, not a gate — no pass threshold is enforced here, deliberately,
// until it's calibrated against real takes (notes/19, guide Part 7).
//
// `onDone` fires when the learner moves on; the parent records progress.

export default function PronounceStep({ phrase, done, onDone }) {
  const { status, clip, analyser, start, stop, supported } = usePronunciation()
  const [playing, setPlaying] = useState(null) // 'ref' | 'take' | 'ab' | null
  const [result, setResult] = useState(null) // { score, ref, user } | null
  const [scoring, setScoring] = useState(false)
  const playersRef = useRef([])

  const hasReference = Boolean(phrase.audio)
  const recording = status === 'recording'

  // Score each new take. clip is replaced (new object) on every recording, so
  // this fires once per take. Guarded against a stale take resolving after the
  // learner has already re-recorded.
  useEffect(() => {
    if (!clip?.blob) return
    let live = true
    setScoring(true)
    setResult(null)
    scoreTake(clip.blob, phrase.audio)
      .then((r) => live && setResult(r))
      .catch(() => live && setResult(null))
      .finally(() => live && setScoring(false))
    return () => {
      live = false
    }
  }, [clip, phrase.audio])

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
      <p className="font-display text-3xl sm:text-4xl text-stone-900">{phrase.hmong}</p>
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

      {/* Step 3 — score + curve + compare */}
      {clip && !recording && (
        <div className="mt-8 pt-6 border-t border-cream-200 space-y-5">
          {scoring && (
            <p className="text-sm text-stone-600">Analyzing your tone…</p>
          )}

          {result && !scoring && (
            <>
              {result.score != null && <ScoreBadge score={result.score} />}
              {(result.ref?.length > 0 || result.user?.length > 0) && (
                <ToneCurve refCurve={result.ref} user={result.user} />
              )}
              {result.score == null && (
                <p className="text-sm text-stone-600">
                  {result.reason === 'no-reference'
                    ? 'No native curve to compare against yet — here’s your own pitch. Trust your ear with the tone tip for now.'
                    : 'That was too short or too quiet to read — try saying it a little louder.'}
                </p>
              )}
            </>
          )}

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
              {done ? 'Practiced — mark again' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Score readout. Colored by band but NOT gated — 80% is a target shown to the
// learner, not a wall enforced here, until it's calibrated (guide Part 7).
function ScoreBadge({ score }) {
  const band =
    score >= 80
      ? 'bg-success-50 text-success-900'
      : score >= 55
      ? 'bg-cream-200 text-stone-800'
      : 'bg-danger-50 text-danger-900'
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`inline-flex items-baseline gap-1 rounded-full px-4 py-1.5 font-display ${band}`}
      >
        <span className="text-2xl">{score}</span>
        <span className="text-sm">/ 100</span>
      </span>
      <span className="text-xs text-stone-600">
        {score >= 80 ? 'Great tone match' : 'Watch where the lines diverge'}
      </span>
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
