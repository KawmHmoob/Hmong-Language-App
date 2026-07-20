// Standalone lesson: the tense/aspect markers that place a Hmong verb in time.
// Written 2026-07-16 — this is the lesson the action-verbs intro promises
// ("you will meet these markers properly in a later lesson").
// Cheat sheet: the Tense Markers table in src/data/reference.js.

export const tenseMarkers = {
  id: 'foundations-tense-markers',
  title: 'Tense Markers',
  summary: 'How Hmong says when something happens — without changing the verb.',
  vocab: 'tense-markers',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-tense-markers-intro',
      kind: 'intro',
      title: 'Time without conjugation',
      body: [
        'English changes the verb itself to move through time: eat, ate, eating, will eat. Hmong never does this. "Noj" is always "noj" — what changes is the small marker word placed around it.',
        'That means there is nothing to memorize verb-by-verb. Learn five little words once, and every verb you know is instantly available in past, present, and future.',
        'Two of them sit BEFORE the verb, and one sits at the very END of the sentence — position is part of the meaning:',
        '> Kuv yuav noj. — I will eat. (marker before the verb)',
        '> Kuv noj lawm. — I already ate. (marker after the verb)',
      ],
    },
    {
      id: 'foundations-tense-markers-examples',
      kind: 'examples',
      title: 'The five markers',
      intro: 'Read each one aloud with the verb "noj" (to eat).',
      items: [
        {
          hmong: 'tab tom', audio: 'grammar/tense-markers/hmong-tense-markers-tabtom.mp3',
          english: 'Currently (-ing)',
          note: 'Goes before the verb: "Kuv tab tom noj" — I am eating.',
        },
        {
          hmong: 'yuav', audio: 'grammar/tense-markers/hmong-tense-markers-yuav.mp3',
          english: 'Will (future)',
          note: 'Goes before the verb: "Kuv yuav noj" — I will eat.',
        },
        {
          hmong: 'tau', audio: 'grammar/tense-markers/hmong-tense-markers-tau.mp3',
          english: 'Already (past completed)',
          note: 'Goes before the verb: "Kuv tau noj" — I have eaten / I did eat.',
        },
        {
          hmong: 'tseem', audio: 'grammar/tense-markers/hmong-tense-markers-tseem.mp3',
          english: 'Still',
          note: 'Goes before the verb: "Kuv tseem noj" — I am still eating.',
        },
        {
          hmong: 'lawm', audio: 'grammar/tense-markers/hmong-tense-markers-lawm.mp3',
          english: 'Completed (sentence-final)',
          note: 'Goes at the END: "Kuv noj lawm" — I ate / I have eaten already.',
        },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-tense-markers-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which marker would you use to say "I WILL eat"?',
      options: ['Yuav', 'Tau', 'Tseem', 'Lawm'],
      answer: 'Yuav',
    },*/
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-tense-markers-practice-2',
      kind: 'practice',
      title: 'One more',
      prompt: 'Where does "lawm" go in the sentence?',
      options: [
        'At the very end of the sentence',
        'Directly before the verb',
        'At the start of the sentence',
        'It replaces the verb',
      ],
      answer: 'At the very end of the sentence',
    },*/
    {
      id: 'foundations-tense-markers-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
