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
        'Triple consonants in the Hmong language are combinations of 3 letters used to represent a single consonant sound.',
        'They build on the single and double consonants you have already seen, often layering a pre-nasal or an aspiration onto a simpler cluster.',
        'The fourteen combinations below each spell ONE sound, not three. For example the "npl" in "nplooj" (leaf) is a single consonant that begins with a hum through the nose — say it as one crisp sound, not n-p-l.',
      ],
    },
    {
      id: 'foundations-triple-consonants-examples',
      kind: 'examples',
      title: 'Triple Consonants Examples',
      intro: 'Triple Consonants Examples',
      items: [
        { hmong: 'Hml', hmongExample: '', audio: '' }, // TODO-VERIFY: need a common, attested hml- word
        { hmong: 'Hny', hmongExample: 'Hnyav (heavy)', audio: '' },
        { hmong: 'Nch', hmongExample: '', audio: '' }, // TODO-VERIFY: candidate "ncho" (to smoke) — confirm before adding
        { hmong: 'Nkh', hmongExample: 'Nkhaus (crooked)', audio: '' }, // TODO-VERIFY: confirm "nkhaus"
        { hmong: 'Nph', hmongExample: '', audio: '' }, // TODO-VERIFY: need a common, attested nph- word
        { hmong: 'Npl', hmongExample: 'Nplooj (leaf)', audio: '' },
        { hmong: 'Nqh', hmongExample: 'Nqhis (thirsty)', audio: '' },
        { hmong: 'Nrh', hmongExample: 'Nrhiav (to look for)', audio: '' },
        { hmong: 'Nth', hmongExample: '', audio: '' }, // TODO-VERIFY: candidate "nthuav" (to unfold) — confirm
        { hmong: 'Nts', hmongExample: 'Ntses (fish)', audio: '' },
        { hmong: 'Ntx', hmongExample: 'Ntxuav (to wash)', audio: '' },
        { hmong: 'Plh', hmongExample: 'Plhu (cheek)', audio: '' }, // TODO-VERIFY: confirm "plhu"
        { hmong: 'Tsh', hmongExample: 'Tshuaj (medicine)', audio: '' },
        { hmong: 'Txh', hmongExample: 'Txhua (every)', audio: '' },
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
      id: 'foundations-triple-consonants-quiz',
      kind: 'mini-quiz',
      title: 'Triple Consonants mini-quiz',
      quizId: 'alphabet-consonants',
    },
  ],
}
