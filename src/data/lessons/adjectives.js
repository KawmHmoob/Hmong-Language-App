// Standalone lesson: describing words in Hmong.
//
// PLACEHOLDER SCAFFOLD. Structure and word set are real; the teaching prose is
// a first pass and every example item is pulled straight from the
// `descriptions` vocabulary category (same Hmong, same glosses — nothing
// authored here). Audio is pending.
//
// SCOPE: this lesson maps to the `descriptions` category only. Colors and the
// "siab" personality expressions are also adjectives but live in their own
// categories, and a lesson can only declare one `vocab:`. They want their own
// lessons — see notes/61.
//
// Everything a native speaker should check is marked TODO-VERIFY.

export const adjectives = {
  id: 'grammar-adjectives',
  title: 'Adjectives | Cov Lus Piav Qhia',  // TODO-VERIFY: "Cov Lus Piav Qhia" as the term for adjectives
  summary: 'Describing words — big, small, good, bad — and why Hmong needs no "to be" in front of them.',
  vocab: 'descriptions',
  steps: [
    {
      id: 'grammar-adjectives-intro',
      kind: 'intro',
      title: 'Describing things',
      body: [
        'Adjectives are the words that describe — big, small, new, old, good, bad. Hmong puts them in two places English does not expect, so the grammar is worth a minute before the vocabulary.',

        '## No "to be" in front of them',
        'This is the rule from the "yog" lesson, seen from the other side. "Yog" links a noun to another noun, and it is NOT used before an adjective. The adjective simply follows the thing it describes, and that is the whole sentence:',
        '> Tsev no loj. — This house is big.',
        '> Me nyuam no me. — This child is small.',
        '> Nws siab heev. — He is very tall.',
        'Look at the first one word by word: "tsev" (house), "no" (this), "loj" (big). There is no word for "is" anywhere in it. That absence is the rule — and it trips up English speakers constantly, because the sentence feels unfinished without it.',
        'The third adds "heev" (very), which sits AFTER the adjective, not before it.',

        '## They follow the noun',
        'Where English puts the adjective first ("the new house"), Hmong puts it last. With a classifier in front, the order runs classifier → noun → adjective:',
        '> Lub tsev tshiab. — The new house.',
        '> Lub tsev qub. — The old house.',
        '> Tus neeg phem. — The bad person.',
        '"Lub" and "tus" are the classifiers from the classifiers lesson — the adjective goes on the far end, after the thing it describes.',

        '## Pairs worth learning together',
        'A lot of this set is opposites, and they are far easier to hold in pairs than one at a time:',
        '> loj / me — big / small',
        '> tshiab / qub — new / old',
        '> zoo / phem — good / bad',
        '> ntev / luv — long / short',
        '> nquag / tub nkeeg — diligent / lazy',

        '## Two words for "many"',
        '"Ntau" and "coob" both gloss as "many", but they are not interchangeable — "coob" is for animate things, "ntau" for everything else:',
        '> Dej ntau. — There is a lot of water.',
        '> Neeg coob. — Many people.',
        'Water takes "ntau", people take "coob". Using the wrong one is a common beginner tell.', // TODO-VERIFY: whether animacy is the exact rule, or something narrower
        'The same care applies to "luv" and "qib taub", which both gloss as "short".', // TODO-VERIFY: difference between luv and qib taub

        '## Describing people',
        '"Zoo" (good) combines to describe appearance, and the pair is gendered:',
        '> Nws zoo nkauj. — She is pretty.',
        '> Nws zoo nraug. — He is handsome.',
        'Note that "nws" covers he, she, and it — so the adjective, not the pronoun, is what tells you who is being described.',

        'Study the full set in the word bank, then come back for the quiz.',
      ],
    },
    {
      id: 'grammar-adjectives-examples',
      kind: 'examples',
      title: 'Common describing words',
      intro: 'A sample of the set, mostly in opposite pairs. Read each aloud.',
      // Hmong + glosses copied verbatim from the `descriptions` category.
      items: [
        { hmong: 'loj', audio: 'grammar/adjectives/hmong-common-adjectives-loj.mp3', english: 'big, large, older', note: 'Also used for age — an older sibling is the "big" one.' }, // TODO-VERIFY: "loj" for seniority
        { hmong: 'me', audio: 'grammar/adjectives/hmong-common-adjectives-me.mp3', english: 'small, young', note: 'The opposite of "loj", and likewise used for age.' },
        { hmong: 'zoo', audio: 'grammar/adjectives/hmong-common-adjectives-zoo.mp3', english: 'good', note: 'Very common — it is the "zoo" in "nyob zoo" and "zoo nkauj".' },
        { hmong: 'phem', audio: 'grammar/adjectives/hmong-common-adjectives-phem.mp3', english: 'bad', note: 'The opposite of "zoo". Appears in "siab phem" (mean).' },
        { hmong: 'tshiab', audio: 'grammar/adjectives/hmong-common-adjectives-tshiab.mp3', english: 'new', note: '' },
        { hmong: 'qub', audio: 'grammar/adjectives/hmong-common-adjectives-qub.mp3', english: 'old', note: 'Of things, not of people.' }, // TODO-VERIFY: whether "qub" is things-only
        { hmong: 'ntau', audio: 'grammar/adjectives/hmong-common-adjectives-ntau.mp3', english: 'many (objects)', note: 'For inanimate things. Use "coob" for people and animals.' },
        { hmong: 'coob', audio: 'grammar/adjectives/hmong-common-adjectives-coob.mp3', english: 'many (animate)', note: 'For people and animals only.' },
        { hmong: 'zoo nkauj', audio: 'grammar/adjectives/hmong-common-adjectives-zoo-nkauj.mp3', english: 'pretty', note: 'Literally "good" + "nkauj" — said of women.' }, // TODO-VERIFY: gendered use of zoo nkauj vs zoo nraug
        { hmong: 'zoo nraug', audio: 'grammar/adjectives/hmong-common-adjectives-zoo-nraug.mp3', english: 'handsome', note: 'The counterpart of "zoo nkauj" — said of men.' },
      ],
    },
    {
      id: 'grammar-adjectives-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
