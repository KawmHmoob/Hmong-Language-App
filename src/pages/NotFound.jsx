import { Link, useLocation } from 'react-router-dom'
import PlayButton from '../components/site/PlayButton.jsx'

// Catch-all page, with two personalities:
//
//  1. A path from the RETIRED web app (/speak, /learn/..., bookmarks, old
//     shared links, search results): explain that the learning app moved to
//     the phone, and point at the store. These people aren't lost — the thing
//     they wanted moved.
//  2. Anything else: a plain 404.
//
// The prefix list mirrors the old web app's routes (archived on the
// `webapp-v1` tag). See notes/72.
const RETIRED = [
  'learn', 'speak', 'words', 'vocabulary', 'quiz', 'quizzes', 'reference',
  'alphabet', 'course', 'review', 'notebook', 'leaderboard', 'pass', 'account',
  'settings', 'search', 'login', 'register', 'onboarding', 'tone-eval',
  'sentences', 'profile',
]

export default function NotFound() {
  const { pathname } = useLocation()
  const first = pathname.split('/')[1]
  const retired = RETIRED.includes(first)

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 sm:py-28 text-center">
      {retired ? (
        <>
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-clay-700 mb-3">Moved to the app</p>
          <h1 className="font-display text-4xl sm:text-5xl text-stone-900">Kawm Hmoob lives on your phone now</h1>
          <p className="mt-4 text-lg text-stone-700 leading-relaxed">
            The browser version of Kawm Hmoob has been retired. Lessons, flashcards,
            quizzes, and everything else are in the mobile app, which gets new
            content first.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PlayButton className="px-5 py-3 text-base" />
            <Link to="/" className="btn-secondary inline-flex px-5 py-3 text-base">See what's inside</Link>
          </div>
          <p className="mt-6 text-sm text-stone-600">
            Forgot your password? <Link to="/reset-password" className="text-clay-700 underline">Reset it here</Link>.
            {' '}Other questions about an account? <Link to="/contact" className="text-clay-700 underline">Get in touch</Link>.
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-7xl text-clay-700">404</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-stone-900">This page doesn't exist</h1>
          <p className="mt-3 text-lg text-stone-700">
            <code className="text-base">{pathname}</code> isn't a page on this site.
          </p>
          <Link to="/" className="mt-8 btn-primary inline-flex px-5 py-3 text-base">Back to home</Link>
        </>
      )}
    </section>
  )
}
