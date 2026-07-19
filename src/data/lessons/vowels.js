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

                "There are a total of 5 main singular vowels in the Hmong language",
                "Hmong vowels are nessecary to understand in order to pronounce Hmong words correctly",
                "Vowels build off of constonants - for example: 'Nplooj' = ",
                "'Npl' (consonant) + 'oo' (vowel) + 'j' (tone)"


            ]

        },
        {
            id: 'foundations-single-vowels-grid',
            kind: 'letters',
            title: 'The single vowels',
            intro: 'One letter, one vowel sound. Tap to hear each.',
            items: singleVowels,
        },
        {
            id: 'foundations-single-vowels-quiz',
            kind: 'mini-quiz',
            title: 'Vowels mini-quiz',
            quizId: 'alphabet-vowels',
        },
    ]


}
