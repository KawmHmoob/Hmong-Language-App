import { Link } from 'react-router-dom'
import { speakGroups, allPhrases, speakStepId } from '../data/speak.js'
import { useProgress } from '../hooks/useProgress.js'
import { useSubscription } from '../context/SubscriptionContext.jsx'

// Speak hub — one of the app's two front doors. Lists every pronounceable
// phrase grouped by topic, with per-phrase practice state and Pro locks.

export default function Speak() {
  const { completedSteps } = useProgress()
  const { isPro } = useSubscription()

  const total = allPhrases().length
  const practiced = allPhrases().filter((p) =>
    completedSteps.includes(speakStepId(p.id))
  ).length

  return (
    <div>
      {/* Section hero */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-clay-600 mb-2">Speak</p>
        <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-3">
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

      <div className="space-y-10">
        {speakGroups.map((group) => (
          <section key={group.id} aria-labelledby={group.id}>
            <h3 id={group.id} className="font-serif text-2xl text-stone-900 mb-1">
              {group.title}
            </h3>
            <p className="text-sm text-stone-600 mb-4">{group.description}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.phrases.map((phrase) => {
                const done = completedSteps.includes(speakStepId(phrase.id))
                const locked = phrase.tier === 'pro' && !isPro
                return (
                  <li key={phrase.id}>
                    <Link
                      to={`/speak/${phrase.id}`}
                      className="surface surface-hover flex items-center justify-between gap-3 p-4 h-full"
                    >
                      <span className="min-w-0">
                        <span className="block font-serif text-lg text-stone-900 truncate">
                          {phrase.hmong}
                        </span>
                        <span className="block text-sm text-stone-600 truncate">
                          {phrase.english}
                        </span>
                      </span>
                      <span className="shrink-0 flex items-center gap-2">
                        {phrase.tier === 'pro' && (
                          <span
                            className={`text-[10px] uppercase tracking-wider font-medium rounded-full px-2 py-0.5 ${
                              locked
                                ? 'bg-cream-200 text-stone-600'
                                : 'bg-clay-500 text-cream-50'
                            }`}
                          >
                            {locked ? '🔒 Pro' : 'Pro'}
                          </span>
                        )}
                        {done && (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs"
                            title="Practiced"
                          >
                            ✓<span className="sr-only">Practiced</span>
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
