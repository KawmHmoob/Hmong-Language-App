import { Link } from 'react-router-dom'
import { categories } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import { selectDueWords } from '../context/ProgressContext.jsx'

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
  const dueNow = selectDueWords(allWords, vocabSchedule).length
  const reviewedToday = Object.values(vocabSchedule).filter(
    (s) => s.lastReviewedAt === todayISO()
  ).length

  const goal = reviewedToday + dueNow
  const goalPct = goal === 0 ? 100 : Math.round((reviewedToday / goal) * 100)
  const caughtUp = dueNow === 0

  return (
    <div>
      {/* Section hero */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-clay-600 mb-2">Words</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-3">
          A few words a day.
        </h2>
        <p className="text-stone-700 max-w-xl leading-relaxed">
          Short, game-like reps. Your review queue is spaced so words come
          back right before you’d forget them.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile label="Day streak" value={streakData.currentStreak} emoji="🔥" />
        <StatTile label="Total XP" value={xp} emoji="✨" />
        <StatTile label="Due today" value={dueNow} emoji="📥" />
        <StatTile label="Reviewed today" value={reviewedToday} emoji="✅" />
      </div>

      {/* Daily goal + session CTA */}
      <div className="surface-elevated p-6 sm:p-8 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-2xl text-stone-900 mb-1">
              {caughtUp ? 'All caught up. 🎉' : 'Today’s session'}
            </h3>
            <p className="text-sm text-stone-700 mb-3">
              {caughtUp
                ? 'Nothing due right now — drill something below or come back tomorrow.'
                : `${dueNow} word${dueNow === 1 ? '' : 's'} waiting. Clear the queue to keep the streak alive.`}
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
              Start session →
            </Link>
          )}
        </div>
      </div>

      {/* Other ways to drill */}
      <h3 className="font-serif text-2xl text-stone-900 mb-4">Drill another way</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <DrillTile
          to="/quiz/tone-drill"
          emoji="🎵"
          title="Tone drill"
          blurb="Hear the difference the last letter makes."
        />
        <DrillTile
          to="/quiz"
          emoji="⚡"
          title="Quizzes"
          blurb="Multiple choice and matching, by topic."
        />
        <DrillTile
          to="/vocabulary"
          emoji="🗂️"
          title="Browse words"
          blurb="Flashcards by category, at your own pace."
        />
        <DrillTile
          to="/notebook"
          emoji="📓"
          title="Notebook"
          blurb="The words you saved for later."
        />
      </div>

      {/* Category strip */}
      <h3 className="font-serif text-2xl text-stone-900 mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/vocabulary/${c.id}`}
            className="surface surface-hover px-3.5 py-2 text-sm text-stone-800"
          >
            <span aria-hidden="true" className="mr-1.5">{c.emoji}</span>
            {c.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

function StatTile({ label, value, emoji }) {
  return (
    <div className="surface p-4 text-center">
      <p className="text-2xl mb-0.5" aria-hidden="true">{emoji}</p>
      <p className="font-serif text-2xl text-stone-900 leading-none">{value}</p>
      <p className="text-xs text-stone-600 mt-1">{label}</p>
    </div>
  )
}

function DrillTile({ to, emoji, title, blurb }) {
  return (
    <Link to={to} className="surface surface-hover p-4 block h-full">
      <p className="text-2xl mb-2" aria-hidden="true">{emoji}</p>
      <p className="font-medium text-stone-900">{title}</p>
      <p className="text-sm text-stone-600 mt-0.5">{blurb}</p>
    </Link>
  )
}
