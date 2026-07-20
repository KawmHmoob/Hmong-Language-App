// Self-test for the tone scorer, on SYNTHETIC audio — no recordings needed.
//
// Generates sine tones with known pitch contours and asserts the two
// properties from the guide (Part 7, build step 4):
//   1. a contour scored against ITSELF ≈ 100
//   2. a rising contour vs a falling contour scores clearly lower
//   3. the same shape at a different octave (male vs female) still ≈ 100
//   4. the same shape stretched in time (slow speaker) stays high
//
// If any of these fail, the bug is in yin/toneScore, not in your recordings.
// Run:  node scripts/audio/tone-selftest.mjs

import { extractContour } from '../../src/lib/yin.js'
import { toneScore } from '../../src/lib/toneScore.js'

const RATE = 16000

// Synthesize a sine whose frequency sweeps from f0 → f1 over `dur` seconds.
function sweep(f0, f1, dur, rate = RATE) {
  const n = Math.round(dur * rate)
  const out = new Float32Array(n)
  let phase = 0
  for (let i = 0; i < n; i++) {
    const f = f0 + (f1 - f0) * (i / n)
    phase += (2 * Math.PI * f) / rate
    out[i] = 0.6 * Math.sin(phase)
  }
  return out
}

const contour = (sig) => extractContour(sig, RATE)

let failures = 0
function check(name, cond, detail) {
  const ok = cond
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
  if (!ok) failures++
}

console.log('tone scorer self-test\n')

// A female-ish rising tone: 200 → 260 Hz over 0.5 s
const femaleRise = contour(sweep(200, 260, 0.5))
// The same rise an octave down (male): 100 → 130 Hz
const maleRise = contour(sweep(100, 130, 0.5))
// A falling tone in the female range: 260 → 200 Hz
const femaleFall = contour(sweep(260, 200, 0.5))
// The female rise, spoken slowly: same shape over 0.9 s
const femaleRiseSlow = contour(sweep(200, 260, 0.9))

check('contours are non-empty', femaleRise.length > 5, `${femaleRise.length} pts`)

const self = toneScore(femaleRise, femaleRise).score
check('identical contour ≈ 100', self >= 95, `got ${self}`)

const octave = toneScore(femaleRise, maleRise).score
check('same tone, octave apart ≈ 100 (normalization)', octave >= 85, `got ${octave}`)

const opposite = toneScore(femaleRise, femaleFall).score
// The MARGIN is the real assertion — a rise must score clearly better than its
// reverse. The absolute value is loose on purpose: these are gentle 60 Hz
// synthetic sweeps, and unconstrained DTW can warp two opposite ramps somewhat
// toward each other by aligning their endpoints (guide Part 6). Real Hmong
// tones are sharper and separate wider. If real-world separation ever proves
// too soft, the lever is a Sakoe-Chiba band in dtw() — not a formula change.
check('rise vs fall clearly lower', opposite < 80, `got ${opposite}`)
check(
  'rise beats fall by a clear margin',
  octave - opposite >= 20,
  `same=${octave} vs opposite=${opposite}`
)

const slow = toneScore(femaleRise, femaleRiseSlow).score
check('same shape, spoken slowly stays high (DTW)', slow >= 80, `got ${slow}`)

console.log(
  failures ? `\n${failures} FAILURES — fix the DSP before recording` : '\nall tone-scorer checks pass'
)
process.exit(failures ? 1 : 0)
