// Standalone lesson: "yog pes tsawg" — asking how much / how many.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const howMuch = {
  id: 'numbers-how-much',
  title: 'Yog Pes Tsawg — How Much?',
  summary: 'Asking how much something costs and how many there are.',
  reference: 'grammar',
  steps: [
    {
      id: 'numbers-how-much-intro',
      kind: 'intro',
      title: 'Asking "how much / how many"',
      body: [
        '"Pes tsawg" is the Hmong phrase for "how much" or "how many". Paired with "yog" it asks the price of something — "yog pes tsawg?" ("how much is it?").',
        'One question word covers both prices and counts — context does the rest. Notice where it sits: Hmong question words usually come at the end of the sentence, so listen for "pes tsawg?" as the closing beat of the question.',
      ],
    },
    {
      id: 'numbers-how-much-examples',
      kind: 'examples',
      title: 'Asking the price',
      intro: 'Read each question aloud.',
      items: [
        { hmong: 'Yog pes tsawg?', english: 'How much is it?', note: 'The everyday way to ask a price at the market.' },
        { hmong: 'Muaj pes tsawg?', english: 'How many are there?', note: '"Muaj" = to have / there is, so literally "there are how many?"' },
        { hmong: 'Koj xav tau pes tsawg?', english: 'How many do you want?', note: '"Xav tau" = to want (literally "think-get").' }, // TODO-VERIFY: gloss of "xav tau" as literally "think-get"
        { hmong: 'Nqi pes tsawg?', english: 'What is the price?', note: '"Nqi" = price / cost.' },
      ],
    },
    {
      id: 'numbers-how-much-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which phrase means "how much / how many"?',
      options: ['Pes tsawg', 'Li cas', 'Qhov twg', 'Thaum twg'],
      answer: 'Pes tsawg',
    },
  ],
}
