# Vocabulary Builder

## What
Three-level browse: categories → words in a category → individual word detail. Each category page also has a "Study Mode" toggle that swaps the list for a flashcard view.

## Files
- `src/data/vocabulary.js` — `categories[]` + `getCategory(id)` + `getWord(catId, wordId)`
- `src/components/vocabulary/VocabCategoryGrid.jsx` — `/vocabulary`
- `src/components/vocabulary/VocabList.jsx` — `/vocabulary/:categoryId` (list ↔ flashcard)
- `src/components/vocabulary/Flashcard.jsx` — flip card with "Mark Learning" / "Mark Known"
- `src/components/vocabulary/WordDetail.jsx` — `/vocabulary/:categoryId/:wordId`

## Why
- **Categories own their words** rather than a flat word array — keeps the data file readable when populated by hand and means category lookup is the primary access pattern (no extra index needed).
- **Schema is permissive** — `whiteHmong`, `greenHmong`, `audioFile`, `exampleSentence`, and `image` are all optional so words can be added incrementally without schema migrations.
- **Flip card without CSS 3D** — a simple `flipped` boolean swaps the visible content. Real 3D flip would need `transform-style: preserve-3d` plus `backface-visibility` plumbing; the boolean version reads as well and avoids extra CSS.

## Code anatomy

### Data shape

```js
// src/data/vocabulary.js
export const categories = [
  {
    id: 'animals',
    title: 'Animals',
    description: 'Common animal names.',
    emoji: '🐾',
    words: [
      {
        id: 'animals-dog',          // REQUIRED, globally unique
        hmongRPA: 'dev',            // REQUIRED
        english: 'dog',             // REQUIRED
        category: 'animals',        // REQUIRED, matches parent .id
        tags: ['mammal', 'pet'],    // REQUIRED (can be [])
        whiteHmong: 'dev',          // optional
        greenHmong: 'dev',          // optional
        audioFile: null,            // optional, just the filename
        exampleSentence: { hmong: '…', english: '…' },  // optional
      },
    ],
  },
]

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}
export function getWord(categoryId, wordId) {
  return getCategory(categoryId)?.words.find((w) => w.id === wordId) || null
}
```

### Routing

Three nested routes, each reading params via `useParams`:

```jsx
// src/App.jsx
<Route path="/vocabulary" element={<VocabCategoryGrid />} />
<Route path="/vocabulary/:categoryId" element={<VocabList />} />
<Route path="/vocabulary/:categoryId/:wordId" element={<WordDetail />} />
```

```jsx
// inside any of those components
const { categoryId, wordId } = useParams()
const cat = getCategory(categoryId)
if (!cat) return <NotFoundFallback />
```

### List ↔ Flashcard toggle

`VocabList.jsx` keeps two pieces of local state:

```jsx
const [mode, setMode] = useState('list')      // 'list' | 'flashcard'
const [cardIdx, setCardIdx] = useState(0)
```

Then conditionally renders one of two views — no router involvement, since the mode is ephemeral and per-visit.

### Flip card without CSS 3D

```jsx
const [flipped, setFlipped] = useState(false)

<div onClick={() => setFlipped(!flipped)}>
  {!flipped ? <FrontContent /> : <BackContent />}
</div>
```

If you want a real 3D flip animation later, wrap front/back in absolutely-positioned divs with `backface-visibility: hidden` and toggle a `rotate-y-180` class on the parent. The state stays the same.

### Marking status from a card

Reads and writes go through `useProgress`:

```jsx
const { vocabProgress, setVocabStatus } = useProgress()
const status = vocabProgress[word.id] || 'new'    // 'new' | 'learning' | 'known'

<button onClick={() => setVocabStatus(word.id, 'known')}>Mark Known</button>
```

`setVocabStatus` handles XP and streak side effects internally — components just declare intent.

## Populating from a Hmong book

Open `src/data/vocabulary.js` and paste new entries into the relevant `words` array. The `id` must be globally unique (recommended convention: `<categoryId>-<englishKeyword>`). See [instructions/adding-vocabulary.md](../instructions/adding-vocabulary.md) for the workflow and bulk import tips.

## Adding a new category

```js
// in vocabulary.js, append to categories[]
{
  id: 'colors',
  title: 'Colors',
  description: 'Color words.',
  emoji: '🎨',
  words: [],   // empty — the EmptyState component will render
}
```

That's it. The new category appears at `/vocabulary` automatically (the grid renders whatever's in `categories`), and clicking it shows the empty-state placeholder until you add words.
