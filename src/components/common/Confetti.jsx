import { useEffect, useMemo, useState } from 'react'

// A one-shot confetti burst. Pure CSS animation (keyframes in index.css) — no
// library. Each piece gets randomized position/drift/rotation/timing via inline
// custom properties; the keyframe reads them. Self-removes when the animation
// finishes so it never lingers in the DOM.
//
// Motion: honors prefers-reduced-motion by rendering NOTHING (the caller shows
// its own static "Perfect!" flourish either way). Falling confetti with the
// global motion kill-switch would just freeze mid-air — better to skip it.

// Theme color tokens — confetti follows the palette (and light/dark/neon).
const COLORS = [
  '--c-clay-500',
  '--c-clay-600',
  '--c-seafoam-500',
  '--c-blush-400',
  '--c-blush-500',
  '--c-cream-400',
]

export default function Confetti({ count = 48, duration = 4200 }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [done, setDone] = useState(false)

  const pieces = useMemo(() => {
    if (reduced) return []
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      left: Math.random() * 100, // vw
      drift: (Math.random() * 2 - 1) * 14, // -14..14 vw sideways
      rot: 360 + Math.random() * 720, // deg
      delay: Math.random() * 500, // ms — staggered start
      dur: 2600 + Math.random() * 1600, // ms
      color: COLORS[i % COLORS.length],
      w: 6 + Math.random() * 6, // px
      h: 9 + Math.random() * 7, // px (taller than wide = ribbon-ish)
    }))
  }, [count, reduced])

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => setDone(true), duration + 700)
    return () => clearTimeout(t)
  }, [duration, reduced])

  if (reduced || done) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.key}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            background: `rgb(var(${p.color}))`,
            '--drift': `${p.drift}vw`,
            '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.dur}ms`,
          }}
        />
      ))}
    </div>
  )
}
