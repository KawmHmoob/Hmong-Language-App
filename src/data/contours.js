// Pre-extracted F0 contours for the reference recordings, keyed by audio path.
//
// Populated by scripts/audio/contours.mjs (run offline — never extract F0 in
// the browser for the reference; do it once, store the array). Shape:
//   { "<audio path>": { rate, points: [[t, f0], …] } }
//
// Empty until you run the script. scoreTake() handles a missing contour by
// showing the learner's own curve with no comparison. See
// instructions/f0-and-tone-scoring.md Part 8.

import contours from './contours.json'

// Audio paths appear in two forms across the app: absolute ('/assets/audio/…')
// on speak phrases and alphabet, bare ('vocabulary/…') on wired vocab. Match on
// the trailing filename so either resolves.
const byFilename = new Map()
for (const [path, data] of Object.entries(contours)) {
  byFilename.set(path.split('/').pop(), data)
}

export function getContour(audioPath) {
  if (!audioPath) return null
  const hit = contours[audioPath] || byFilename.get(audioPath.split('/').pop())
  return hit?.points || null
}
