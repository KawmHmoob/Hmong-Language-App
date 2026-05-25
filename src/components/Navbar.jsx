import { NavLink, Link } from 'react-router-dom'
import XPBadge from './progress/XPBadge.jsx'
import StreakBadge from './progress/StreakBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import KawmHmoobLogo from '/assets/KawmHmoobSvg1svgexport.svg'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/alphabet', label: 'Alphabet' },
  { to: '/course', label: 'Course' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/notebook', label: 'Notebook' },
  { to: '/quiz', label: 'Quiz' },
]

export default function Navbar() {
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-10 bg-[#C7DEE0] backdrop-blur-md border-b border-[#9CBFC2]/40">
      {/* Row 1: brand + identity bar */}
      <div className="mx-auto max-w-5xl px-6 pt-4 pb-3 flex items-center justify-between gap-4">
        <Link to="/" className="group">
          {/* <h1 className="font-serif text-2xl text-stone-900 leading-tight group-hover:text-clay-700 transition">
            Kawm Hmoob
          </h1> */}
          <img
            src={KawmHmoobLogo}
            alt="Kawm Hmoob"
            className="h-10 w-13"
          />
          <p className="text-xs text-stone-800/80 italic">Learn the Hmong language</p>
        </Link>

        <div className="flex items-center gap-2">
          <XPBadge />
          <StreakBadge />
          <span className="w-px h-5 bg-stone-800/20 mx-1" aria-hidden="true" />
          <IconLink to="/search" title="Search"><SearchIcon /></IconLink>
          <IconLink to="/settings" title="Settings"><SettingsIcon /></IconLink>
          <IconLink to="/account" title="Account">
            {user.isGuest ? 'Guest' : `@${user.username}`}
          </IconLink>
        </div>
      </div>

      {/* Row 2: navigation */}
      <nav className="mx-auto max-w-5xl px-4 pb-2 flex flex-wrap gap-1 text-sm">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-sm transition font-medium ${
                isActive
                  ? 'bg-stone-800 text-[#C7DEE0]'
                  : 'text-stone-800 hover:bg-white/30'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconLink({ to, title, children }) {
  return (
    <NavLink
      to={to}
      title={title}
      className={({ isActive }) =>
        `px-2.5 py-1.5 rounded-sm text-sm transition ${
          isActive
            ? 'bg-stone-800 text-[#C7DEE0]'
            : 'text-stone-800 hover:bg-white/30'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
