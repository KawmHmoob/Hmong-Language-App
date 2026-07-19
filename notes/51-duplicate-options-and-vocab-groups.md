# Duplicate Quiz Options (bug) + Vocabulary Grouped by Theme

---

## 1. 🐛 Quizzes could show the same answer twice

**Symptom:** the tone drill produced questions with duplicate options —
`[Mid, High, High, High]` — so several choices were identical and the question
was unanswerable.

**Cause:** distractors were picked as distinct *items*, not distinct *answers*:
```js
const distractors = shuffle(dataset.filter((d) => d.answer !== item.answer)).slice(0, 3)
```
That filter only excludes items sharing the **correct** answer. Any three
remaining items can still share an answer *with each other*.

It surfaced on the tone drill because that dataset is **~30 words mapping to
only 8 tone names** — so collisions are the norm, not the exception. Quizzes
where each item has a unique answer (consonants, vowels) never showed it, which
is why it went unnoticed.

> **The general trap: deduping by identity when the user sees a projection.**
> The options list shows `d.answer`, so uniqueness has to be enforced on
> `d.answer` — not on the objects behind it. Any time you `map()` a picked set
> down to one field, check for collisions *in that field*.

**Fix** — walk the shuffled dataset and keep answers you haven't used:
```js
const seenAnswers = new Set([item.answer])
const distractors = []
for (const d of shuffle(dataset)) {
  if (seenAnswers.has(d.answer)) continue
  seenAnswers.add(d.answer)
  distractors.push(d)
  if (distractors.length === 3) break
}
```
Guarantees 4 distinct options, and **degrades correctly**: a dataset with fewer
than 4 distinct answers yields a shorter option list instead of padding with
duplicates. Fixes every quiz at once, not just the tone drill.

---

## 2. Vocabulary grouped by theme

33 categories / 429 words rendered as one flat grid — the same wall Learn
(notes/46) and the quiz menu (notes/35) had.

`categoryGroups` in `vocabulary.js` maps ids into seven themes:

| Theme | Categories |
| --- | --- |
| People & Family | family (male/female perspective), relatives |
| Home & Places | household, rooms, housing, buildings, tools, places, locations |
| Nature & Food | animals, nature, food |
| Clothing | wear-verbs, clothing-verbs |
| Time, Numbers & Money | numbers, quantifiers, timeframes, days, months, calendar, money |
| Describing | colors, descriptions, personality-siab |
| Grammar & Function Words | pronouns, demonstratives, classifiers, verbs, tense-markers, reciprocals, yog-to-be, grammar |

**Themes reference ids; they don't own data.** `categories` stays the single
source — same relationship as `consonantGroups` (notes/43).

### The safety net worth copying
A hand-written grouping rots the moment someone adds a category and forgets the
map. So anything unassigned is swept into a final **"More"** group:
```js
const assigned = new Set(themed.flatMap((t) => t.items.map((c) => c.id)))
const leftovers = categories.filter((c) => !assigned.has(c.id))
```
**A new category can never silently disappear from the page** — worst case it
shows under "More" until it's filed. Groups that resolve to zero items drop out,
so deleting a category doesn't leave an empty heading either.

### Empty categories are dimmed, not hidden
`nature` has 0 words. The card renders at 60% opacity reading **"Coming soon"**
instead of "0 words". Hiding it would make missing content invisible; showing it
honestly makes it a visible TODO.

## How to extend
- **New category:** add it to `categories`, then drop its id into a theme in
  `CATEGORY_THEMES`. Skip the second step and it lands under "More".
- **New theme:** add `{ id, title, blurb, ids }`. Order in the array is display order.
- **New quiz dataset:** nothing to do for the dedupe — it's in `buildQuestions`
  and applies to every quiz.

## Files
- `src/pages/QuizEngine.jsx` — `buildQuestions` dedupes distractors by answer
- `src/data/vocabulary.js` — `CATEGORY_THEMES` → `categoryGroups` (+ "More" sweep)
- `src/pages/VocabCategoryGrid.jsx` — grouped sections, word total, empty-state cards
