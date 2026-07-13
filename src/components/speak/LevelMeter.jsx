import { useEffect, useRef } from 'react'

// Live mic level meter for the Speak recorder. Draws a rolling bar
// history onto a canvas from the AnalyserNode that usePronunciation
// exposes while recording.
//
// Motion: users with prefers-reduced-motion get a slow (5 fps) update
// instead of a 60 fps animation — same information, less flicker.

const BARS = 32

export default function LevelMeter({ analyser }) {
  const canvasRef = useRef(null)
  const levelsRef = useRef(new Array(BARS).fill(0))

  useEffect(() => {
    if (!analyser) return
    const canvas = canvasRef.current
    const ctx2d = canvas.getContext('2d')
    const data = new Uint8Array(analyser.fftSize)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Canvas can't use Tailwind classes — read the themed clay color off the
    // element (className sets text-clay-500, computed style resolves the var).
    const barColor = getComputedStyle(canvas).color

    let raf = null
    let interval = null

    const tick = () => {
      analyser.getByteTimeDomainData(data)
      // RMS of the waveform → one 0..1 loudness value for this frame.
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128
        sum += v * v
      }
      const level = Math.min(1, Math.sqrt(sum / data.length) * 3)

      const levels = levelsRef.current
      levels.push(level)
      levels.shift()

      const { width, height } = canvas
      ctx2d.clearRect(0, 0, width, height)
      const barW = width / BARS
      for (let i = 0; i < BARS; i++) {
        const h = Math.max(2, levels[i] * height)
        ctx2d.fillStyle = barColor
        ctx2d.fillRect(i * barW + 1, (height - h) / 2, barW - 2, h)
      }

      if (!reduced) raf = requestAnimationFrame(tick)
    }

    if (reduced) {
      interval = setInterval(tick, 200)
    } else {
      raf = requestAnimationFrame(tick)
    }
    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (interval) clearInterval(interval)
    }
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      width="280"
      height="48"
      className="w-full max-w-[280px] h-12 mx-auto text-clay-500"
      role="img"
      aria-label="Microphone level"
    />
  )
}
