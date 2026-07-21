import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import BetaRibbon from '../components/common/BetaRibbon.jsx'
import { GridIcon, BookIcon, ZapIcon } from '../components/icons/index.jsx'

// Sentence Builder — PLACEHOLDER, no data.
//
// Roadmap Phase 2 (notes/future-implementations/04). This screen exists to hold
// the route and show the intended SHAPE; there is deliberately no exercise data
// and no fake interaction. Nothing here should look functional, because it
// isn't — the same honesty rule the old SpeakFamily followed (disabled control
// over a faked one).
//
// When it's built, the grammar it validates against is largely already written:
// classifiers, tense markers, demonstratives, conjunctions, and the adjective
// word-order rules all live in src/data/lessons/.

// The parts of a Hmong sentence the builder would let you assemble. Structure
// only — these are category labels from the existing lessons, NOT exercise
// content.
const PARTS = [
  { label: 'Classifier', hint: 'tus, lub, daim…', lesson: '/learn/grammar/foundations-noun-classifiers' },
  { label: 'Noun', hint: 'tsev, dev, ntawv…', lesson: '/vocabulary' },
  { label: 'Verb', hint: 'noj, mus, pom…', lesson: '/learn/grammar/foundations-action-verbs' },
  { label: 'Tense marker', hint: 'yuav, tau, lawm…', lesson: '/learn/grammar/foundations-tense-markers' },
  { label: 'Adjective', hint: 'loj, me, zoo…', lesson: '/learn/grammar/grammar-adjectives' },
]

export default function SentenceBuilder() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Sentence Builder' },
        ]}
      />

      <BetaRibbon title="Not built">
        This is a placeholder. The sentence builder isn’t implemented yet — this
        page shows the shape it will take, with no exercises behind it.
      </BetaRibbon>

      <div className="mb-8">
        <h2 className="font-display text-4xl text-stone-900 mb-3">
          Sentence Builder
        </h2>
        <p className="text-stone-700 max-w-2xl leading-relaxed">
          Hmong sentences follow a consistent order — classifier, then noun, then
          the words that describe or act on it. This is where you’ll assemble
          sentences piece by piece and see that structure directly, instead of
          inferring it from examples.
        </p>
      </div>

      {/* The parts, as static chips. Deliberately NOT draggable — a drag
          affordance that does nothing is worse than no affordance. */}
      <h3 className="font-display text-2xl text-stone-900 mb-1">The pieces</h3>
      <p className="text-stone-600 text-sm mb-4">
        Each part already has a lesson behind it — the builder will draw on them.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {PARTS.map((p) => (
          <Link
            key={p.label}
            to={p.lesson}
            className="surface surface-hover p-4 block group"
          >
            <p className="font-display text-lg text-stone-900 group-hover:text-clay-700 transition">
              {p.label}
            </p>
            <p className="text-sm text-stone-600 mt-0.5">{p.hint}</p>
          </Link>
        ))}
      </div>

      <h3 className="font-display text-2xl text-stone-900 mb-4">
        What it will do
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <div className="surface p-5">
          <GridIcon size={22} className="text-blush-500 mb-2" />
          <p className="font-display text-lg text-stone-900">Build a sentence</p>
          <p className="text-sm text-stone-600 mt-1 leading-snug">
            Arrange the parts in order and get told when the order is wrong —
            and why, in terms of the rule you already learned.
          </p>
        </div>
        <div className="surface p-5">
          <ZapIcon size={22} className="text-blush-500 mb-2" />
          <p className="font-display text-lg text-stone-900">Identify the parts</p>
          <p className="text-sm text-stone-600 mt-1 leading-snug">
            The reverse drill: given a real Hmong sentence, label which word is
            the classifier, which is the verb, which marks tense.
          </p>
        </div>
      </div>

      <div className="surface p-5 sm:p-6">
        <p className="text-stone-700 leading-relaxed mb-4">
          Until this ships, the grammar it’s built on is all in Learn — the
          classifier, tense-marker, and adjective lessons each explain one piece
          of the order.
        </p>
        <Link to="/learn/grammar" className="btn-secondary gap-2">
          <BookIcon size={16} />
          Go to Grammar lessons
        </Link>
      </div>
    </>
  )
}
