import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getCategory } from '../data/vocabulary.js'
import { useProgress } from '../hooks/useProgress.js'
import AudioButton from '../components/common/AudioButton.jsx'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import Flashcard from '../components/vocabulary/Flashcard.jsx'
import { CategoryIcon, ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '../components/icons/index.jsx'

export default function VocabList() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const cat = getCategory(categoryId)
  const [mode, setMode] = useState('list')
  const [cardIdx, setCardIdx] = useState(0)
  const { vocabProgress } = useProgress()

  if (!cat) {
    return (
      <div>
        <p className="text-stone-900">Category not found.</p>
        <Link to="/vocabulary" className="text-clay-700 underline">
          Back to vocabulary
        </Link>
      </div>
    )
  }

  const empty = cat.words.length === 0
  const word = cat.words[cardIdx]

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: cat.title },
        ]}
      />

      <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
        <div>
          <h2 className="font-display text-4xl text-stone-900 flex items-center gap-3">
            <CategoryIcon category={cat} size={30} className="text-clay-600" />
            {cat.title}
          </h2>
          <p className="text-stone-700 mt-1">{cat.description}</p>
        </div>
        {!empty && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Quiz reachable from BOTH list and study mode — always in the header */}
            <Link to={`/quiz/vocab-${cat.id}`} className="btn-primary text-sm gap-1.5">
              Take the quiz <ArrowRightIcon size={14} />
            </Link>
            <div className="flex gap-1 rounded bg-cream-100 border border-cream-200 p-1">
              <button
                onClick={() => setMode('list')}
                className={`px-3 py-1.5 text-sm rounded-sm transition ${
                  mode === 'list' ? 'bg-cream-50 text-clay-700 shadow-warm' : 'text-stone-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => {
                  setMode('flashcard')
                  setCardIdx(0)
                }}
                className={`px-3 py-1.5 text-sm rounded-sm transition ${
                  mode === 'flashcard' ? 'bg-cream-50 text-clay-700 shadow-warm' : 'text-stone-600'
                }`}
              >
                Study Mode
              </button>
            </div>
          </div>
        )}
      </div>

      {empty && <EmptyState />}

      {!empty && mode === 'list' && (
        <ul className="space-y-2">
          {cat.words.map((w) => {
            const status = vocabProgress[w.id] || 'new'
            return (
              <li
                key={w.id}
                className="surface surface-hover flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <AudioButton audioSrc={w.audioFile} wordId={w.id} />
                  <button
                    onClick={() => navigate(`/vocabulary/${cat.id}/${w.id}`)}
                    className="text-left"
                  >
                    <div className="font-display text-lg text-clay-700">
                      {w.hmongRPA}
                    </div>
                    <div className="text-sm text-stone-600">{w.english}</div>
                  </button>
                </div>
                <StatusPill status={status} />
              </li>
            )
          })}
        </ul>
      )}

      {!empty && mode === 'flashcard' && word && (
        <div>
          <Flashcard word={word} />

          {/* Deck progress — position in the deck at a glance, not just a
              fraction you have to read. */}
          <div className="mt-5 h-1.5 rounded-full bg-cream-200 overflow-hidden">
            <div
              className="h-full bg-clay-600 transition-all duration-300"
              style={{ width: `${((cardIdx + 1) / cat.words.length) * 100}%` }}
            />
          </div>

          {/* Prev / next as large round targets flanking the counter. Was two
              small ghost buttons — hard to hit on a phone, and the forward
              action didn't look primary. See notes/66. */}
          <div className="flex justify-between items-center mt-4 gap-3">
            <button
              onClick={() => setCardIdx((i) => Math.max(0, i - 1))}
              disabled={cardIdx === 0}
              aria-label="Previous card"
              className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-cream-200 text-stone-800 hover:bg-cream-300 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
            >
              <ArrowLeftIcon size={20} />
            </button>

            <span className="text-sm font-medium text-stone-700 whitespace-nowrap">
              {cardIdx + 1} / {cat.words.length}
            </span>

            {/* End of the deck: "Next" would dead-end, so offer the two things
                a learner actually wants next — go again, or prove it. */}
            {cardIdx === cat.words.length - 1 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setCardIdx(0)}
                  aria-label="Restart deck"
                  className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-cream-200 text-stone-800 hover:bg-cream-300 active:scale-95 transition"
                >
                  <RefreshIcon size={20} />
                </button>
                <Link to={`/quiz/vocab-${cat.id}`} className="btn-primary gap-1.5">
                  Take the quiz <ArrowRightIcon size={16} />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setCardIdx((i) => Math.min(cat.words.length - 1, i + 1))}
                aria-label="Next card"
                className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-clay-600 text-cream-50 hover:bg-clay-700 active:scale-95 transition"
              >
                <ArrowRightIcon size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function StatusPill({ status }) {
  const styles = {
    known: 'bg-success-50 text-success-900',
    learning: 'bg-cream-200 text-clay-700',
    new: 'bg-cream-100 text-stone-600',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="rounded-md border-2 border-dashed border-cream-400 bg-cream-50/60 p-12 text-center">
      <div className="text-5xl mb-3 opacity-70">ðŸ“š</div>
      <h3 className="font-display text-xl text-stone-900">Words coming soon</h3>
      <p className="text-sm text-stone-600 mt-1">
        This category is being built. Check back later.
      </p>
    </div>
  )
}
