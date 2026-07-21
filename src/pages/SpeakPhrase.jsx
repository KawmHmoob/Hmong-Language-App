import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPhrase, adjacentPhrases, speakStepId } from '../data/speak.js'
import { useProgress } from '../hooks/useProgress.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import PaywallGate from '../components/common/PaywallGate.jsx'
import AccountGate from '../components/common/AccountGate.jsx'
import PronounceStep from '../components/speak/PronounceStep.jsx'
import { isPhraseGuestAllowed, GUEST_PHRASE_LIMIT } from '../lib/access.js'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons/index.jsx'

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

        {/* Real buttons, matching the quiz's btn-secondary nav — underlined
            text links read as footnotes, not as "move to the next thing", and
            were small tap targets on mobile. See notes/65. */}
        <div className="mt-6 max-w-2xl mx-auto flex justify-between items-center gap-3">
          {prev ? (
            <Link to={`/speak/${prev.id}`} className="btn-secondary gap-1.5 min-w-0">
              <ArrowLeftIcon size={15} />
              <span className="truncate">{prev.hmong}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/speak/${next.id}`} className="btn-secondary gap-1.5 min-w-0">
              <span className="truncate">{next.hmong}</span>
              <ArrowRightIcon size={15} />
            </Link>
          ) : (
            <Link to="/speak" className="btn-secondary gap-1.5">
              Finish
              <ArrowRightIcon size={15} />
            </Link>
          )}
        </div>
      </div>
    </PaywallGate>
    </AccountGate>
  )
}
