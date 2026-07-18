// Standalone lesson: the four-letter consonant combinations of Hmong RPA.
// Content filled 2026-07-16 (Slice A pass) — audio still pending.
// NOTE: the earlier entry "Nrhh" was removed — it is not a standard White
// Hmong RPA cluster (the attested four-letter set is nplh, ntsh, ntxh).
// TODO-VERIFY: confirm the removal with a native speaker / reference.
// Follows the lesson model in ../lessons.js.

export const quadrupleConsonants = {
  id: 'foundations-quadruple-consonants',
  title: 'Quadruple Consonants in the Hmong Language',
  summary: 'An introduction to the four-letter consonant clusters in Hmong writing.',
  steps: [
    {
      id: 'foundations-quadruple-consonants-intro',
      kind: 'intro',
      title: 'Quadruple Consonants in the Hmong Language',
      body: [
        'Quadruple consonants in the Hmong language are combinations of 4 letters used to represent a single consonant sound.',
        'These are the longest consonant clusters in Hmong RPA, typically stacking a pre-nasal, a base consonant, and an aspiration together.',
        'White Hmong has just three of them — nplh, ntsh, and ntxh — so this is the shortest letter lesson in the course. Each is still ONE sound: "nplhaib" (ring) starts with a single burst, not four separate letters.',
      ],
    },
    {
      id: 'foundations-quadruple-consonants-examples',
      kind: 'examples',
      title: 'Quadruple Consonants Examples',
      intro: 'Quadruple Consonants Examples',
      items: [
        { hmong: 'Nplh', hmongExample: 'Nplhaib (ring)', audio: '/assets/audio/consonants/quad-consonants/quad-consonants-nplh.mp3' },
        { hmong: 'Ntsh', hmongExample: 'Ntshai (afraid)', audio: '/assets/audio/consonants/quad-consonants/quad-consonants-ntsh.mp3' },
        { hmong: 'Ntxh', hmongExample: 'Ntxhais (daughter / girl)', audio: '/assets/audio/consonants/quad-consonants/quad-consonants-ntxh.mp3' },
      ],
    },
    {
      id: 'foundations-quadruple-consonants-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which of these is a FOUR-letter consonant?',
      options: ['Ntxh', 'Ntx', 'Txh', 'Nts'],
      answer: 'Ntxh',
    },
    {
      id: 'foundations-quadruple-consonants-quiz',
      kind: 'mini-quiz',
      title: 'Quadruple Consonants mini-quiz',
      quizId: 'alphabet-consonants',
    },
  ],
}
