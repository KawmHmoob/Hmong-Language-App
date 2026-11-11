import { useEffect, useRef, useState } from 'react'
import { PlayIcon, PauseIcon } from '../icons/index.jsx'

// "Hear the eight tones" — the showcase's one interactive piece, and the
// fastest way to show a visitor why Hmong needs an app with real audio.
//
// One shared Audio object for the whole grid, so tapping a second tone stops
// the first instead of talking over it. `playing` holds the path of the clip
// currently sounding (null = silence); `onended` resets it.
//
// Tones come from appContent.json, i.e. from the mobile app's reference.js —
// same names, same clips (public/assets/audio/tones/).
export default function ToneDemo({ tones }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(null)

  // Stop the sound if the visitor navigates away mid-clip.
  useEffect(() => () => audioRef.current?.pause(), [])

  function toggle(tone) {
    const audio = audioRef.current ?? (audioRef.current = new Audio())
    if (playing === tone.audio) {
      audio.pause()
      setPlaying(null)
      return
    }
    audio.src = tone.audio
    audio.onended = () => setPlaying(null)
    setPlaying(tone.audio)
    // play() rejects if the browser blocks it or the file fails — reset quietly.
    audio.play().catch(() => setPlaying(null))
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tones.map((t) => {
        const active = playing === t.audio
        return (
          <li key={t.audio}>
            <button
              type="button"
              onClick={() => toggle(t)}
              aria-pressed={active}
              aria-label={`${active ? 'Stop' : 'Play'} the ${t.name} tone, ${t.example2}`}
              className={`w-full h-full text-left rounded-xl border p-4 transition-colors ${
                active
                  ? 'bg-clay-600 border-clay-600 text-cream-50'
                  : 'bg-cream-50 border-cream-200 hover:border-clay-600/60'
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className={`font-display text-3xl leading-none ${active ? '' : 'text-clay-700'}`}>
                  {t.marker ? `-${t.marker}` : '–'}
                </span>
                {active ? <PauseIcon size={18} /> : <PlayIcon size={18} className="text-stone-600" />}
              </span>
              <span className={`block mt-3 font-semibold ${active ? '' : 'text-stone-900'}`}>{t.name}</span>
              <span className={`block text-sm mt-0.5 ${active ? '' : 'text-stone-700'}`}>
                {t.marker ? t.example2 : `${t.example2} (no letter)`}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
