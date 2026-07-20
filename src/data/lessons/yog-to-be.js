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
        '"Yog" is the Hmong verb "to be". Learn it as "equals," not as English "to be" everywhere — it links one noun to another, and it is generally NOT used before an adjective.',
        '> Kuv yog Hmoob. — I am Hmong.',
        'That works because both sides are nouns: "kuv" (I) equals "Hmoob" (Hmong). For being somewhere, Hmong reaches for a different word entirely — "nyob", not "yog":',
        '> Kuv nyob hauv tsev. — I am at home.',
        'And adjectives stand on their own, with no "to be" at all — see the Adjectives lesson for that half of the rule.',

        '## One word, several jobs',
        '"Yog" is one of the most context-dependent words in Hmong. Depending on where it sits, it can carry the sense of "is", "are", or "if":',
        '> Lub no yog lub tsev. — This is the house.',
        '> Peb yog Hmoob. — We are Hmong.',
        '> Tus pojniam yog ib tus neeg zoo. — The woman is a good person.',
        '> Yog koj xav. — If you want.',
        'The first three describe what something IS — its essence, not a temporary condition. The last uses the same word to open a condition instead. Only context tells them apart.',

        'This is genuinely one of the harder words to get a feel for, precisely because it does so much work. The Readings unit is the fastest way to absorb the pattern — seeing "yog" used naturally, again and again, teaches the context better than a rule can.',
      ],
    },
    {
      id: 'foundations-yog-to-be-examples',
      kind: 'examples',
      title: 'Using "yog"',
      intro: 'Read each sentence aloud.',
      items: [
        { hmong: 'Kuv yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-kuv-yog.mp3', english: 'I am', note: '"Kuv yog Hmoob" = I am Hmong.' },
        { hmong: 'Koj yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-koj-yog.mp3', english: 'You are', note: 'Pairs naturally with "puas" questions: "Koj puas yog…?" (Are you…?)' },
        { hmong: 'Nws yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-nws-yog.mp3', english: 'He / she is', note: 'One pronoun covers he, she, and it.' },
        { hmong: 'Tsis yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-tsis-yog.mp3', english: 'is not / no', note: '"Tsis" is the general negator — it works on other verbs too.' },
        { hmong: 'Puas yog?', audio: 'grammar/yog-to-be/hmong-yog-to-be-puas-yog.mp3', english: 'Is it? / Right?', note: 'Tacked on at the end of a sentence it works like "…right?"' },
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
