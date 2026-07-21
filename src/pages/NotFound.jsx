import { Link, useLocation } from 'react-router-dom'
import { BookIcon, MicIcon, CardsIcon } from '../components/icons/index.jsx'

// 404. Wired to path="*" in App.jsx, so it catches any unknown URL. Rather than
// a dead end, it points back at the five sections — a lost user's most likely
// next move is "take me somewhere real," not "go home and start over."

const WAYS_BACK = [
  { to: '/learn', label: 'Learn', blurb: 'Lessons, start to finish.', Icon: BookIcon },
  { to: '/speak', label: 'Speak', blurb: 'Record and compare your tones.', Icon: MicIcon },
  { to: '/vocabulary', label: 'Words', blurb: 'Flashcards and drills.', Icon: CardsIcon },
]

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <div className="max-w-xl mx-auto text-center py-16 sm:py-24">
      <p className="text-sm uppercase tracking-[0.25em] text-clay-600 mb-3">Lost</p>
      <h2 className="font-display text-7xl sm:text-8xl text-stone-900 mb-3">404</h2>
      <p className="text-stone-700 mb-1">
        There’s nothing at <span className="font-medium text-stone-900">{pathname}</span>.
      </p>
      <p className="text-stone-600 mb-8">
        The page may have moved, or the link was mistyped.
      </p>

      <Link to="/" className="btn-primary">
        Go home
      </Link>

      <p className="text-xs uppercase tracking-wider text-stone-500 mt-12 mb-4">
        Or pick up where you were
      </p>
      <div className="grid gap-3 sm:grid-cols-3 text-left">
        {WAYS_BACK.map(({ to, label, blurb, Icon }) => (
          <Link key={to} to={to} className="surface surface-hover p-4 block group">
            <Icon size={22} className="text-clay-600 mb-2" />
            <p className="font-medium text-stone-900 group-hover:text-clay-700 transition">
              {label}
            </p>
            <p className="text-sm text-stone-600 mt-0.5">{blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
