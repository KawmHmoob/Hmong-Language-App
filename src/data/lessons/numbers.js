// Standalone lesson: Hmong numbers.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const numbers = {
  id: 'numbers-counting',
  title: 'Numbers',
  summary: 'Counting in Hmong, from one upward.',
  reference: 'grammar',
  steps: [
    {
      id: 'numbers-counting-intro',
      kind: 'intro',
      title: 'Counting in Hmong',
      body: [
        'Hmong numbers are regular and quick to learn. Once you know one through ten, larger numbers build on the same words.',
        'Teens stack ten plus the unit: "kaum ib" (ten-one) = eleven, "kaum ob" = twelve. Watch the tones closely — several numbers differ from other everyday words only by their tone letter, so saying them aloud matters more than reading them.',
      ],
    },
    {
      id: 'numbers-counting-examples',
      kind: 'examples',
      title: 'One through ten',
      intro: 'Read each number aloud.',
      items: [
        { hmong: 'Ib', english: 'one', note: 'Final -b marks the high tone.' },
        { hmong: 'Ob', english: 'two', note: 'Also a high tone (-b).' },
        { hmong: 'Peb', english: 'three', note: 'The same word as "we / us" — context tells them apart.' },
        { hmong: 'Plaub', english: 'four', note: 'Also means "hair / fur" — another reason tones and context matter.' },
        { hmong: 'Tsib', english: 'five', note: 'The "ts" is one consonant sound.' },
        { hmong: 'Rau', english: 'six', note: 'Also appears as "to / for" in other sentences — context separates them.' },
        { hmong: 'Xya', english: 'seven', note: 'RPA "x" sounds like English "s" in "see".' }, // TODO-VERIFY: best plain-English hint for RPA x
        { hmong: 'Yim', english: 'eight', note: 'Bare final (no tone letter) = the mid tone.' },
        { hmong: 'Cuaj', english: 'nine', note: 'Final -j marks the high-falling tone.' },
        { hmong: 'Kaum', english: 'ten', note: 'Builds the teens: "kaum ib" = eleven.' },
      ],
    },
    {
      id: 'numbers-counting-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'What is the Hmong word for "five"?',
      options: ['Tsib', 'Plaub', 'Rau', 'Cuaj'],
      answer: 'Tsib',
    },
  ],
}
