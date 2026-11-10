import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PhoneIcon, ArrowRightIcon } from '../icons/index.jsx'
import { isShipped, storeNames } from '../../data/mobileApp.js'

// App-wide "there's a mobile app" banner. Sits in Layout under WarningRibbon.
//
// Dismissible, and the dismissal is remembered per browser. The storage key is
// versioned: bump it (e.g. on launch day, when the copy changes from "coming
// soon" to "out now") and everyone who dismissed the old message sees the new
// one once. localStorage can throw (private mode, blocked storage), so every
// access is wrapped — the banner must still render without it.
//
// Hidden on /app itself: the page already says everything the banner does.
// See notes/71.

const KEY = `kh:appPromoDismissed:${isShipped ? 'live' : 'soon'}`

function readDismissed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function AppPromo() {
  const { pathname } = useLocation()
  const [dismissed, setDismissed] = useState(readDismissed)

  if (dismissed || pathname === '/app') return null

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* not persisting is fine — it just shows again next visit */
    }
  }

  return (
    <div className="bg-ocean-300/70 border-b border-ocean-400/40 text-stone-900">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-2.5 flex items-center gap-3">
        <PhoneIcon size={18} className="shrink-0" />
        <p className="text-sm min-w-0 flex-1">
          {isShipped ? (
            <><strong>The Kawm Hmoob app is here.</strong> Now on {storeNames}.</>
          ) : (
            <><strong>Kawm Hmoob is going mobile.</strong> The app is coming soon.</>
          )}
        </p>
        <Link
          to="/app"
          className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold underline-offset-2 hover:underline"
        >
          {isShipped ? 'Get it' : 'Learn more'}
          <ArrowRightIcon size={16} />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss mobile app announcement"
          className="shrink-0 -mr-2 h-9 w-9 grid place-items-center rounded-lg hover:bg-stone-900/10 transition-colors"
        >
          <span aria-hidden="true" className="text-lg leading-none">×</span>
        </button>
      </div>
    </div>
  )
}
