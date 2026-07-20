import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPhrase, adjacentPhrases, speakStepId } from '../data/speak.js'
import { useProgress } from '../hooks/useProgress.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import PaywallGate from '../components/common/PaywallGate.jsx'
import AccountGate from '../components/common/AccountGate.jsx'
import PronounceStep from '../components/speak/PronounceStep.jsx'
import { isPhraseGuestAllowed, GUEST_PHRASE_LIMIT } from '../lib/access.js'

// One phrase's practice screen. PronounceStep does the record/compare loop;
// this page owns routing, the paywall, progress, and prev/next flow.

export default function SpeakPhrase() {
  const { phraseId } = useParams()
  const navigate = useNavigate()
  const phrase = getPhrase(phraseId)
  const { completedSteps, markStepComplete, awardPoints } = useProgress()

  if (!phrase) {
    return (
      <div>
        <p className="text-stone-900">Phrase not found.</p>
        <button onClick={() => navigate('/speak')} className="mt-4 btn-primary">
          Back to Speak
        </button>
      </div>
    )
  }

  const { prev, next } = adjacentPhrases(phrase.id)
  const done = completedSteps.includes(speakStepId(phrase.id))

  // Points fire when a take is RECORDED (onTake below), not here — recording
  // is the thing worth rewarding, and it's the corpus contribution. UNCAPPED
  // and unguarded by `done`: every take is a new clip worth having (notes/57).
  const handleTake = () => {
    awardPoints('speak-attempt')
  }

  const handleDone = () => {
    if (!done) markStepComplete(speakStepId(phrase.id))
    if (next) {
      navigate(`/speak/${next.id}`)
    } else {
      navigate('/speak')
    }
  }

  return (
    <AccountGate
      allowed={isPhraseGuestAllowed(phrase.id)}
      contentLabel="Create a free account to keep practicing"
      blurb={`The first ${GUEST_PHRASE_LIMIT} phrases are open to everyone. An account is free — it unlocks every phrase and saves the words you're working on.`}
    >
    <PaywallGate tier={phrase.tier} contentLabel={`“${phrase.hmong}” is a Pro phrase`}>
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Speak', to: '/speak' },
            { label: phrase.hmong },
          ]}
        />

        <div className="surface-elevated p-6 sm:p-10 max-w-2xl mx-auto">
          <PronounceStep
            key={phrase.id}
            phrase={phrase}
            done={done}
            onDone={handleDone}
            onTake={handleTake}
          />
        </div>

        <div className="mt-6 max-w-2xl mx-auto flex justify-between items-center text-sm">
          {prev ? (
            <Link to={`/speak/${prev.id}`} className="text-stone-700 underline">
              ← {prev.hmong}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/speak/${next.id}`} className="text-stone-700 underline">
              {next.hmong} →
            </Link>
          ) : (
            <Link to="/speak" className="text-stone-700 underline">
              Back to Speak →
            </Link>
          )}
        </div>
      </div>
    </PaywallGate>
    </AccountGate>
  )
}
