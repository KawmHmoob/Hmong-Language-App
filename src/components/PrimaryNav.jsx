import { NavLink, useLocation } from 'react-router-dom'

// Primary navigation — FIVE sections, no "More" sheet. Every page in the app
// belongs to a section, and the section stays lit wherever you are inside it
// (e.g. /vocabulary lights up Words). See notes/30 + notes/32 for the IA.
//
// Renders both form factors from one config:
//   - mobile: fixed bottom tab bar with a sliding accent indicator
//   - desktop (md+): a left rail with accent-tinted active pills
//
// Section identity: each section has an accent used for the indicator bar,
// the rail pill tint, and hub eyebrows — while ACTIVE TEXT stays ink. That's
// deliberate: some accents (seafoam) fail text-contrast on cream in the
// light theme, so color marks the place and type weight marks the state.
//
// Tailwind note: accent classes are written out literally per section (not
// template strings) because the JIT compiler only ships classes it can see.

const sections = [
  {
    id: 'home',
    to: '/',
    label: 'Home',
    icon: HomeIcon,
    match: (p) => p === '/',
    ind: 'bg-stone-700',
    pill: 'bg-cream-100',
  },
  {
    id: 'learn',
    to: '/learn',
    label: 'Learn',
    icon: BookIcon,
    match: (p) => p.startsWith('/learn'),
    ind: 'bg-seafoam-500',
    pill: 'bg-seafoam-500/15',
  },
  {
    id: 'reference',
    to: '/reference',
    label: 'Reference',
    icon: AlphabetIcon,
    match: (p) => p.startsWith('/reference') || p.startsWith('/alphabet') || p.startsWith('/course'),
    ind: 'bg-cream-600',
    pill: 'bg-cream-600/20',
  },
  {
    id: 'speak',
    to: '/speak',
    label: 'Speak',
    icon: MicIcon,
    match: (p) => p.startsWith('/speak'),
    ind: 'bg-clay-600',
    pill: 'bg-clay-600/15',
  },
  {
    id: 'words',
    to: '/words',
    label: 'Words',
    icon: CardsIcon,
    match: (p) =>
      ['/words', '/vocabulary', '/quiz', '/notebook'].some((r) => p.startsWith(r)),
    ind: 'bg-blush-500',
    pill: 'bg-blush-500/15',
  },
]

function activeIndex(pathname) {
  return sections.findIndex((s) => s.match(pathname))
}

export default function PrimaryNav() {
  return (
    <>
      <SideRail />
      <TabBar />
    </>
  )
}

function SideRail() {
  const { pathname } = useLocation()
  const active = activeIndex(pathname)

  return (
    // top-32 (not top-28): the header grew taller, and the sticky rail has to
    // clear it or it tucks under the blur on scroll.
    <nav
      aria-label="Primary"
      className="hidden md:block w-52 shrink-0 self-start sticky top-32 pl-4 py-10"
    >
      <div className="flex flex-col gap-1">
        {sections.map((s, i) => {
          const isActive = i === active
          const Icon = s.icon
          return (
            <NavLink
              key={s.id}
              to={s.to}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? `${s.pill} text-stone-900`
                  : 'text-stone-700 hover:bg-cream-100 hover:text-stone-900'
              }`}
            >
              <Icon aria-hidden="true" filled={isActive} />
              <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {s.label}
              </span>
              {isActive && (
                <span
                  className={`ml-auto h-1.5 w-1.5 rounded-full ${s.ind}`}
                  aria-hidden="true"
                />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

function TabBar() {
  const { pathname } = useLocation()
  const active = activeIndex(pathname)

  return (
    <nav aria-label="Primary" className="md:hidden fixed bottom-0 inset-x-0 z-30">
      <div className="glass border-x-0 border-b-0 shadow-warm-lg pb-[env(safe-area-inset-bottom)]">
        {/* Sliding indicator: one bar, width 1/4, moved by transform so it
            animates on the GPU (and ports to RN as a transform later). */}
        <div className="relative">
          <div
            aria-hidden="true"
            className={`absolute top-0 left-0 h-0.5 w-1/5 rounded-full transition-transform duration-300 ${
              active >= 0 ? sections[active].ind : 'opacity-0'
            }`}
            style={{ transform: `translateX(${Math.max(active, 0) * 100}%)` }}
          />
          <div className="grid grid-cols-5">
            {sections.map((s, i) => {
              const isActive = i === active
              const Icon = s.icon
              return (
                <NavLink
                  key={s.id}
                  to={s.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-1 pt-2.5 pb-2 min-h-[52px] transition-colors ${
                    isActive ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon aria-hidden="true" filled={isActive} />
                  <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {s.label}
                  </span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Icons: 24x24 viewBox, currentColor, 2px round strokes. `filled` switches
// the active state to a weightier look without needing a second SVG set.

function HomeIcon({ filled, ...props }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5" fill="none" />
      <path d="M5 9.5V21h14V9.5" fillOpacity={filled ? 0.15 : 0} />
      <path d="M9 21v-6h6v6" fill="none" />
    </svg>
  )
}

// Capital "A" — the letters/orthography section. Reads at 22px where a
// two-glyph "Aa" would turn to mush.
function AlphabetIcon({ filled, ...props }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {filled && <path d="M12 5.5L17.5 19h-11z" fill="currentColor" fillOpacity="0.15" stroke="none" />}
      <path d="M5 20L12 4l7 16" />
      <line x1="8.2" y1="14.5" x2="15.8" y2="14.5" />
    </svg>
  )
}

function BookIcon({ filled, ...props }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.15 : 0} />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
      {filled && <line x1="8" y1="8" x2="15" y2="8" />}
    </svg>
  )
}

function MicIcon({ filled, ...props }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.2 : 0} />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  )
}

function CardsIcon({ filled, ...props }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="13" height="15" rx="2" fill={filled ? 'currentColor' : 'none'} fillOpacity={filled ? 0.2 : 0} />
      <path d="M8 3h11a2 2 0 0 1 2 2v13" />
    </svg>
  )
}
