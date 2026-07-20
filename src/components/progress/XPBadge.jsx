import { useProgress } from '../../hooks/useProgress.js'
import { StarIcon } from '../icons/index.jsx'

// `className` lets the caller control responsive visibility — the header hides
// this below `sm` to make room for the season level (notes/57).
export default function XPBadge({ className = '' }) {
  const { xp } = useProgress()
  return (
    <span
      title={`${xp} lifetime XP`}
      className={`inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-sm font-semibold text-clay-700 ${className}`}
    >
      <StarIcon size={15} />
      {xp}
    </span>
  )
}
