// Reading lesson: a child and her mother. Beginner — the first connected
// prose in the course. Migrated from the old /course Reading tab and given
// a glossary + comprehension check (see notes/34).

export const readingMim = {
  id: 'readings-mim',
  title: 'Tus Me Nyuam thiab Niam',
  summary: 'A child and her mother — your first few sentences of real Hmong.',
  steps: [
    {
      id: 'readings-mim-read',
      kind: 'reading',
      title: 'Tus Me Nyuam thiab Niam',
      level: 'Beginner',
      intro: 'Read the Hmong aloud first. Only reveal the English when you have made your best guess.',
      hmong: 'Muaj ib tug me nyuam. Nws hu ua Mim. Mim hlub nws niam heev.',
      english: 'There is a child. Her name is Mim. Mim loves her mother very much.',
      glossary: [
        { hmong: 'muaj', english: 'there is / to have' },
        { hmong: 'ib tug', english: 'one (+ person/animal classifier)' },
        { hmong: 'me nyuam', english: 'child' },
        { hmong: 'hu ua', english: 'is called / named' },
        { hmong: 'hlub', english: 'to love' },
        { hmong: 'niam', english: 'mother' },
        { hmong: 'heev', english: 'very / a lot' },
      ],
    },
    {
      id: 'readings-mim-practice',
      kind: 'practice',
      title: 'Did you catch it?',
      prompt: 'Who does Mim love very much?',
      options: ['Her mother', 'Her father', 'Her child', 'Her teacher'],
      answer: 'Her mother',
    },
  ],
}
