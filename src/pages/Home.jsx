import { Link } from 'react-router-dom'
import TodayCard from '../components/home/TodayCard.jsx'
import { FlameIcon, StarIcon, MicIcon, CardsIcon } from '../components/icons/index.jsx'
import { allPhrases } from '../data/speak.js'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectSession } from '../context/ProgressContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { pickOfTheDay } from '../lib/daily.js'

// Home — a bento-style dashboard. One glance answers "where am I?" (streak,
// XP, due words) and "what should I do?" (the two front doors + today's
// suggestions). The phrase of the day gives the Hmong language itself the
// hero treatment.

const explore = [
  { to: '/learn', label: 'Learn' },
  { to: '/reference', label: 'Reference' },
  { to: '/learn/readings', label: 'Readings' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/notebook', label: 'Notebook' },
  { to: '/quiz', label: 'Quizzes' },
]

// Deterministic daily pick: hash the ISO date into an index. Same phrase all
// day, new phrase tomorrow, no state or randomness to store.
// Shared with Speak's word of the day — see src/lib/daily.js.
function phraseOfTheDay() {
  return pickOfTheDay(allPhrases(), 'home-phrase')
}

export default function Home() {
  const { user } = useAuth()
  const { xp, streakData, vocabSchedule } = useProgress()

  const allWords = categories.flatMap((c) => c.words)
  const dueCount = selectSession(allWords, vocabSchedule).queue.length
  const phrase = phraseOfTheDay()

  return (
    <>
      {/* Hero */}
      <section className="mb-10 pt-2">
        <p className="text-sm uppercase tracking-[0.25em] text-clay-600 mb-3 font-semibold">
          {user.isGuest ? 'Welcome' : `Welcome back, ${user.username}`}
        </p>
        <h2 className="font-display text-5xl sm:text-6xl text-stone-900 mb-4">Nyob zoo.</h2>
        <p className="text-lg text-stone-700 max-w-xl leading-relaxed">
          Learn to read, speak, and understand Hmong — one tone at a time.
        </p>
      </section>

      {/* Bento grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phrase of the day — the language is the hero */}
        <Link
          to={`/speak/${phrase.id}`}
          className="surface surface-hover col-span-2 row-span-2 p-6 sm:p-8 flex flex-col justify-between group"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
            Phrase of the day
          </p>
          <div className="py-6">
            <p className="font-display text-3xl sm:text-4xl text-stone-900 leading-snug group-hover:text-clay-700 transition">
              {phrase.hmong}
            </p>
            <p className="text-stone-600 mt-2">{phrase.english}</p>
          </div>
          <span className="text-sm font-medium text-clay-700">
            Practice saying it →
          </span>
        </Link>

        {/* Stats */}
        <div className="surface p-5 text-center flex flex-col items-center justify-center">
          <FlameIcon size={22} className="text-clay-600 mb-1.5" />
          <p className="font-display text-3xl text-stone-900 leading-none">
            {streakData.currentStreak}
          </p>
          <p className="text-xs text-stone-600 mt-1.5">day streak</p>
        </div>
        <div className="surface p-5 text-center flex flex-col items-center justify-center">
          <StarIcon size={22} className="text-clay-600 mb-1.5" />
          <p className="font-display text-3xl text-stone-900 leading-none">{xp}</p>
          <p className="text-xs text-stone-600 mt-1.5">total XP</p>
        </div>

        {/* The two front doors */}
        <Link
          to="/speak"
          className="surface surface-hover col-span-2 sm:col-span-1 lg:col-span-1 p-5 group"
        >
          <MicIcon size={22} className="text-clay-600 mb-2" />
          <p className="font-display text-lg text-stone-900 group-hover:text-clay-700 transition">
            Speak
          </p>
          <p className="text-sm text-stone-600 mt-0.5">Record &amp; compare</p>
        </Link>
        <Link
          to={dueCount > 0 ? '/words/session' : '/words'}
          className="surface surface-hover col-span-2 sm:col-span-1 lg:col-span-1 p-5 group"
        >
          <CardsIcon size={22} className="text-blush-500 mb-2" />
          <p className="font-display text-lg text-stone-900 group-hover:text-clay-700 transition">
            Words
          </p>
          <p className="text-sm text-stone-600 mt-0.5">
            {dueCount > 0
              ? `${dueCount} word${dueCount === 1 ? '' : 's'} due — start`
              : 'All caught up'}
          </p>
        </Link>

        {/* Today's suggestions */}
        <div className="col-span-2 lg:col-span-4">
          <TodayCard />
        </div>
      </section>

      {/* Explore the rest */}
      <section className="mt-10">
        <h3 className="font-display text-xl text-stone-900 mb-3">Explore</h3>
        <div className="flex flex-wrap gap-2">
          {explore.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="surface surface-hover px-3.5 py-2 text-sm text-stone-800"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
