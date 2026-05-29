import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const closeMenu = () => setMenuOpen(false)

  // Auto-close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-20 bg-[#C7DEE0] backdrop-blur-md border-b border-[#9CBFC2]/40">
      {/* Row 1: brand + identity bar */}
      <div className="mx-auto max-w-5xl px-3 sm:px-6 pt-2 sm:pt-4 pb-2 sm:pb-3 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" onClick={closeMenu} className="group flex items-center gap-2 min-w-0">
          <img
            src={KawmHmoobLogo}
            alt="Kawm Hmoob"
            className="h-8 sm:h-10 w-auto flex-shrink-0"
          />
          <p className="hidden sm:block text-xs text-stone-800/80 italic truncate">
            Learn the Hmong language
          </p>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <XPBadge />
          <StreakBadge />

          {/* Desktop-only icon group */}
          <span className="hidden sm:inline-block w-px h-5 bg-stone-800/20 mx-1" aria-hidden="true" />
          <div className="hidden sm:flex items-center gap-1">
            <IconLink to="/search" title="Search"><SearchIcon /></IconLink>
            <IconLink to="/settings" title="Settings"><SettingsIcon /></IconLink>
            <IconLink to="/account" title="Account">
              <span className="flex items-center gap-1.5">
                <PersonIcon />
                <span className="hidden md:inline text-sm">
                  {user.isGuest ? 'Guest' : `@${user.username}`}
                </span>
              </span>
            </IconLink>
          </div>

          {/* Mobile-only hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="sm:hidden p-2 rounded-sm text-stone-800 hover:bg-white/30 transition"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Desktop nav row */}
      <nav className="hidden sm:block mx-auto max-w-5xl px-4 pb-2">
        <div className="flex flex-wrap gap-1 text-sm">
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
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#9CBFC2]/40 bg-[#C7DEE0] shadow-lg">
          <nav className="px-3 py-3 flex flex-col gap-1 text-sm">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-sm transition font-medium ${
                    isActive
                      ? 'bg-stone-800 text-[#C7DEE0]'
                      : 'text-stone-800 hover:bg-white/30'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="my-2 h-px bg-stone-800/15" />

            <MobileMenuLink to="/search" onClick={closeMenu} icon={<SearchIcon />}>
              Search
            </MobileMenuLink>
            <MobileMenuLink to="/settings" onClick={closeMenu} icon={<SettingsIcon />}>
              Settings
            </MobileMenuLink>
            <MobileMenuLink to="/account" onClick={closeMenu} icon={<PersonIcon />}>
              {user.isGuest ? 'Guest' : `@${user.username}`}
            </MobileMenuLink>
          </nav>
        </div>
      )}
    </header>
  )
}

function MobileMenuLink({ to, onClick, icon, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2.5 rounded-sm transition font-medium ${
          isActive
            ? 'bg-stone-800 text-[#C7DEE0]'
            : 'text-stone-800 hover:bg-white/30'
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
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

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLink({ to, title, children }) {
  return (
    <NavLink
      to={to}
      title={title}
      className={({ isActive }) =>
        `px-2 sm:px-2.5 py-1.5 rounded-sm text-sm transition ${
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
