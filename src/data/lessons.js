// Import each Lesson from its own file. Each of these files exports ONE Lesson
// — not a Unit. The Unit is composed below.
import { pronouns } from './lessons/pronouns'
import { singularConsonants } from './lessons/singular-consonants'
import { dualConsonants } from './lessons/dual-consonants'
import { tripleConsonants } from './lessons/triple-consonants'
import { quadrupleConsonants } from './lessons/quadruple-consonants'
import { hmongWordStructure } from './lessons/hmong-word-structure'
import { SingleVowels } from './lessons/vowels'
import { DoubleVowels } from './lessons/double-vowels'
import { Tones } from './lessons/tones'
import { sibReciprocals } from './lessons/sib-reciprocals'
import { greetingsFarewells } from './lessons/greetings-farewells'
import { actionVerbs } from './lessons/action-verbs'
import { nounClassifiers } from './lessons/noun-classifiers'
import { pronounsDemonstratives } from './lessons/pronouns-demonstratives'
import { possessivePronouns } from './lessons/possessive-pronouns'
import { yogToBe } from './lessons/yog-to-be'
import { tenseMarkers } from './lessons/tense-markers'
import { numbers } from './lessons/numbers'
import { howMuch } from './lessons/how-much'
import { time } from './lessons/time'
import { readingMim } from './lessons/reading-mim'
import { readingGarden } from './lessons/reading-garden'
import { readingSchool } from './lessons/reading-school'
// import {vowels} from './lessons/vowels'

// Structured lesson model: Units → Lessons → Steps.
//
// A Unit is a chapter (e.g. "Foundations"). It contains many Lessons.
// A Lesson is one learnable thing (e.g. "Pronouns"). It contains many Steps.
// A Step is one screen the user sees (intro, examples, quiz, reading…).
//
// Step kinds:
//   - 'intro'      { title, body: string[] }
//   - 'examples'   { title, intro?, items: [{ hmong, english, note?, audio? }] }
//                  (consonant lessons use { hmong, hmongExample, englishSound }
//                   instead; the renderer falls through — see notes/28)
//                  When the lesson has `vocab`, this step also shows the "Study
//                  the words" button that unlocks the quiz step.
//   - 'quiz'       { title? }  — requires `vocab` on the lesson. The lesson's
//                  final step: the vocab-<vocab> quiz, LOCKED until the learner
//                  has studied (study → then test). See notes/37.
//   - 'letters'    { title, intro?, items: [{ letter, sound?, audio? }] }
//                  The letter tile grid — renders the SAME <LetterGrid> the
//                  Reference page uses. For consonants/vowels. See notes/47.
//   - 'tones'      { title, intro?, items: [{ marker, name, description, example2, audio }] }
//                  The tone rows — the SAME <ToneRows> as Reference. See notes/47.
//                  (Do NOT push letters/tones through 'examples' — that layout
//                   is for word lists and mangles them.)
//   - 'reading'    { title, level, intro?, hmong, english, glossary: [{hmong, english}] }
//                  Translation stays hidden until the learner asks — see notes/34.
//   - 'practice'   { title, prompt, options: string[], answer }
//                  Only readings still use this (comprehension check). Vocab
//                  lessons' old quick-checks are commented out — see notes/37.
//   - 'mini-quiz'  { title, quizId }  — links out to an existing quiz.
//   - 'speak-drill' { title, familyId, blurb? }
//                  Hands off to a Speak word-family drill (/speak/family/:id).
//                  The alphabet lessons end on this instead of a mini-quiz —
//                  you can't prove you can SAY a consonant by clicking a
//                  multiple-choice option. See notes/50.
//
// Optional `tier: 'free' | 'pro'` on a Unit or Lesson gates content behind the
// paywall. Lesson tier overrides unit tier. Both default to 'free'.
//
// Optional `reference: '<tab>'` on a Lesson links it to its cheat sheet in the
// Reference section (e.g. 'grammar'). The lesson player renders a "Cheat sheet"
// link; the table links back with "Learn this". Two doors, same knowledge —
// see notes/34.
//
// Optional `vocab: '<categoryId>'` on a Lesson names the vocabulary category it
// teaches (an id from src/data/vocabulary.js). It drives the study→quiz flow:
// the examples step gets a "Study the words" button (→ the word bank), and the
// final `quiz` step stays locked until the learner studies. The lesson explains;
// Words drills; the quiz tests. Don't re-list the words inside the lesson —
// that's the redundancy this removes. See notes/37.
//
// IDs must be globally unique across the app — they're used as progress keys.
//
// ──────────────────────────────────────────────────────────────────────────
// To add a new lesson:
//   1. Create src/data/lessons/<slug>.js exporting one Lesson object.
//   2. Import it at the top of this file.
//   3. Add it to the unit's `lessons` array below.
// ──────────────────────────────────────────────────────────────────────────

// UNIT LAYOUT — see notes/46.
//
// FOUNDATIONS = the alphabet. A Hmong word is consonant + vowel + tone, so
// Foundations teaches that formula and then each of its three pieces. That's
// what a beginner needs before anything else, and it's the unit's whole job.
//
// Everything that is NOT alphabet work lives in its own unit — grammar first.
// That's what keeps Foundations from becoming the dumping ground it was (it
// held all 14 lessons, grammar included).
//
// Order inside Foundations follows the formula: structure → consonants →
// vowels → tones. Tones sits last because it's the hardest and builds on the
// other two; expect it to grow several contrast lessons.

// A unit may declare `groups` instead of a flat `lessons` array. Groups are a
// DISPLAY concept — headed sections inside one unit — so a long unit reads as
// a curriculum instead of a wall of cards. `lessons` is derived from them (see
// withLessons below), so progress, routing, and the Learn hub are unchanged.
const foundations = {
  id: 'foundations',
  title: 'Foundations',
  description:
    'Start here. How a Hmong word is built — consonant + vowel + tone — and each piece in turn.',
  groups: [
    {
      id: 'word-structure',
      title: 'How Hmong Words Work',
      blurb: 'The formula everything else builds on.',
      lessons: [hmongWordStructure],
    },
    {
      id: 'consonants',
      title: 'Consonants',
      blurb: 'Cov tsiaj ntawv — the sound a word starts with.',
      lessons: [singularConsonants, dualConsonants, tripleConsonants, quadrupleConsonants],
    },
    {
      id: 'vowels',
      title: 'Vowels',
      blurb: 'Cov tab — the middle of the syllable.',
      lessons: [SingleVowels, DoubleVowels],
    },
    {
      id: 'tones',
      title: 'Tones',
      blurb: 'Cov cim — the pitch that changes meaning. The hardest piece.',
      lessons: [
        Tones,
        // Add contrast lessons here: high vs high-falling, the breathy -g,
        // the creaky -m, minimal-pair drills. One idea per lesson.
      ],
    },
  ],
}

// The Grammar unit — how words COMBINE. Not alphabet work, so not Foundations.
const grammarUnit = {
  id: 'grammar',
  title: 'Grammar',
  description: 'Pronouns, verbs, tense markers, and classifiers — how Hmong sentences hold together.',
  lessons: [
    pronouns,
    actionVerbs,
    tenseMarkers,
    nounClassifiers,
    pronounsDemonstratives,
    possessivePronouns,
    yogToBe,
  ],
}

// The Conversational unit. Everyday vocabulary and phrases.
const conversational = {
  id: 'conversational',
  title: 'Conversational',
  description: 'Everyday words and phrases — greetings, reciprocals, and more.',
  lessons: [
    greetingsFarewells,
    sibReciprocals,
    // Drop new Conversational lessons here, in the order you want them shown.
  ],
}

// The Numbers & Time unit. Counting, prices, and telling time.
const numbersAndTime = {
  id: 'numbers-and-time',
  title: 'Numbers & Time',
  description: 'Counting, asking how much, and telling time in Hmong.',
  lessons: [
    numbers,
    howMuch,
    time,
    // Drop new Numbers & Time lessons here, in the order you want them shown.
  ],
}

// The Readings unit. Connected prose — the only place words appear in context.
// Ordered by difficulty (the `level` on each reading step).
const readings = {
  id: 'readings',
  title: 'Readings',
  description: 'Short passages to read for meaning. Hmong first, translation only when you ask.',
  lessons: [
    readingMim,
    readingGarden,
    readingSchool,
    // Drop new readings here, easiest first.
  ],
}

// `units` is the top-level export consumed by the Learn page and the lesson
// player. Add additional units here as you build them — same pattern: import
// the lessons, declare the unit, list it.
// Normalize a unit so EVERY unit has a flat `lessons` array, whether it was
// declared with `groups` or not. This is the compatibility seam: all existing
// code (progress, getLesson, the Learn hub, allStepIds) keeps reading
// `unit.lessons` and never has to know about groups.
function withLessons(unit) {
  if (!unit.groups) return unit
  return { ...unit, lessons: unit.groups.flatMap((g) => g.lessons) }
}

export const units = [
  foundations,     // the alphabet: word structure → consonants → vowels → tones
  grammarUnit,     // how words combine
  conversational,
  numbersAndTime,
  readings,
].map(withLessons)

// ──────────────────────────────────────────────────────────────────────────
// Helpers — pure read-only functions over the data above.
// Consumers (Lesson.jsx, Learn.jsx) call these instead of poking the data
// directly. That way, the data shape can change without touching every page.
// ──────────────────────────────────────────────────────────────────────────

// Resolve a Unit by its id. Returns null if not found.
export function getUnit(unitId) {
  return units.find((u) => u.id === unitId) || null
}

// Resolve a Lesson by its (unitId, lessonId) pair. Two-step lookup because
// lessons live inside units.
export function getLesson(unitId, lessonId) {
  const unit = getUnit(unitId)
  if (!unit) return null
  return unit.lessons.find((l) => l.id === lessonId) || null
}

// Return just the array of step ids for a lesson. Used to compare against the
// user's completedSteps when computing per-lesson progress.
export function allStepIds(lesson) {
  return lesson.steps.map((s) => s.id)
}

// Compute progress numbers for a single lesson, given the user's completedSteps.
// Returns { done, total, ratio, complete } — used to render the progress bar
// and "✓ Done" badge on the Learn page.
export function lessonProgress(lesson, completedSteps) {
  const ids = allStepIds(lesson)
  if (ids.length === 0) return { done: 0, total: 0, ratio: 0, complete: true }
  const done = ids.filter((id) => completedSteps.includes(id)).length
  return { done, total: ids.length, ratio: done / ids.length, complete: done === ids.length }
}
