// Word families — Speak practice built on shared rimes.
//
// PLACEHOLDER / BAREBONES. The data shape and the screen exist; the recording,
// comparison, and scoring do NOT. See notes/46 and
// notes/future-implementations/01-pronunciation-dataset.md for the real plan.
//
// THE IDEA
// A "family" is a set of words that share the same ending sound (rime), so the
// learner drills one contrast at a time instead of random words. Because every
// Hmong word is consonant + vowel + tone, you can hold two pieces steady and
// vary the third:
//
//   kind: 'vowel'      → same vowel + tone, vary the CONSONANT   (da, ma, pa)
//   kind: 'tone'       → same consonant + vowel, vary the TONE   (pob, poj, pov…)
//   kind: 'consonant'  → same consonant, vary vowel/tone
//
// THE EVENTUAL FLOW (not built yet)
//   hear the reference → record yourself → compare → score
//   ≥ PASS_SCORE  → advance to the next word
//   below         → try again
// This is meant to replace the generic mini-quiz at the end of alphabet
// lessons: a speaking task instead of a multiple-choice one.

// Score a learner must beat to advance. Tuning this is a Phase-2 job — it means
// nothing until real scoring exists (notes/19 covers calibrating it honestly).
export const PASS_SCORE = 80

import { consonantGroups } from './reference.js'

// Consonant drills — one per consonant type (single / double / triple /
// quadruple). DERIVED from `consonantGroups` in reference.js, so each drill
// picks up its letters AND their reference recordings automatically; record a
// new consonant and it appears here with no edit. See notes/50.
//
// These replace the `mini-quiz` step the consonant lessons used to end on: a
// multiple-choice question can't show you can *say* a consonant.
const consonantFamilies = consonantGroups.map((g) => ({
  id: `family-consonant-${g.id}`,
  kind: 'consonant',
  focus: g.id,
  // g.title is like 'Single | Cov Tsiaj Ntawv Txiv Tab' — keep the Hmong half.
  title: `${g.title.split('|')[0].trim()} consonants`,
  description: `Say each ${g.id} consonant. ${g.blurb} Listen first, then record yourself.`,
  pattern: g.blurb,
  words: g.items.map((c) => ({
    id: `family-consonant-${c.letter}`,
    hmong: c.letter,
    english: c.sound || '',
    audio: c.audio || '',
    // A bare consonant has no vowel/tone — the breakdown is skipped for these.
  })),
}))

export const wordFamilies = [
  ...consonantFamilies,
  {
    id: 'family-vowel-a',
    kind: 'vowel',
    focus: 'a',
    title: 'The “a” family',
    description:
      'Words that share the same ending sound: a consonant + “a”, with no tone letter (the mid tone). Only the first sound changes.',
    pattern: 'consonant + a + (no tone)',
    // Each word carries its own breakdown so the screen can show the
    // consonant + vowel + tone split from the Foundations lesson.
    // `audio` = the native reference recording (none yet — see audio-files.md).
    // `english` left blank where the meaning isn't confirmed.
    words: [
      { id: 'family-a-da', hmong: 'da', consonant: 'd', vowel: 'a', tone: '', english: '', audio: '' }, // TODO-VERIFY: meaning of "da"
      { id: 'family-a-ma', hmong: 'ma', consonant: 'm', vowel: 'a', tone: '', english: '', audio: '' }, // TODO-VERIFY: meaning of "ma"
      { id: 'family-a-pa', hmong: 'pa', consonant: 'p', vowel: 'a', tone: '', english: '', audio: '' }, // TODO-VERIFY: meaning of "pa"
      // Add more consonant + "a" words here — the more members, the better the drill.
    ],
  },
  // Next families to build (same shape):
  //   - one per vowel: e, i, o, u, w, then the double vowels
  //   - tone families: same syllable across all 8 tones (pob/poj/pov/po/pos/pog/pom/pod)
  //   - consonant families: one consonant across several vowels
]

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getWordFamily(familyId) {
  return wordFamilies.find((f) => f.id === familyId) || null
}

export function familiesByKind(kind) {
  return wordFamilies.filter((f) => f.kind === kind)
}
