// Reference data — the things you LOOK UP, not the things you're taught.
//
// Job split (see notes/34): a table here STATES a fact ("txoj = long, winding
// things"); a lesson in src/data/lessons/ EXPLAINS it. Same content, different
// moment — cross-linked, not duplicated. Keep tables terse: no teaching prose.
//
// Exports: consonants, doubleConsonants, vowels, tones, grammar
// (grammar arrived here when the old /course page dissolved.)

export const consonants = [
  { letter: 'c', sound: 'j (English)' },
  { letter: 'ch', sound: 'ch' },
  { letter: 'd', sound: 'd' },
  { letter: 'dh', sound: 'd-h' },
  { letter: 'f', sound: 'f' },
  { letter: 'h', sound: 'h' },
  { letter: 'hl', sound: 'voiceless l' },
  { letter: 'hm', sound: 'voiceless m' },
  { letter: 'hn', sound: 'voiceless n' },
  { letter: 'k', sound: 'k' },
  { letter: 'kh', sound: 'k-h' },
  { letter: 'l', sound: 'l' },
  { letter: 'm', sound: 'm' },
  { letter: 'n', sound: 'n' },
  { letter: 'nc', sound: 'nj' },
  { letter: 'np', sound: 'mb' },
  { letter: 'nq', sound: 'ng-g (uvular)' },
  { letter: 'nt', sound: 'nd' },
  { letter: 'nts', sound: 'ndz' },
  { letter: 'ntx', sound: 'ndj' },
  { letter: 'ny', sound: 'ny' },
  { letter: 'p', sound: 'p' },
  { letter: 'ph', sound: 'p-h' },
  { letter: 'pl', sound: 'pl' },
  { letter: 'q', sound: 'k (uvular)' },
  { letter: 'qh', sound: 'q-h' },
  { letter: 'r', sound: 'tr' },
  { letter: 'rh', sound: 'tr-h' },
  { letter: 's', sound: 'sh' },
  { letter: 't', sound: 't' },
  { letter: 'th', sound: 't-h' },
  { letter: 'ts', sound: 'ts' },
  { letter: 'tsh', sound: 'tsh' },
  { letter: 'tx', sound: 'ts (English)' },
  { letter: 'txh', sound: 'tx-h' },
  { letter: 'v', sound: 'v' },
  { letter: 'x', sound: 's' },
  { letter: 'xy', sound: 'sh-y' },
  { letter: 'y', sound: 'y' },
  { letter: 'z', sound: 'zh' },
]

export const doubleConsonants = [
  { letter: 'Ch', audio: '/assets/audio/double-consonant-ch.mp3', exampleWord: 'Chiaj' },
  { letter: 'Dh', audio: '/assets/audio/double-consonant-dh.mp3', exampleWord: '' },
  { letter: 'Dl', audio: '/assets/audio/double-consonant-dl.mp3', exampleWord: '' },
  { letter: 'Hl', audio: '/assets/audio/double-consonant-hl.mp3', exampleWord: '' },
  { letter: 'Hm', audio: '/assets/audio/double-consonant-hm.mp3', exampleWord: '' },
  { letter: 'Hn', audio: '/assets/audio/double-consonant-hn.mp3', exampleWord: '' },
  { letter: 'Kh', audio: '/assets/audio/double-consonant-kh.mp3', exampleWord: '' },
  { letter: 'Ml', audio: '/assets/audio/double-consonant-ml.mp3', exampleWord: '' },
  { letter: 'Nc', audio: '/assets/audio/double-consonant-nc.mp3', exampleWord: '' },
  { letter: 'Nk', audio: '/assets/audio/double-consonant-nk.mp3', exampleWord: '' },
  { letter: 'Np', audio: '/assets/audio/double-consonant-np.mp3', exampleWord: '' },
  { letter: 'Nq', audio: '/assets/audio/double-consonant-nq.mp3', exampleWord: '' },
  { letter: 'Nt', audio: '/assets/audio/double-consonant-nt.mp3', exampleWord: '' },
  { letter: 'Ny', audio: '/assets/audio/double-consonant-ny.mp3', exampleWord: '' },
  { letter: 'Ph', audio: '/assets/audio/double-consonant-ph.mp3', exampleWord: '' },
  { letter: 'Pl', audio: '/assets/audio/double-consonant-pl.mp3', exampleWord: '' },
  { letter: 'Qh', audio: '/assets/audio/double-consonant-qh.mp3', exampleWord: '' },
  { letter: 'Rh', audio: '/assets/audio/double-consonant-rh.mp3', exampleWord: '' },
  { letter: 'Th', audio: '/assets/audio/double-consonant-th.mp3', exampleWord: '' },
  { letter: 'Ts', audio: '/assets/audio/double-consonant-ts.mp3', exampleWord: '' },
  { letter: 'Tx', audio: '/assets/audio/double-consonant-tx.mp3', exampleWord: '' },
  { letter: 'Xy', audio: '/assets/audio/double-consonant-xy.mp3', exampleWord: '' },
]

export const vowels = [
  { letter: 'a', sound: 'ah' },
  { letter: 'e', sound: 'eh' },
  { letter: 'i', sound: 'ee' },
  { letter: 'o', sound: 'aw' },
  { letter: 'u', sound: 'oo' },
  { letter: 'w', sound: 'uh (schwa)' },
  { letter: 'aa', sound: 'an' },
  { letter: 'ai', sound: 'eye' },
  { letter: 'au', sound: 'ow' },
  { letter: 'aw', sound: 'aw-uh' },
  { letter: 'ee', sound: 'eng' },
  { letter: 'ia', sound: 'ee-ah' },
  { letter: 'oo', sound: 'ong' },
  { letter: 'ua', sound: 'oo-ah' },
]

export const tones = [
  { marker: 'b', name: 'High', description: 'High level tone', example: 'pob (ball)' },
  { marker: 'j', name: 'High-falling', description: 'Falls from high', example: 'poj (female)' },
  { marker: 'v', name: 'Mid-rising', description: 'Rises to mid', example: 'pov (throw)' },
  { marker: '', name: 'Mid', description: 'Mid level (no marker)', example: 'po (spleen)' },
  { marker: 's', name: 'Low', description: 'Low level tone', example: 'pos (thorn)' },
  { marker: 'g', name: 'Mid-low breathy', description: 'Breathy mid-low', example: 'pog (grandma)' },
  { marker: 'm', name: 'Low-falling glottalized', description: 'Creaky low-falling', example: 'pom (see)' },
  { marker: 'd', name: 'Low-rising', description: 'Rises from low (rare)', example: 'pod (?)' },
]

// ── Grammar cheat sheets ────────────────────────────────────────────────────
// Came from the dissolved /course page. These are LOOKUP tables — the "what",
// stripped of teaching. `lesson` points at the Learn lesson that explains the
// "why", and the Reference page renders it as a "Learn this →" link. Omit
// `lesson` when no lesson covers the table yet.

export const grammar = [
  {
    title: 'Pronouns',
    note: 'Hmong marks singular, dual (exactly two), and plural.',
    lesson: { unitId: 'foundations', lessonId: 'foundations-pronouns' },
    items: [
      { hmong: 'Kuv', english: 'I' },
      { hmong: 'Koj', english: 'You (singular)' },
      { hmong: 'Nws', english: 'He / she / it' },
      { hmong: 'Wb', english: 'We two' },
      { hmong: 'Neb', english: 'You two' },
      { hmong: 'Nkawd', english: 'They two' },
      { hmong: 'Peb', english: 'We (plural)' },
      { hmong: 'Nej', english: 'You (plural)' },
      { hmong: 'Lawv', english: 'They' },
    ],
  },
  {
    title: 'Common Verbs',
    note: 'Verbs never conjugate — tense comes from the markers below.',
    lesson: { unitId: 'foundations', lessonId: 'foundations-action-verbs' },
    items: [
      { hmong: 'Mus', english: 'To go' },
      { hmong: 'Los', english: 'To come' },
      { hmong: 'Noj', english: 'To eat' },
      { hmong: 'Haus', english: 'To drink' },
      { hmong: 'Hais', english: 'To say / speak' },
      { hmong: 'Pom', english: 'To see' },
      { hmong: 'Paub', english: 'To know' },
      { hmong: 'Ua', english: 'To do / make' },
    ],
  },
  {
    title: 'Tense Markers',
    note: 'Small words placed around the verb to place it in time.',
    lesson: { unitId: 'foundations', lessonId: 'foundations-tense-markers' },
    items: [
      { hmong: 'tab tom', english: 'Currently (-ing)' },
      { hmong: 'yuav', english: 'Will (future)' },
      { hmong: 'tau', english: 'Already (past completed)' },
      { hmong: 'tseem', english: 'Still' },
      { hmong: 'lawm', english: 'Sentence-final completed marker' },
    ],
  },
  {
    title: 'Question Words',
    note: 'These usually sit at the END of the sentence in Hmong.',
    lesson: { unitId: 'numbers-and-time', lessonId: 'numbers-how-much' },
    items: [
      { hmong: 'Dab tsi?', english: 'What?' },
      { hmong: 'Leej twg?', english: 'Who?' },
      { hmong: 'Qhov twg?', english: 'Where?' },
      { hmong: 'Thaum twg?', english: 'When?' },
      { hmong: 'Vim li cas?', english: 'Why?' },
      { hmong: 'Li cas?', english: 'How?' },
      { hmong: 'Pes tsawg?', english: 'How much / how many?' },
    ],
  },
  {
    title: 'Noun Classifiers',
    note: 'Pattern: number + classifier + noun — "ib tug dev" (one dog).',
    lesson: { unitId: 'foundations', lessonId: 'foundations-noun-classifiers' },
    items: [
      { hmong: 'Tus', english: 'People and animals' },
      { hmong: 'Lub', english: 'Round / 3-D objects' },
      { hmong: 'Daim', english: 'Flat objects' },
      { hmong: 'Txoj', english: 'Long, winding things' },
      { hmong: 'Rab', english: 'Tools / weapons' },
      { hmong: 'Phau', english: 'Books' },
    ],
  },
  {
    title: 'Numbers 1–10',
    note: 'Teens stack on kaum: "kaum ib" = eleven.',
    lesson: { unitId: 'numbers-and-time', lessonId: 'numbers-counting' },
    items: [
      { hmong: 'Ib', english: 'One' },
      { hmong: 'Ob', english: 'Two' },
      { hmong: 'Peb', english: 'Three' },
      { hmong: 'Plaub', english: 'Four' },
      { hmong: 'Tsib', english: 'Five' },
      { hmong: 'Rau', english: 'Six' },
      { hmong: 'Xya', english: 'Seven' },
      { hmong: 'Yim', english: 'Eight' },
      { hmong: 'Cuaj', english: 'Nine' },
      { hmong: 'Kaum', english: 'Ten' },
    ],
  },
]
