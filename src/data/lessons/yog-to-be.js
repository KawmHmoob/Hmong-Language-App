// Standalone lesson: "yog" — the Hmong verb "to be".
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const yogToBe = {
  id: 'foundations-yog-to-be',
  title: 'Yog — To Be',
  summary: 'How "yog" links a noun to what it is, and when you can leave it out.',
  vocab: 'yog-to-be',
  steps: [
    {
      id: 'foundations-yog-to-be-intro',
      kind: 'intro',
      title: 'How "yog" works',
      body: [
        '"Yog" is the Hmong verb "to be". It links one noun to another — "I am a teacher", "this is a dog". Unlike English, it is generally not used before adjectives.',
        'Learn "yog" as "equals," not as English "to be" everywhere: "Kuv yog Hmoob" (I am Hmong) works because both sides are nouns. For being somewhere, Hmong uses "nyob" instead — "Kuv nyob hauv tsev" (I am at home) — and adjectives stand on their own with no "to be" at all.',
      ],
    },
    {
      id: 'foundations-yog-to-be-examples',
      kind: 'examples',
      title: 'Using "yog"',
      intro: 'Read each sentence aloud.',
      items: [
        { hmong: 'Kuv yog', english: 'I am', note: '"Kuv yog Hmoob" = I am Hmong.' },
        { hmong: 'Koj yog', english: 'You are', note: 'Pairs naturally with "puas" questions: "Koj puas yog…?" (Are you…?)' },
        { hmong: 'Nws yog', english: 'He / she is', note: 'One pronoun covers he, she, and it.' },
        { hmong: 'Tsis yog', english: 'is not / no', note: '"Tsis" is the general negator — it works on other verbs too.' },
        { hmong: 'Puas yog?', english: 'Is it? / Right?', note: 'Tacked on at the end of a sentence it works like "…right?"' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-yog-to-be-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'How do you say "is not"?',
      options: ['Tsis yog', 'Puas yog', 'Kuv yog', 'Nws yog'],
      answer: 'Tsis yog',
    },*/
    {
      id: 'foundations-yog-to-be-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
