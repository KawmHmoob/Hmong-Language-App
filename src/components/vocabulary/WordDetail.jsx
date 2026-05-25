import { Link, useParams, useNavigate } from 'react-router-dom'
import { getCategory, getWord } from '../../data/vocabulary.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { useNotebook } from '../../context/NotebookContext.jsx'

export default function WordDetail() {
  const { categoryId, wordId } = useParams()
  const navigate = useNavigate()
  const cat = getCategory(categoryId)
  const word = getWord(categoryId, wordId)
  const { vocabProgress, setVocabStatus } = useProgress()
  const { savedWords, saveWord, unsaveWord } = useNotebook()

  if (!cat || !word) {
    return (
      <div>
        <p className="text-stone-900">Word not found.</p>
        <Link to="/vocabulary" className="text-clay-700 underline">Back</Link>
      </div>
    )
  }

  const status = vocabProgress[word.id] || 'new'
  const isSaved = Boolean(savedWords[word.id])

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: cat.title, to: `/vocabulary/${cat.id}` },
          { label: word.hmongRPA },
        ]}
      />

      <div className="surface p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
            <div>
              <h2 className="font-serif text-5xl text-clay-700 leading-none">
                {word.hmongRPA}
              </h2>
              <p className="text-xl text-stone-900 mt-2">{word.english}</p>
            </div>
          </div>
          <button
            onClick={() => (isSaved ? unsaveWord(word.id) : saveWord(word.id))}
            className={
              isSaved
                ? 'inline-flex items-center gap-1 px-3 py-1.5 rounded bg-clay-100 text-clay-800 text-xs font-medium border border-clay-300'
                : 'inline-flex items-center gap-1 px-3 py-1.5 rounded bg-cream-100 text-stone-700 text-xs font-medium border border-cream-300 hover:border-clay-500'
            }
          >
            {isSaved ? 'âœ“ Saved' : '+ Save to Notebook'}
          </button>
        </div>

        <dl className="grid sm:grid-cols-2 gap-4 text-sm border-t border-cream-200 pt-5">
          {word.whiteHmong && <Field label="White Hmong">{word.whiteHmong}</Field>}
          {word.greenHmong && <Field label="Green Hmong">{word.greenHmong}</Field>}
          <Field label="Category">{cat.title}</Field>
          <Field label="Tags">{word.tags?.join(', ') || 'â€”'}</Field>
          <Field label="Status">{status}</Field>
          <Field label="Audio file">{word.audioFile || 'â€”'}</Field>
        </dl>

        {word.exampleSentence && (
          <div className="mt-6 border-t border-cream-200 pt-5">
            <h3 className="font-serif text-lg text-stone-900 mb-2">Example</h3>
            <p className="italic text-clay-700 leading-relaxed">{word.exampleSentence.hmong}</p>
            <p className="text-stone-700 mt-1">{word.exampleSentence.english}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-8">
          <button
            onClick={() => setVocabStatus(word.id, 'learning')}
            className="px-4 py-2 rounded bg-cream-200 text-clay-700 text-sm font-medium hover:bg-cream-300 transition"
          >
            Mark Learning
          </button>
          <button
            onClick={() => setVocabStatus(word.id, 'known')}
            className="px-4 py-2 rounded bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200 transition"
          >
            Mark Known
          </button>
          <button
            onClick={() => navigate(`/vocabulary/${cat.id}`)}
            className="ml-auto btn-ghost"
          >
            Back to {cat.title}
          </button>
        </div>
      </div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-clay-600">{label}</dt>
      <dd className="text-stone-800 mt-0.5">{children}</dd>
    </div>
  )
}
