// Standalone lesson: the eight Hmong tones (cov cim).
// PLACEHOLDER SCAFFOLD — intro prose wants a native-speaker pass.
//
// The tone table IS shown here, using the `tones` step kind, which renders the
// SAME <ToneRows> component as the Reference page. Data comes from
// reference.js (one source), presentation comes from the shared component
// (one look). Never dump this data through the generic `examples` step — that
// layout is for word lists and mangles tones. See notes/47.

import { tones as toneData } from '../reference.js'

export const Tones = {
  id: 'foundations-tones',
  title: 'Tones in the Hmong Language | Cov Cim',
  summary: 'The eight tones of Hmong — the pitch that changes what a word means.',
  reference: 'tones',
  steps: [
    {
      id: 'foundations-tones-intro',
      kind: 'intro',
      title: 'Tones in the Hmong Language | Cov Cim',
      body: [
        'Hmong is a tonal language. The same consonant and vowel said at a different pitch is a completely different word:',
        '> Pob (ball) — Poj (female) — Pom (see)',
        'Same letters "po", different tone, different meaning.',
        'The tone is written as the LAST letter of the syllable, and that letter is never pronounced. In "pob", you do not say a "b" — the "b" tells you the pitch is high.',
        'There are eight tones. Seven are written with a final letter (b, j, v, s, g, m, d) and one — the mid tone — has no marker at all.',
        'Every syllable follows the same shape: consonant + vowel + tone.',
        '> Nplooj — Npl (consonant) + oo (vowel) + j (tone)',
        'This is the hardest part of Hmong for English speakers, because English uses pitch for emotion, not for meaning. Use the cheat sheet link above to hear all eight side by side.',
      ],
    },
    {
      id: 'foundations-tones-table',
      kind: 'tones',
      title: 'The eight tones',
      intro: 'The marker, its name, and its Hmong name. Tap to hear each pitch.',
      items: toneData,
    },
    {
      id: 'foundations-tones-quiz',
      kind: 'mini-quiz',
      title: 'Tones mini-quiz',
      quizId: 'alphabet-tones',
    },
  ],
}
