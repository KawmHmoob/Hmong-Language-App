// Standalone lesson: telling time and time-of-day words in Hmong.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const time = {
  id: 'numbers-time',
  title: 'Time Vocabulary',
  summary: 'Words for telling time and parts of the day.',
  vocab: 'timeframes',
  steps: [
    {
      id: 'numbers-time-intro',
      kind: 'intro',
      title: 'Talking about time',
      body: [
        'This lesson covers the words for parts of the day and how to tell the time in Hmong. It builds directly on the numbers lesson.',
        'Everyday Hmong often marks time by the part of the day — morning, midday, dark — rather than the clock. For clock time, "teev" (hour) does the work with a number in front: "ob teev" = two o\'clock.', // TODO-VERIFY: "ob teev" as natural clock-time phrasing
      ],
    },
    {
      id: 'numbers-time-examples',
      kind: 'examples',
      title: 'Times of day',
      intro: 'Read each word aloud.',
      items: [
        { hmong: 'Sawv ntxov', english: 'morning', note: 'Literally "rise early."' },
        { hmong: 'Tav su', english: 'noon / midday', note: 'Midday — the time of the midday meal.' }, // TODO-VERIFY: literal sense of "tav su"
        { hmong: 'Tav su tag', english: 'afternoon', note: '"Tag" = finished — after midday has passed.' },
        { hmong: 'Yav tsaus ntuj', english: 'evening / night', note: '"Tsaus ntuj" = the sky darkens.' },
        { hmong: 'Teev', english: "o'clock / hour", note: 'Pairs with numbers: "ib teev" = one o\'clock / one hour.' }, // TODO-VERIFY: hour vs o'clock usage
        { hmong: 'Tag kis', english: 'tomorrow', note: 'Also written together as "tagkis."' },
        { hmong: 'Nag hmo', english: 'last night / yesterday', note: 'Context decides between "yesterday" and "last night."' }, // TODO-VERIFY: primary sense of "nag hmo"
      ],
    },
    {
      id: 'numbers-time-quiz',
      kind: 'quiz',
      title: 'Learn the time words',
    },
  ],
}
