// YIN pitch detection + contour extraction.
//
// F0 = how fast the voice repeats itself. YIN finds the repeat period by
// checking, for each candidate lag τ, how different the signal is from itself
// shifted by τ. Smallest difference = the period; F0 = rate / τ.
//
// It's autocorrelation plus three fixes (cumulative-mean normalization,
// absolute threshold, parabolic interpolation) that between them kill most
// octave errors. See instructions/f0-and-tone-scoring.md Part 3.

// Human speech F0 range. Bounding the lag search to this window isn't just
// speed — it makes octave errors OUTSIDE the human range structurally
// impossible. Hmong sits comfortably inside 75–350 Hz.
const F0_MIN = 75
const F0_MAX = 350

// Step 1 — squared difference of the frame against itself at each lag.
function differenceFunction(frame, maxLag) {
  const d = new Float32Array(maxLag)
  for (let tau = 1; tau < maxLag; tau++) {
    let sum = 0
    for (let i = 0; i + tau < frame.length; i++) {
      const delta = frame[i] - frame[i + tau]
      sum += delta * delta
    }
    d[tau] = sum
  }
  return d
}

// Step 2 — the fix that separates YIN from plain autocorrelation. Divide each
// value by the running mean of everything before it, so "near zero" means
// "much better than average" — scale-free and comparable across lags. Without
// this you pick tiny lags and report pitch octaves too high.
function cumulativeMeanNormalized(d) {
  const cmnd = new Float32Array(d.length)
  cmnd[0] = 1
  let runningSum = 0
  for (let tau = 1; tau < d.length; tau++) {
    runningSum += d[tau]
    cmnd[tau] = runningSum === 0 ? 1 : (d[tau] * tau) / runningSum
  }
  return cmnd
}

// Step 4 — τ is an integer, so F0 is quantized into a staircase. Fit a parabola
// through the three points around the dip for a sub-sample period estimate.
function parabolicMin(c, tau) {
  if (tau <= 0 || tau >= c.length - 1) return tau
  const a = c[tau - 1]
  const b = c[tau]
  const g = c[tau + 1]
  const denom = 2 * (2 * b - g - a)
  return denom === 0 ? tau : tau + (g - a) / denom
}

// One frame → { f0, confidence }. f0 = 0 means unvoiced (no periodic signal).
export function yin(frame, rate, threshold = 0.15) {
  const minLag = Math.floor(rate / F0_MAX)
  const maxLag = Math.floor(rate / F0_MIN)
  if (frame.length < maxLag) return { f0: 0, confidence: 0 }

  const d = differenceFunction(frame, maxLag)
  const cmnd = cumulativeMeanNormalized(d)

  // Step 3 — take the FIRST lag under threshold, not the global minimum.
  // Later dips are harmonics; a global min sometimes prefers one and halves
  // the pitch. Walk down to the local minimum once under threshold.
  for (let tau = minLag; tau < maxLag; tau++) {
    if (cmnd[tau] < threshold) {
      let t = tau
      while (t + 1 < maxLag && cmnd[t + 1] < cmnd[t]) t++
      const period = parabolicMin(cmnd, t)
      return { f0: rate / period, confidence: 1 - cmnd[t] }
    }
  }
  return { f0: 0, confidence: 0 }
}

// Frame the whole signal → [{ t, f0 }] for voiced frames only.
// 45 ms window (fits 2+ cycles of the lowest pitch), 10 ms hop (100 points/sec).
export function extractContour(samples, rate, { minConfidence = 0.5 } = {}) {
  const WINDOW = Math.round(0.045 * rate)
  const HOP = Math.round(0.01 * rate)
  const points = []

  for (let i = 0; i + WINDOW <= samples.length; i += HOP) {
    const frame = samples.subarray(i, i + WINDOW) // view, not copy

    // Energy gate — YIN on silence is wasted work and can confidently
    // "detect" room noise. RMS floor first.
    let energy = 0
    for (let j = 0; j < frame.length; j++) energy += frame[j] * frame[j]
    if (Math.sqrt(energy / frame.length) < 0.01) continue

    const { f0, confidence } = yin(frame, rate)
    if (f0 > 0 && confidence >= minConfidence) {
      points.push({ t: i / rate, f0 })
    }
  }
  return points
}

// 3-point median filter — kills isolated single-frame octave jumps while
// preserving real contour movement (a mean filter would smear the movement).
export function medianSmooth(points, k = 3) {
  if (points.length < k) return points
  const half = Math.floor(k / 2)
  return points.map((p, i) => {
    const win = points
      .slice(Math.max(0, i - half), i + half + 1)
      .map((x) => x.f0)
      .sort((a, b) => a - b)
    return { t: p.t, f0: win[Math.floor(win.length / 2)] }
  })
}

// Hz → semitones relative to THIS speaker's own median. The step that makes
// cross-speaker (and cross-gender) scoring possible: a 110 Hz voice and a
// 220 Hz voice producing the same tone shape now produce the same curve.
// Median, not mean — one octave outlier would shift the whole curve.
export function normalizeContour(points) {
  if (points.length === 0) return []
  const median = [...points.map((p) => p.f0)].sort((a, b) => a - b)[
    Math.floor(points.length / 2)
  ]
  return points.map((p) => ({
    t: p.t,
    st: 12 * Math.log2(p.f0 / median),
  }))
}
