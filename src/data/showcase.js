// Everything the showcase SAYS lives here. The page components only lay it out.
//
// Numbers are NOT typed here — they come from appContent.json, generated from
// the mobile app by scripts/showcase/sync-app-content.mjs. See notes/72.

import content from './appContent.json'

export const stats = [
  { value: content.stats.lessons, label: 'lessons' },
  { value: content.stats.words, label: 'words' },
  { value: content.stats.recordings, label: 'native recordings' },
  { value: content.stats.quizzes, label: 'quizzes' },
]

export const units = content.units
export const tones = content.tones

// Icon names refer to exports in components/icons/index.jsx.
export const features = [
  {
    icon: 'BookIcon',
    title: 'Structured lessons',
    body: `${content.stats.lessons} lessons across ${content.stats.units} units — from the alphabet and the eight tones to grammar, numbers, and telling time.`,
  },
  {
    icon: 'VolumeIcon',
    title: 'Native-speaker audio',
    body: `${content.stats.recordings} recordings of real Hmong speech, so you learn how words actually sound — not how they're spelled.`,
  },
  {
    icon: 'CardsIcon',
    title: 'Flashcards that adapt',
    body: `${content.stats.words} words in ${content.stats.categories} categories, reviewed with spaced repetition so the hard ones come back sooner.`,
  },
  {
    icon: 'ZapIcon',
    title: 'Quizzes',
    body: 'Check what stuck with quizzes for every word category and lesson topic.',
  },
  {
    icon: 'GridIcon',
    title: 'Alphabet & tone reference',
    body: 'Every consonant, vowel, and tone marker in one place, for whenever you need to look one up.',
  },
  {
    icon: 'FlameIcon',
    title: 'Streaks & seasons',
    body: 'Daily streaks, a season pass, and a leaderboard to keep you coming back.',
  },
]

// SCREENSHOT SLOTS. To add one: put the PNG in public/assets/screens/ and set
// `src` to its path, e.g. '/assets/screens/home.png'. While `src` is null the
// slot renders a labeled placeholder. Portrait phone shots (9:19.5-ish) fit best.
export const screens = [
  { id: 'home', label: 'Home', caption: 'Your day at a glance', src: null },
  { id: 'lesson', label: 'Lesson', caption: 'Step-by-step lessons', src: null },
  { id: 'flashcards', label: 'Flashcards', caption: 'Spaced-repetition review', src: null },
  { id: 'quiz', label: 'Quiz', caption: 'Check what stuck', src: null },
  { id: 'reference', label: 'Reference', caption: 'Every letter and tone', src: null },
]

// The hero phone shows the first screen.
export const heroScreen = screens[0]

export const faq = [
  {
    q: 'Is it free?',
    a: 'Yes — Kawm Hmoob is free to download and use right now. If paid features are added later, you will always see the price before being asked to pay.',
  },
  {
    q: 'Is there an iPhone version?',
    a: 'Not yet. Kawm Hmoob is on Android today, and an iOS version is planned. Email us below to hear when it lands.',
  },
  {
    q: 'What writing system does it use?',
    a: 'The Romanized Popular Alphabet (RPA), the most widely used way to write Hmong with Latin letters. The final letter of a word marks its tone.',
  },
  {
    q: 'What happened to the web version?',
    a: 'The browser version has been retired so all the effort can go into the mobile app, which is more polished and gets new lessons first. A web version of the app may return later.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'Use the reset page on this website (linked in the footer): enter your email, open the link we send you on any device, and choose a new password. Then sign in to the app with it.',
  },
  {
    q: 'I found a mistake. Where do I report it?',
    a: 'Please do — the content is still being reviewed with native speakers, and corrections make it better for everyone. Use the contact page.',
  },
]
