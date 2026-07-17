# Reference vs. Learn — organizing by job, and dissolving Course

## What
`/course` no longer exists. Its contents went to the surface that matches each
one's **job**, and `/alphabet` grew into a full **Reference** section:

| Was | Now |
| --- | --- |
| Course → Grammar tables | **Reference → Grammar** tab (+ 2 new tables) |
| Course → Everyday phrases | **Speak** (new "Daily Life" group + "Thov") |
| Course → Reading | **Learn → Readings unit** (a real unit, new `'reading'` step) |
| Course → Tense Markers table | **both**: a Reference table *and* a new Learn lesson |
| `/alphabet` | `/reference` — Consonants · Vowels · Tones · **Grammar** |

Plus **cross-links in both directions**: every grammar table has "Learn this →",
every lesson with a cheat sheet has "Cheat sheet →".

## Why — the diagnosis (this is the useful part)
Course *looked* redundant with Learn: both had pronouns, verbs, greetings. The
instinct was to delete the duplicates. That was wrong.

**The duplication wasn't the bug. The missing distinction was.**

> A pronoun **table** and a pronoun **lesson** are not two copies of one thing.
> They are two different jobs on the same content:
> - **Learn** = *"why does Hmong use classifiers, and how do I build one?"* —
>   prose, sequenced, you finish it.
> - **Reference** = *"which classifier for books again?"* — a grid, unordered,
>   you consult it mid-sentence and leave.
>
> Textbook vs. the index at the back. Both legitimate. Ship both.

So why did it *feel* redundant? Because **Course was organized by content type**
(grammar / phrases / readings) while every other surface was **organized by job**
(learn it / drill it / say it). It was the odd one out, so it read as noise even
though its contents were fine.

The app's surfaces now each own exactly one job:

| Job | Surface | Format |
| --- | --- | --- |
| Look it up | **Reference** | tables, no progress |
| Learn it | **Learn** | prose lessons, sequenced, XP |
| Drill it | **Words** | flashcards, SRS |
| Say it | **Speak** | record & compare |
| Read it | **Learn → Readings** | passages (a Learn sub-job) |

**The rule:** organize surfaces by job-to-be-done, not content type. When a page
feels redundant, check whether it's answering a *different question* about the
same material — if so, the fix is a clearer boundary and a cross-link, not a delete.

## How the cross-links work (what makes the distinction *felt*)
Without links, two doors to the same knowledge just look like two copies. Both
directions are **data, not hardcoded**:

```js
// reference.js — a table points at the lesson that explains it
{ title: 'Tense Markers', lesson: { unitId: 'foundations', lessonId: 'foundations-tense-markers' }, items: [...] }

// lessons/*.js — a lesson points at its cheat-sheet tab
export const tenseMarkers = { id: '…', title: 'Tense Markers', reference: 'grammar', steps: [...] }
```
`Reference.jsx` renders "Learn this →" when `lesson` exists; `Lesson.jsx`'s
`StepHeader` renders "Cheat sheet →" when `reference` exists. Omit the field and
the link disappears — no null checks scattered anywhere.

## The `'reading'` step kind — and why the translation hides
New step kind (documented in `lessons.js`):
```js
{ kind: 'reading', title, level, intro?, hmong, english, glossary: [{hmong, english}] }
```
`ReadingStep` keeps the English behind a **"Reveal translation"** button. That's
the whole pedagogical point:

> If the English is visible, the eye reads it first and the Hmong becomes
> decoration. Making the learner ask for it turns reading into an *attempt*.

The glossary stays visible — it's a crutch for **words**, not for **meaning**.
Each reading also gained a comprehension `practice` step, so a passage is now
read → checked, not just displayed.

## Content changes
- **New lesson: Tense Markers** (`foundations-tense-markers`) — the lesson
  `action-verbs`'s intro already *promised* ("you will meet these markers properly
  in a later lesson") but which never existed. Now it does, right after it.
- **Content bug fixed** in the school reading: the Hmong said `lus Mev`
  (Spanish) while the English glossed it as "English". Corrected to `lus Askiv`.
  `// TODO-VERIFY` left on the line.
- **New reference tables**: Noun Classifiers, Numbers 1–10; Pronouns gained the
  missing dual forms (`neb`, `nkawd`).
- Reference has **no "Mark Complete / +10 XP" button** — the old Course/Alphabet
  pages awarded XP for *reading a table*, which is incoherent. You can't finish a
  cheat sheet. Progress belongs to Learn.

## Migration safety (the boring, important part)
- **Legacy URLs all work.** `/alphabet/:tab` → `/reference/:tab` (1:1). `/course/:tab`
  is smarter — each tab lands where its *content* went:
  ```js
  grammar → /reference/grammar   everyday → /speak   reading → /learn/readings
  ```
  Both are tiny components (not `<Navigate>` literals) because they need
  `useParams()` to preserve the tab.
- **Quiz ids kept.** `everyday-greetings` still exists — it's in users' saved
  `quizScores` — it just sources from `speakGroups` now instead of the deleted
  `everyday` export.
- **Orphaned progress ids** (`course-grammar`, `course-everyday`, `course-reading`)
  linger harmlessly in `completedLessons`; XP already awarded stays. Don't reuse
  those strings.
- **Search reindexed**: it imported `course.js` (now deleted) — it indexes Speak
  phrases and reading-step passages instead. New kinds: `reference`, `speak`.

## How to extend
- **New cheat sheet:** add to `grammar` in `reference.js` with a `lesson` link;
  add `reference: 'grammar'` to the matching lesson. Both links appear.
- **New reading:** a lesson file with a `reading` step + a `practice` step, added
  to the `readings` unit in `lessons.js`. Order = difficulty.
- **Don't** put teaching prose in a Reference table, and **don't** put lookup
  grids in a lesson. If you want both, that's what the cross-link is for.

## Files
- `src/data/reference.js` — **renamed** from alphabet.js; absorbed `grammar`
- `src/pages/Reference.jsx` — **renamed** from Alphabet.jsx; Grammar tab, no XP button
- `src/data/lessons/tense-markers.js` — **new lesson**
- `src/data/lessons/reading-{mim,garden,school}.js` — **new**, migrated + reworked
- `src/data/lessons.js` — `readings` unit, `reading` step kind, `reference` field
- `src/pages/Lesson.jsx` — `ReadingStep`, "Cheat sheet →" in StepHeader
- `src/data/speak.js` — Daily Life group, "Thov"
- `src/App.jsx` — `/reference` routes + `AlphabetRedirect`/`CourseRedirect`
- `src/data/quizzes.js`, `src/pages/Search.jsx` — resourced off reference/speak/lessons
- `src/pages/Course.jsx`, `src/data/course.js` — **deleted**
- `src/components/PrimaryNav.jsx`, `Footer.jsx`, `Home.jsx`, `Learn.jsx` — links
