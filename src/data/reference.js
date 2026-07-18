// Reference data — the things you LOOK UP, not the things you're taught.
//
// Job split (see notes/34): a table here STATES a fact ("txoj = long, winding
// things"); a lesson in src/data/lessons/ EXPLAINS it. Same content, different
// moment — cross-linked, not duplicated. Keep tables terse: no teaching prose.
//
// Exports: consonants, doubleConsonants, vowels, tones, grammar
// (grammar arrived here when the old /course page dissolved.)

export const consonants = [
  { letter: 'c', sound: 'j (English)', audio: '/assets/audio/single-consonant-c.mp3' },
  { letter: 'ch', sound: 'ch' },
  { letter: 'd', sound: 'd', audio: '/assets/audio/single-consonant-d.mp3' },
  { letter: 'dh', sound: 'd-h' },
  { letter: 'f', sound: 'f', audio: '/assets/audio/single-consonant-f.mp3' },
  { letter: 'h', sound: 'h', audio: '/assets/audio/single-consonant-h.mp3' },
  { letter: 'hl', sound: 'voiceless l' },
  { letter: 'hm', sound: 'voiceless m' },
  { letter: 'hn', sound: 'voiceless n' },
  { letter: 'k', sound: 'k', audio: '/assets/audio/single-consonant-k.mp3' },
  { letter: 'kh', sound: 'k-h' },
  { letter: 'l', sound: 'l', audio: '/assets/audio/single-consonant-l.mp3' },
  { letter: 'm', sound: 'm', audio: '/assets/audio/single-consonant-m.mp3' },
  { letter: 'n', sound: 'n', audio: '/assets/audio/single-consonant-n.mp3' },
  { letter: 'nc', sound: 'nj' },
  { letter: 'np', sound: 'mb' },
  { letter: 'nq', sound: 'ng-g (uvular)' },
  { letter: 'nt', sound: 'nd' },
  { letter: 'nts', sound: 'ndz' },
  { letter: 'ntx', sound: 'ndj' },
  { letter: 'ny', sound: 'ny' },
  { letter: 'p', sound: 'p', audio: '/assets/audio/single-consonant-p.mp3' },
  { letter: 'ph', sound: 'p-h' },
  { letter: 'pl', sound: 'pl' },
  { letter: 'q', sound: 'k (uvular)', audio: '/assets/audio/single-consonant-q.mp3' },
  { letter: 'qh', sound: 'q-h' },
  { letter: 'r', sound: 'tr', audio: '/assets/audio/single-consonant-r.mp3' },
  { letter: 'rh', sound: 'tr-h' },
  { letter: 's', sound: 'sh', audio: '/assets/audio/single-consonant-s.mp3' },
  { letter: 't', sound: 't', audio: '/assets/audio/single-consonant-t.mp3' },
  { letter: 'th', sound: 't-h' },
  { letter: 'ts', sound: 'ts' },
  { letter: 'tsh', sound: 'tsh' },
  { letter: 'tx', sound: 'ts (English)' },
  { letter: 'txh', sound: 'tx-h' },
  { letter: 'v', sound: 'v', audio: '/assets/audio/single-consonant-v.mp3' },
  { letter: 'x', sound: 's', audio: '/assets/audio/single-consonant-x.mp3' },
  { letter: 'xy', sound: 'sh-y' },
  { letter: 'y', sound: 'y', audio: '/assets/audio/single-consonant-y.mp3' },
  { letter: 'z', sound: 'zh', audio: '/assets/audio/single-consonant-z.mp3' },
  // Triple consonants (3 letters, one sound). Sound column left blank — these
  // are learned by ear; the full set matches the Triple Consonants lesson.
  // (nts, ntx, tsh, txh already appear above with sounds.)
  { letter: 'hml', sound: '' },
  { letter: 'hny', sound: '' },
  { letter: 'nch', sound: '' },
  { letter: 'nkh', sound: '' },
  { letter: 'nph', sound: '' },
  { letter: 'npl', sound: '' },
  { letter: 'nqh', sound: '' },
  { letter: 'nrh', sound: '' },
  { letter: 'nth', sound: '' },
  { letter: 'plh', sound: '' },
  // Quadruple consonants (4 letters, one sound) — the whole set in White Hmong.
  { letter: 'nplh', sound: '' },
  { letter: 'ntsh', sound: '' },
  { letter: 'ntxh', sound: '' },
]

// Consonants grouped by cluster length, for the categorized Reference view.
// Derived from `consonants` above (length = category), so there's one source.
// Empty groups drop out. See notes/43.
export const consonantGroups = [
  { id: 'single', title: 'Single', blurb: 'One letter, one sound.' },
  { id: 'double', title: 'Double', blurb: 'Two letters, one sound.' },
  { id: 'triple', title: 'Triple', blurb: 'Three letters, one sound.' },
  { id: 'quadruple', title: 'Quadruple', blurb: 'Four letters, one sound.' },
]
  .map((g, i) => ({ ...g, items: consonants.filter((c) => c.letter.length === i + 1) }))
  .filter((g) => g.items.length > 0)

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
