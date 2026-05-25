import { useProgress } from '../../hooks/useProgress.js'

export default function StreakBadge() {
  const { streakData } = useProgress()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-200 px-2.5 py-1 text-xs font-semibold text-orange-900">
      <span aria-hidden="true">🔥</span>
      {streakData.currentStreak}
    </span>
  )
}
