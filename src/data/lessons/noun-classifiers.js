// Standalone lesson: Hmong noun classifiers (measure words).
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const nounClassifiers = {
  id: 'foundations-noun-classifiers',
  title: 'Noun Classifiers',
  summary: 'The measure words Hmong uses to count and specify nouns.',
  vocab: 'classifiers',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-noun-classifiers-intro',
      kind: 'intro',
      title: 'How noun classifiers work',
      body: [
        'Hmong uses classifiers (measure words) before nouns when counting or pointing something out. The right classifier depends on the kind of thing — people, animals, long objects, flat objects, and so on.',
        'The pattern is number (or possessor) + classifier + noun:',
        '> Ib tug dev. — One [animal-classifier] dog.',
        'Choosing the right classifier takes practice, but "tus" and "lub" cover a large share of everyday nouns, so start there.',
      ],
    },
    {
      id: 'foundations-noun-classifiers-examples',
      kind: 'examples',
      title: 'Common classifiers',
      intro: 'Read each classifier aloud with the kind of noun it pairs with.',
      items: [
        { hmong: 'Tus', audio: 'grammar/classifiers/hmong-classifiers-tus.mp3', english: 'for people and animals', note: '"Tus dev" = the dog; "tus me nyuam" = the child.' },
        { hmong: 'Lub', audio: 'grammar/classifiers/hmong-classifiers-lub.mp3', english: 'for round / 3-D objects', note: '"Lub tsev" = the house; "lub tais" = the bowl.' },
        { hmong: 'Daim', audio: 'grammar/classifiers/hmong-classifiers-daim.mp3', english: 'for flat objects', note: '"Daim ntawv" = the paper / sheet.' },
        { hmong: 'Txoj', audio: 'grammar/classifiers/hmong-classifiers-txoj.mp3', english: 'for long, winding things', note: '"Txoj kev" = the road — also used for abstract things like "txoj sia" (life).' },
        { hmong: 'Rab', audio: 'grammar/classifiers/hmong-classifiers-rab.mp3', english: 'for tools / weapons', note: '"Rab riam" = the knife.' },
        { hmong: 'Phau', audio: 'grammar/classifiers/hmong-classifiers-phau.mp3', english: 'for books', note: '"Phau ntawv" = the book (a bound stack of paper).' },
      ],
    },
    {
      id: 'foundations-noun-classifiers-quiz',
      kind: 'quiz',
      title: 'Learn the classifiers',
    },
  ],
}
