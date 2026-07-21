import { Link } from 'react-router-dom'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectSession, DAILY_NEW_LIMIT } from '../context/ProgressContext.jsx'
import {
  FlameIcon, StarIcon, InboxIcon, CheckCircleIcon,
  MusicNoteIcon, ZapIcon, GridIcon, NotebookIcon, CategoryIcon, ArrowRightIcon,
} from '../components/icons/index.jsx'

// Words hub — the app's second front door. Pulls today's SRS queue, streak,
// and XP into one place and fans out to every way of drilling vocabulary
// (flashcard session, quizzes, tone drill, browsing).
//
// "Daily goal" is DERIVED, not stored: goal = words reviewed today + words
// still due. Nothing new was added to ProgressContext for this.

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Words() {
  const { xp, streakData, vocabSchedule } = useProgress()

  const allWords = categories.flatMap((c) => c.words)
  // Reviews are time-sensitive; new words are a capped introduction. Mixing
  // them is what made day one claim 391 words were "due" — see notes/35.
  const { reviews, fresh, queue } = selectSession(allWords, vocabSchedule)
  const reviewedToday = Object.values(vocabSchedule).filter(
    (s) => s.lastReviewedAt === todayISO()
  ).length
  const learnedTotal = Object.keys(vocabSchedule).length

  const goal = reviewedToday + queue.length
  const goalPct = goal === 0 ? 100 : Math.round((reviewedToday / goal) * 100)
  const caughtUp = queue.length === 0

  return (
    <div>
      {/* Section hero */}
      <div className="mb-10">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-blush-500" aria-hidden="true" />
          Words
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-stone-900 mb-3">
          A few words a day.
        </h2>
        <p className="text-stone-700 max-w-xl leading-relaxed">
          Short, game-like reps. Your review queue is spaced so words come
          back right before you’d forget them.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile label="Day streak" value={streakData.currentStreak} icon={FlameIcon} />
        <StatTile label="Total XP" value={xp} icon={StarIcon} />
        <StatTile label="Reviews due" value={reviews.length} icon={InboxIcon} />
        <StatTile
          label={`Words started`}
          value={`${learnedTotal}/${allWords.length}`}
          icon={CheckCircleIcon}
        />
      </div>

      {/* Daily goal + session CTA */}
      <div className="surface-elevated p-6 sm:p-8 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl text-stone-900 mb-1">
              {caughtUp ? 'All caught up. 🎉' : 'Today’s session'}
            </h3>
            <p className="text-sm text-stone-700 mb-3">
              {caughtUp
                ? 'Nothing due and no new words left — drill something below or come back tomorrow.'
                : [
                    reviews.length > 0 &&
                      `${reviews.length} review${reviews.length === 1 ? '' : 's'} due`,
                    fresh.length > 0 && `${fresh.length} new word${fresh.length === 1 ? '' : 's'}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-full max-w-xs bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-clay-600 transition-all duration-500"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <span className="text-xs text-stone-600 whitespace-nowrap">
                {goalPct}% of today
              </span>
            </div>
          </div>
          {!caughtUp && (
            <Link to="/words/session" className="btn-primary text-base px-6 py-3">
              Start session <ArrowRightIcon size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Other ways to drill */}
      <h3 className="font-display text-2xl text-stone-900 mb-4">Drill another way</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-10">

        <DrillTile
          to="/vocabulary"
          icon={GridIcon}
          title="Browse words"
          blurb="Flashcards by category, at your own pace."
        />

        <DrillTile
          to="/quiz"
          icon={ZapIcon}
          title="Quizzes"
          blurb="Multiple choice drills, by topic."
        />
        <DrillTile
          to="/quiz/tone-drill"
          icon={MusicNoteIcon}
          title="Tone drill"
          blurb="Hear the difference the last letter makes."
        />

        <DrillTile
          to="/notebook"
          icon={NotebookIcon}
          title="Notebook"
          blurb="The words you saved for later."
        />

        {/* Placeholder route — the tile says so, so nobody taps it expecting
            an exercise. Roadmap Phase 2 (future-implementations/04). */}
        <DrillTile
          to="/words/sentences"
          icon={GridIcon}
          title="Sentence builder"
          blurb="Coming soon — assemble and label sentence parts."
        />
      </div>

      {/* Category strip — commented out. All 28 categories as chips made the
          hub long and competed with the "Browse words" drill tile, which
          already leads to the same place (/vocabulary). Uncomment to restore.
      <h3 className="font-display text-2xl text-stone-900 mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/vocabulary/${c.id}`}
            className="surface surface-hover px-3.5 py-2 text-sm text-stone-800"
          >
            <CategoryIcon category={c} size={15} className="mr-1.5 inline-block align-[-2px] text-clay-600" />
            {c.title}
          </Link>
        ))}
      </div>
      */}
    </div>
  )
}

function StatTile({ label, value, icon: Icon }) {
  return (
    <div className="surface p-4 text-center flex flex-col items-center">
      <Icon size={20} className="text-blush-500 mb-1" />
      <p className="font-display text-2xl text-stone-900 leading-none">{value}</p>
      <p className="text-xs text-stone-600 mt-1">{label}</p>
    </div>
  )
}

function DrillTile({ to, icon: Icon, title, blurb }) {
  return (
    <Link to={to} className="surface surface-hover p-4 block h-full">
      <Icon size={22} className="text-blush-500 mb-2" />
      <p className="font-medium text-stone-900">{title}</p>
      <p className="text-sm text-stone-600 mt-0.5">{blurb}</p>
    </Link>
  )
}
