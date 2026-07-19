# Quiz Menu — One Organizing Scheme, Two Pages

## What
The Quizzes page (`/words/quizzes`) is now split into:

1. **Course quizzes** — Alphabet, Tones, Grammar, Speak. Grouped by each quiz's
   own `category` field, exactly as before.
2. **Vocabulary** — one section, sub-grouped by the **same seven themes** the
   Vocabulary page uses (People & Family, Home & Places, Nature & Food, …).

The user's ask was precise: *"the same way it is with words, everything too
bundles up, but keep the vocabulary in vocabulary."* Vocabulary stays a single
umbrella — it just gets internal structure.

## Why
The old grouping was `q.category`, and 33 of the ~35 quizzes share the category
`"Vocabulary"`. So "grouped by category" produced one honest group and one
33-item dump — the wall we'd already fixed on the Vocabulary page (notes/51).

The deeper point: **the same content should be organized the same way
everywhere it appears.** A learner who's built a mental map of "Nature & Food"
on the Vocabulary page shouldn't have to rebuild it on the Quizzes page. Two
organizing schemes for one dataset is two things to memorize.

## The themes are imported, not re-declared
```js
import { categoryGroups } from '../data/vocabulary.js'

const vocabThemes = useMemo(
  () =>
    categoryGroups
      .map((g) => ({
        id: g.id,
        title: g.title,
        items: g.items
          .map((c) => quizzes.find((q) => q.id === `vocab-${c.id}`))
          .filter(Boolean),
      }))
      .filter((g) => g.items.length > 0),
  []
)
```

`categoryGroups` is already derived (notes/51) — themes plus a **"More" sweep**
that catches any category not assigned to one. That sweep is what makes this
safe: add a new vocab category tomorrow and its quiz still appears, in "More",
without touching this file. Nothing is silently dropped.

Two filters do the defensive work:
- `.filter(Boolean)` — a category with no `vocab-<id>` quiz just doesn't render
  a card.
- `.filter((g) => g.items.length > 0)` — a theme whose categories have no
  quizzes doesn't render an empty heading.

The non-vocab side is the old Map grouping with one guard:

```js
if (q.id.startsWith('vocab-')) continue
```

The `vocab-` **id prefix** is the split, not the `category` string. Ids are
saved user data and never change; a display string can be reworded any time.
Same reason `quizUnlock` keys off the prefix (notes/52).

## `QuizGroup` got a `small` flag instead of a twin
The nested theme headings needed to look subordinate to "Vocabulary". Rather
than copy the component, it took one prop:

```js
function QuizGroup({ title, list, bestByQuiz, vocabProgress, small = false })
```

`small` only swaps the heading's type scale. One component, two weights — if the
card grid or the lock state changes, it changes in one place. (Same instinct as
`ToneRows`'s `heading` prop, notes/47.)

`category` was also renamed to `title`, because the prop now receives a *theme*
name as often as a category name. A prop name that lies about its contents is
a bug waiting to be written.

## What was removed: "Show all"
The old preview-6 + "Show all" collapse (`PREVIEW_COUNT`, `useState`) is gone.
It existed to tame the 33-item group — with the group split into themes of 4–6,
every group now fits on screen. **When you fix the cause, delete the
workaround**; leaving it would mean two collapse affordances competing for the
same scroll.

This also made `QuizGroup` stateless, so the whole page is now derived render.

## How to extend
- **Re-theme the quizzes:** edit `CATEGORY_THEMES` in `src/data/vocabulary.js`.
  Both pages follow — that's the point of importing rather than re-declaring.
- **New non-vocab quiz:** give it a `category` and it makes its own group.
- **Restore collapsing:** if a theme ever passes ~8 quizzes, put the
  preview/expand logic back inside `QuizGroup` so both call sites get it.

## Files
- `src/pages/QuizMenu.jsx` — the split, `vocabThemes`, `QuizGroup({ small })`
- `src/data/vocabulary.js` — `categoryGroups` (source of the themes; unchanged)
