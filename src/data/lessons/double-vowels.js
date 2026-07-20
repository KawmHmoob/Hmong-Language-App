// Standalone lesson: the double vowels of Hmong RPA.
// PLACEHOLDER SCAFFOLD — teaching prose only.
//
// The vowel grid IS shown here, via the `letters` step kind — the SAME
// <LetterGrid> the Reference page uses. See notes/47.

import { doubleVowels } from '../reference.js'

export const DoubleVowels = {
  id: 'foundations-double-vowels',
  title: 'Double Vowels in the Hmong Language | Cov Txooj',
  summary: 'The two-letter vowels of Hmong — two letters, but one sound.',
  reference: 'vowels',
  steps: [
    {
      id: 'foundations-double-vowels-intro',
      kind: 'intro',
      title: 'Double Vowels in the Hmong Language | Cov Txooj',
      body: [
        'Double vowels are written with two letters but make ONE vowel sound. "ai" is not "a" then "i" — it is its own single vowel, the way "eye" is one sound in English.',
        'This is the piece that trips up new readers: seeing two letters and saying them separately. Read them as one unit.',
        'They sit in the same slot as a single vowel: consonant + vowel + tone. "Nplooj" = "Npl" (consonant) + "oo" (double vowel) + "j" (tone).',
        'Several of these end in a nasal sound — "aa", "ee", and "oo" carry an "n"/"ng" quality rather than a long version of the single vowel.', // TODO-VERIFY: nasal description for aa / ee / oo
      ],
    },
    {
      id: 'foundations-double-vowels-grid',
      kind: 'letters',
      title: 'The double vowels',
      intro: 'Two letters, one sound. Tap to hear each.',
      items: doubleVowels,
    },
    // Ends on a SPEAK DRILL, matching the consonant lessons. Replaced a
    // `mini-quiz` pointing at the shared 'alphabet-vowels' quiz — which tested
    // single AND double vowels, so finishing this lesson quizzed you on
    // letters it hadn't taught (notes/60).
    {
      id: 'foundations-double-vowels-speak',
      kind: 'speak-drill',
      title: 'Say the double vowels',
      familyId: 'family-vowel-double',
      blurb: 'Two letters, one sound — say each as a single unit.',
    },
  ],
}
