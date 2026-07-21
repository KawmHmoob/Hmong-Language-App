import { Link } from 'react-router-dom'
import TodayCard from '../components/home/TodayCard.jsx'
import {
  FlameIcon,
  StarIcon,
  MicIcon,
  CardsIcon,
  BookIcon,
  ScrollIcon,
  GridIcon,
  ZapIcon,
  NotebookIcon,
  TrophyIcon,
  TiersIcon,
  ArrowRightIcon,
} from '../components/icons/index.jsx'
import { allPhrases } from '../data/speak.js'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectSession } from '../context/ProgressContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { pickOfTheDay } from '../lib/daily.js'
import { levelFromPoints } from '../lib/leveling.js'

// Home — a bento-style dashboard. One glance answers "where am I?" (streak,
// XP, due words) and "what should I do?" (the two front doors + today's
// suggestions). The phrase of the day gives the Hmong language itself the
// hero treatment.

// Vocabulary size, DERIVED. A hardcoded "429 words across 33 categories" was
// already wrong by the time it was written — the real figures are 423/37 — and
// a stale number in the UI is worse than none, because it reads as a fact.
//
// Deduped by id the same way getCategory() resolves, so this counts what a
// learner can actually REACH. (There are two `timeframes` categories; the
// second is unreachable — see notes/56.)
const vocabStats = (() => {
  const byId = new Map()
  for (const c of categories) if (!byId.has(c.id)) byId.set(c.id, c)
  const cats = [...byId.values()]
  return {
    categories: cats.length,
    words: cats.reduce((n, c) => n + c.words.length, 0),
  }
})()

// Explore cards. Each carries a BLURB saying what the destination is for —
// a bare label ("Reference") assumes you already know, which is exactly wrong
// for the people who need this section. The accent is the owning section's
// color from PrimaryNav, so Home agrees with the rail about what belongs where.
const explore = [
  {
    to: '/learn',
    label: 'Learn',
    blurb: 'Structured lessons, start to finish.',
    Icon: BookIcon,
    accent: 'text-seafoam-500',
  },
  {
    to: '/reference',
    label: 'Reference',
    blurb: 'Look up any letter, tone, or rule.',
    Icon: GridIcon,
    accent: 'text-cream-600',
  },
  {
    to: '/learn/readings',
    label: 'Readings',
    blurb: 'Short passages to read for meaning.',
    Icon: ScrollIcon,
    accent: 'text-seafoam-500',
  },
  {
    to: '/vocabulary',
    label: 'Vocabulary',
    blurb: `${vocabStats.words} words across ${vocabStats.categories} categories.`,
    Icon: CardsIcon,
    accent: 'text-blush-500',
  },
  {
    to: '/quiz',
    label: 'Quizzes',
    blurb: 'Test a category once you’ve studied it.',
    Icon: ZapIcon,
    accent: 'text-blush-500',
  },
  {
    to: '/notebook',
    label: 'Notebook',
    blurb: 'Saved words and your own notes.',
    Icon: NotebookIcon,
    accent: 'text-blush-500',
  },
  {
    to: '/leaderboard',
    label: 'Leaderboard',
    blurb: 'This week’s standings and season race.',
    Icon: TrophyIcon,
    accent: 'text-clay-600',
  },
  {
    to: '/pass',
    label: 'Season Pass',
    blurb: '50 tiers of rewards to work through.',
    Icon: TiersIcon,
    accent: 'text-clay-600',
  },
]

// The season strip: level, progress to the next level, and the two doors into
// the season layer. Derived entirely from seasonPoints — no extra state.
function SeasonStrip() {
  const { seasonPoints } = useProgress()
  const lv = levelFromPoints(seasonPoints || 0)
  const pct = Math.round(lv.progress * 100)

  return (
    <div className="surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl text-stone-900 leading-none">
            Lv {lv.level}
          </span>
          <span className="text-sm text-stone-600">
            {(seasonPoints || 0).toLocaleString()} season pts
            {!lv.maxed && ` · ${lv.remaining.toLocaleString()} to next`}
          </span>
        </div>
        <div className="flex gap-2">
          <Link to="/pass" className="btn-secondary text-xs px-3 py-1.5">
            Season Pass
          </Link>
          <Link to="/leaderboard" className="btn-secondary text-xs px-3 py-1.5">
            Leaderboard
          </Link>
        </div>
      </div>
      <div
        className="h-2 rounded-full bg-cream-200 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Level ${lv.level} progress`}
      >
        <div
          className="h-full rounded-full bg-clay-600 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

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
          Learn to read, speak, and understand Hmong.
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
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-clay-700">
            Practice saying it <ArrowRightIcon size={14} />
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

        {/* Season strip — the entry point for the leaderboard + pass. These
            aren't a sixth nav section (the five-section IA is load-bearing),
            so Home is where they have to be discoverable. See notes/57. */}
        <div className="col-span-2 lg:col-span-4">
          <SeasonStrip />
        </div>

        {/* Today's suggestions */}
        <div className="col-span-2 lg:col-span-4">
          <TodayCard />
        </div>
      </section>

      {/* Explore the rest */}
      <section className="mt-14">
        <h3 className="font-display text-3xl text-stone-900 mb-1">Explore</h3>
        <p className="text-stone-700 mb-5">Everywhere else in the app.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {explore.map(({ to, label, blurb, Icon, accent }) => (
            <Link key={to} to={to} className="surface surface-hover p-5 group flex flex-col">
              <Icon size={26} className={`${accent} mb-3`} />
              <p className="font-display text-xl text-stone-900 group-hover:text-clay-700 transition">
                {label}
              </p>
              <p className="text-sm text-stone-600 mt-1 leading-snug flex-1">{blurb}</p>
              <span className="text-sm font-medium text-clay-700 mt-3 inline-flex items-center gap-1">
                Open
                <ArrowRightIcon
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
