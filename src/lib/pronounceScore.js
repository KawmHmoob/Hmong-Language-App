// The one function the UI calls: recorded blob + reference audio → result.
//
// Keeps the DSP (yin/toneScore) unaware of blobs, and keeps the component
// unaware of DSP. See instructions/f0-and-tone-scoring.md.

import { blobToSamples } from './audioSamples.js'
import { extractContour } from './yin.js'
import { toneScore } from './toneScore.js'
import { getContour } from '../data/contours.js'

// Reference contours resolved to a {t,f0}[] once, then cached for the session.
// Preference order:
//   1. pre-extracted in contours.json (fast path, if the offline script ran)
//   2. computed from the reference mp3 in-browser, memoized
//
// The guide recommends offline pre-extraction, but with no ffmpeg/packages
// available, lazy browser extraction is the pragmatic ship: F0 on a ~1s clip
// is a few ms, and it's cached, so it happens at most once per phrase/session.
const refCache = new Map()

async function resolveReference(audioPath) {
  if (!audioPath) return []

  const stored = getContour(audioPath)
  if (stored) return stored.map(([t, f0]) => ({ t, f0 }))

  if (refCache.has(audioPath)) return refCache.get(audioPath)

  try {
    const url = audioPath.startsWith('/') ? audioPath : `/assets/audio/${audioPath}`
    const blob = await fetch(url).then((r) => r.blob())
    const { samples, rate } = await blobToSamples(blob)
    const contour = extractContour(samples, rate)
    refCache.set(audioPath, contour)
    return contour
  } catch {
    refCache.set(audioPath, []) // don't retry a broken path every take
    return []
  }
}

// blob = the learner's take. audioPath = the reference recording (phrase.audio).
export async function scoreTake(blob, audioPath) {
  const { samples, rate } = await blobToSamples(blob)
  const userContour = extractContour(samples, rate)

  if (userContour.length < 5) {
    return { score: null, ref: [], user: [], reason: 'no-voice' }
  }

  const ref = await resolveReference(audioPath)
  if (ref.length < 5) {
    // No reference — return the learner's own curve for display, no score.
    const { user } = toneScore(userContour, userContour)
    return { score: null, ref: [], user, reason: 'no-reference' }
  }

  return toneScore(ref, userContour)
}
