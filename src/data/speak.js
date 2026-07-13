// Speak section data — phrases for pronunciation practice.
//
// Schema (one group → many phrases):
//   {
//     id, title, description,
//     phrases: [{
//       id,        REQUIRED — globally unique, namespaced `speak-…`; used
//                  as-is as the progress key in completedSteps
//       hmong,     REQUIRED — the phrase in RPA
//       english,   REQUIRED
//       audio,     '' when no native recording exists yet, otherwise an
//                  absolute path like '/assets/audio/nyob-zoo.mp3'
//       tip,       optional — a short pronunciation/tone pointer
//       tier,      optional — 'pro' gates the phrase behind the paywall
//     }]
//   }
//
// Edit by hand like every other file in src/data/. When a real recording
// lands, fill in `audio` — the Speak UI upgrades itself (Listen + A/B
// compare appear automatically).

export const speakGroups = [
  {
    id: 'speak-greetings',
    title: 'Greetings',
    description: 'The phrases you will say most — get these tones right first.',
    phrases: [
      {
        id: 'speak-nyob-zoo',
        hmong: 'Nyob zoo',
        english: 'Hello',
        audio: '',
        tip: 'Both syllables carry a high, even tone — keep them level, don’t let "zoo" fall.',
      },
      {
        id: 'speak-koj-puas-nyob-zoo',
        hmong: 'Koj puas nyob zoo?',
        english: 'How are you?',
        audio: '',
        tip: 'The "-j" in "Koj" is a falling tone: start high, drop.',
      },
      {
        id: 'speak-kuv-nyob-zoo',
        hmong: 'Kuv nyob zoo',
        english: 'I am well',
        audio: '',
        tip: '"Kuv" ends in -v: a mid-rising tone, like asking a tiny question.',
      },
      {
        id: 'speak-sib-ntsib-dua',
        hmong: 'Sib ntsib dua',
        english: 'See you again',
        audio: '',
        tip: 'The -b endings are high tones; keep the pitch up on both.',
      },
      {
        id: 'speak-mus-zoo',
        hmong: 'Mus zoo',
        english: 'Go well (to the one leaving)',
        audio: '',
        tip: '"Mus" ends in -s: a low tone. Start low, stay low, then lift into "zoo".',
      },
    ],
  },
  {
    id: 'speak-politeness',
    title: 'Politeness',
    description: 'Thank you, sorry, please — small words, big goodwill.',
    phrases: [
      {
        id: 'speak-ua-tsaug',
        hmong: 'Ua tsaug',
        english: 'Thank you',
        audio: '',
        tip: '"Tsaug" ends in -g: a breathy low falling tone.',
      },
      {
        id: 'speak-thov-txim',
        hmong: 'Thov txim',
        english: 'Sorry / excuse me',
        audio: '',
        tip: '"Thov" rises (-v); "txim" stays level. Mind the aspirated "Th".',
      },
      {
        id: 'speak-tsis-ua-li-cas',
        hmong: 'Tsis ua li cas',
        english: "You're welcome / no worries",
        audio: '',
        tip: 'Four quick syllables — keep the rhythm even rather than rushing the middle.',
      },
    ],
  },
  {
    id: 'speak-introductions',
    title: 'Introductions',
    description: 'Names, ages, where you live — your first real conversation.',
    phrases: [
      {
        id: 'speak-koj-lub-npe',
        hmong: 'Koj lub npe hu li cas?',
        english: 'What is your name?',
        audio: '',
        tip: 'The "np" in "npe" is prenasalized — a quick "n" melting into "p".',
        tier: 'pro',
      },
      {
        id: 'speak-kuv-lub-npe',
        hmong: 'Kuv lub npe hu ua…',
        english: 'My name is…',
        audio: '',
        tip: 'Practice sliding your own name onto the end without dropping the tone of "ua".',
        tier: 'pro',
      },
      {
        id: 'speak-koj-nyob-qhov-twg',
        hmong: 'Koj nyob qhov twg?',
        english: 'Where do you live?',
        audio: '',
        tip: '"Qhov" starts deep in the throat — an aspirated q, further back than English k.',
        tier: 'pro',
      },
    ],
  },
]

// ── Helpers — pure lookups over the data above ──────────────────────────────

export function allPhrases() {
  return speakGroups.flatMap((g) => g.phrases)
}

export function getPhrase(phraseId) {
  return allPhrases().find((p) => p.id === phraseId) || null
}

// Neighbors in display order, for prev/next navigation on the practice screen.
export function adjacentPhrases(phraseId) {
  const list = allPhrases()
  const i = list.findIndex((p) => p.id === phraseId)
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  }
}

// The progress key stored in ProgressContext.completedSteps for a phrase.
// Phrase ids already carry the `speak-` namespace, so the key is the id
// itself — this wrapper exists so every consumer derives it the same way.
export function speakStepId(phraseId) {
  return phraseId
}
