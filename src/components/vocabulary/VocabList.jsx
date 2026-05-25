import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getCategory } from '../../data/vocabulary.js'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import Flashcard from './Flashcard.jsx'

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
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: cat.title },
        ]}
      />

      <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
        <div>
          <h2 className="font-serif text-4xl text-stone-900">
            {cat.emoji} {cat.title}
          </h2>
          <p className="text-stone-700 mt-1">{cat.description}</p>
        </div>
        {!empty && (
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
                    <div className="font-serif text-lg text-clay-700">
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
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCardIdx((i) => Math.max(0, i - 1))}
              disabled={cardIdx === 0}
              className="btn-ghost disabled:opacity-50"
            >
              â† Prev
            </button>
            <span className="text-sm text-stone-700 self-center">
              {cardIdx + 1} / {cat.words.length}
            </span>
            <button
              onClick={() => setCardIdx((i) => Math.min(cat.words.length - 1, i + 1))}
              disabled={cardIdx === cat.words.length - 1}
              className="btn-ghost disabled:opacity-50"
            >
              Next â†’
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function StatusPill({ status }) {
  const styles = {
    known: 'bg-emerald-100 text-emerald-800',
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
      <h3 className="font-serif text-xl text-stone-900">Words coming soon</h3>
      <p className="text-sm text-stone-600 mt-1">
        This category is being built. Check back later.
      </p>
    </div>
  )
}
