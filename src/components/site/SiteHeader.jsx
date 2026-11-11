import { Link } from 'react-router-dom'
import PlayButton from './PlayButton.jsx'
import { SunIcon, MoonIcon, SparkIcon } from '../icons/index.jsx'
import { useTheme } from '../../hooks/useTheme.js'

// In-page anchors on the landing page. They're Links to "/#id" (not bare
// "#id") so they also work from /privacy, /terms, etc.
const NAV = [
  { id: 'tones', label: 'Tones' },
  { id: 'features', label: 'Features' },
  { id: 'screens', label: 'Screens' },
  { id: 'faq', label: 'FAQ' },
]

const THEME_META = {
  light: { label: 'Light', next: 'Dark', Icon: SunIcon },
  dark: { label: 'Dark', next: 'Neon', Icon: MoonIcon },
  neon: { label: 'Neon', next: 'Light', Icon: SparkIcon },
}

export default function SiteHeader() {
  const { theme, cycle } = useTheme()
  const { label, next, Icon } = THEME_META[theme]

  return (
    <header className="sticky top-0 z-20 bg-ocean-200/85 backdrop-blur-md border-b border-ocean-400/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-2 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img src="/assets/transIcon.png" alt="" className="h-9 w-auto shrink-0" />
          <img src="/assets/KawmHmoobSvg1svgexport.svg" alt="Kawm Hmoob" className="h-7 sm:h-8 w-auto min-w-0" />
        </Link>

        <nav aria-label="Page sections" className="hidden md:flex items-center gap-1 ml-4">
          {NAV.map((n) => (
            <Link
              key={n.id}
              to={`/#${n.id}`}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-900/10 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={cycle}
            title={`Theme: ${label} (switch to ${next})`}
            aria-label={`Theme: ${label}. Switch to ${next} theme`}
            className="h-10 w-10 grid place-items-center rounded-lg text-stone-800 hover:bg-stone-900/10 transition-colors"
          >
            <Icon size={19} />
          </button>
          <PlayButton compact />
        </div>
      </div>
    </header>
  )
}
