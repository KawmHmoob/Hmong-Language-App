import { useProgress } from '../../hooks/useProgress.js'
import { FlameIcon } from '../icons/index.jsx'

export default function StreakBadge() {
  const { streakData } = useProgress()
  // See XPBadge: clay-700 on cream-200 fails contrast in dark (2.70:1).
  return (
    <span
      title={`${streakData.currentStreak}-day streak`}
      className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-sm font-semibold text-stone-900"
    >
      <FlameIcon size={15} />
      {streakData.currentStreak}
    </span>
  )
}
