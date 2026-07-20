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
// The DERIVED letter drills below (consonantFamilies, vowelFamilies) stretch
// those names: they're "say each letter of this type", not a syllable contrast.
// They reuse the kind of the letter they cover — a consonant letter drill is
// `consonant`, a vowel letter drill is `vowel`. Worth knowing before filtering
// on `kind` and expecting only contrast sets.
//
// A fourth kind drills a PATTERN rather than a sound:
//
//   kind: 'phrase'     → same sentence frame, vary the slots (telling the time)
//
// Phrase families have no consonant/vowel/tone breakdown — the unit of practice
// is the whole utterance, so the screen skips the split the letter drills show.
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

import { consonantGroups, vowelGroups } from './reference.js'

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

// Vowel drills — one per vowel type (single / double). Same derivation as the
// consonant families above, from `vowelGroups`, so a newly recorded vowel shows
// up here with no edit.
//
// These exist so the vowel lessons END THE SAME WAY the consonant lessons do.
// Both were alphabet lessons, but the consonant ones moved to a speak-drill
// (notes/50) while the vowel ones were left on the old `mini-quiz` — so the two
// halves of Foundations taught the same kind of thing and then tested it two
// different ways. See notes/60.
//
// Word ids are `family-vowel-<group>-<letter>`, NOT `family-vowel-<letter>`:
// the latter would produce `family-vowel-a`, which is already a family id.
const vowelFamilies = vowelGroups.map((g) => ({
  id: `family-vowel-${g.id}`,
  kind: 'vowel',
  focus: g.id,
  // g.title is like 'Single | Cov Tab' — keep the Hmong half.
  title: `${g.title.split('|')[0].trim()} vowels`,
  description: `Say each ${g.id} vowel. ${g.blurb} Listen first, then record yourself.`,
  pattern: g.blurb,
  words: g.items.map((v) => ({
    id: `family-vowel-${g.id}-${v.letter}`,
    hmong: v.letter,
    english: v.sound || '',
    audio: v.audio || '',
    // A bare vowel has no consonant/tone — the breakdown is skipped for these.
  })),
}))

export const wordFamilies = [
  ...consonantFamilies,
  ...vowelFamilies,
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
  // Telling the time — the SPEAKING counterpart to the time-explained lesson.
  //
  // Why a speak drill instead of another multiple-choice quiz: reading a clock
  // is recognition, saying one is production. A learner can pick "6:30" off a
  // list without being able to produce "rau teev pebcaug sawv ntxov" — the
  // number, the classifier-like "teev", the minute, and the a.m./p.m. tag all
  // have to be assembled in order, out loud. That's the actual skill.
  //
  // Every phrase below is taken from the lesson's own body text, so nothing
  // here is newly authored Hmong. Ordered easiest → hardest: bare hour, then
  // hour + minutes, then + a.m./p.m., then a full sentence.
  {
    id: 'family-time-clock',
    kind: 'phrase',
    focus: 'teev',
    title: 'Telling the time',
    description:
      'Say each time out loud. The order is always hour → “teev” → minutes → a.m./p.m. Listen first, then record yourself.',
    pattern: '[number] teev [minutes] [sawv ntxov / tsaus ntuj]',
    words: [
      { id: 'family-time-4', hmong: 'Plaub teev', english: "4 o'clock", audio: '' },
      { id: 'family-time-2-30', hmong: 'Ob teev pebcaug', english: '2:30', audio: '' },
      { id: 'family-time-2-30-mus', hmong: 'Ob teev mus pebcaug', english: '2:30 (the “mus” variant)', audio: '' },
      // The "thiab" construction — the one case where "feeb" is REQUIRED.
      { id: 'family-time-3-46-thiab', hmong: 'Peb teev thiab plaubcaum rau feeb', english: '3:46 (literally "3 hours and 46 minutes")', audio: '' },
      { id: 'family-time-6-30-am', hmong: 'Rau teev pebcaug sawv ntxov', english: '6:30 a.m.', audio: '' },
      { id: 'family-time-5-25-pm', hmong: 'Tsib teev neesnkaum tsib tsaus ntuj', english: '5:25 p.m.', audio: '' },
      // "Tamsim nov" — matching the lesson's spelling, not my earlier "Tamsim no".
      { id: 'family-time-now-4', hmong: 'Tamsim nov yog plaub teev', english: "It's 4 o'clock now", audio: '' },
      { id: 'family-time-now-4-pm', hmong: 'Tamsim nov yog plaub teev tsuas ntuj', english: "It's 4 p.m. now", audio: '' },
      { id: 'family-time-clock-says', hmong: 'Lub teevsij hais tias nws peb teev mus plaubcaum tsib tsaus ntuj', english: 'The clock says it’s 3:45 p.m.', audio: '' },
    ],
  },
  // Next families to build (same shape):
  //   - one per vowel: e, i, o, u, w, then the double vowels
  //   - tone families: same syllable across all 8 tones (pob/poj/pov/po/pos/pog/pom/pod)
  //   - consonant families: one consonant across several vowels
  //   - more phrase families: greetings, asking a price
]

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getWordFamily(familyId) {
  return wordFamilies.find((f) => f.id === familyId) || null
}

export function familiesByKind(kind) {
  return wordFamilies.filter((f) => f.kind === kind)
}
