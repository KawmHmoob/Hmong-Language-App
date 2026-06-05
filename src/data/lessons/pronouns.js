// Standalone lesson: the seven core Hmong pronouns.
// Covers singular, dual, and plural — a number distinction English doesn't make.

export const pronouns = {
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
}
