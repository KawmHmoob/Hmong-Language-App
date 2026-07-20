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
        'Teens stack ten plus the unit:',
        '> Kaum ib — eleven (ten-one)',
        '> Kaum ob — twelve (ten-two)',
        'Watch the tones closely — several numbers differ from other everyday words only by their tone letter, so saying them aloud matters more than reading them.',
      ],
    },
    {
      id: 'numbers-counting-examples',
      kind: 'examples',
      title: 'One through ten',
      intro: 'Read each number aloud.',
      items: [
        { hmong: 'Ib', audio: 'vocabulary/numbers/hmong-numbers-ib.mp3', english: 'one', note: 'Final -b marks the high tone.' },
        { hmong: 'Ob', audio: 'vocabulary/numbers/hmong-numbers-ob.mp3', english: 'two', note: 'Also a high tone (-b).' },
        { hmong: 'Peb', audio: 'vocabulary/numbers/hmong-numbers-peb.mp3', english: 'three', note: 'The same word as "we / us" — context tells them apart.' },
        { hmong: 'Plaub', audio: 'vocabulary/numbers/hmong-numbers-plaub.mp3', english: 'four', note: 'Also means "hair / fur" — another reason tones and context matter.' },
        { hmong: 'Tsib', audio: 'vocabulary/numbers/hmong-numbers-tsib.mp3', english: 'five', note: 'The "ts" is one consonant sound.' },
        { hmong: 'Rau', audio: 'vocabulary/numbers/hmong-numbers-rau.mp3', english: 'six', note: 'Also appears as "to / for" in other sentences — context separates them.' },
        { hmong: 'Xya', audio: 'vocabulary/numbers/hmong-numbers-xya.mp3', english: 'seven', note: 'RPA "x" sounds like English "s" in "see".' },
        { hmong: 'Yim', audio: 'vocabulary/numbers/hmong-numbers-yim.mp3', english: 'eight', note: 'Bare final (no tone letter) = the mid tone.' },
        { hmong: 'Cuaj', audio: 'vocabulary/numbers/hmong-numbers-cuaj.mp3', english: 'nine', note: 'Final -j marks the high-falling tone.' },
        { hmong: 'Kaum', audio: 'vocabulary/numbers/hmong-numbers-kaum.mp3', english: 'ten', note: 'Builds the teens: "kaum ib" = eleven.' },
        // Tens written SOLID, matching both the word bank and the recordings —
        // this lesson was the only place they were spaced.
        { hmong: 'Neesnkaum', audio: 'vocabulary/numbers/hmong-numbers-neesnkaum.mp3', english: 'twenty', note: 'Builds the twenties: "Neesnkaum ib" = twenty-one.' },
        { hmong: 'Pebcaug', audio: 'vocabulary/numbers/hmong-numbers-pebcaug.mp3', english: 'thirty', note: 'Builds the thirties: "Pebcaug ib" = thirty-one.' },
        { hmong: 'Plaubcaug', audio: 'vocabulary/numbers/hmong-numbers-plaubcaug.mp3', english: 'forty', note: 'Builds the forties: "Plaubcaug ib" = forty-one.' },
        { hmong: 'Tsibcaug', audio: 'vocabulary/numbers/hmong-numbers-tsibcaug.mp3', english: 'fifty', note: 'Builds the fifties: "Tsibcaug ib" = fifty-one.' },
        { hmong: 'Raucaum', audio: 'vocabulary/numbers/hmong-numbers-raucaum.mp3', english: 'sixty', note: 'Builds the sixties: "Raucaum ib" = sixty-one.' },
        { hmong: 'Xyacaum', audio: 'vocabulary/numbers/hmong-numbers-xyacaum.mp3', english: 'seventy', note: 'Builds the seventies: "Xyacaum ib" = seventy-one.' },
        { hmong: 'Yimcaum', audio: 'vocabulary/numbers/hmong-numbers-yimcaum.mp3', english: 'eighty', note: 'Builds the eighties: "Yimcaum ib" = eighty-one.' },
        { hmong: 'Cuajcaum', audio: 'vocabulary/numbers/hmong-numbers-cuajcaum.mp3', english: 'ninety', note: 'Builds the nineties: "Cuajcaum ib" = ninety-one.' },
        { hmong: 'Ib puas', audio: 'vocabulary/numbers/hmong-numbers-ib-puas.mp3', english: 'one hundred', note: '100' },
        { hmong: 'Puas', audio: 'vocabulary/numbers/hmong-numbers-puas.mp3', english: 'hundred', note: 'Used after a number to form hundreds (e.g. "Ob puas" = 200).' },
        { hmong: 'Txhiab', audio: 'vocabulary/numbers/hmong-numbers-txhiab.mp3', english: 'thousand', note: 'Used after a number to form thousands (e.g. "Ib txhiab" = 1,000).' },
        { hmong: 'Vam', audio: 'vocabulary/numbers/hmong-numbers-vam.mp3', english: 'ten thousand', note: 'Used after a number to form ten thousands (e.g. "Ib vam" = 10,000).' },
        { hmong: 'Plhom', audio: 'vocabulary/numbers/hmong-numbers-plhom.mp3', english: 'million', note: 'Used after a number to form millions (e.g. "Ib Plhom" = 1,000,000).' },
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
