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
        '"Sib" is a small word placed before a verb to make the action reciprocal — something two or more people do TO each other. A verb meaning "to hit" becomes "to hit each other" the moment "sib" goes in front of it.',
        'Because the action flows both ways, the subject is naturally two or more people:',
        '> Nkawd sib hlub. — The two of them love each other.',
        'You have already met "sib" in one very common phrase:',
        '> Sib ntsib dua. — Goodbye / see you again.',
        'Literally, that is "(we) meet each other again" — the reciprocal sense is baked into the farewell itself.',

        '## Reading a "sib" sentence',
        'Here it is doing real work in a full sentence:',
        '> Wb sib ntaus. / Lawv sib ntaus. — We fight each other. / They are fighting each other.',
        'Most of the time "sib" appears with a plural subject like "wb" or "lawv" — the mutual action needs at least two people to flow between. A few uses drop the plural noun and lean on context instead, but that is the exception, not the pattern to learn from.',

        '## How far it reaches',
        '"Sib" can theoretically combine with almost any verb that could involve two or more people — the five in this lesson are simply the most common. Not every combination will sound natural to a fluent ear, though: whether a given "sib + verb" pair actually makes sense is context-dependent, the same way not every English verb takes "each other" comfortably ("we breakfast each other" does not work, even though "we help each other" does).',
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
