// Sample words for the tone drill quiz.
//
// Tone names are NOT written here — they're DERIVED from each word's final
// letter using the `tones` data in reference.js. In RPA the last letter of a
// syllable IS the tone marker (b j v s g m d), or absent for the mid tone, so
// the word itself already carries the answer.
//
// Why derive: these names used to be hardcoded and drifted out of sync when the
// tones were renamed — the drill still said "Mid-rising" and "Mid-low breathy"
// while the lessons taught "Rising" and "Mid-Falling with Air". Now a rename in
// reference.js updates the drill automatically. See notes/49.
//
// NOTE: the word list is starter examples — verify with a native speaker and
// expand for better variety.

import { tones } from './reference.js'

const NAME_BY_MARKER = Object.fromEntries(tones.map((t) => [t.marker, t.name]))
const MARKERS = new Set(tones.map((t) => t.marker).filter(Boolean))

// The tone name for a written syllable, from its final letter.
export function toneOf(word) {
  const last = word.slice(-1).toLowerCase()
  return MARKERS.has(last) ? NAME_BY_MARKER[last] : NAME_BY_MARKER['']
}

const words = [
  // -b
  'pob', 'kab', 'lub', 'tub', 'ntab',
  // -j
  'poj', 'koj', 'niaj', 'txuj',
  // -v
  'pov', 'kuv', 'txiv', 'nrov',
  // no marker (mid)
  'po', 'hu', 'li', 'ua',
  // -s
  'pos', 'mos', 'tsis', 'nias',
  // -g
  'pog', 'mog', 'leeg', 'sawg',
  // -m
  'pom', 'mam', 'twm', 'hom',
  // -d  (rare in modern Hmong)
  'pod',
]

export const toneDrillWords = words.map((word) => ({ word, tone: toneOf(word) }))
