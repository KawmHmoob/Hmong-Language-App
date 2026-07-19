import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import { LockIcon, MicIcon } from '../components/icons/index.jsx'
import { getWordFamily, PASS_SCORE } from '../data/wordFamilies.js'

// Word-family practice — BAREBONES PLACEHOLDER.
//
// Shows the drill's shape: the family, its pattern, and each word broken into
// consonant + vowel + tone. Recording/comparison/scoring are NOT built — the
// record control is deliberately disabled rather than faked, so nobody (us
// included) mistakes this for working. See notes/46.

export default function SpeakFamily() {
  const { familyId } = useParams()
  const navigate = useNavigate()
  const family = getWordFamily(familyId)

  if (!family) {
    return (
      <div>
        <p className="text-stone-900">Word family not found.</p>
        <button onClick={() => navigate('/speak')} className="mt-4 btn-primary">
          Back to Speak
        </button>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Speak', to: '/speak' },
          { label: family.title },
        ]}
      />

      <div className="mb-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-clay-600" aria-hidden="true" />
          Word family
        </p>
        <h2 className="font-display text-4xl text-stone-900 mb-2">{family.title}</h2>
        <p className="text-stone-700 max-w-2xl leading-relaxed">{family.description}</p>
        <p className="mt-3 inline-block text-sm font-medium text-clay-700 bg-cream-100 border border-cream-200 rounded-full px-3 py-1">
          {family.pattern}
        </p>
      </div>

      {/* Honest "not built yet" banner — this screen shows shape, not function. */}
      <div className="surface p-4 mb-6 flex items-start gap-3">
        <span className="text-stone-500 mt-0.5 shrink-0">
          <LockIcon size={18} />
        </span>
        <p className="text-sm text-stone-700 leading-relaxed">
          <span className="font-semibold text-stone-900">Coming soon:</span> you’ll
          hear a native recording, record yourself, and get a score. Beat{' '}
          <span className="font-semibold">{PASS_SCORE}%</span> to move to the next
          word. Right now this is a preview of the words you’ll drill.
        </p>
      </div>

      <ol className="space-y-3">
        {family.words.map((w, i) => (
          <li key={w.id} className="surface p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-cream-200 text-stone-700 text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-3xl text-clay-700 leading-none">
                    {w.hmong}
                  </p>
                  {w.english && (
                    <p className="text-sm text-stone-600 mt-1">{w.english}</p>
                  )}
                  {/* consonant + vowel + tone — the Foundations formula. Only
                      for whole syllables; a bare consonant has no breakdown. */}
                  {w.vowel && (
                    <p className="text-xs text-stone-500 mt-1.5">
                      {w.consonant} + {w.vowel} + {w.tone || '(no tone)'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <AudioButton audioSrc={w.audio} wordId={w.id} size="lg" />
                <button
                  type="button"
                  disabled
                  title="Recording isn’t built yet"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-cream-200 text-stone-400 cursor-not-allowed"
                >
                  <MicIcon size={18} />
                  <span className="sr-only">Record (not available yet)</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <Link to="/speak" className="btn-ghost">
          Back to Speak
        </Link>
      </div>
    </div>
  )
}
