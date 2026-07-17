import { useProgress } from '../../hooks/useProgress.js'
import { FlameIcon } from '../icons/index.jsx'

export default function StreakBadge() {
  const { streakData } = useProgress()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-clay-700">
      <FlameIcon size={13} />
      {streakData.currentStreak}
    </span>
  )
}
