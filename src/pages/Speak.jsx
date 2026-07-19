import { Link } from 'react-router-dom'
import { LockIcon, CheckIcon } from '../components/icons/index.jsx'
import { speakGroups, allPhrases, speakStepId } from '../data/speak.js'
import { useProgress } from '../hooks/useProgress.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSubscription } from '../context/SubscriptionContext.jsx'
import { isPhraseGuestAllowed, GUEST_PHRASE_LIMIT } from '../lib/access.js'
import { wordFamilies } from '../data/wordFamilies.js'
import { pickOfTheDay } from '../lib/daily.js'

// Speak hub — one of the app's two front doors. Lists every pronounceable
// phrase grouped by topic, with per-phrase practice state and Pro locks.

export default function Speak() {
  const { completedSteps } = useProgress()
  const { user } = useAuth()
  const { isPro } = useSubscription()

  const total = allPhrases().length
  const practiced = allPhrases().filter((p) =>
    completedSteps.includes(speakStepId(p.id))
  ).length

  // Today's phrase to say out loud. Salted differently from Home's phrase of
  // the day so the two surfaces don't show the same thing (src/lib/daily.js).
  const daily = pickOfTheDay(allPhrases(), 'speak-daily')
  const dailyDone = daily && completedSteps.includes(speakStepId(daily.id))

  return (
    <div>
      {/* Section hero */}
      <div className="mb-10">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-clay-600" aria-hidden="true" />
          Speak
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-stone-900 mb-3">
          Say it like it’s yours.
        </h2>
        <p className="text-stone-700 max-w-xl leading-relaxed">
          Listen, record your own voice, and compare. Hmong tones carry the
          meaning — this is where you train your ear and your mouth together.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-clay-600 transition-all duration-500"
              style={{ width: `${total ? (practiced / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-stone-700">
            {practiced} of {total} phrases practiced
          </span>
        </div>
      </div>

      {/* Say this today — one rotating phrase, same for everyone, no state
          stored (the date is the seed). The daily anchor a streak/leaderboard
          would eventually hang off. See notes/52. */}
      {daily && (
        <Link
          to={`/speak/${daily.id}`}
          className="surface-elevated surface-hover flex items-center justify-between gap-4 p-5 mb-10 group"
        >
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.2em] text-stone-600 mb-1">
              Say this today
            </span>
            <span className="block font-display text-2xl text-stone-900 group-hover:text-clay-700 transition truncate">
              {daily.hmong}
            </span>
            <span className="block text-sm text-stone-600 truncate">{daily.english}</span>
          </span>
          {dailyDone ? (
            <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1">
              <CheckIcon size={12} /> Done
            </span>
          ) : (
            <span className="shrink-0 text-sm font-medium text-clay-700">Practice →</span>
          )}
        </Link>
      )}

      {/* Word families — sound drills built on a shared rime. Barebones
          preview for now; recording/scoring not built (notes/46). */}
      {wordFamilies.length > 0 && (
        <section className="mb-10" aria-labelledby="word-families">
          <h3 id="word-families" className="font-display text-2xl text-stone-900 mb-1">
            Word families
          </h3>
          <p className="text-sm text-stone-600 mb-4">
            Drill one sound at a time — words that share the same ending.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {wordFamilies.map((f) => (
              <li key={f.id}>
                <Link
                  to={`/speak/family/${f.id}`}
                  className="surface surface-hover flex items-center justify-between gap-3 p-4 h-full"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-lg text-stone-900 truncate">
                      {f.title}
                    </span>
                    <span className="block text-sm text-stone-600">
                      {f.words.length} words · {f.pattern}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider font-medium rounded-full bg-cream-200 text-stone-600 px-2 py-0.5">
                    Preview
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-10">
        {speakGroups.map((group) => (
          <section key={group.id} aria-labelledby={group.id}>
            <h3 id={group.id} className="font-display text-2xl text-stone-900 mb-1">
              {group.title}
            </h3>
            <p className="text-sm text-stone-600 mb-4">{group.description}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.phrases.map((phrase) => {
                const done = completedSteps.includes(speakStepId(phrase.id))
                const locked = phrase.tier === 'pro' && !isPro
                const needsAccount = user.isGuest && !isPhraseGuestAllowed(phrase.id)
                return (
                  <li key={phrase.id}>
                    <Link
                      to={`/speak/${phrase.id}`}
                      className="surface surface-hover flex items-center justify-between gap-3 p-4 h-full"
                    >
                      <span className="min-w-0">
                        <span className="block font-display text-lg text-stone-900 truncate">
                          {phrase.hmong}
                        </span>
                        <span className="block text-sm text-stone-600 truncate">
                          {phrase.english}
                        </span>
                      </span>
                      <span className="shrink-0 flex items-center gap-2">
                        {needsAccount && phrase.tier !== 'pro' && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium rounded-full bg-cream-200 text-stone-600 px-2 py-0.5"
                            title="Free account required"
                          >
                            <LockIcon size={10} /> Account
                          </span>
                        )}
                        {phrase.tier === 'pro' && (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium rounded-full px-2 py-0.5 ${
                              locked
                                ? 'bg-cream-200 text-stone-600'
                                : 'bg-clay-500 text-cream-50'
                            }`}
                          >
                            {locked && <LockIcon size={10} />}
                            Pro
                          </span>
                        )}
                        {done && (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700"
                            title="Practiced"
                          >
                            <CheckIcon size={12} />
                            <span className="sr-only">Practiced</span>
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
