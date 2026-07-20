// Standalone lesson: the single vowels of Hmong RPA.
// PLACEHOLDER SCAFFOLD — teaching prose only.
//
// The vowel grid IS shown here, via the `letters` step kind, which renders the
// SAME <LetterGrid> the Reference page uses. Data from reference.js (one
// source), presentation from the shared component (one look). See notes/47.

import { singleVowels } from '../reference.js'

export const SingleVowels = {
    id: 'foundations-single-vowels',
    title: 'Vowels in the Hmong Language | Cov Tab',
    summary: "An introduction to vowels in the Hmong Language",
    reference: 'vowels',
    steps: [
        {
            id: "foundations-vowels-intro",
            kind: "intro",
            title: "Singular Vowels in the Hmong Language | Cov Tab",
            body: [
                "Hmong has 5 main single vowels — the second piece of every syllable, sitting between the consonant and the tone. Getting them right matters: a vowel is what carries the tone's pitch, so a mispronounced vowel makes the tone hard to hear too.",
                "They build directly off consonants, filling the middle slot of the formula from the word-structure lesson:",
                "> Nplooj — Npl (consonant) + oo (vowel) + j (tone)",
                "Six letters are used to write these five sounds (a, e, i, o, u, and the schwa w) — the grid below plays each one on its own so you can hear the difference before you see it in a full word.",
            ]

        },
        {
            id: 'foundations-single-vowels-grid',
            kind: 'letters',
            title: 'The single vowels',
            intro: 'One letter, one vowel sound. Tap to hear each.',
            items: singleVowels,
        },
        // Ends on a SPEAK DRILL, matching the consonant lessons — you can't
        // show you can say a vowel by clicking a multiple-choice option. This
        // replaced a `mini-quiz` step that pointed at the shared
        // 'alphabet-vowels' quiz (notes/50, notes/60).
        {
            id: 'foundations-single-vowels-speak',
            kind: 'speak-drill',
            title: 'Say the single vowels',
            familyId: 'family-vowel-single',
            blurb: 'One letter, one sound. Listen, then say each one.',
        },
    ]


}
