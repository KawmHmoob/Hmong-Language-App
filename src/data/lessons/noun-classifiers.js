// Standalone lesson: Hmong noun classifiers (measure words).
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const nounClassifiers = {
  id: 'foundations-noun-classifiers',
  title: 'Noun Classifiers',
  summary: 'The measure words Hmong uses to count and specify nouns.',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-noun-classifiers-intro',
      kind: 'intro',
      title: 'How noun classifiers work',
      body: [
        'Hmong uses classifiers (measure words) before nouns when counting or pointing something out. The right classifier depends on the kind of thing — people, animals, long objects, flat objects, and so on.',
        'The pattern is number (or possessor) + classifier + noun: "ib tug dev" — one [animal-classifier] dog. Choosing the right classifier takes practice, but "tus" and "lub" cover a large share of everyday nouns, so start there.',
      ],
    },
    {
      id: 'foundations-noun-classifiers-examples',
      kind: 'examples',
      title: 'Common classifiers',
      intro: 'Read each classifier aloud with the kind of noun it pairs with.',
      items: [
        { hmong: 'Tus', english: 'for people and animals', note: '"Tus dev" = the dog; "tus me nyuam" = the child.' },
        { hmong: 'Lub', english: 'for round / 3-D objects', note: '"Lub tsev" = the house; "lub tais" = the bowl.' },
        { hmong: 'Daim', english: 'for flat objects', note: '"Daim ntawv" = the paper / sheet.' },
        { hmong: 'Txoj', english: 'for long, winding things', note: '"Txoj kev" = the road — also used for abstract things like "txoj sia" (life).' },
        { hmong: 'Rab', english: 'for tools / weapons', note: '"Rab riam" = the knife.' },
        { hmong: 'Phau', english: 'for books', note: '"Phau ntawv" = the book (a bound stack of paper).' },
      ],
    },
    {
      id: 'foundations-noun-classifiers-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which classifier is used for people and animals?',
      options: ['Tus', 'Lub', 'Daim', 'Phau'],
      answer: 'Tus',
    },
  ],
}
