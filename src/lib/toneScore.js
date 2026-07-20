// DTW alignment + the tone score.
//
// People speak at different speeds, so comparing two contours index-to-index
// would penalize TIMING as if it were TONE. Dynamic Time Warping finds the
// cheapest way to stretch/compress time to line the two curves up, and returns
// the leftover distance — that residual is the real tone difference.
// See instructions/f0-and-tone-scoring.md Parts 6–7.

import { medianSmooth, normalizeContour } from './yin.js'

// Two rolling rows instead of a full matrix: O(n·m) time, O(m) space.
// Returns the mean-per-step alignment cost (roughly, average semitone error).
export function dtw(a, b) {
  const n = a.length
  const m = b.length
  if (!n || !m) return Infinity

  let prev = new Float64Array(m + 1).fill(Infinity)
  let curr = new Float64Array(m + 1)
  prev[0] = 0

  for (let i = 1; i <= n; i++) {
    curr[0] = Infinity
    for (let j = 1; j <= m; j++) {
      const cost = Math.abs(a[i - 1] - b[j - 1])
      curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1])
    }
    const tmp = prev
    prev = curr
    curr = tmp
  }

  // Normalize by path length so a long phrase isn't penalized for being long.
  return prev[m] / (n + m)
}

// Curve → semitone array, ready for DTW. Exposed so the chart can plot the
// exact same normalized data the score is computed from.
export function toSemitones(contour) {
  return normalizeContour(medianSmooth(contour))
}

// Feel constant. exp(-d/K): 0 st error → 100, ~2 st → 51, ~4 st → 26, never
// negative. K is the ONE knob to tune once real takes exist — bigger K =
// more forgiving. Do not calibrate the pass threshold off this until you have
// a distribution of real scores to look at (guide Part 7 / notes/19).
const SCORE_K = 3

// The minimum voiced length worth judging. Shorter than this and the contour
// is too sparse for DTW to mean anything.
const MIN_POINTS = 5

// Full pipeline: two raw [{t,f0}] contours → { score, ref, user } where
// ref/user are the normalized semitone curves for plotting. Returns null when
// either take is too short (caller shows "say it again", not a fake score).
export function toneScore(refContour, userContour) {
  const ref = toSemitones(refContour)
  const user = toSemitones(userContour)
  if (ref.length < MIN_POINTS || user.length < MIN_POINTS) {
    return { score: null, ref, user, reason: 'too-short' }
  }

  const distance = dtw(
    ref.map((p) => p.st),
    user.map((p) => p.st)
  )
  const raw = 100 * Math.exp(-distance / SCORE_K)
  const score = Math.round(Math.max(0, Math.min(100, raw)))
  return { score, ref, user, distance }
}
