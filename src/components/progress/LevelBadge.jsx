import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress.js'
import { levelFromPoints } from '../../lib/leveling.js'

// Season level in the header — the one status number that's also a door.
//
// It's a LINK (XPBadge/StreakBadge are inert text) because a level implies a
// track to see: showing "Lv 4" with no way to ask "of what?" is the kind of
// dead-end number that makes gamification feel bolted on. See notes/57.
//
// Shows level, not points: it's the number that stays small and readable at
// header size, and it's what the pass is indexed by.
export default function LevelBadge() {
  const { seasonPoints } = useProgress()
  const lv = levelFromPoints(seasonPoints || 0)

  return (
    <Link
      to="/pass"
      title={`Season level ${lv.level} — ${(seasonPoints || 0).toLocaleString()} points${
        lv.maxed ? ' (max)' : `, ${lv.remaining.toLocaleString()} to level ${lv.level + 1}`
      }`}
      className="inline-flex items-center gap-1 rounded-full bg-clay-600 px-3 py-1.5 text-sm font-semibold text-cream-50 hover:bg-clay-700 transition-colors"
    >
      <span className="opacity-80">Lv</span>
      {lv.level}
    </Link>
  )
}
