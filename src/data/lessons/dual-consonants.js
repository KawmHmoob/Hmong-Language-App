// Standalone lesson: the two-letter consonant combinations of Hmong RPA.
// Note: `Audio` field is intentionally capitalized inconsistently in some
// entries below — fix when wiring up audio playback. Same applies to the
// NOTE: most 'englishSound' descriptions are still empty ('') — filling the
// ~24 per-letter sound descriptions needs care (ideally with a native
// speaker) and is tracked as remaining content work, not placeholder text.

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
        'Bi consonants are made up of one Major Consonant and one sound indicator, or two Major Consonants.',
        'There are a total of 23 unique double consonants.',
      ],
    },
    {
      id: 'foundations-double-consonants-examples',
      kind: 'examples',
      title: 'Double Consonants Examples',
      intro: 'Double Consonants Examples',
      items: [
        { hmong: 'Ch', hmongExample: 'Chiaj', audio: '', englishSound: "Clear C consonant with a puff of air."},
     
        
        
        { hmong: 'Dh', hmongExample: 'Dhia', audio: '', englishSound: '' },
        { hmong: 'Dl', hmongExample: 'Dlaim', audio: '', englishSound: '' },
        { hmong: 'Hl', hmongExample: 'Hlub', audio: '', englishSound: '' },
        { hmong: 'Hm', hmongExample: 'Hmoob', audio: '', englishSound: '' },
        { hmong: 'Hn', hmongExample: 'Hnav', audio: '', englishSound: '' },
        { hmong: 'Kh', hmongExample: 'Khob', audio: '', englishSound: '' },
        { hmong: 'Ml', hmongExample: 'Mlom', audio: '', englishSound: '' },
        { hmong: 'Nc', hmongExample: 'Ncaws', audio: '', englishSound: '' },
        { hmong: 'Nk', hmongExample: 'Nkauj', audio: '', englishSound: '' },
        { hmong: 'Np', hmongExample: 'Npua', audio: '', englishSound: '' },
        { hmong: 'Nq', hmongExample: 'Nqaij', audio: '', englishSound: '' },
        { hmong: 'Nt', hmongExample: 'Ntoo', audio: '', englishSound: '' },
        { hmong: 'Ny', hmongExample: 'Nyiaj', audio: '', englishSound: '' },
        { hmong: 'Ph', hmongExample: 'Phau', audio: '', englishSound: '' },
        { hmong: 'Pl', hmongExample: 'Plaub', audio: '', englishSound: '' },
        { hmong: 'Qh', hmongExample: 'Qhov', audio: '', englishSound: '' },
        { hmong: 'Rh', hmongExample: 'Rho', audio: '', englishSound: '' },
        { hmong: 'Th', hmongExample: 'Thaj', audio: '', englishSound: '' },
        { hmong: 'Ts', hmongExample: 'Tsev', audio: '', englishSound: '' },
        { hmong: 'Tx', hmongExample: 'Txiv', audio: '', englishSound: '' },
        { hmong: 'Xy', hmongExample: 'Xyoo', audio: '', englishSound: '' },
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
