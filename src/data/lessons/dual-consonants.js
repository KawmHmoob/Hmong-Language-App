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
        { hmong: 'Ch', hmongExample: 'Chiaj', audio: '/assets/audio/consonants/double-consonants/double-consonant-ch.mp3', englishSound: "Clear C consonant with a puff of air."},
     
        
        
        { hmong: 'Dh', hmongExample: 'Dhia', audio: '/assets/audio/consonants/double-consonants/double-consonant-dh.mp3', englishSound: '' },
        { hmong: 'Dl', hmongExample: 'Dlaim', audio: '/assets/audio/consonants/double-consonants/double-consonant-dl.mp3', englishSound: '' },
        { hmong: 'Hl', hmongExample: 'Hlub', audio: '/assets/audio/consonants/double-consonants/double-consonant-hl.mp3', englishSound: '' },
        { hmong: 'Hm', hmongExample: 'Hmoob', audio: '/assets/audio/consonants/double-consonants/double-consonant-hm.mp3', englishSound: '' },
        { hmong: 'Hn', hmongExample: 'Hnav', audio: '/assets/audio/consonants/double-consonants/double-consonant-hn.mp3', englishSound: '' },
        { hmong: 'Kh', hmongExample: 'Khob', audio: '/assets/audio/consonants/double-consonants/double-consonant-kh.mp3', englishSound: '' },
        { hmong: 'Ml', hmongExample: 'Mlom', audio: '/assets/audio/consonants/double-consonants/double-consonant-ml.mp3', englishSound: '' },
        { hmong: 'Nc', hmongExample: 'Ncaws', audio: '/assets/audio/consonants/double-consonants/double-consonant-nc.mp3', englishSound: '' },
        { hmong: 'Nk', hmongExample: 'Nkauj', audio: '/assets/audio/consonants/double-consonants/double-consonant-nk.mp3', englishSound: '' },
        { hmong: 'Np', hmongExample: 'Npua', audio: '/assets/audio/consonants/double-consonants/double-consonant-np.mp3', englishSound: '' },
        { hmong: 'Nq', hmongExample: 'Nqaij', audio: '/assets/audio/consonants/double-consonants/double-consonant-nq.mp3', englishSound: '' },
        { hmong: 'Nt', hmongExample: 'Ntoo', audio: '/assets/audio/consonants/double-consonants/double-consonant-nt.mp3', englishSound: '' },
        { hmong: 'Ny', hmongExample: 'Nyiaj', audio: '/assets/audio/consonants/double-consonants/double-consonant-ny.mp3', englishSound: '' },
        { hmong: 'Ph', hmongExample: 'Phau', audio: '/assets/audio/consonants/double-consonants/double-consonant-ph.mp3', englishSound: '' },
        { hmong: 'Pl', hmongExample: 'Plaub', audio: '/assets/audio/consonants/double-consonants/double-consonant-pl.mp3', englishSound: '' },
        { hmong: 'Qh', hmongExample: 'Qhov', audio: '/assets/audio/consonants/double-consonants/double-consonant-qh.mp3', englishSound: '' },
        { hmong: 'Rh', hmongExample: 'Rho', audio: '/assets/audio/consonants/double-consonants/double-consonant-rh.mp3', englishSound: '' },
        { hmong: 'Th', hmongExample: 'Thaj', audio: '/assets/audio/consonants/double-consonants/double-consonant-th.mp3', englishSound: '' },
        { hmong: 'Ts', hmongExample: 'Tsev', audio: '/assets/audio/consonants/double-consonants/double-consonant-ts.mp3', englishSound: '' },
        { hmong: 'Tx', hmongExample: 'Txiv', audio: '/assets/audio/consonants/double-consonants/double-consonant-tx.mp3', englishSound: '' },
        { hmong: 'Xy', hmongExample: 'Xyoo', audio: '/assets/audio/consonants/double-consonants/double-consonant-xy.mp3', englishSound: '' },
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
      id: 'dual-consonants-speak',
      kind: 'speak-drill',
      title: 'Now say them',
      familyId: 'family-consonant-double',
    },
  ],
}
