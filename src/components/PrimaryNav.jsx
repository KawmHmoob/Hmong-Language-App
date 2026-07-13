import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// The app's primary navigation: exactly TWO front doors (Speak, Words) plus a
// compact "More" for everything else.
//
// Renders BOTH form factors from one links source:
//   - desktop (md+): a left rail, sticky inside Layout's flex row
//   - mobile: a fixed bottom tab bar; "More" opens a sheet above the bar
//
// The fixed tab bar doesn't care where it sits in the DOM, so one mount point
// in Layout covers both. Secondary pages stay reachable here AND keep their
// original routes.

const primary = [
  { to: '/speak', label: 'Speak', icon: MicIcon, blurb: 'Pronunciation practice' },
  { to: '/words', label: 'Words', icon: CardsIcon, blurb: 'Vocabulary & drills' },
]

const secondary = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/alphabet', label: 'Alphabet' },
  { to: '/course', label: 'Course' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/notebook', label: 'Notebook' },
  { to: '/quiz', label: 'Quiz' },
]

export default function PrimaryNav() {
  return (
    <>
      <SideRail />
      <TabBar />
    </>
  )
}

function SideRail() {
  return (
    <nav
      aria-label="Primary"
      className="hidden md:block w-56 shrink-0 self-start sticky top-28 pl-4 py-10"
    >
      <div className="space-y-2">
        {primary.map(({ to, label, icon: Icon, blurb }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-start gap-3 rounded-md border px-4 py-3.5 transition-all duration-200 ${
                isActive
                  ? 'bg-cream-50 border-clay-500 shadow-warm'
                  : 'bg-cream-50/60 border-cream-200 hover:bg-cream-50 hover:shadow-warm'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`mt-0.5 ${isActive ? 'text-clay-600' : 'text-stone-500 group-hover:text-clay-600'} transition`}
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                <span className="min-w-0">
                  <span className={`block font-serif text-lg leading-tight ${isActive ? 'text-clay-700' : 'text-stone-900'}`}>
                    {label}
                  </span>
                  <span className="block text-xs text-stone-600 mt-0.5">{blurb}</span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <p className="mt-8 mb-2 px-1 text-[11px] uppercase tracking-[0.2em] text-stone-600">
        More
      </p>
      <div className="flex flex-col gap-0.5">
        {secondary.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `rounded px-3 py-1.5 text-sm transition ${
                isActive
                  ? 'bg-stone-900 text-cream-50 font-medium'
                  : 'text-stone-800 hover:bg-cream-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function TabBar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const moreRef = useRef(null)

  // Close the sheet whenever navigation happens.
  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  // Close on Escape, and return focus to the More button.
  useEffect(() => {
    if (!moreOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false)
        moreRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-30"
    >
      {moreOpen && (
        <div
          id="more-sheet"
          className="mx-3 mb-2 rounded-xl glass shadow-warm-lg p-3"
        >
          <div className="grid grid-cols-2 gap-1">
            {secondary.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-stone-900 text-cream-50 font-medium'
                      : 'text-stone-800 hover:bg-cream-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="glass border-x-0 border-b-0 shadow-warm-lg px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-3">
          {primary.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                  isActive ? 'text-clay-700' : 'text-stone-600 hover:text-stone-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  <span
                    className={`h-1 w-1 rounded-full ${isActive ? 'bg-clay-600' : 'bg-transparent'}`}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}

          <button
            ref={moreRef}
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
            aria-controls="more-sheet"
            aria-label="More pages"
            className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
              moreOpen ? 'text-clay-700' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <DotsIcon aria-hidden="true" />
            <span>More</span>
            <span
              className={`h-1 w-1 rounded-full ${moreOpen ? 'bg-clay-600' : 'bg-transparent'}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </nav>
  )
}

function MicIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  )
}

function CardsIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="13" height="15" rx="2" />
      <path d="M8 3h11a2 2 0 0 1 2 2v13" />
    </svg>
  )
}

function DotsIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  )
}
