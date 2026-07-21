import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import PronounceStep from '../components/speak/PronounceStep.jsx'
import { getWordFamily } from '../data/wordFamilies.js'
import { useProgress } from '../hooks/useProgress.js'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../components/icons/index.jsx'

// Word-family practice — now the SAME loop as phrase practice.
//
// Was a static list with a disabled mic. The consonant and vowel families are
// derived from reference.js and carry real recordings, so there was no reason
// they couldn't record + score like SpeakPhrase does. This screen now steps
// through the family one letter at a time and hands each to PronounceStep,
// so both Speak surfaces behave identically. See notes/64.
//
// Progress + points use the WORD id as the key, matching how phrase practice
// uses the phrase id.

export default function SpeakFamily() {
  const { familyId } = useParams()
  const navigate = useNavigate()
  const family = getWordFamily(familyId)
  const { completedSteps, markStepComplete, awardPoints } = useProgress()
  const [index, setIndex] = useState(0)

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

  const words = family.words
  const word = words[index]
  const done = completedSteps.includes(word.id)
  const practiced = words.filter((w) => completedSteps.includes(w.id)).length

  // PronounceStep speaks `phrase` shape. A bare consonant has no vowel/tone, so
  // it falls back to the family's pattern as the tip.
  const phrase = {
    id: word.id,
    hmong: word.hmong,
    english: word.english,
    audio: word.audio,
    tip: word.vowel
      ? `${word.consonant} + ${word.vowel} + ${word.tone || '(no tone)'}`
      : family.pattern,
  }

  // Points fire on RECORD, not on advancing — same rule as SpeakPhrase
  // (notes/63). Uncapped, every take counts.
  const handleTake = () => awardPoints('speak-attempt')

  const handleDone = () => {
    if (!done) markStepComplete(word.id)
    if (index < words.length - 1) setIndex(index + 1)
    else navigate('/speak')
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

      <div className="mb-6">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-clay-600" aria-hidden="true" />
          Word family
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-stone-900 mb-2">
          {family.title}
        </h2>
        <p className="text-stone-700 max-w-2xl leading-relaxed">{family.description}</p>
      </div>

      {/* Position + progress through the family. */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 max-w-2xl mx-auto text-sm">
        <span className="text-stone-700">
          {index + 1} of {words.length}
        </span>
        <span className="inline-flex items-center gap-1.5 text-stone-600">
          <CheckIcon size={14} /> {practiced} practiced
        </span>
      </div>
      <div className="max-w-2xl mx-auto h-1.5 rounded-full bg-cream-200 overflow-hidden mb-6">
        <div
          className="h-full bg-clay-600 transition-all duration-300"
          style={{ width: `${((index + 1) / words.length) * 100}%` }}
        />
      </div>

      <div className="surface-elevated p-5 sm:p-10 max-w-2xl mx-auto">
        {/* key resets recording + score state when moving between letters */}
        <PronounceStep
          key={word.id}
          phrase={phrase}
          done={done}
          onDone={handleDone}
          onTake={handleTake}
        />
      </div>

      {/* Prev / next — same btn-secondary treatment as the quiz and
          SpeakPhrase, so all three navigations look and tap alike. */}
      <div className="mt-6 max-w-2xl mx-auto flex justify-between items-center gap-3">
        {index > 0 ? (
          <button
            onClick={() => setIndex(index - 1)}
            className="btn-secondary gap-1.5 min-w-0"
          >
            <ArrowLeftIcon size={15} />
            <span className="truncate">{words[index - 1].hmong}</span>
          </button>
        ) : (
          <Link to="/speak" className="btn-secondary gap-1.5">
            <ArrowLeftIcon size={15} />
            Speak
          </Link>
        )}

        {index < words.length - 1 ? (
          <button
            onClick={() => setIndex(index + 1)}
            className="btn-secondary gap-1.5 min-w-0"
          >
            <span className="truncate">{words[index + 1].hmong}</span>
            <ArrowRightIcon size={15} />
          </button>
        ) : (
          <Link to="/speak" className="btn-secondary gap-1.5">
            Finish
            <ArrowRightIcon size={15} />
          </Link>
        )}
      </div>
    </div>
  )
}
