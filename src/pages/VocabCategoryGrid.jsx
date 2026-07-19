import { Link } from 'react-router-dom'
import { categories, categoryGroups } from '../data/vocabulary.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import { CategoryIcon } from '../components/icons/index.jsx'

// The word bank, grouped by theme. 33 categories in one flat grid was a wall;
// the themes come from `categoryGroups` in vocabulary.js. See notes/51.
export default function VocabCategoryGrid() {
  const totalWords = categories.reduce((n, c) => n + c.words.length, 0)

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Vocabulary' },
        ]}
      />
      <div className="mb-8">
        <h2 className="font-display text-4xl text-stone-900 mb-2">Vocabulary</h2>
        <p className="text-stone-700">
          {totalWords} words across {categories.length} categories, grouped by theme.
        </p>
      </div>

      <div className="space-y-10">
        {categoryGroups.map((g) => (
          <section key={g.id} aria-labelledby={`vocab-${g.id}`}>
            <div className="mb-4">
              <h3 id={`vocab-${g.id}`} className="font-display text-2xl text-stone-900">
                {g.title}{' '}
                <span className="text-stone-400 text-base font-normal">
                  ({g.items.length})
                </span>
              </h3>
              {g.blurb && <p className="text-sm text-stone-600">{g.blurb}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

function CategoryCard({ category: c }) {
  const empty = c.words.length === 0
  return (
    <Link
      to={`/vocabulary/${c.id}`}
      className={`surface surface-hover p-5 block ${empty ? 'opacity-60' : ''}`}
    >
      <div className="mb-3 text-clay-600">
        <CategoryIcon category={c} size={28} />
      </div>
      <h3 className="font-display text-lg text-stone-900 mb-1">{c.title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
        {c.description}
      </p>
      {/* Empty categories are dimmed and labelled rather than hidden — they're
          a visible TODO for content, not a bug. */}
      <p className="text-xs uppercase tracking-wider text-clay-600 mt-4">
        {empty ? 'Coming soon' : `${c.words.length} ${c.words.length === 1 ? 'word' : 'words'}`}
      </p>
    </Link>
  )
}
