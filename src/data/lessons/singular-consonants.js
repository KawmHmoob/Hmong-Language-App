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
        'Hmong is written with the Romanized Popular Alphabet (RPA), where every sound is spelled with ordinary Roman letters. This lesson covers the "mother letters" (cov tsiaj ntawv niam) — the 17 consonants written with a single letter, and the building blocks every other consonant lesson builds on.',

        '## Two surprises for English speakers',
        'First, a few letters do not sound like English at all:',
        '> c — a "j" sound',
        '> x — an "s" sound',
        '> z — the soft "s" in "measure"',
        'Second, Hmong consonants only ever START a syllable — they are never pronounced at the end. A trailing letter like the "b" in "pob" is a TONE marker, not a consonant sound. You will meet that properly in the Tones lesson.',
      ],
    },
    {
      id: 'foundations-consonants-examples',
      kind: 'examples',
      title: 'The 17 single consonants',
      intro: 'Read each letter aloud with its sound. The notes call out the ones that trip up English speakers.',
      items: [
        { hmong: 'C', english: 'sounds like English "j"', note: 'As in "jump" — not a "k" sound.', audio: '/assets/audio/consonants/single-consonants/single-consonant-c.mp3' },
        { hmong: 'D', english: 'sounds like "d"', audio: '/assets/audio/consonants/single-consonants/single-consonant-d.mp3' },
        { hmong: 'F', english: 'sounds like "f"', audio: '/assets/audio/consonants/single-consonants/single-consonant-f.mp3' },
        { hmong: 'H', english: 'sounds like "h"', audio: '/assets/audio/consonants/single-consonants/single-consonant-h.mp3' },
        { hmong: 'K', english: 'sounds like "k"', note: 'Unaspirated — no puff of air. The puffed version is written "kh".', audio: '/assets/audio/consonants/single-consonants/single-consonant-k.mp3' },
        { hmong: 'L', english: 'sounds like "l"', audio: '/assets/audio/consonants/single-consonants/single-consonant-l.mp3' },
        { hmong: 'M', english: 'sounds like "m"', audio: '/assets/audio/consonants/single-consonants/single-consonant-m.mp3' },
        { hmong: 'N', english: 'sounds like "n"', audio: '/assets/audio/consonants/single-consonants/single-consonant-n.mp3' },
        { hmong: 'P', english: 'sounds like "p"', note: 'Unaspirated — softer than English "p". The puffed version is "ph".', audio: '/assets/audio/consonants/single-consonants/single-consonant-p.mp3' },
        { hmong: 'Q', english: 'a "k" made deep in the throat', note: 'Uvular: the tongue pulls back further than for "k".', audio: '/assets/audio/consonants/single-consonants/single-consonant-q.mp3' },
        { hmong: 'R', english: 'sounds like "tr"', note: 'Retroflex — curl the tongue tip back, close to the "tr" in "try".', audio: '/assets/audio/consonants/single-consonants/single-consonant-r.mp3' },
        { hmong: 'S', english: 'sounds like "sh"', note: 'Like the "sh" in "ship".', audio: '/assets/audio/consonants/single-consonants/single-consonant-s.mp3' },
        { hmong: 'T', english: 'sounds like "t"', note: 'Unaspirated — no puff. The puffed version is "th".', audio: '/assets/audio/consonants/single-consonants/single-consonant-t.mp3' },
        { hmong: 'V', english: 'sounds like "v"', audio: '/assets/audio/consonants/single-consonants/single-consonant-v.mp3' },
        { hmong: 'X', english: 'sounds like "s"', note: 'Like the "s" in "see" — NOT an "x" sound.', audio: '/assets/audio/consonants/single-consonants/single-consonant-x.mp3' },
        { hmong: 'Y', english: 'sounds like "y"', note: 'As in "yes".', audio: '/assets/audio/consonants/single-consonants/single-consonant-y.mp3' },
        { hmong: 'Z', english: 'the soft "s" in "measure"', note: 'A buzzing "zh" sound, never a hard English "z".', audio: '/assets/audio/consonants/single-consonants/single-consonant-z.mp3' },
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
      id: 'singular-consonants-speak',
      kind: 'speak-drill',
      title: 'Now say them',
      familyId: 'family-consonant-single',
    },
  ],
}
