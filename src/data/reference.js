// Reference data — the things you LOOK UP, not the things you're taught.
//
// Job split (see notes/34): a table here STATES a fact ("txoj = long, winding
// things"); a lesson in src/data/lessons/ EXPLAINS it. Same content, different
// moment — cross-linked, not duplicated. Keep tables terse: no teaching prose.
//
// Exports: consonants, doubleConsonants, vowels, tones, grammar
// (grammar arrived here when the old /course page dissolved.)

export const consonants = [
  { letter: 'c', sound: 'C', audio: '/assets/audio/consonants/single-consonants/single-consonant-c.mp3' },
  { letter: 'ch', sound: 'ch', audio: '/assets/audio/consonants/double-consonants/double-consonant-ch.mp3' },
  { letter: 'd', sound: 'd', audio: '/assets/audio/consonants/single-consonants/single-consonant-d.mp3' },
  { letter: 'dh', sound: 'd-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-dh.mp3' },
  { letter: 'f', sound: 'f', audio: '/assets/audio/consonants/single-consonants/single-consonant-f.mp3' },
  { letter: 'h', sound: 'h', audio: '/assets/audio/consonants/single-consonants/single-consonant-h.mp3' },
  { letter: 'hl', sound: 'voiceless l', audio: '/assets/audio/consonants/double-consonants/double-consonant-hl.mp3' },
  { letter: 'hm', sound: 'voiceless m', audio: '/assets/audio/consonants/double-consonants/double-consonant-hm.mp3' },
  { letter: 'hn', sound: 'voiceless n', audio: '/assets/audio/consonants/double-consonants/double-consonant-hn.mp3' },
  { letter: 'k', sound: 'k', audio: '/assets/audio/consonants/single-consonants/single-consonant-k.mp3' },
  { letter: 'kh', sound: 'k-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-kh.mp3' },
  { letter: 'l', sound: 'l', audio: '/assets/audio/consonants/single-consonants/single-consonant-l.mp3' },
  { letter: 'm', sound: 'm', audio: '/assets/audio/consonants/single-consonants/single-consonant-m.mp3' },
  { letter: 'n', sound: 'n', audio: '/assets/audio/consonants/single-consonants/single-consonant-n.mp3' },
  { letter: 'nc', sound: 'nj', audio: '/assets/audio/consonants/double-consonants/double-consonant-nc.mp3' },
  { letter: 'np', sound: 'mb', audio: '/assets/audio/consonants/double-consonants/double-consonant-np.mp3' },
  { letter: 'nq', sound: 'ng-g (uvular)', audio: '/assets/audio/consonants/double-consonants/double-consonant-nq.mp3' },
  { letter: 'nt', sound: 'nd', audio: '/assets/audio/consonants/double-consonants/double-consonant-nt.mp3' },

  { letter: 'ny', sound: 'ny', audio: '/assets/audio/consonants/double-consonants/double-consonant-ny.mp3' },
  { letter: 'p', sound: 'p', audio: '/assets/audio/consonants/single-consonants/single-consonant-p.mp3' },
  { letter: 'ph', sound: 'p-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-ph.mp3' },
  { letter: 'pl', sound: 'pl', audio: '/assets/audio/consonants/double-consonants/double-consonant-pl.mp3' },
  { letter: 'q', sound: 'k (uvular)', audio: '/assets/audio/consonants/single-consonants/single-consonant-q.mp3' },
  { letter: 'qh', sound: 'q-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-qh.mp3' },
  { letter: 'r', sound: 'tr', audio: '/assets/audio/consonants/single-consonants/single-consonant-r.mp3' },
  { letter: 'rh', sound: 'tr-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-rh.mp3' },
  { letter: 's', sound: 'sh', audio: '/assets/audio/consonants/single-consonants/single-consonant-s.mp3' },
  { letter: 't', sound: 't', audio: '/assets/audio/consonants/single-consonants/single-consonant-t.mp3' },
  { letter: 'th', sound: 't-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-th.mp3' },
  { letter: 'ts', sound: 'ts', audio: '/assets/audio/consonants/double-consonants/double-consonant-ts.mp3' },

  { letter: 'tx', sound: 'ts (English)', audio: '/assets/audio/consonants/double-consonants/double-consonant-tx.mp3' },

  { letter: 'v', sound: 'v', audio: '/assets/audio/consonants/single-consonants/single-consonant-v.mp3' },
  { letter: 'x', sound: 's', audio: '/assets/audio/consonants/single-consonants/single-consonant-x.mp3' },
  { letter: 'xy', sound: 'sh-y', audio: '/assets/audio/consonants/double-consonants/double-consonant-xy.mp3' },
  { letter: 'y', sound: 'y', audio: '/assets/audio/consonants/single-consonants/single-consonant-y.mp3' },
  { letter: 'z', sound: 'zh', audio: '/assets/audio/consonants/single-consonants/single-consonant-z.mp3' },
  // Triple consonants (3 letters, one sound). Sound column left blank — these
  // are learned by ear; the full set matches the Triple Consonants lesson.
  // (nts, ntx, tsh, txh already appear above with sounds.)
  
  { letter: 'hml', sound: 'hml', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hml.mp3' },
  { letter: 'hny', sound: 'hny', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hny.mp3' },
  { letter: 'nch', sound: 'nch', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nch.mp3' },
  { letter: 'nkh', sound: 'nkh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nkh.mp3' },
  { letter: 'nph', sound: 'nph', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nph.mp3' },
  { letter: 'npl', sound: 'npl', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-npl.mp3' },
  { letter: 'nqh', sound: 'nqh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nqh.mp3' },
  { letter: 'nrh', sound: 'nrh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nrh.mp3' },
  { letter: 'nth', sound: 'nth', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nth.mp3' },
  { letter: 'nts', sound: 'ndz', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nts.mp3' },
  { letter: 'ntx', sound: 'ndj', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-ntx.mp3' },
  { letter: 'txh', sound: 'tx-h', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-txh.mp3'},
  { letter: 'tsh', sound: 'tsh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-tsh.mp3'},
  
  { letter: 'plh', sound: 'plh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-plh.mp3' },
  // Quadruple consonants (4 letters, one sound) — the whole set in White Hmong.
  { letter: 'nplh', sound: 'nplh', audio: '/assets/audio/consonants/quad-consonants/quad-consonants-nplh.mp3' },
  { letter: 'ntsh', sound: 'ntsh', audio: '/assets/audio/consonants/quad-consonants/quad-consonants-ntsh.mp3' },
  { letter: 'ntxh', sound: 'ntxh' ,  audio: '/assets/audio/consonants/quad-consonants/quad-consonants-ntxh.mp3'},
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
  { letter: 'Ch', audio: '/assets/audio/consonants/double-consonants/double-consonant-ch.mp3', exampleWord: 'Chiaj' },
  { letter: 'Dh', audio: '/assets/audio/consonants/double-consonants/double-consonant-dh.mp3', exampleWord: '' },
  { letter: 'Dl', audio: '/assets/audio/consonants/double-consonants/double-consonant-dl.mp3', exampleWord: '' },
  { letter: 'Hl', audio: '/assets/audio/consonants/double-consonants/double-consonant-hl.mp3', exampleWord: '' },
  { letter: 'Hm', audio: '/assets/audio/consonants/double-consonants/double-consonant-hm.mp3', exampleWord: '' },
  { letter: 'Hn', audio: '/assets/audio/consonants/double-consonants/double-consonant-hn.mp3', exampleWord: '' },
  { letter: 'Kh', audio: '/assets/audio/consonants/double-consonants/double-consonant-kh.mp3', exampleWord: '' },
  { letter: 'Ml', audio: '/assets/audio/consonants/double-consonants/double-consonant-ml.mp3', exampleWord: '' },
  { letter: 'Nc', audio: '/assets/audio/consonants/double-consonants/double-consonant-nc.mp3', exampleWord: '' },
  { letter: 'Nk', audio: '/assets/audio/consonants/double-consonants/double-consonant-nk.mp3', exampleWord: '' },
  { letter: 'Np', audio: '/assets/audio/consonants/double-consonants/double-consonant-np.mp3', exampleWord: '' },
  { letter: 'Nq', audio: '/assets/audio/consonants/double-consonants/double-consonant-nq.mp3', exampleWord: '' },
  { letter: 'Nt', audio: '/assets/audio/consonants/double-consonants/double-consonant-nt.mp3', exampleWord: '' },
  { letter: 'Ny', audio: '/assets/audio/consonants/double-consonants/double-consonant-ny.mp3', exampleWord: '' },
  { letter: 'Ph', audio: '/assets/audio/consonants/double-consonants/double-consonant-ph.mp3', exampleWord: '' },
  { letter: 'Pl', audio: '/assets/audio/consonants/double-consonants/double-consonant-pl.mp3', exampleWord: '' },
  { letter: 'Qh', audio: '/assets/audio/consonants/double-consonants/double-consonant-qh.mp3', exampleWord: '' },
  { letter: 'Rh', audio: '/assets/audio/consonants/double-consonants/double-consonant-rh.mp3', exampleWord: '' },
  { letter: 'Th', audio: '/assets/audio/consonants/double-consonants/double-consonant-th.mp3', exampleWord: '' },
  { letter: 'Ts', audio: '/assets/audio/consonants/double-consonants/double-consonant-ts.mp3', exampleWord: '' },
  { letter: 'Tx', audio: '/assets/audio/consonants/double-consonants/double-consonant-tx.mp3', exampleWord: '' },
  { letter: 'Xy', audio: '/assets/audio/consonants/double-consonants/double-consonant-xy.mp3', exampleWord: '' },
]


export const tripleConsonants = [
  { letter: 'Hml', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hml.mp3', exampleWord: '' },
  { letter: 'Hny', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hny.mp3', exampleWord: '' },
  { letter: 'Nch', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nch.mp3', exampleWord: '' },
  { letter: 'Nkh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nkh.mp3', exampleWord: '' },
  { letter: 'Nph', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nph.mp3', exampleWord: '' },
  { letter: 'Npl', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-npl.mp3', exampleWord: '' },
  { letter: 'Nqh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nqh.mp3', exampleWord: '' },
  { letter: 'Nrh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nrh.mp3', exampleWord: '' },
  { letter: 'Nth', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nth.mp3', exampleWord: '' },
  { letter: 'Plh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-plh.mp3', exampleWord: '' },
]

export const vowels = [
  { letter: 'a', sound: 'ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-a.mp3' },
  { letter: 'e', sound: 'eh', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-e.mp3' },
  { letter: 'i', sound: 'ee', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-i.mp3' },
  { letter: 'o', sound: 'aw', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-o.mp3' },
  { letter: 'u', sound: 'oo', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-u.mp3' },
  { letter: 'w', sound: 'uh (schwa)', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-w.mp3' },
  { letter: 'aa', sound: 'an', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-aa.mp3' },
  { letter: 'ai', sound: 'eye', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ai.mp3' },
  { letter: 'au', sound: 'ow', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-au.mp3' },
  { letter: 'aw', sound: 'aw-uh', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-aw.mp3' },
  { letter: 'ee', sound: 'eng', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ee.mp3' },
  { letter: 'ia', sound: 'ee-ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ia.mp3' },
  { letter: 'oo', sound: 'ong', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-oo.mp3' },
  { letter: 'ua', sound: 'oo-ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ua.mp3' },
]


// Seperation

export const vowelGroups = [

  { id: 'single', title: 'Single', blurb: 'One letter, one sound.' },
  { id: 'double', title: 'Double', blurb: 'Two letters,  sound.' },

]
  .map((g, i) => ({ ...g, items: consonants.filter((c) => c.letter.length === i + 1) }))
  .filter((g) => g.items.length > 0)




// Groups


export const singleVowels = [
  { letter: 'a', sound: 'ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-a.mp3' },
  { letter: 'e', sound: 'eh', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-e.mp3' },
  { letter: 'i', sound: 'ee', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-i.mp3' },
  { letter: 'o', sound: 'aw', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-o.mp3' },
  { letter: 'u', sound: 'oo', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-u.mp3' },
  { letter: 'w', sound: 'uh (schwa)', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-w.mp3' },
]


export const doubleVowels = [
  { letter: 'aa', sound: 'an', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-aa.mp3' },
  { letter: 'ai', sound: 'eye', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ai.mp3' },
  { letter: 'au', sound: 'ow', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-au.mp3' },
  { letter: 'aw', sound: 'aw-uh', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-aw.mp3' },
  { letter: 'ee', sound: 'eng', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ee.mp3' },
  { letter: 'ia', sound: 'ee-ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ia.mp3' },
  { letter: 'oo', sound: 'ong', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-oo.mp3' },
  { letter: 'ua', sound: 'oo-ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-ua.mp3' },
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
