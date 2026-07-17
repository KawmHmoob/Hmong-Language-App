// Import each Lesson from its own file. Each of these files exports ONE Lesson
// — not a Unit. The Unit is composed below.
import { pronouns } from './lessons/pronouns'
import { singularConsonants } from './lessons/singular-consonants'
import { dualConsonants } from './lessons/dual-consonants'
import { tripleConsonants } from './lessons/triple-consonants'
import { quadrupleConsonants } from './lessons/quadruple-consonants'
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

// Structured lesson model: Units → Lessons → Steps.
//
// A Unit is a chapter (e.g. "Foundations"). It contains many Lessons.
// A Lesson is one learnable thing (e.g. "Pronouns"). It contains many Steps.
// A Step is one screen the user sees (intro, examples, practice, mini-quiz).
//
// Step kinds:
//   - 'intro'      { title, body: string[] }
//   - 'examples'   { title, intro?, items: [{ hmong, english, note?, audio? }] }
//                  (consonant lessons use { hmong, hmongExample, englishSound }
//                   instead; the renderer falls through — see notes/28)
//   - 'practice'   { title, prompt, options: string[], answer }
//   - 'mini-quiz'  { title, quizId }
//   - 'reading'    { title, level, intro?, hmong, english, glossary: [{hmong, english}] }
//                  Translation stays hidden until the learner asks — see notes/34.
//
// Optional `tier: 'free' | 'pro'` on a Unit or Lesson gates content behind the
// paywall. Lesson tier overrides unit tier. Both default to 'free'.
//
// Optional `reference: '<tab>'` on a Lesson links it to its cheat sheet in the
// Reference section (e.g. 'grammar'). The lesson player renders a "Cheat sheet"
// link; the table links back with "Learn this". Two doors, same knowledge —
// see notes/34.
//
// IDs must be globally unique across the app — they're used as progress keys.
//
// ──────────────────────────────────────────────────────────────────────────
// To add a new lesson:
//   1. Create src/data/lessons/<slug>.js exporting one Lesson object.
//   2. Import it at the top of this file.
//   3. Add it to the unit's `lessons` array below.
// ──────────────────────────────────────────────────────────────────────────

// The Foundations unit. The Unit declares its own metadata (id, title,
// description) and then lists which Lessons belong to it, in display order.
const foundations = {
  id: 'foundations',
  title: 'Foundations',
  description: 'Start here. Pronouns, basic verbs, and how Hmong sentences hold together.',
  lessons: [
    pronouns,
    singularConsonants,
    dualConsonants,
    tripleConsonants,
    quadrupleConsonants,
    actionVerbs,
    tenseMarkers,
    nounClassifiers,
    pronounsDemonstratives,
    possessivePronouns,
    yogToBe,
    // Drop new Foundations lessons here, in the order you want them shown.
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
export const units = [foundations, conversational, numbersAndTime, readings]

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
