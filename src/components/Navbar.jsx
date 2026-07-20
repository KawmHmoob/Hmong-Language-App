import { Link, NavLink } from 'react-router-dom'
import XPBadge from './progress/XPBadge.jsx'
import StreakBadge from './progress/StreakBadge.jsx'
import LevelBadge from './progress/LevelBadge.jsx'
import { TrophyIcon, TiersIcon } from './icons/index.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../hooks/useTheme.js'

// Served statically from public/assets â€” referenced by URL, not imported.
const KawmHmoobLogo = '/assets/KawmHmoobSvg1svgexport.svg'

// Slim identity/status header. Primary navigation (Speak / Words / More)
// lives in PrimaryNav.jsx â€” bottom tab bar on mobile, left rail on desktop.

const THEME_META = {
  light: { label: 'Light', next: 'dark' },
  dark: { label: 'Dark', next: 'neon' },
  neon: { label: 'Neon', next: 'light' },
}

export default function Navbar() {
  const { user } = useAuth()
  const { theme, cycle } = useTheme()

  // Ocean, not seafoam: the page body is seafoam-300, so a seafoam-200 header
  // sat LIGHTER than the page and read as a gap rather than a bar. ocean-200 is
  // a step deeper than the body in every theme, which is what makes it register
  // as a header. See notes/55.
  return (
    <header className="sticky top-0 z-20 bg-ocean-200/85 backdrop-blur-md border-b border-ocean-400/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="group flex items-center gap-2.5 min-w-0">
          <img
            src={KawmHmoobLogo}
            alt="Kawm Hmoob"
            className="h-8 sm:h-14 w-auto flex-shrink-0"
          />
          <span className="hidden sm:block text-xs uppercase tracking-[0.22em] text-stone-800/70 font-medium truncate">
            Learn Hmong
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Status cluster. The header is width-critical on phones, so the two
              LIFETIME numbers (xp, streak) yield to the season level, which is
              the one that's also a link. Nothing is dropped â€” both still show
              on Home. */}
          <LevelBadge />
          <XPBadge className="hidden sm:inline-flex" />
          <StreakBadge />

          <span className="inline-block w-px h-6 bg-stone-800/20 mx-1" aria-hidden="true" />
          <IconLink to="/pass" title="Season Pass"><TiersIcon size={19} /></IconLink>
          <IconLink to="/leaderboard" title="Leaderboard"><TrophyIcon size={19} /></IconLink>
          <span className="inline-block w-px h-6 bg-stone-800/20 mx-1" aria-hidden="true" />
          <button
            type="button"
            onClick={cycle}
            title={`Theme: ${THEME_META[theme].label} â€” switch to ${THEME_META[THEME_META[theme].next].label}`}
            aria-label={`Theme: ${THEME_META[theme].label}. Switch to ${THEME_META[THEME_META[theme].next].label} theme`}
            className="px-2.5 sm:px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-900/10 transition-colors"
          >
            {theme === 'light' && <SunIcon />}
            {theme === 'dark' && <MoonIcon />}
            {theme === 'neon' && <SparkIcon />}
          </button>
          <IconLink to="/search" title="Search"><SearchIcon /></IconLink>
          <IconLink to="/settings" title="Settings"><SettingsIcon /></IconLink>
          <IconLink to="/account" title="Account">
            <span className="flex items-center gap-2">
              <PersonIcon />
              <span className="hidden md:inline text-sm">
                {user.isGuest ? 'Guest' : `@${user.username}`}
              </span>
            </span>
          </IconLink>
        </div>
      </div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l1.9 5.7L20 9.6l-5.4 3.2L15.8 19 12 15.4 8.2 19l1.2-6.2L4 9.6l6.1-1.9L12 2z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        `px-2.5 sm:px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-stone-800 text-ocean-200'
            : 'text-stone-800 hover:bg-stone-900/10'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

