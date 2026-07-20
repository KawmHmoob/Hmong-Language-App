import { useProgress } from '../../hooks/useProgress.js'
import { StarIcon } from '../icons/index.jsx'

// `className` lets the caller control responsive visibility — the header hides
// this below `sm` to make room for the season level (notes/57).
export default function XPBadge({ className = '' }) {
  const { xp } = useProgress()
  // text-stone-900, NOT text-clay-700: clay does not invert, and on cream-200
  // the pair collapsed to 2.70:1 in dark mode (both tokens sit at the dark end
  // of their own scales). `stone` inverts, so ink-on-surface is legible in all
  // three themes. See notes/55.
  return (
    <span
      title={`${xp} lifetime XP`}
      className={`inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-sm font-semibold text-stone-900 ${className}`}
    >
      <StarIcon size={15} />
      {xp}
    </span>
  )
}
