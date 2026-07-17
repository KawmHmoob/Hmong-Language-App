// Standalone lesson: common Hmong action verbs.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const actionVerbs = {
  id: 'foundations-action-verbs',
  title: 'Action Verbs',
  summary: 'Everyday Hmong verbs for the things people do.',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-action-verbs-intro',
      kind: 'intro',
      title: 'How Hmong action verbs work',
      body: [
        'Action verbs name the things people do — eat, go, see, work. Hmong verbs do not change form for tense or person; the same word is used regardless of who does it or when.',
        'To place an action in time, Hmong adds small marker words instead of changing the verb: "yuav" before a verb points to the future, and "lawm" at the end of a sentence shows the action is already done. You will meet these markers properly in a later lesson — for now, focus on learning the verbs themselves.',
      ],
    },
    {
      id: 'foundations-action-verbs-examples',
      kind: 'examples',
      title: 'Common action verbs',
      intro: 'Read each verb aloud.',
      items: [
        { hmong: 'Noj', english: 'to eat', note: '"Noj mov" — literally "eat rice" — is the everyday way to say "have a meal."' },
        { hmong: 'Haus', english: 'to drink', note: '"Haus dej" = drink water. The final -s marks a low tone.' },
        { hmong: 'Mus', english: 'to go', note: 'Motion away from the speaker.' },
        { hmong: 'Los', english: 'to come', note: 'Motion toward the speaker — the natural pair of "mus."' },
        { hmong: 'Pom', english: 'to see', note: 'To see or catch sight of something.' },
        { hmong: 'Ua', english: 'to do / make', note: 'The all-purpose verb — it appears in many set phrases, like "ua tsaug" (thank you).' },
        { hmong: 'Hais', english: 'to say / speak', note: '"Hais lus" = to speak (literally "say words").' },
      ],
    },
    {
      id: 'foundations-action-verbs-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which verb means "to eat"?',
      options: ['Noj', 'Haus', 'Mus', 'Pom'],
      answer: 'Noj',
    },
  ],
}
