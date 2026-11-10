import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import {
  PhoneIcon,
  BookIcon,
  CardsIcon,
  MicIcon,
  MailIcon,
  CheckIcon,
} from '../components/icons/index.jsx'
import { MOBILE_APP, isShipped, storeNames } from '../data/mobileApp.js'

// /app — the mobile app's home on the web.
//
// The web app is being wound down in favor of the React Native app, but NOT
// yet: tone scoring (record → pitch curve → score) only runs here today. This
// page says both things honestly — mobile is the future, the web still has one
// thing mobile doesn't. When the scorer lands in RN, delete the "Still on the
// web" section. Store links come from data/mobileApp.js. See notes/71.

const features = [
  { Icon: BookIcon, title: 'Every lesson', body: 'The full course — alphabet, tones, grammar, numbers, time — built for your phone.' },
  { Icon: CardsIcon, title: 'Flashcards & quizzes', body: 'Spaced-repetition review and quizzes, with native-speaker audio.' },
  { Icon: CheckIcon, title: 'Your progress, synced', body: 'Same account as the website. Sign in and pick up where you left off.' },
]

export default function GetTheApp() {
  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Mobile app' }]} />

      <div className="flex items-center gap-3 mb-3 text-clay-700">
        <PhoneIcon size={28} />
        <span className="text-xs uppercase tracking-[0.22em] font-semibold">
          {isShipped ? 'Out now' : 'Coming soon'}
        </span>
      </div>
      <h1 className="font-display text-4xl sm:text-5xl text-stone-900 mb-4">
        Kawm Hmoob, in your pocket
      </h1>
      <p className="text-lg text-stone-800 leading-relaxed mb-8">
        {isShipped
          ? `The Kawm Hmoob app is available now on ${storeNames}. It's where new lessons, words, and recordings land first.`
          : 'Kawm Hmoob is going mobile. The app is where new lessons, words, and recordings will land first.'}
      </p>

      <Downloads />

      <ul className="grid gap-3 sm:grid-cols-3 mb-10">
        {features.map(({ Icon, title, body }) => (
          <li key={title} className="rounded-xl bg-cream-50 border border-cream-200 p-4">
            <Icon size={22} className="text-clay-700 mb-2" />
            <h2 className="font-semibold text-stone-900 mb-1">{title}</h2>
            <p className="text-sm text-stone-700 leading-relaxed">{body}</p>
          </li>
        ))}
      </ul>

      {/* Tone scoring is web-only by design (Web Audio pipeline; see notes/71). */}
      <section className="rounded-xl border border-ocean-400/40 bg-ocean-200/60 p-5 mb-10">
        <div className="flex items-center gap-2 mb-2 text-stone-900">
          <MicIcon size={20} />
          <h2 className="font-display text-2xl">Only on the web: tone scoring</h2>
        </div>
        <p className="text-stone-800 leading-relaxed mb-4">
          Recording yourself and seeing your pitch scored against a native
          speaker runs here on the website. Use the app for lessons and review,
          and come here to get your tones scored.
        </p>
        <Link to="/speak" className="btn-primary inline-flex">Practice tones</Link>
      </section>

      <p className="text-sm text-stone-600">
        Questions? See the <Link to="/contact" className="text-clay-700 underline">contact page</Link>
        {' '}or the <Link to="/privacy" className="text-clay-700 underline">privacy policy</Link>.
      </p>
    </div>
  )
}

// Real store buttons once a URL exists; an email "notify me" until then. Never
// render a download button that goes nowhere.
function Downloads() {
  if (!isShipped) {
    const href = `mailto:${MOBILE_APP.notifyEmail}?subject=${encodeURIComponent('Notify me when the Kawm Hmoob app launches')}`
    return (
      <div className="rounded-xl bg-cream-100 border border-cream-300 p-5 mb-10">
        <p className="text-stone-800 mb-3">
          The app isn't in the stores yet. Want to hear the moment it is?
        </p>
        <a href={href} className="btn-primary inline-flex items-center gap-2">
          <MailIcon size={18} />
          Email me at launch
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {MOBILE_APP.ios && (
        <a href={MOBILE_APP.ios} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
          Download for iOS
        </a>
      )}
      {MOBILE_APP.android && (
        <a href={MOBILE_APP.android} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
          Get it on Google Play
        </a>
      )}
    </div>
  )
}
