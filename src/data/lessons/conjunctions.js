// Standalone lesson: the words that join Hmong clauses together.
//
// PLACEHOLDER SCAFFOLD. The structure, the word set, and the study→quiz flow
// are real; the teaching prose is a first pass and the example items are pulled
// straight from the `conjunctions` vocabulary category (same Hmong, same
// glosses — nothing authored here). Audio is pending.
//
// Everything a native speaker should check is marked TODO-VERIFY.

export const conjunctions = {
  id: 'grammar-conjunctions',
  title: 'Conjunctions | Cov Lus Txuas',  // TODO-VERIFY: "Cov Lus Txuas" as the term for conjunctions
  summary: 'The joining words — and, but, because, or, if — and how Hmong chains clauses.',
  vocab: 'conjunctions',
  steps: [
    {
      id: 'grammar-conjunctions-intro',
      kind: 'intro',
      title: 'Joining two ideas',
      body: [
        'Once you can build a sentence, the next step is joining two of them. Conjunctions are the small words that do it — and, but, because, or, if.',

        '## The everyday joiners',
        'Start with the four you will use in almost every conversation:',
        '> Kuv thiab koj. — You and I.',
        '> Kuv mus nrog nws. — I go with him.',
        '> Kuv xav tiamsis tsis tau. — I want but cannot.',
        '> Kuv tsis mus vim hais tias kuv nyuaj siab. — I do not go because I am sad.',
        'Notice they sit BETWEEN the two things being joined, the same as in English. That much transfers directly.',

        '## "Ces" — and then',
        '"Ces" chains events in sequence: this happened, then that happened.',
        '> Kuv mus ces koj tuaj. — I go then you come.',
        'It also closes an "if" sentence, where English would use nothing at all:',
        '> Yog koj mus ces kuv tuaj. — If you go then I come.',
        '"Yog" opens the condition, "ces" introduces the result. The pair carries the whole if/then structure.',

        '## Pairs that overlap',
        'Several of these come in a short and a long form with the same gloss. Treat them as separate entries until you have heard both used in context:',
        '> vim  /  vim hais tias — because',
        '> yog  /  yog hais tias — if',
        '> los yog  /  lossis — or',
        '> tias  /  hais tias — (that)', // TODO-VERIFY: when the long vs short form of each pair is required

        '## The "that" words',
        'Three words land on English "that", and they do different jobs. Compare:',
        '> Tus neeg uas kuv pom. — The person that I saw.',
        '> Nws hais tias nws paub. — He said that he knows.',
        '"Uas" attaches a description to a noun — which person? the one I saw. "Hais tias" introduces something said or thought. They are not swappable.', // TODO-VERIFY: whether "tias" alone behaves like "hais tias" here
        'This is the hardest piece in the set. Listen for it in the Readings unit rather than memorising a rule.',

        '## Purpose and uncertainty',
        '> Koj mus kom kuv paub. — You go so that I know.',
        '> Kuv mus seb nws nyob. — I go to see if he is home.',
        '> Ntshe koj paub. — Maybe you know.',
        '"Kom" gives the purpose of an action, "seb" marks something being checked, and "ntshe" hedges the whole statement.',

        '## Split conjunctions',
        'A few wrap around the thing they modify instead of sitting in front of it:',
        '> txawm ... los — even though, although',
        '> tsuas ... xwb — only',
        'The second half is not optional — leaving it off changes or breaks the meaning.', // TODO-VERIFY: whether the second half is strictly required

        'Study the full set in the word bank — there are 24, and after the pronouns they are the words you will meet most often.',
      ],
    },
    {
      id: 'grammar-conjunctions-examples',
      kind: 'examples',
      title: 'The most common joiners',
      intro: 'A sample of the set. Read each aloud.',
      // Hmong + glosses copied verbatim from the `conjunctions` category.
      items: [
        { hmong: 'thiab', audio: 'grammar/conjunctions/hmong-conjunctions-thiab.mp3', english: 'and', note: 'The everyday "and" — also required with "feeb" when telling the time.' },
        { hmong: 'tiamsis', audio: 'grammar/conjunctions/hmong-conjunctions-tiamsis.mp3', english: 'but', note: 'Marks the contrast between two clauses.' },
        { hmong: 'vim', audio: 'grammar/conjunctions/hmong-conjunctions-vim.mp3', english: 'because', note: 'The short form. "Vim hais tias" is the longer one.' },
        { hmong: 'lossis', audio: 'grammar/conjunctions/hmong-conjunctions-lossis.mp3', english: 'or', note: 'Pairs with "los yog", which carries the same gloss.' },
        { hmong: 'yog hais tias', audio: 'grammar/conjunctions/hmong-conjunctions-yog-hais-tias.mp3', english: 'if', note: 'Opens a condition. "Yog" alone can also do this.' },
        { hmong: 'ces', audio: 'grammar/conjunctions/hmong-conjunctions-ces.mp3', english: 'then, so then', note: 'Chains events in sequence.' }, // TODO-VERIFY: "ces" as sequential chaining
        { hmong: 'nrog', audio: 'grammar/conjunctions/hmong-conjunctions-nrog.mp3', english: 'with', note: 'Joins a companion to the action.' },
        { hmong: 'uas', audio: 'grammar/conjunctions/hmong-conjunctions-uas.mp3', english: '(relative marker: that, which, who)', note: 'Introduces a description of the noun before it.' },
      ],
    },
    {
      id: 'grammar-conjunctions-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
