import { useParams, Link } from 'react-router-dom'
import Tabs from '../components/Tabs.jsx'
import { consonants, vowels, tones } from '../data/alphabet.js'
import AudioButton from '../components/common/AudioButton.jsx'
import { useProgress } from '../hooks/useProgress.js'

const tabs = [
  { id: 'consonants', label: 'Consonants' },
  { id: 'vowels', label: 'Vowels' },
  { id: 'tones', label: 'Tones' },
]

const lessonIdMap = {
  consonants: 'alphabet-consonants',
  vowels: 'alphabet-vowels',
  tones: 'alphabet-tones',
}

export default function Alphabet() {
  const { tab } = useParams()
  const { completedLessons, markLessonComplete } = useProgress()
  const lessonId = lessonIdMap[tab]
  const completed = lessonId && completedLessons.includes(lessonId)

  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Alphabet</h2>
        <p className="text-stone-700">
          Hmong uses the Romanized Popular Alphabet (RPA).
        </p>
      </div>

      <Tabs basePath="/alphabet" tabs={tabs} />

      {tab === 'consonants' && <Grid items={consonants} />}
      {tab === 'vowels' && <Grid items={vowels} />}
      {tab === 'tones' && <ToneList items={tones} />}

      {lessonId && (
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            onClick={() => markLessonComplete(lessonId)}
            disabled={completed}
            className={
              completed
                ? 'inline-flex items-center justify-center px-4 py-2 rounded bg-emerald-700 text-cream-50 font-medium text-sm shadow-warm'
                : 'btn-secondary'
            }
          >
            {completed ? 'âœ“ Completed' : 'Mark Complete (+10 XP)'}
          </button>
          <Link to={`/quiz/${lessonId}`} className="btn-primary">
            Take Quiz
          </Link>
        </div>
      )}
    </>
  )
}

function Grid({ items }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {items.map((it) => (
        <div key={it.letter} className="surface p-3 text-center">
          <div className="flex justify-end mb-1">
            <AudioButton audioSrc={null} wordId={it.letter} />
          </div>
          <div className="font-serif text-2xl text-clay-700">{it.letter}</div>
          <div className="text-xs text-stone-500 mt-1">{it.sound}</div>
        </div>
      ))}
    </div>
  )
}

function ToneList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((t) => (
        <div key={t.name} className="surface flex items-center gap-4 p-4">
          <div className="w-10 font-serif text-2xl text-clay-700 text-center">
            {t.marker || 'â€“'}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-stone-800">{t.name}</div>
            <div className="text-sm text-stone-600">{t.description}</div>
          </div>
          <AudioButton audioSrc={null} wordId={t.name} />
          <div className="text-sm text-stone-700 italic">{t.example}</div>
        </div>
      ))}
    </div>
  )
}
