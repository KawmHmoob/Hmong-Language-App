// Standalone lesson: Hmong possessive pronouns.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const possessivePronouns = {
  id: 'foundations-possessive-pronouns',
  title: 'Possessive Pronouns',
  summary: 'How to say my, your, his, her, and our in Hmong.',
  vocab: 'pronouns',
  steps: [
    {
      id: 'foundations-possessive-pronouns-intro',
      kind: 'intro',
      title: 'How possessives work',
      body: [
        'Hmong does not have separate possessive words like English "my" or "your". The plain pronoun is used, and possession is shown by word order (and sometimes a linking word).',
        'The everyday pattern is pronoun + classifier + noun: "kuv lub tsev" = my house, "koj tus dev" = your dog. The classifier matches the noun being owned, not the owner — so it is "lub" for the house no matter whose house it is.',
      ],
    },
    {
      id: 'foundations-possessive-pronouns-examples',
      kind: 'examples',
      title: 'Showing possession',
      intro: 'Read each phrase aloud.',
      items: [
        { hmong: 'Kuv', audio: 'grammar/pronouns/hmong-pronouns-kuv.mp3', english: 'my', note: '"Kuv lub tsev" = my house — pronoun + classifier + noun.' },
        { hmong: 'Koj', audio: 'grammar/pronouns/hmong-pronouns-koj.mp3', english: 'your', note: '"Koj tus dev" = your dog.' },
        { hmong: 'Nws', audio: 'grammar/pronouns/hmong-pronouns-nws.mp3', english: 'his / her / its', note: '"Nws phau ntawv" = his/her book — one word covers all three.' },
        { hmong: 'Peb', audio: 'grammar/pronouns/hmong-pronouns-peb.mp3', english: 'our', note: 'Also the number three — context separates them.' },
        { hmong: 'Lawv', audio: 'grammar/pronouns/hmong-pronouns-lawv.mp3', english: 'their', note: '"Lawv lub tsev" = their house.' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-possessive-pronouns-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which word means "their"?',
      options: ['Lawv', 'Peb', 'Koj', 'Nws'],
      answer: 'Lawv',
    },*/
    {
      id: 'foundations-possessive-pronouns-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
