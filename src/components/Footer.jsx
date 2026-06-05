import { Link, NavLink } from 'react-router-dom'

// Served statically from public/assets — referenced by URL, not imported.
const KawmHmoobLogo = '/assets/KawmHmoobSvg1svgexport.svg'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/alphabet', label: 'Alphabet' },
  { to: '/course', label: 'Course' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/notebook', label: 'Notebook' },
  { to: '/quiz', label: 'Quiz' },
]

const resources = [
  { to: '/search', label: 'Search' },
  { to: '/settings', label: 'Settings' },
  { to: '/account', label: 'Account' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 bg-[#C7DEE0] backdrop-blur-md border-t border-[#9CBFC2]/40">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <Link to="/" className="inline-block group">
            <img
              src={KawmHmoobLogo}
              alt="Kawm Hmoob"
              className="h-10 w-13"
            />
            <p className="text-xs text-stone-800/80 italic mt-1">
              Learn the Hmong language
            </p>
          </Link>
          <p className="mt-4 text-sm text-stone-700/80 max-w-xs">
            A gentle place to learn Hmong — alphabet, vocabulary, lessons, and quizzes at your pace.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-stone-900 mb-3">Explore</h3>
          <ul className="space-y-1.5 text-sm">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className="text-stone-800 hover:text-clay-700 transition"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-stone-900 mb-3">Account</h3>
          <ul className="space-y-1.5 text-sm">
            {resources.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="text-stone-800 hover:text-clay-700 transition"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#9CBFC2]/40">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-700/80">
          <p>© {year} Kawm Hmoob · made with care</p>
          <p>Ua tsaug rau koj txoj kev kawm.</p>
        </div>
      </div>
    </footer>
  )
}
