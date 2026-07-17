// Reading lesson: going to school. Intermediate.
// Migrated from the old /course Reading tab (see notes/34).
//
// CONTENT FIX: the original passage read "lus Mev" but glossed it as
// "English". "Lus Mev" is Spanish; English is "lus Askiv". Since the app
// teaches English speakers, the Hmong was corrected to "lus Askiv" so it
// matches the translation.
// TODO-VERIFY: confirm "lus Askiv" is the natural term for English.

export const readingSchool = {
  id: 'readings-school',
  title: 'Mus Kawm Ntawv',
  summary: 'Going to school — daily habits and talking about languages.',
  steps: [
    {
      id: 'readings-school-read',
      kind: 'reading',
      title: 'Mus Kawm Ntawv',
      level: 'Intermediate',
      intro: '"Kawm ntawv" literally means "study letters" — and "Kawm Hmoob" is why you are here.',
      hmong: 'Txhua hnub kuv mus kawm ntawv. Kuv nyiam kawm lus Hmoob thiab lus Askiv.',
      english: 'Every day I go to school. I like learning Hmong and English.',
      glossary: [
        { hmong: 'txhua hnub', english: 'every day' },
        { hmong: 'mus', english: 'to go' },
        { hmong: 'kawm ntawv', english: 'to study / go to school (lit. "study letters")' },
        { hmong: 'nyiam', english: 'to like' },
        { hmong: 'lus', english: 'language / words' },
        { hmong: 'lus Hmoob', english: 'the Hmong language' },
        { hmong: 'thiab', english: 'and' },
        { hmong: 'lus Askiv', english: 'the English language' },
      ],
    },
    {
      id: 'readings-school-practice',
      kind: 'practice',
      title: 'Did you catch it?',
      prompt: 'How often does the speaker go to school?',
      options: ['Every day', 'Once a week', 'Every morning', 'Never'],
      answer: 'Every day',
    },
  ],
}
