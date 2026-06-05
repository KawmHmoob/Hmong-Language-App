import { consonants, doubleConsonants, vowels, tones } from './alphabet.js'
import { grammar, everyday } from './course.js'
import { toneDrillWords } from './toneDrill.js'

import {categories} from './vocabulary.js'

// Quiz shape: { id, title, description, questionCount, questionTypes, category, tier? }
// Optional `tier: 'free' | 'pro'` gates the quiz behind the paywall. Default 'free'.
// See notes/14-paywall-and-supabase.md.



export const vocabQuizzes = categories.map((cat) => ({
  id: `vocab-${cat.id}`,
  title: cat.title,
  description: cat.description,
  questionCount: Math.min(10,cat.words.length),
  questionTypes: ['multiple-choice'],
  category: 'Vocabulary'
}))


export const quizzes = [
  ...vocabQuizzes,

  {
    id: 'alphabet-consonants',
    title: 'Consonants',
    description: 'Match Hmong consonants to their sounds.',
    questionCount: 10,
    questionTypes: ['multiple-choice'],
    category: 'Alphabet',
  },
  {
    id: 'alphabet-double-consonants',
    title: "Double Consonants",
    description: "Match Hmong consonant to their sounds",
    questioncount: 10,
    questionsTypes:['multiple-choice'],
    category: 'Alphabet'
  },

  {
    id: 'alphabet-vowels',
    title: 'Vowels',
    description: 'Recognize Hmong vowels by sound.',
    questionCount: 10,
    questionTypes: ['multiple-choice', 'matching'],
    category: 'Alphabet',
  },
  {
    id: 'alphabet-tones',
    title: 'Tone Markers',
    description: 'Identify the 8 Hmong tone markers.',
    questionCount: 8,
    questionTypes: ['multiple-choice'],
    category: 'Alphabet',
  },
  {
    id: 'tone-drill',
    title: 'Tone Drill',
    description: 'Identify the tone of each Hmong word — uniquely valuable for tonal-language listening practice.',
    questionCount: 12,
    questionTypes: ['multiple-choice'],
    category: 'Tones',
  },
  {
    id: 'grammar-pronouns',
    title: 'Pronouns',
    description: 'Translate Hmong pronouns.',
    questionCount: 7,
    questionTypes: ['multiple-choice', 'matching'],
    category: 'Grammar',
  },
  {
    id: 'everyday-greetings',
    title: 'Greetings',
    description: 'Common Hmong greetings.',
    questionCount: 4,
    questionTypes: ['multiple-choice'],
    category: 'Everyday',
  },
]

export function getQuizConfig(id) {
  return quizzes.find((q) => q.id === id)

}


export function getQuizDataset(id) {

  if (id.startsWith('vocab-')){
    const catId = id.slice(6);
    const cat = categories.find((c) => c.id == catId)
    return cat ? cat.words.map((item) => ({
      prompt: item.hmongRPA,
      answer: item.english
    })) :
    []

  }

  switch (id) {
    case 'alphabet-consonants':
      return consonants.map((c) => ({ prompt: c.letter, answer: c.sound }))
    case 'alphabet-vowels':
      return vowels.map((v) => ({ prompt: v.letter, answer: v.sound }))
    case 'alphabet-tones':
      return tones.map((t) => ({ prompt: t.marker || '(no marker)', answer: t.name }))
    case 'tone-drill':
      return toneDrillWords.map((w) => ({ prompt: w.word, answer: w.tone }))
    case 'grammar-pronouns': {
      const group = grammar.find((g) => g.title === 'Pronouns')
      return group ? group.items.map((i) => ({ prompt: i.hmong, answer: i.english })) : []
    }
    case 'everyday-greetings': {
      const group = everyday.find((e) => e.title === 'Greetings')
      return group ? group.items.map((i) => ({ prompt: i.hmong, answer: i.english })) : []
    }




    default:
      return []
  }
}
