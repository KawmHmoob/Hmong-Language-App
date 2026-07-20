// Tone-contour overlay: the native reference vs the learner's take, both as
// pitch curves on one plot. Time on x, semitones-from-own-median on y.
//
// This is the honest core of the Speak feedback — two lines can't be "wrong",
// they just show what happened, and the learner SEES their tone go flat where
// it should rise. Pure SVG, no chart library. See notes/59-style restraint.
//
// Both curves are already normalized (semitones, own-median-centred) upstream,
// which is what makes a male and a female voice comparable on the same axis.

const W = 320
const H = 160
const PAD = 16

function pathFor(points, xScale, yScale) {
  if (!points.length) return ''
  // Break the line at time gaps (unvoiced stretches) rather than drawing a
  // straight segment across silence — a gap is information, not a pitch slide.
  let d = ''
  let prevT = null
  for (const p of points) {
    const x = xScale(p.t)
    const y = yScale(p.st)
    const gap = prevT != null && p.t - prevT > 0.06 // >60ms unvoiced
    d += `${d === '' || gap ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
    prevT = p.t
  }
  return d.trim()
}

// `refCurve`, NOT `ref` — `ref` is a reserved prop in React; passing it to a
// plain function component silently drops it, so the native line would never
// draw. See notes/61.
export default function ToneCurve({ refCurve = [], user = [] }) {
  const all = [...refCurve, ...user]
  if (all.length < 2) return null

  const tMax = Math.max(...all.map((p) => p.t)) || 1
  // Symmetric semitone range, at least ±6 st so small wiggles don't fill the
  // frame and look dramatic. Clamp so one outlier can't flatten everything.
  const stMax = Math.min(18, Math.max(6, ...all.map((p) => Math.abs(p.st) + 1)))

  const xScale = (t) => PAD + (t / tMax) * (W - 2 * PAD)
  const yScale = (st) => H / 2 - (st / stMax) * (H / 2 - PAD)

  return (
    <figure className="mx-auto max-w-md">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-xl bg-ocean-50 border border-ocean-200"
        role="img"
        aria-label="Your pitch compared to a native speaker"
      >
        {/* Zero line = each speaker's neutral pitch. */}
        <line
          x1={PAD}
          y1={H / 2}
          x2={W - PAD}
          y2={H / 2}
          className="stroke-ocean-300"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Reference underneath, thicker + calmer. */}
        {refCurve.length > 0 && (
          <path
            d={pathFor(refCurve, xScale, yScale)}
            fill="none"
            className="stroke-ocean-600"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
        )}

        {/* Learner's take on top, in the accent so it reads as "you". */}
        <path
          d={pathFor(user, xScale, yScale)}
          fill="none"
          className="stroke-clay-600"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <figcaption className="mt-2 flex justify-center gap-4 text-xs text-stone-600">
        {refCurve.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-ocean-600 rounded" />
            Native
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-clay-600 rounded" />
          You
        </span>
      </figcaption>
    </figure>
  )
}
