// Standalone lesson: telling time and time-of-day words in Hmong.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

// Exported as `timeExplained`, NOT `time` — time.js already exports `time`, and
// two modules exporting the same name collide the moment lessons.js imports
// both. Step ids below are likewise prefixed `time-explained-`: ids are
// progress keys, so reusing `numbers-time-*` would have made finishing a step
// here mark the same step complete in the other lesson.
export const timeExplained = {
  id: 'time-explained',
  title: 'Time Explained | Yog pestsawg teev lawm? What time is it? (ADVENTURE TIME!)',
  summary: 'Explaining how to tell time, articulate literal time.',
  vocab: 'timeframes',
  steps: [
    {
      id: 'time-explained-intro',
      kind: 'intro',
      title: 'Telling the time',
      // Rewritten for structure, NOT for content: every Hmong string below is
      // the original text, unchanged. Only the English framing was reorganised —
      // into sections, with each Hmong form on its own '> ' example line so the
      // pattern is visible instead of buried mid-sentence. See notes/59.
      body: [
        'Once you know the numbers and the time-of-day words, telling the time is a matter of putting them in the right order. That order barely changes, so this lesson is mostly one pattern learned four times.',

        '## The pattern',
        'Read a Hmong clock the same way you read the face: the hour first, then the minutes. The word holding it together is "teev".', // TODO-VERIFY: "ob teev" as natural clock-time phrasing
        '"Teev" covers both "o\'clock" and "hour". On its own it simply means hour, which is why the same word also counts duration — more on that at the end.',
        '> 2:30 — Ob teev pebcaug',

        '## The "mus" variant',
        'You will also hear "mus" (to go) slipped in after "teev". It is less common, and the meaning does not change at all.',
        '> 2:30 — Ob teev mus pebcaug', // was "pescaug" — the other three uses say "pebcaug" (peb caug = 3×10 = 30)

        '## When you use "thiab"',
        '"Thiab" means "and". The moment you use it, the word "feeb" ("minute") becomes required — you are no longer reading a clock face, you are counting two quantities.',
        '> 3:46 — Peb teev thiab plaubcaum rau feeb',
        'Literally: "three hours and forty-six minutes."',

        '## Morning and evening',
        'Hmong has no separate a.m. / p.m. markers. You tag the part of the day onto the END of the phrase: "sawv ntxov" for morning, "tsaus ntuj" for evening and night.',
        '> 6:30 a.m. — Rau teev pebcaug sawv ntxov',
        '> 5:25 p.m. — Tsib teev neesnkaum tsib tsaus ntuj',
        '> 4:00 p.m. — Tamsim nov yog plaub teev tsuas ntuj', // TODO-VERIFY: "tsuas ntuj" here vs "tsaus ntuj" above — likely the same word
        'And inside a full sentence:',
        '> Lub teevsij hais tias nws peb teev mus plaubcaum tsib tsaus ntuj',
        'The clock says it is 3:45 p.m.',

        '## "Teev" for duration, not the clock',
        'The same word measures how long something lasted. Nothing about the time of day is implied here — context does all the work.',
        '> Kuv sau ntawv tau ob teev — I wrote for 2 hours.',
        '> Koj lub teevsij yog pestsawg teev? — What time does your clock say?',
        '> Kuv yuav muag koj pebcaug feeb ua koj daim tsev kawm ntawv lossis wb yuav sib ntaus — I will give you 30 minutes to do your homework, or we will fight each other.', // TODO-VERIFY: "muag" (to sell) where the gloss says "give" — likely "muab"
        '> Tamsim nov yog plaub teev — Right now it is 4 o\'clock.',

        'This one takes a while to feel natural, and that is normal — the order is simply different from English. The passages in the Readings unit use these constructions in context, which is the fastest way to make them stick.',
      ],

    },
    {
      id: 'time-explained-examples',
      kind: 'examples',
      title: 'The clock words',
      // Narrowed to the words this lesson actually USES to build a time.
      // "Tag kis" / "Nag hmo" moved out — they're relative DAYS, and the
      // numbers-time lesson already teaches them. A lesson's examples should be
      // the pieces of the thing it's explaining, not everything time-adjacent.
      intro: 'The words every spoken time is built from. Read each aloud.',
      items: [
        { hmong: 'Teev', audio: 'vocabulary/timeframes/hmong-time-teev.mp3', english: "o'clock / hour", note: 'Pairs with a number: "ib teev" = one o\'clock — or one hour, when counting duration.' }, // TODO-VERIFY: hour vs o'clock usage
        { hmong: 'Feeb', audio: 'vocabulary/timeframes/hmong-time-feeb.mp3', english: 'minute', note: 'Required after "thiab" when stating an exact time.' },
        // "Teev sij", not "Lub Teevsij" — the recording is of the bare word.
        // The vocabulary entry (id: time-teevsij) is spelled the same way; the
        // classifier is worth knowing ("lub teev sij" = the clock) but isn't
        // part of what was recorded, so it stays in the note instead.
        { hmong: 'Teev sij', audio: 'vocabulary/timeframes/hmong-time-teev-sij.mp3', english: 'clock / watch', note: 'Takes "lub" as its classifier: "lub teev sij" = the clock.' },
        { hmong: 'Sawv ntxov', audio: 'vocabulary/timeframes/hmong-time-sawv-ntxov.mp3', english: 'morning — a.m.', note: 'Literally "rise early." Goes at the END of the time.' },
        { hmong: 'Tsaus ntuj', audio: 'vocabulary/timeframes/hmong-time-tsaus-ntuj.mp3', english: 'evening / night — p.m.', note: 'Literally "the sky darkens." Also goes at the end.' },
        // { hmong: 'Tav su', audio: 'vocabulary/timeframes/hmong-time-tavsu.mp3', english: 'noon / midday', note: 'The hinge between sawv ntxov and tsaus ntuj.' }, // TODO-VERIFY: literal sense of "tav su"
      ],
    },
    {
      // A SPEAKING check, not a multiple-choice one. Telling the time is a
      // production skill — you can pick "6:30" off a list without being able to
      // say "rau teev pebcaug sawv ntxov". See notes/58.
      id: 'time-explained-speak',
      kind: 'speak-drill',
      title: 'Say the time',
      familyId: 'family-time-clock',
      blurb: 'Build each time out loud: hour → teev → minutes → a.m./p.m.',
    },
    {
      id: 'time-explained-quiz',
      kind: 'quiz',
      title: 'Learn the time words',
    },
  ],
}
