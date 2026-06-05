// Standalone lesson: the two-letter consonant combinations of Hmong RPA.
// Note: `Audio` field is intentionally capitalized inconsistently in some
// entries below — fix when wiring up audio playback. Same applies to the
// placeholder 'english: "s"' values which need real per-letter content.

export const dualConsonants = {
  id: 'foundations-double-consonants',
  title: 'Double Consonants in the Hmong Language',
  summary: 'An introduction to the 29 distinct double consonants in Hmong writing, and Hmong Language',
  steps: [
    {
      id: 'foundations-double-consonants-intro',
      kind: 'intro',
      title: 'Double Consonants in the Hmong Language',
      body: [
        'Double consonants in the Hmong language are combinations of 2 letters used to represent a consonant sound in the Hmong Language',
        'Unlike singular consonants, double consonants are often pronounced with greater emphasis depending on how its used, or phrased',
        'There are a total of 29 unique double consonants.',
      ],
    },
    {
      id: 'foundations-double-consonants-examples',
      kind: 'examples',
      title: 'Double Consonants Examples',
      intro: 'Double Consonants Examples',
      items: [
        { hmong: 'Ch', hmongExample: 'Chiaj', audio: '', englishSound: "sounds like"},
        { hmong: 'Dh', hmongExample: 'Dhia', audio: '' },
        { hmong: 'Dl', hmongExample: '', audio: '' },
        { hmong: 'Hl', hmongExample: '', audio: '' },
        { hmong: 'Hm', hmongExample: '', audio: '' },
        { hmong: 'Hn', hmongExample: '', audio: '' },
        { hmong: 'Kh', hmongExample: '', audio: '' },
        { hmong: 'Ml', hmongExample: '', audio: '' },
        { hmong: 'Nc', hmongExample: '', audio: '' },
        { hmong: 'Nk', hmongExample: '', audio: '' },
        { hmong: 'Np', hmongExample: '', audio: '' },
        { hmong: 'Nq', hmongExample: '', audio: '' },
        { hmong: 'Nt', hmongExample: '', audio: '' },
        { hmong: 'Ny', hmongExample: '', audio: '' },
        { hmong: 'Ph', hmongExample: '', audio: '' },
        { hmong: 'Pl', hmongExample: '', audio: '' },
        { hmong: 'Qh', hmongExample: '', audio: '' },
        { hmong: 'Rh', hmongExample: '', audio: '' },
        { hmong: 'Th', hmongExample: '', audio: '' },
        { hmong: 'Ts', hmongExample: '', audio: '' },
        { hmong: 'Tx', hmongExample: '', audio: '' },
        { hmong: 'Xy', hmongExample: '', audio: '' },
      ],
    },
    {
      id: 'foundations-double-consonants-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'You see the Hmong word "xav". Which English sound does the letter "x" make here?',
      options: ['"ks" as in "axe"', '"s" as in "see"', '"z" as in "zoo"', '"sh" as in "ship"'],
      answer: '"s" as in "see"',
    },
    {
      id: 'foundations-double-consonants-quiz',
      kind: 'mini-quiz',
      title: 'Double Consonants mini-quiz',
      quizId: 'alphabet-consonants',
    },
  ],
}
