// Standalone lesson: the three-letter consonant combinations of Hmong RPA.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, and some
// example words await native-speaker verification (TODO-VERIFY marks).
// Follows the lesson model in ../lessons.js.

export const tripleConsonants = {
  id: 'foundations-triple-consonants',
  title: 'Triple Consonants in the Hmong Language',
  summary: 'An introduction to the three-letter consonant clusters in Hmong writing.',
  steps: [
    {
      id: 'foundations-triple-consonants-intro',
      kind: 'intro',
      title: 'Triple Consonants in the Hmong Language',
      body: [
        'Triple consonants are combinations of three letters used to represent a single consonant sound. They build on the single and double consonants you have already seen, often layering a pre-nasal or an aspiration onto a simpler cluster.',
        'The fourteen combinations below each spell ONE sound, not three:',
        '> Nplooj — npl (one consonant) + oo (vowel) + j (tone)',
        'That "npl" begins with a hum through the nose — say it as one crisp sound, not n-p-l.',
      ],
    },
    {
      id: 'foundations-triple-consonants-examples',
      kind: 'examples',
      title: 'Triple Consonants Examples',
      intro: 'Triple Consonants Examples',
      items: [
        { hmong: 'Hml', hmongExample: '', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hml.mp3' }, 
        { hmong: 'Hny', hmongExample: 'Hnyav (heavy)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hny.mp3' },
        { hmong: 'Nch', hmongExample: '', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nch.mp3' },
        { hmong: 'Nkh', hmongExample: 'Nkhaus (crooked)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nkh.mp3' },
        { hmong: 'Nph', hmongExample: '', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nph.mp3' },
        { hmong: 'Npl', hmongExample: 'Nplooj (leaf)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-npl.mp3' },
        { hmong: 'Nqh', hmongExample: 'Nqhis (thirsty)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nqh.mp3' },
        { hmong: 'Nrh', hmongExample: 'Nrhiav (to look for)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nrh.mp3' },
        { hmong: 'Nth', hmongExample: '', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nth.mp3' },
        { hmong: 'Nts', hmongExample: 'Ntses (fish)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nts.mp3' },
        { hmong: 'Ntx', hmongExample: 'Ntxuav (to wash)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-ntx.mp3' },
        { hmong: 'Plh', hmongExample: 'Plhu (cheek)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-plh.mp3' },
        { hmong: 'Tsh', hmongExample: 'Tshuaj (medicine)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-tsh.mp3' },
        { hmong: 'Txh', hmongExample: 'Txhua (every)', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-txh.mp3' },
      ],
    },
    {
      id: 'foundations-triple-consonants-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which of these is a THREE-letter consonant?',
      options: ['Npl', 'Np', 'Nplh', 'Pl'],
      answer: 'Npl',
    },
    {
      id: 'triple-consonants-speak',
      kind: 'speak-drill',
      title: 'Now say them',
      familyId: 'family-consonant-triple',
    },
  ],
}
