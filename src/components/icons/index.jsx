// The app's icon language. One consistent inline-SVG set — no icon library.
//
// Rules (keep these when adding icons):
//   - 24x24 viewBox, drawn on a 24px grid with ~2px padding
//   - stroke="currentColor", strokeWidth 2, round caps and joins
//   - fill only for tiny accents (fillOpacity <= 0.2) or solid glyph shapes
//   - color comes from the PARENT (text-* classes) — never hardcode
//   - default size 20; pass size={16|22|24} to match context
//
// Emoji are still allowed as CONTENT (🎉 in a success message) — never as
// chrome. See notes/31 for the full replacement map.

function base(props, size) {
  const { size: s = size ?? 20, ...rest } = props
  return {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...rest,
  }
}

export function FlameIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c-3.6 0-6-2.4-6-5.6 0-2.7 1.8-4.6 3.2-6.4C10.4 7.5 11 6 11 4c2.5 1.5 7 5.2 7 11.4 0 3.2-2.4 5.6-6 5.6z" />
      <path d="M12 21c-1.7 0-3-1.3-3-3 0-1.6 1.2-2.6 3-4.4 1.8 1.8 3 2.8 3 4.4 0 1.7-1.3 3-3 3z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}

export function StarIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l2.5 5.5L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.5-.8z" />
    </svg>
  )
}

// Open book — the Learn section. Distinct from NotebookIcon (which is a bound
// pad you write in); this one is a spread you read from.
export function BookIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2z" fill="currentColor" fillOpacity="0.12" />
      <path d="M12 6.5v13" />
    </svg>
  )
}

// Unrolled scroll — connected prose, i.e. the readings.
export function ScrollIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.12" />
      <path d="M6 4a2 2 0 0 0-2 2v2h2" />
      <path d="M9.5 9h6M9.5 13h6" />
    </svg>
  )
}

// Cup with handles on a stepped base — the leaderboard. Kept chunky so it
// still reads as a trophy at 16px in the header.
export function TrophyIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" fill="currentColor" fillOpacity="0.15" />
      <path d="M7 5H4.8a.8.8 0 0 0-.8.9c.2 2 1.3 3.4 3 3.6M17 5h2.2a.8.8 0 0 1 .8.9c-.2 2-1.3 3.4-3 3.6" />
      <path d="M12 14v3" />
      <path d="M8.5 20h7l-.7-3h-5.6z" />
    </svg>
  )
}

// Layered chevrons — tiers stacking up. Used for the season pass.
export function TiersIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 8 4.5-8 4.5-8-4.5z" fill="currentColor" fillOpacity="0.15" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  )
}

export function VolumeIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" fill="currentColor" fillOpacity="0.15" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a8 8 0 0 1 0 11" />
    </svg>
  )
}

export function PlayIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}

export function SwapIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 8h13l-3-3" />
      <path d="M20 16H7l3 3" />
    </svg>
  )
}

export function RefreshIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 3v4h-4" />
    </svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M20 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  )
}

export function InboxIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" />
      <path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5" />
      <path d="M5.5 13.5L7 6h10l1.5 7.5" />
    </svg>
  )
}

export function MusicNoteIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 18.5V5.5l10-2v12" />
      <circle cx="6.5" cy="18.5" r="2.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="16.5" cy="15.5" r="2.5" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}

export function ZapIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}

export function GridIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}

export function NotebookIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3" width="15" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M13 8h4M13 12h4" />
    </svg>
  )
}

export function MicIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" fillOpacity="0.15" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  )
}

export function CardsIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="13" height="15" rx="2" fill="currentColor" fillOpacity="0.1" />
      <path d="M8 3h11a2 2 0 0 1 2 2v13" />
    </svg>
  )
}

export function PawIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="9" r="1.8" />
      <circle cx="12" cy="7" r="1.8" />
      <circle cx="17" cy="9" r="1.8" />
      <path d="M12 12c-2.8 0-5 2.2-5 4.4 0 1.4 1.1 2.6 2.5 2.6 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.4 0 2.5-1.2 2.5-2.6 0-2.2-2.2-4.4-5-4.4z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}

export function BowlIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16a8 8 0 0 1-16 0z" fill="currentColor" fillOpacity="0.15" />
      <path d="M9 8.5c0-1.5 1.5-1.5 1.5-3M14 8.5c0-1.5 1.5-1.5 1.5-3" />
    </svg>
  )
}

export function PersonIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 20.5v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1" fill="currentColor" fillOpacity="0.1" />
    </svg>
  )
}

// ── Category icon map ───────────────────────────────────────────────────────
// vocabulary.js keeps its hand-editable `emoji` field (house rule: data stays
// plain). The UI prefers a set icon when one exists and falls back to the
// emoji otherwise — so adding a category never REQUIRES drawing an icon.
const categoryIcons = {
  animals: PawIcon,
  food: BowlIcon,
  man: PersonIcon,
  woman: PersonIcon,
  people: PersonIcon,
  family: PersonIcon,
}

export function CategoryIcon({ category, size = 20, className = '' }) {
  const Icon = categoryIcons[category?.id]
  if (Icon) return <Icon size={size} className={className} />
  return (
    <span aria-hidden="true" className={className} style={{ fontSize: size * 0.9 }}>
      {category?.emoji}
    </span>
  )
}
