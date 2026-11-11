import { Link } from 'react-router-dom'
import { MOBILE_APP } from '../../data/mobileApp.js'

const linkCls = 'text-stone-700 hover:text-clay-700 transition-colors'

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ocean-200 border-t border-ocean-400/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-8 sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <img src="/assets/transIcon.png" alt="" className="h-8 w-auto" />
            <img src="/assets/KawmHmoobSvg1svgexport.svg" alt="Kawm Hmoob" className="h-7 w-auto" />
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            Learn Hmong with native-speaker audio. Ua tsaug rau koj txoj kev kawm.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          {MOBILE_APP.android && (
            <a href={MOBILE_APP.android} target="_blank" rel="noreferrer" className={linkCls}>
              Google Play
            </a>
          )}
          <Link to="/contact" className={linkCls}>Contact</Link>
          <Link to="/reset-password" className={linkCls}>Reset password</Link>
          <Link to="/privacy" className={linkCls}>Privacy</Link>
          <Link to="/terms" className={linkCls}>Terms</Link>
        </nav>
      </div>
      <div className="border-t border-ocean-400/40">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-stone-700">
          © {year} Kawm Hmoob · Devan Lee &amp; DevvDevvDevv Development
        </p>
      </div>
    </footer>
  )
}
