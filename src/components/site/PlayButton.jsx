import { Link } from 'react-router-dom'
import { PlayIcon } from '../icons/index.jsx'
import { MOBILE_APP } from '../../data/mobileApp.js'

// The one "download" button, used in the header, hero, and final CTA.
//
// Deliberately NOT a copy of Google's official badge artwork: that badge has
// strict usage rules and must be the downloaded asset. If you want it, get it
// from Google's badge generator, drop it in public/assets/, and swap the
// contents of this component for an <img>. Every placement updates at once.
//
// `compact` = header size, shorter label on small screens.
export default function PlayButton({ compact = false, className = '' }) {
  const label = (
    <>
      <PlayIcon size={compact ? 16 : 18} />
      {compact ? (
        <>
          <span className="sm:hidden">Get app</span>
          <span className="hidden sm:inline">Get the app</span>
        </>
      ) : (
        'Get it on Google Play'
      )}
    </>
  )
  const cls = `btn-primary inline-flex items-center justify-center gap-2 ${compact ? 'px-3 py-2 text-sm' : ''} ${className}`

  // No store URL configured → never render a dead link; send people to the CTA.
  if (!MOBILE_APP.android) {
    return <Link to="/#download" className={cls}>{label}</Link>
  }
  return (
    <a href={MOBILE_APP.android} target="_blank" rel="noreferrer" className={cls}>
      {label}
    </a>
  )
}
