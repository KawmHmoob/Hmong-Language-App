import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress.js'
import { useAuth } from '../context/AuthContext.jsx'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import { buildBoard, lastWeekWinner } from '../data/leaderboard.js'
import { levelFromPoints, seasonDaysLeft, SEASON } from '../lib/leveling.js'

// Leaderboard — season and weekly boards.
//
// NO route params and no per-user pages: names and totals only. That's a
// deliberate privacy floor, not a missing feature. A leaderboard that opens
// into profiles turns a study app into a place where strangers can be
// followed around, and none of these learners agreed to that. See notes/57.

export default function Leaderboard() {
  const { seasonPoints, weekEarned, clipsContributed } = useProgress()
  const { user } = useAuth()
  const [board, setBoard] = useState('season')

  // NEVER derive a display name from the email. It used to be
  // `user.email.split('@')[0]`, which leaks the local part of a private address
  // onto a public board — and for most people that IS their real name. The
  // profile already carries a chosen, public-by-design handle; use it.
  //
  // Guests have no username, so they show as "You" — they aren't on a real
  // board anyway until accounts and a backend exist (notes/57).
  const you = useMemo(
    () => ({
      name: user?.isGuest ? 'You' : user?.username || user?.displayName || 'You',
      seasonPoints: seasonPoints || 0,
      weekPoints: weekEarned?.points || 0,
      clips: clipsContributed || 0,
    }),
    [user, seasonPoints, weekEarned, clipsContributed]
  )

  const key = board === 'season' ? 'seasonPoints' : 'weekPoints'
  const rows = useMemo(() => buildBoard(you, key), [you, key])
  const leader = rows[0]
  const yourRow = rows.find((r) => r.isYou)
  const daysLeft = seasonDaysLeft()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Leaderboard' }]} />

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider font-semibold text-clay-700 mb-1">
          {SEASON.title}
        </p>
        <h2 className="font-display text-4xl text-stone-900 mb-2">Who’s ahead.</h2>
        <p className="text-stone-700">
          {daysLeft > 0
            ? `${daysLeft} days left this season.`
            : 'This season has ended.'}
        </p>
      </div>

      {/* Two settled facts up top: last week's champion (a closed result) and
          the current leader (a live one). Keeping them visually distinct stops
          the page reading as one ambiguous ranking. */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="surface p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
            Last week’s winner
          </p>
          <p className="font-display text-2xl text-stone-900">🏆 {lastWeekWinner.name}</p>
          <p className="text-sm text-stone-700 mt-1">
            {lastWeekWinner.weekPoints.toLocaleString()} pts · {lastWeekWinner.clips} clips
          </p>
          <p className="text-xs text-stone-600 mt-1">{lastWeekWinner.week}</p>
        </div>

        <div className="surface p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
            Leading now ({board === 'season' ? 'season' : 'this week'})
          </p>
          <p className="font-display text-2xl text-stone-900">
            {leader.isYou ? '👑 You' : `👑 ${leader.name}`}
          </p>
          <p className="text-sm text-stone-700 mt-1">
            {(leader[key] || 0).toLocaleString()} pts
          </p>
          {yourRow && !leader.isYou && (
            <p className="text-xs text-stone-600 mt-1">
              You’re #{yourRow.rank} of {rows.length}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          ['season', 'Season'],
          ['week', 'This week'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setBoard(id)}
            aria-pressed={board === id}
            className={
              board === id
                ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-clay-600 text-cream-50'
                : 'px-4 py-2 rounded-lg text-sm font-medium bg-cream-100 text-stone-700 hover:bg-cream-200'
            }
          >
            {label}
          </button>
        ))}
      </div>

      <ol className="surface divide-y divide-cream-200 overflow-hidden">
        {rows.map((r) => (
          <li
            key={r.id}
            className={`flex items-center gap-4 px-4 py-3 ${
              r.isYou ? 'bg-clay-600/10' : ''
            }`}
          >
            <span
              className={`w-8 shrink-0 text-center font-display text-lg ${
                r.rank <= 3 ? 'text-clay-700' : 'text-stone-600'
              }`}
            >
              {r.rank}
            </span>
            <span className="flex-1 min-w-0">
              <span
                className={`block truncate ${
                  r.isYou ? 'font-semibold text-stone-900' : 'text-stone-800'
                }`}
              >
                {r.name}
                {r.isYou && <span className="text-clay-700"> · you</span>}
              </span>
              <span className="block text-xs text-stone-600">
                {r.clips.toLocaleString()} voice clips
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-medium text-stone-900">
                {(r[key] || 0).toLocaleString()}
              </span>
              <span className="block text-xs text-stone-600">
                Lv {levelFromPoints(r.seasonPoints).level}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="text-xs text-stone-600 mt-4">
        Everyone but you is placeholder data — there’s no leaderboard backend yet.
        Points come from lessons, quizzes, and voice recordings; see the{' '}
        <Link to="/pass" className="underline hover:text-clay-700">
          season pass
        </Link>
        .
      </p>
    </>
  )
}
