import { Link } from 'react-router-dom'
import { categories } from '../../data/vocabulary.js'
import Breadcrumbs from '../common/Breadcrumbs.jsx'

export default function VocabCategoryGrid() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Vocabulary' }]} />
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Vocabulary</h2>
        <p className="text-stone-700">A growing word bank, organized by theme.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/vocabulary/${c.id}`}
            className="surface surface-hover p-6 block"
          >
            <div className="text-4xl mb-3 opacity-80">{c.emoji}</div>
            <h3 className="font-serif text-xl text-stone-900 mb-1">{c.title}</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{c.description}</p>
            <p className="text-xs uppercase tracking-wider text-clay-600 mt-4">
              {c.words.length} {c.words.length === 1 ? 'word' : 'words'}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}
