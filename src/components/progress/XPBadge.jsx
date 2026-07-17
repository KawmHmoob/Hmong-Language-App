import { useProgress } from '../../hooks/useProgress.js'
import { StarIcon } from '../icons/index.jsx'

export default function XPBadge() {
  const { xp } = useProgress()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-clay-700">
      <StarIcon size={13} />
      {xp}
    </span>
  )
}
