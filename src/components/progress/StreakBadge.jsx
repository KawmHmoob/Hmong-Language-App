import { useProgress } from '../../hooks/useProgress.js'
import { FlameIcon } from '../icons/index.jsx'

export default function StreakBadge() {
  const { streakData } = useProgress()
  return (
    <span
      title={`${streakData.currentStreak}-day streak`}
      className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-sm font-semibold text-clay-700"
    >
      <FlameIcon size={15} />
      {streakData.currentStreak}
    </span>
  )
}
