// Standalone lesson: everyday Hmong greetings and farewells.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const greetingsFarewells = {
  id: 'vocab-greetings-farewells',
  title: 'Greetings and Farewells',
  summary: 'How to say hello, ask how someone is, and say goodbye in Hmong.',
  steps: [
    {
      id: 'vocab-greetings-farewells-intro',
      kind: 'intro',
      title: 'Saying hello and goodbye',
      body: [
        'Greetings are the first thing you will use in any conversation. Hmong has a handful of common phrases for hello, goodbye, and checking in on someone.',
        '"Nyob zoo" — literally "live well / be well" — works at any time of day; there are no separate words for good morning or good evening. Greetings are often followed straight away by a warm question like "Koj puas nyob zoo?" (How are you?). When greeting elders, greet them first — it is a sign of respect.',
      ],
    },
    {
      id: 'vocab-greetings-farewells-examples',
      kind: 'examples',
      title: 'Common greetings and farewells',
      intro: 'Read each phrase aloud.',
      items: [
        { hmong: 'Nyob zoo', english: 'Hello', note: 'Literally "live well" — the standard greeting at any hour.' },
        { hmong: 'Koj puas nyob zoo?', english: 'How are you?', note: '"Puas" turns a statement into a yes/no question — literally "are you well?"' },
        { hmong: 'Kuv nyob zoo', english: 'I am well', note: 'The natural reply: echo the greeting back with "kuv" (I).' },
        { hmong: 'Ua tsaug', english: 'Thank you', note: 'Literally "to do thanks."' },
        { hmong: 'Sib ntsib dua', english: 'See you again / Goodbye', note: 'Literally "meet each other again" — note the reciprocal "sib."' },
        { hmong: 'Mus zoo', english: 'Go well (farewell to the one leaving)', note: 'Said to the person who is leaving: "go well."' },
        { hmong: 'Nyob zoo', english: 'Stay well (farewell to the one staying)', note: 'The same words as "hello" — said by the person leaving to those who stay.' },
      ],
    },
    {
      id: 'vocab-greetings-farewells-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'How do you say "Thank you" in Hmong?',
      options: ['Ua tsaug', 'Nyob zoo', 'Thov txim', 'Mus zoo'],
      answer: 'Ua tsaug',
    },
  ],
}
