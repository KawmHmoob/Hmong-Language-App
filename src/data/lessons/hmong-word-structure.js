// Standalone lesson: how a Hmong word is built.
// This is the ANCHOR lesson of Foundations — the one idea every other alphabet
// unit (Consonants / Vowels / Tones) hangs off. Teach the formula first, then
// send the learner to each piece.
//
// PLACEHOLDER SCAFFOLD — prose is real but wants a native-speaker pass.

export const hmongWordStructure = {
  id: 'foundations-word-structure',
  title: 'How Hmong Words Work',
  summary: 'Every Hmong word is consonant + vowel + tone. Learn the formula first.',
  steps: [
    {
      id: 'foundations-word-structure-intro',
      kind: 'intro',
      title: 'Consonant + Vowel + Tone = Word',
      body: [
        'Hmong writing is remarkably regular. Almost every syllable is built from exactly three pieces, always in the same order: a consonant, then a vowel, then a tone.',
        'Take "nplooj" (leaf). It looks long, but it is only three pieces: "npl" is ONE consonant, "oo" is ONE vowel, and "j" is the tone. Not six letters — three parts.',
        'The tone is written as the final letter, and that letter is never pronounced as a sound. In "pob", you do not say a "b" at the end. The "b" tells you the pitch is high.',
        'This is why Hmong looks harder to read than it is. Once you can spot the three pieces, you can pronounce a word you have never seen before — and that is the whole goal of the next three units.',
        'One exception worth knowing: the mid tone has no letter at all. A syllable that ends in a vowel, like "po", is still a complete word — it just carries the mid tone.',
      ],
    },
    {
      id: 'foundations-word-structure-examples',
      kind: 'examples',
      title: 'Breaking words apart',
      intro: 'Same three pieces every time. Read the breakdown, then say the word.',
      items: [
        { hmong: 'Nplooj', english: 'leaf', note: 'Npl (consonant) + oo (vowel) + j (tone)' },
        { hmong: 'Pob', english: 'ball', note: 'P (consonant) + o (vowel) + b (tone)' },
        { hmong: 'Po', english: 'spleen', note: 'P + o + (no tone letter = mid tone)' },
        { hmong: 'Dev', english: 'dog', note: 'D (consonant) + e (vowel) + v (tone)' },
        { hmong: 'Tsev', english: 'house', note: 'Ts (consonant) + e (vowel) + v (tone)' },
        { hmong: 'Hmoob', english: 'Hmong', note: 'Hm (consonant) + oo (vowel) + b (tone)' },
      ],
    },
    {
      id: 'foundations-word-structure-next',
      kind: 'intro',
      title: 'Where to go next',
      body: [
        'Now that you know the formula, learn each piece on its own:',
        'CONSONANTS — the sound a word starts with. Hmong has single, double, triple, and even four-letter consonants, and each spells ONE sound.',
        'VOWELS — the middle. Single vowels (a, e, i, o, u, w) and double vowels (ai, oo, ua…) that are two letters but one sound.',
        'TONES — the pitch, written as that final letter. Eight of them, and they change what a word means. This is the piece that takes the most practice.',
      ],
    },
  ],
}
