// Evaluation set for the tone scorer — the labeled clips it's validated against.
//
// PURPOSE: answer "does the scorer measure tone?" — NOT "where's the pass line"
// (that's calibration, a later job with ~200 real takes). See notes/61 and
// instructions/f0-and-tone-scoring.md Part 10.
//
// ── HOW THIS FILE IS FILLED ─────────────────────────────────────────────────
// The native rows are DERIVED from the real data (reference.js + vocabulary.js),
// so file paths and words can't drift out of sync. Every native clip is
// label:'correct' — the reference set is ground truth by definition.
//
// Claude CANNOT hear audio, so it never labels quality. Learner rows are
// 'PLACEHOLDER' until YOU record + listen. Inventing 'flat'/'mediocre' would be
// fabricating the exact ground truth the scorer is measured against.
//
// SCOPE (this pass): single tones, single vowels, greetings/farewells,
// adjectives. A focused placeholder set — expand later by adding sources below.

import { tones, singleVowels } from './reference.js'
import { getCategory } from './vocabulary.js'

export const SPEAKERS = {
  'native-f': { who: 'Native speaker', voice: 'female, middle-aged' },
  'me-m': { who: 'You', voice: 'male, young adult' },
}

// Small, OBJECTIVE label vocabulary — a label you can defend by pointing at the
// recording, not a vibe.
export const LABELS = {
  correct: 'Accurate — the target as it should sound.',
  flat: 'No pitch movement — the classic English-speaker error.',
  'wrong-tone': 'A different tone than the target (e.g. pob for poj).',
  'right-tone-slow': 'Correct contour, drawn out — tests DTW ignores tempo.',
  mediocre: 'Recognizable but off — approaching it without nailing it.',
}

// ── Native rows, derived per source ─────────────────────────────────────────

// The `po` minimal-pair family — same consonant+vowel, all 8 tones. The single
// highest-value eval content: because they differ ONLY in tone, scoring each
// against every other yields a clean confusion matrix.
const toneRows = tones.map((t) => ({
  id: `eval-tone-${t.marker || 'none'}`,
  file: t.audio,
  hmong: t.example?.split(' ')[0] || `po${t.marker}`, // 'pob (ball)' → 'pob'
  english: t.name,
  source: 'tone',
  speaker: 'native-f',
  label: 'correct',
}))

// Single vowels — one sustained vowel each. No tone contrast, but a good check
// that the pipeline handles steady pitches and open vowels cleanly.
const vowelRows = singleVowels.map((v) => ({
  id: `eval-vowel-${v.letter}`,
  file: v.audio,
  hmong: v.letter,
  english: v.sound,
  source: 'vowel',
  speaker: 'native-f',
  label: 'correct',
}))

// Words from a wired vocabulary category → native rows. Only words that
// actually have a recording; audioFile is a bare path, absolutize it the way
// useAudio does.
function categoryRows(categoryId, source) {
  const cat = getCategory(categoryId)
  if (!cat) return []
  return cat.words
    .filter((w) => w.audioFile)
    .map((w) => ({
      id: `eval-${source}-${w.id}`,
      file: w.audioFile.startsWith('/') ? w.audioFile : `/assets/audio/${w.audioFile}`,
      hmong: w.hmongRPA,
      english: w.english,
      source,
      speaker: 'native-f',
      label: 'correct',
    }))
}

const greetingRows = categoryRows('greetings', 'greeting')
const adjectiveRows = categoryRows('descriptions', 'adjective')

const nativeRows = [...toneRows, ...vowelRows, ...greetingRows, ...adjectiveRows]

// ── Learner rows — PLACEHOLDER until you record them ────────────────────────
// The scarce, high-value data is the deliberate ERRORS. Start with the po
// family since tone is the whole point. Set `file` + change `label` once
// recorded. Add greeting/adjective takes the same way.
const myRows = [
  { id: 'eval-me-pob', file: '', hmong: 'pob', english: 'High', source: 'tone', speaker: 'me-m', label: 'PLACEHOLDER' },
  { id: 'eval-me-poj', file: '', hmong: 'poj', english: 'High-falling', source: 'tone', speaker: 'me-m', label: 'PLACEHOLDER' },
  { id: 'eval-me-pov', file: '', hmong: 'pov', english: 'Rising', source: 'tone', speaker: 'me-m', label: 'PLACEHOLDER' },
  // FLAT: say pob with no pitch movement → should score LOW vs native pob.
  { id: 'eval-me-pob-flat', file: '', hmong: 'pob', english: 'High', source: 'tone', speaker: 'me-m', label: 'PLACEHOLDER' },
  // WRONG-TONE: say pob when target is poj → should score LOW vs native poj.
  { id: 'eval-me-poj-as-pob', file: '', hmong: 'poj', english: 'High-falling', source: 'tone', speaker: 'me-m', label: 'PLACEHOLDER' },
  // RIGHT-TONE-SLOW: correct pov, drawn out → should stay HIGH vs native pov.
  { id: 'eval-me-pov-slow', file: '', hmong: 'pov', english: 'Rising', source: 'tone', speaker: 'me-m', label: 'PLACEHOLDER' },
]

export const evalSet = [...nativeRows, ...myRows]

// Rows ready to score (have a file, real label). The harness skips the rest.
export const scorableEval = evalSet.filter((r) => r.file && r.label !== 'PLACEHOLDER')
