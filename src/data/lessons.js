// Structured lesson model: Units → Lessons → Steps.
//
// Step kinds (v1):
//   - 'intro'      { title, body: string[] }                       // explanation paragraphs
//   - 'examples'   { title, intro?, items: [{ hmong, english, note? }] }
//   - 'practice'   { title, prompt, options: string[], answer }    // single self-check MCQ
//   - 'mini-quiz'  { title, quizId }                               // hands off to /quiz/:quizId
//
// Optional `tier: 'free' | 'pro'` on a Unit or Lesson gates it behind the paywall.
// Lesson tier overrides unit tier. Both default to 'free' when omitted.
// See notes/14-paywall-and-supabase.md.
//
// IDs must be globally unique across the app (used as progress keys).
// To add a new unit: copy the Foundations entry below, change ids, and append to `units`.

export const units = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'Start here. Pronouns, basic verbs, and how Hmong sentences hold together.',
    lessons: [
      {
        id: 'foundations-pronouns',
        title: 'Pronouns',
        summary: 'Singular, dual, and plural — Hmong marks all three.',
        steps: [
          {
            id: 'foundations-pronouns-intro',
            kind: 'intro',
            title: 'How Hmong pronouns work',
            body: [
              'Hmong pronouns mark three numbers: singular (one person), dual (exactly two people), and plural (three or more). English collapses dual into plural — Hmong does not.',
              'Pronouns do not change for case. The same word is used whether the pronoun is the subject, object, or possessor. "Kuv" means "I", "me", and "my" depending on position in the sentence.',
              'In this lesson you will see all seven core pronouns and learn the distinction between "wb" (we two) and "peb" (we, three or more). Getting this distinction right is one of the first things native speakers notice.',
            ],
          },
          {
            id: 'foundations-pronouns-examples',
            kind: 'examples',
            title: 'The seven core pronouns',
            intro: 'Read each row aloud. Notice how dual forms (wb, neb) sit between singular and plural.',
            items: [
              { hmong: 'Kuv', english: 'I / me / my', note: 'Singular' },
              { hmong: 'Koj', english: 'You', note: 'Singular' },
              { hmong: 'Nws', english: 'He / she / it', note: 'Singular, no gender' },
              { hmong: 'Wb', english: 'We two', note: 'Dual — exactly two people including the speaker' },
              { hmong: 'Neb', english: 'You two', note: 'Dual — exactly two listeners' },
              { hmong: 'Peb', english: 'We (3+)', note: 'Plural' },
              { hmong: 'Nej', english: 'You (3+)', note: 'Plural' },
              { hmong: 'Lawv', english: 'They', note: 'Plural' },
            ],
          },
          {
            id: 'foundations-pronouns-practice',
            kind: 'practice',
            title: 'Quick check',
            prompt: 'You and one friend are walking together. Which pronoun would you use for "we"?',
            options: ['Kuv', 'Wb', 'Peb', 'Lawv'],
            answer: 'Wb',
          },
          {
            id: 'foundations-pronouns-quiz',
            kind: 'mini-quiz',
            title: 'Pronouns mini-quiz',
            quizId: 'grammar-pronouns',
          },
        ],
      },

      // Lesson 2

      {

        id: 'foundations-consonants',
        title: 'Singular Consonants - Cov Tsiaj Ntawv Niam | Pronounciation',
        summary: 'Main singular consonants of Hmong & Pronounceiation',
        steps: [
          {
            id: 'foundations--singular-consontants-intro',
            kind: 'intro',
            title: 'How Singular Hmong consonants work',
            body: [
              'Hmong has 18 consonants in the language that are used to '
            ],
          },
          {
            id: 'foundations-pronouns-examples',
            kind: 'examples',
            title: 'The seven core pronouns',
            intro: 'Read each row aloud. Notice how dual forms (wb, neb) sit between singular and plural.',
            items: [
              { hmong: 'Kuv', english: 'I / me / my', note: 'Singular' },
              { hmong: 'Koj', english: 'You', note: 'Singular' },
              { hmong: 'Nws', english: 'He / she / it', note: 'Singular, no gender' },
              { hmong: 'Wb', english: 'We two', note: 'Dual — exactly two people including the speaker' },
              { hmong: 'Neb', english: 'You two', note: 'Dual — exactly two listeners' },
              { hmong: 'Peb', english: 'We (3+)', note: 'Plural' },
              { hmong: 'Nej', english: 'You (3+)', note: 'Plural' },
              { hmong: 'Lawv', english: 'They', note: 'Plural' },
            ],
          },
          {
            id: 'foundations-pronouns-practice',
            kind: 'practice',
            title: 'Quick check',
            prompt: 'You and one friend are walking together. Which pronoun would you use for "we"?',
            options: ['Kuv', 'Wb', 'Peb', 'Lawv'],
            answer: 'Wb',
          },
          {
            id: 'foundations-pronouns-quiz',
            kind: 'mini-quiz',
            title: 'Pronouns mini-quiz',
            quizId: 'grammar-pronouns',
          },
        ],

      }
    ],
  },
]

export function getUnit(unitId) {
  return units.find((u) => u.id === unitId) || null
}

export function getLesson(unitId, lessonId) {
  const unit = getUnit(unitId)
  if (!unit) return null
  return unit.lessons.find((l) => l.id === lessonId) || null
}

export function allStepIds(lesson) {
  return lesson.steps.map((s) => s.id)
}

export function lessonProgress(lesson, completedSteps) {
  const ids = allStepIds(lesson)
  if (ids.length === 0) return { done: 0, total: 0, ratio: 0, complete: true }
  const done = ids.filter((id) => completedSteps.includes(id)).length
  return { done, total: ids.length, ratio: done / ids.length, complete: done === ids.length }
}
