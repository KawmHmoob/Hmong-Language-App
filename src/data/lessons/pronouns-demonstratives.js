// Standalone lesson: Hmong demonstratives (this / that / these / those).
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const pronounsDemonstratives = {
  id: 'foundations-pronouns-demonstratives',
  title: 'Pronouns & Demonstratives',
  summary: 'Pointing words — this, that, here, there — and how they pair with classifiers.',
  vocab: 'demonstratives',
  steps: [
    {
      id: 'foundations-pronouns-demonstratives-intro',
      kind: 'intro',
      title: 'How demonstratives work',
      body: [
        'Demonstratives are the pointing words: this, that, these, those. In Hmong they usually follow the noun (and its classifier) rather than coming before it:',
        '> Lub tsev no. — This house. (literally "house this")',
        'Hmong also cares about where the thing is relative to the listener — "no" (near me), "ko" (near you), "ntawd" (over there / that one).', // TODO-VERIFY: exact nuance split between "ko" and "ntawd"
      ],
    },
    {
      id: 'foundations-pronouns-demonstratives-examples',
      kind: 'examples',
      title: 'Common demonstratives',
      intro: 'Read each pointing word aloud.',
      items: [
        { hmong: 'No', audio: 'grammar/common-demonstratives/hmong-demonstratives-no.mp3', english: 'this', note: '"Lub tsev no" = this house — the demonstrative follows the noun.' },
        { hmong: 'Ntawd', audio: 'grammar/common-demonstratives/hmong-demonstratives-ntawd.mp3', english: 'that', note: 'That one / over there — away from the speaker.' },
        { hmong: 'Ko', audio: 'grammar/common-demonstratives/hmong-demonstratives-ko.mp3', english: 'that (near listener)', note: 'Specifically near the person you are talking to.' }, // TODO-VERIFY: "ko" vs "ntawd" distance nuance
        { hmong: 'Ntawm no', audio: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-no.mp3', english: 'here', note: 'Literally "at this (place)."' },
        { hmong: 'Ntawm ntawd', audio: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-ntawd.mp3', english: 'there', note: 'Literally "at that (place)."' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-pronouns-demonstratives-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which word means "this"?',
      options: ['No', 'Ntawd', 'Ko', 'Ntawm ntawd'],
      answer: 'No',
    },*/
    {
      id: 'foundations-pronouns-demonstratives-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
