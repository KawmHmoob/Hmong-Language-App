// Standalone lesson: Hmong numbers.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const numbers = {
  id: 'numbers-counting',
  title: 'Numbers',
  summary: 'Counting in Hmong, from one upward.',
  vocab: 'numbers',
  reference: 'grammar',
  steps: [
    {
      id: 'numbers-counting-intro',
      kind: 'intro',
      title: 'Counting in Hmong',
      body: [
        'Hmong numbers are regular and quick to learn. Once you know one through ten, larger numbers build on the same words.',
        'Teens stack ten plus the unit: "kaum ib" (ten-one) = eleven, "kaum ob" = twelve. Watch the tones closely — several numbers differ from other everyday words only by their tone letter, so saying them aloud matters more than reading them.',
      ],
    },
    {
      id: 'numbers-counting-examples',
      kind: 'examples',
      title: 'One through ten',
      intro: 'Read each number aloud.',
      items: [
        { hmong: 'Ib', english: 'one', note: 'Final -b marks the high tone.' },
        { hmong: 'Ob', english: 'two', note: 'Also a high tone (-b).' },
        { hmong: 'Peb', english: 'three', note: 'The same word as "we / us" — context tells them apart.' },
        { hmong: 'Plaub', english: 'four', note: 'Also means "hair / fur" — another reason tones and context matter.' },
        { hmong: 'Tsib', english: 'five', note: 'The "ts" is one consonant sound.' },
        { hmong: 'Rau', english: 'six', note: 'Also appears as "to / for" in other sentences — context separates them.' },
        { hmong: 'Xya', english: 'seven', note: 'RPA "x" sounds like English "s" in "see".' },
        { hmong: 'Yim', english: 'eight', note: 'Bare final (no tone letter) = the mid tone.' },
        { hmong: 'Cuaj', english: 'nine', note: 'Final -j marks the high-falling tone.' },
        { hmong: 'Kaum', english: 'ten', note: 'Builds the teens: "kaum ib" = eleven.' },
        { hmong: 'Nees nkaum', english: 'twenty', note: 'Builds the twenties: "Nees nkaum ib" = twenty-one.' },
        { hmong: 'Peb caug', english: 'thirty', note: 'Builds the thirties: "Peb caug ib" = thirty-one.' },
        { hmong: 'Plaub caug', english: 'forty', note: 'Builds the forties: "Plaub caug ib" = forty-one.' },
        { hmong: 'Tsib caug', english: 'fifty', note: 'Builds the fifties: "Tsib caug ib" = fifty-one.' },
        { hmong: 'Rau caum', english: 'sixty', note: 'Builds the sixties: "Rau caum ib" = sixty-one.' },
        { hmong: 'Xya caum', english: 'seventy', note: 'Builds the seventies: "Xya caum ib" = seventy-one.' },
        { hmong: 'Yim caum', english: 'eighty', note: 'Builds the eighties: "Yim caum ib" = eighty-one.' },
        { hmong: 'Cuaj caum', english: 'ninety', note: 'Builds the nineties: "Cuaj caum ib" = ninety-one.' },
        { hmong: 'Ib puas', english: 'one hundred', note: '100' },
        { hmong: 'Puas', english: 'hundred', note: 'Used after a number to form hundreds (e.g. "Ob puas" = 200).' },
        { hmong: 'Txhiab', english: 'thousand', note: 'Used after a number to form thousands (e.g. "Ib txhiab" = 1,000).' },
        { hmong: 'Vam', english: 'ten thousand', note: 'Used after a number to form ten thousands (e.g. "Ib vam" = 10,000).' },
        { hmong: 'Plhom', english: 'million', note: 'Used after a number to form millions (e.g. "Ib Plhom" = 1,000,000).' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'numbers-counting-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'What is the Hmong word for "five"?',
      options: ['Tsib', 'Plaub', 'Rau', 'Cuaj'],
      answer: 'Tsib',
    },*/
    {
      id: 'numbers-counting-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
