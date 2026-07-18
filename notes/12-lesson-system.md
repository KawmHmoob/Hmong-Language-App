# Lesson system (Units → Lessons → Steps)

> 🕰 **Partly superseded — read this for the Units→Lessons→Steps *shape*, not the
> specifics.** Since this note: `Course.jsx`/`Alphabet.jsx` no longer exist
> (Course dissolved → [34](34-reference-vs-learn.md); Alphabet → Reference →
> [32](32-alphabet-section-and-mojibake.md)); the `/learn` page is now a hub with
> per-unit pages ([33](33-unit-pages.md)); and the **step model changed** — the
> current kinds and the study→gated-quiz flow are in
> [37](37-lesson-study-handoff-and-fonts.md), with `reading` in
> [34](34-reference-vs-learn.md). The units→lessons→steps skeleton and the
> mini-quiz auto-complete pattern below are still accurate.

Structured teaching surface at `/learn`. The lesson system is the path real pedagogy grows on.

## Why it exists

The flat reference tables in [src/pages/Course.jsx](../src/pages/Course.jsx) and [src/pages/Alphabet.jsx](../src/pages/Alphabet.jsx) work as a phrasebook but not as a course. A learner needs explanation, examples in context, a quick self-check, and a graded mini-quiz — in that order, one step at a time. The `/learn` route delivers that without disturbing the reference views.

## Files

- [src/data/lessons.js](../src/data/lessons.js) — `units` array, plus helpers `getUnit`, `getLesson`, `allStepIds`, `lessonProgress`.
- [src/pages/Learn.jsx](../src/pages/Learn.jsx) — unit/lesson grid with per-lesson progress bar.
- [src/pages/Lesson.jsx](../src/pages/Lesson.jsx) — step player. One step on screen at a time, advances on user action.
- [src/context/ProgressContext.jsx](../src/context/ProgressContext.jsx) — `completedSteps` field + `markStepComplete(stepId, { lessonId, lessonComplete })` mutator.

## Data model

```js
Unit { id, title, description, lessons: Lesson[] }
Lesson { id, title, summary, steps: Step[] }
Step  = IntroStep | ExamplesStep | PracticeStep | MiniQuizStep
```

Step kinds (v1):

| kind | shape | UX |
|---|---|---|
| `intro` | `{ title, body: string[] }` | Paragraphs of explanation. Continue button advances. |
| `examples` | `{ title, intro?, items: [{ hmong, english, note? }] }` | List of examples with optional per-item note. |
| `practice` | `{ title, prompt, options: string[], answer }` | Single inline MCQ with feedback. Auto-advances on Continue after the user picks. Not graded. |
| `mini-quiz` | `{ title, quizId }` | Hands off to `/quiz/:quizId` (the existing QuizEngine). Step auto-completes when a score for that `quizId` exists. |

## How completion works

- Each step has a globally-unique `id`. When the user advances past it, `markStepComplete(stepId, { lessonId, lessonComplete })` is called.
- `markStepComplete` adds the id to `completedSteps` and grants `+2 XP`.
- When `lessonComplete: true` is passed (caller computes this by checking that all *other* step ids for the lesson are already in `completedSteps`), the mutator also appends the lesson id to `completedLessons` and grants `+10 XP` — same XP path as the legacy "Mark Complete" button.
- Mini-quiz steps are special: `Lesson.jsx` runs a `useEffect` that watches `quizScores` and auto-marks the step complete if any score exists for the matching `quizId`. This is how returning from `/quiz/:quizId` finishes the lesson without an extra click.

## Adding a new unit

1. Open [src/data/lessons.js](../src/data/lessons.js).
2. Copy the `foundations` unit object and append it to `units`.
3. Change every `id` so it's unique across the whole file. Convention: `unitid-lessonid-stepkind` (e.g. `tones-rising-intro`).
4. For a `mini-quiz` step, set `quizId` to an existing quiz from [src/data/quizzes.js](../src/data/quizzes.js), or add a new quiz there first.
5. No code changes required — the `/learn` page reads `units` directly.

## Adding a new step kind

1. Add a renderer function inside [src/pages/Lesson.jsx](../src/pages/Lesson.jsx) following the pattern of `IntroStep` / `ExamplesStep`.
2. Add a `step.kind === 'yourkind' && <YourStep ... />` line in the main render.
3. Decide whether the kind has its own Continue button (like `practice`) or uses the shared bottom Continue (like `intro`/`examples`). Update the bottom-button condition accordingly.
4. Document the shape in this note's table above and in the comment header of `lessons.js`.

## Open questions / future work

- **Paywall gating** — when subscriptions land, add `tier: 'free' | 'pro'` to `Unit` and/or `Lesson`. Wrap the `/learn` cards and the lesson route in a `<PaywallGate>` that reads `user.subscription` from `AuthContext`. See `09-spaced-repetition.md` style for how to add minimal cross-cutting features.
- **Richer step kinds** — listening, dictation, sentence ordering, fill-in-blank. Tracked in [11-future-implementations.md](11-future-implementations.md).
- **Migrating existing Course/Alphabet content** — once the lesson model proves out, re-author those flat tables as units.
