// Standalone lesson: the reciprocal marker "sib" and common reciprocal verbs.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const sibReciprocals = {
  id: 'vocab-sib-reciprocals',
  title: 'Sib — Reciprocals',
  summary: 'How "sib" turns a verb into a mutual, back-and-forth action.',
  vocab: 'reciprocals',
  steps: [
    {
      id: 'vocab-sib-reciprocals-intro',
      kind: 'intro',
      title: 'How "sib" works',
      body: [
        '"Sib" is a small word placed before a verb to make the action reciprocal — something two or more people do to each other.',
        'For example, a verb meaning "to hit" becomes "to hit each other" when "sib" is added in front of it.',
        'Because the action flows both ways, the subject is naturally two or more people: "Nkawd sib hlub" — the two of them love each other. You have already met "sib" in "sib ntsib dua" (see you again — literally "meet each other again").',
        'Usually, when using "sib" in a sentence, its context is formulated with two or more people, although there are some instances in which its used by itself without any plural nouns',

        'Examples:',
        'Hmong: Sib Ntsib Dua',
        'English: Goodbye / See you again',
        "But the literal English transition would be, '(we) meet again' . ",
        'A typical example of using "sib" would be like:',
        "Hmong: 'Wb sib ntaus / lawv sib ntaus",
        "English: 'We fight each other' / 'They're fighting each other'. ",


        'Now, "Sib" would theoretically work with almost every verb in the Hmong language that would require 2, or more people - the practice ones in the next part are just the examples of some of the most common, however, not every verb would be used with "Sib" correctly in a way that would make sense, the use of "Sib" is all context based.',
      ],
    },
    {
      id: 'vocab-sib-reciprocals-examples',
      kind: 'examples',
      title: 'Common "sib" phrases',
      intro: 'Read each row aloud. Notice how "sib" makes the action mutual.',
      items: [
        { hmong: 'Sib hlub', audio: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-hlub.mp3', english: 'to love each other', note: '"Hlub" = to love / cherish.' },
        { hmong: 'Sib pab', audio: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-pab.mp3', english: 'to help each other', note: '"Pab" = to help.' },
        { hmong: 'Sib ntaus', audio: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-ntaus.mp3', english: 'to fight / hit each other', note: '"Ntaus" = to hit / strike.' },
        { hmong: 'Sib tham', audio: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-tham.mp3', english: 'to talk with each other', note: '"Tham" = to chat / converse.' },
        { hmong: 'Sib pom', audio: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-pom.mp3', english: 'to see each other', note: '"Pom" = to see — from the action verbs lesson.' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'vocab-sib-reciprocals-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'What does "Sib pab" mean?',
      options: [
        'To help each other',
        'To love each other',
        'To fight each other',
        'To talk with each other',
      ],
      answer: 'To help each other',
    },*/
    {
      id: 'vocab-sib-reciprocals-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
