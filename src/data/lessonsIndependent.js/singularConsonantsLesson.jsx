// Standalone lesson: the single-letter ("mother") consonants of Hmong RPA.
// Follows the lesson model in ../lessons.js. Imported and slotted into the
// Foundations unit there. Sounds mirror the `consonants` data in ../alphabet.js,
// which also backs the 'alphabet-consonants' quiz this lesson ends on.

export const singularConsonants = {
  id: 'foundations-consonants',
  title: 'Singular Consonants — Cov Tsiaj Ntawv Niam',
  summary: 'The 17 single-letter consonants of Hmong and how each one sounds.',
  steps: [
    {
      id: 'foundations-consonants-intro',
      kind: 'intro',
      title: 'How single Hmong consonants work',
      body: [
        'Hmong is written with the Romanized Popular Alphabet (RPA), where every sound is spelled with ordinary Roman letters. This lesson covers the "mother letters" (cov tsiaj ntawv niam): the consonants written with a single letter. There are 17 of them.',
        'These are the building blocks. In this lesson, we will focus on singular consonants.' ,
        'Two things surprise English speakers. First, a few letters do not sound like English: "c" is a "j" sound, "x" is "s", and "z" is the soft "s" in "measure". Second, Hmong consonants only ever start a syllable — they are never pronounced at the end. A trailing letter like the "b" in "pob" is a tone marker, not a consonant sound.',
      ],
    },
    {
      id: 'foundations-consonants-examples',
      kind: 'examples',
      title: 'The 17 single consonants',
      intro: 'Read each letter aloud with its sound. The notes call out the ones that trip up English speakers.',
      items: [
        { hmong: 'C', english: 'sounds like English "j"', note: 'As in "jump" — not a "k" sound.', audio: '/assets/audio/singular-consonant-c.mp3' },
        { hmong: 'D', english: 'sounds like "d"', audio: '/assets/audio/singular-consonant-d.mp3' },
        { hmong: 'F', english: 'sounds like "f"', audio: '/assets/audio/singular-consonant-f.mp3' },
        { hmong: 'H', english: 'sounds like "h"', audio: '/assets/audio/singular-consonant-h.mp3' },
        { hmong: 'K', english: 'sounds like "k"', note: 'Unaspirated — no puff of air. The puffed version is written "kh".', audio: '/assets/audio/singular-consonant-k.mp3' },
        { hmong: 'L', english: 'sounds like "l"', audio: '/assets/audio/singular-consonant-l.mp3' },
        { hmong: 'M', english: 'sounds like "m"', audio: '/assets/audio/singular-consonant-m.mp3' },
        { hmong: 'N', english: 'sounds like "n"', audio: '/assets/audio/singular-consonant-n.mp3' },
        { hmong: 'P', english: 'sounds like "p"', note: 'Unaspirated — softer than English "p". The puffed version is "ph".', audio: '/assets/audio/singular-consonant-p.mp3' },
        { hmong: 'Q', english: 'a "k" made deep in the throat', note: 'Uvular: the tongue pulls back further than for "k".', audio: '/assets/audio/singular-consonant-q.mp3' },
        { hmong: 'R', english: 'sounds like "tr"', note: 'Retroflex — curl the tongue tip back, close to the "tr" in "try".', audio: '/assets/audio/singular-consonant-r.mp3' },
        { hmong: 'S', english: 'sounds like "sh"', note: 'Like the "sh" in "ship".', audio: '/assets/audio/singular-consonant-s.mp3' },
        { hmong: 'T', english: 'sounds like "t"', note: 'Unaspirated — no puff. The puffed version is "th".', audio: '/assets/audio/singular-consonant-t.mp3' },
        { hmong: 'V', english: 'sounds like "v"', audio: '/assets/audio/singular-consonant-v.mp3' },
        { hmong: 'X', english: 'sounds like "s"', note: 'Like the "s" in "see" — NOT an "x" sound.', audio: '/assets/audio/singular-consonant-x.mp3' },
        { hmong: 'Y', english: 'sounds like "y"', note: 'As in "yes".', audio: '/assets/audio/singular-consonant-y.mp3' },
        { hmong: 'Z', english: 'the soft "s" in "measure"', note: 'A buzzing "zh" sound, never a hard English "z".', audio: '/assets/audio/singular-consonant-z.mp3' },
      ],
    },
    {
      id: 'foundations-consonants-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'You see the Hmong word "xav". Which English sound does the letter "x" make here?',
      options: ['"ks" as in "axe"', '"s" as in "see"', '"z" as in "zoo"', '"sh" as in "ship"'],
      answer: '"s" as in "see"',
    },
    {
      id: 'foundations-consonants-quiz',
      kind: 'mini-quiz',
      title: 'Consonants mini-quiz',
      quizId: 'alphabet-consonants',
    },
  ],
}
