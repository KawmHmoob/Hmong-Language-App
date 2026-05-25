# Lesson System — Code Walkthrough

A teaching companion to [12-lesson-system.md](12-lesson-system.md). That note tells you *what* the system is and *how to extend it*. This note explains *why each line is there* so you can read the code and understand the reasoning, not just the shape.

Read this top-to-bottom. Each section walks one file or one decision.

---

## 1. The data model — `src/data/lessons.js`

### The shape

```js
units = [
  { id, title, description, lessons: [
    { id, title, summary, steps: [
      { id, kind, ...kindSpecificFields }
    ]}
  ]}
]
```

Three nested levels: **Unit** (a chapter, e.g. "Foundations") → **Lesson** (a single sitting, e.g. "Pronouns") → **Step** (one screen of content, e.g. "the intro paragraphs").

### Why this shape and not flat?

You could have stored everything as one flat array of lessons. Two reasons we didn't:

1. **Grouping is a first-class UI concern.** The `/learn` page renders units as headers with their lessons under them. If lessons were flat, the page would have to invent a grouping field anyway — so we encode the grouping in the data.
2. **Future paywall gating.** When monetization lands, the natural unit of paywall is the *unit* ("Foundations is free, Conversational Hmong is pro"). Having a real `Unit` object means we can put `tier: 'pro'` on the unit itself rather than tagging every lesson.

### Why `id` strings instead of numeric indexes?

Two reasons:

1. **Stable keys.** If you reorder lessons in the array, numeric indexes shift and break stored progress. String ids ("foundations-pronouns") are stable forever.
2. **Globally unique.** `completedSteps` in `ProgressContext` is a flat array of step ids. If two units both had a step with id `1`, completing one would mark the other complete. Prefixed string ids prevent that.

### The four step `kind`s

```js
'intro'      // explanation paragraphs
'examples'   // table of examples
'practice'   // single inline MCQ, not graded
'mini-quiz'  // hand off to /quiz/:quizId
```

This is the **discriminated union** pattern. Each step has a `kind` field that tells the renderer which other fields to expect. The renderer (`Lesson.jsx`) does `step.kind === 'intro' && <IntroStep step={step} />`. Adding a fifth kind (e.g. `'dialogue'`) means: define its shape here, add a renderer there, done. No central type registry to update.

### The helper functions

```js
getUnit(unitId)
getLesson(unitId, lessonId)
allStepIds(lesson)
lessonProgress(lesson, completedSteps)
```

These exist so **callers don't reach into the data structure directly**. If we change the storage shape later (say, fetch from an API), only these helpers need to update — not every page.

`lessonProgress` returns `{ done, total, ratio, complete }` because the UI needs all four: the count for "3 / 4 steps", the ratio for the progress bar, and the boolean for the "✓ Done" badge.

---

## 2. The context change — `src/context/ProgressContext.jsx`

### What we added to `initialState`

```js
completedSteps: [],   // step ids from src/data/lessons.js
```

A flat array of strings. **Why an array and not a Set?**

- React state must be JSON-serializable for `localStorage` persistence. `Set` doesn't serialize natively (it becomes `{}`).
- The list will stay small (hundreds of ids at most over a user's lifetime). `array.includes()` is fine at this scale.

If we ever cross 10k completed steps, switch to a `Set` in memory and serialize as an array. Not today's problem.

### The new mutator — `markStepComplete`

```js
const markStepComplete = useCallback((stepId, opts = {}) => {
  const { lessonId } = opts
  setState((s) => {
    if (s.completedSteps.includes(stepId)) return s   // (1) idempotent guard
    const completedSteps = [...s.completedSteps, stepId]
    const next = {
      ...s,
      completedSteps,
      xp: s.xp + 2,                                   // (2) per-step XP
      streakData: nextStreak(s.streakData, todayISO()),
    }
    if (lessonId && opts.lessonComplete && !s.completedLessons.includes(lessonId)) {
      next.completedLessons = [...s.completedLessons, lessonId]
      next.xp += 10                                   // (3) lesson bonus
    }
    return next
  })
}, [])
```

Three things worth understanding:

**(1) Idempotent guard.** If the user clicks Continue twice quickly, or if `useEffect` fires the auto-complete logic on a re-render, we must not double-grant XP. The `if (s.completedSteps.includes(stepId)) return s` line returns the *same* state object, so React skips the re-render. This is the same pattern `markLessonComplete` already uses on line 71 of the file.

**(2) +2 XP per step.** Smaller than the +10 for a full lesson — we want the lesson bonus to feel like a reward, not a redundant payout. Tune freely.

**(3) Caller-computed `lessonComplete`.** Why does the *caller* (Lesson.jsx) decide whether the lesson is complete, instead of this mutator looking it up? Because this file doesn't import `lessons.js` and shouldn't — `ProgressContext` is generic state machinery, not lesson-aware. The caller already has the lesson object in scope and can compute "is this the last step?" cheaply. Keeping the dependency direction one-way (Lesson.jsx → ProgressContext, not the reverse) is what lets us add `lessons.js` without touching the context internals.

### Why `useCallback`

Every other mutator in this file is wrapped in `useCallback`. The reason is that these functions get put into a `useMemo`'d context value. If a mutator's identity changed every render, the memo would re-fire, every consuming component would re-render, and the whole tree would thrash. `useCallback([])` with an empty dep array means "this function reference is stable for the lifetime of the component" — exactly what we want.

---

## 3. The unit list page — `src/pages/Learn.jsx`

This page is mostly straightforward rendering. The interesting parts:

### Reading from context, not props

```js
const { completedSteps } = useProgress()
```

`Learn.jsx` is a route component — it has no parent passing it props. So it reads `completedSteps` directly from the progress context. Same pattern every other page in the app uses.

### Computing progress per-lesson

```js
{unit.lessons.map((lesson) => {
  const p = lessonProgress(lesson, completedSteps)
  ...
})}
```

We call `lessonProgress` inline per render. **Is that wasteful?** No — it's a `O(steps)` filter, the lists are tiny, and React would re-render this whole section anytime `completedSteps` changes anyway. Memoizing would add complexity for zero measurable gain. *Premature optimization is the root of all evil* (and also of bugs in stale memo dependencies).

### The progress bar

```jsx
<div className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
  <div className="h-full bg-clay-600 transition-all" style={{ width: `${pct}%` }} />
</div>
```

Two divs, no library. The outer is the track, the inner's `width` is set inline because Tailwind can't generate arbitrary percentage classes at runtime. `transition-all` makes the bar animate smoothly when progress changes — a small touch that makes completion feel rewarding.

---

## 4. The lesson player — `src/pages/Lesson.jsx`

This is the most interesting file. Let's walk it.

### State

```js
const [index, setIndex] = useState(0)
```

Just one piece of local state: which step are we on. Everything else (completion, XP, etc.) lives in the progress context. This is on purpose — local state should hold *only ephemeral UI state*, never anything that should survive a page refresh.

### The auto-complete `useEffect`

```js
useEffect(() => {
  if (!lesson) return
  lesson.steps.forEach((step) => {
    if (step.kind !== 'mini-quiz') return
    if (completedSteps.includes(step.id)) return
    const taken = quizScores.some((s) => s.quizId === step.quizId)
    if (taken) {
      const ids = allStepIds(lesson)
      const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
      markStepComplete(step.id, {
        lessonId: lesson.id,
        lessonComplete: remaining.length === 0,
      })
    }
  })
}, [lesson, completedSteps, quizScores, markStepComplete])
```

This is the trickiest piece in the system. The problem it solves: when a user finishes a mini-quiz at `/quiz/grammar-pronouns` and clicks "Back to Lesson", we want the mini-quiz step to be marked complete *automatically*, without making them click "Continue" on a now-pointless screen.

How it works:

1. The effect runs whenever `lesson`, `completedSteps`, or `quizScores` change.
2. For each `mini-quiz` step in the current lesson, it checks: is there a score in `quizScores` matching this step's `quizId`?
3. If yes and the step isn't already marked complete, it calls `markStepComplete`.
4. The `remaining` calculation handles the lesson-completion bonus: if every other step is already done, this is the final one, so pass `lessonComplete: true`.

**Why is `markStepComplete` in the dep array?** ESLint's `exhaustive-deps` rule. The function is wrapped in `useCallback([])` so its identity is stable, meaning the effect only re-fires on the *real* dependencies (`lesson`, `completedSteps`, `quizScores`).

**Why is the `if (!lesson) return` line at the top?** Because the early return for "lesson not found" comes *after* this hook. React's Rules of Hooks require hooks to run in the same order on every render — so we can't put the early return above the hook. Instead, the hook itself bails out on null. (Initial draft had the early return first; the lint rule caught it.)

### The advance handler

```js
const handleAdvance = () => {
  if (!completedSteps.includes(step.id)) {
    const ids = allStepIds(lesson)
    const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
    markStepComplete(step.id, {
      lessonId: lesson.id,
      lessonComplete: remaining.length === 0,
    })
  }
  if (isLast) {
    navigate('/learn')
  } else {
    setIndex((i) => i + 1)
  }
}
```

Same `lessonComplete` calculation as above, but called when the user clicks Continue. The `if (!completedSteps.includes(step.id))` guard means revisiting a completed lesson and clicking through doesn't re-grant XP.

### The "shared button vs per-step button" split

```jsx
{step.kind !== 'practice' && step.kind !== 'mini-quiz' && (
  <div className="mt-6 flex justify-between items-center">
    <button onClick={handleAdvance} className="btn-primary">
      {isLast ? 'Finish' : 'Continue'}
    </button>
  </div>
)}
```

Why isn't there one Continue button for every step kind?

- **Intro and Examples**: passive content. One Continue button at the bottom is right.
- **Practice**: the user must answer first. The Continue button appears *inside* the feedback banner only after they pick. Showing the bottom button too would let them skip the question.
- **Mini-quiz**: there's no "Continue" — the user clicks "Take quiz" which navigates away. They return via the back arrow / Learn link, which triggers the auto-complete effect.

So the bottom Continue is gated to only show for kinds that *don't* manage their own advance.

### The renderers

`IntroStep`, `ExamplesStep`, `PracticeStep`, `MiniQuizStep` are all defined in the same file as plain function components. Per the project convention in [README.md](README.md): "Helper components live in the same file as plain `function` declarations." Default-export the main thing (the `Lesson` page); helpers are file-local.

`PracticeStep` deserves a closer look:

```js
function PracticeStep({ step, onAdvance }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === step.answer
  ...
}
```

Local `picked` state lives in the renderer because it's purely UI: did the user click an option *yet*. There's no need for it to survive remounts or be shared with anything else. The colored button styling is conditional on `picked` and `isAnswer`:

```js
let cls = 'border-cream-300 bg-cream-50 hover:border-clay-500'
if (picked && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
if (picked && opt === picked && !isAnswer) cls = 'border-red-500 bg-red-50'
if (picked && opt !== picked && !isAnswer) cls = 'border-cream-200 bg-cream-50 opacity-60'
```

After the user picks: their wrong answer goes red, the correct answer goes green, the other distractors go faded. This is the same visual language `QuizEngine.jsx` uses, so the experience feels consistent.

---

## 5. Routing — `src/App.jsx`

```jsx
<Route path="/learn" element={<Learn />} />
<Route path="/learn/:unitId/:lessonId" element={<Lesson />} />
```

Two-segment URL. **Why include `unitId` if `lessonId` is globally unique?**

1. **Readable URLs.** `/learn/foundations/foundations-pronouns` tells the user where they are. `/learn/foundations-pronouns` would too, but breadcrumbs and back-button behavior are clearer when the URL reflects the hierarchy.
2. **Scoping for paywall later.** When `Unit.tier` exists, the route guard reads `unitId` from the URL and decides whether to gate. If `unitId` weren't in the URL, the guard would have to look up "which unit owns this lesson", which means traversing the data structure.

---

## 6. The mental model

If you're going to remember three things from this:

1. **Steps are the unit of progress, lessons are the unit of completion.** Every Continue click writes a step id to localStorage. The lesson id only gets written when the *last* step is completed in the same call.

2. **The progress context doesn't know about lessons.** It knows about ids. `lessons.js` and `Lesson.jsx` know about lesson structure and pass *computed* facts ("this is the last step") into the mutator. This separation is what lets us swap out the lesson data layer (e.g. fetch from a backend) without touching `ProgressContext`.

3. **The `useEffect` for mini-quiz auto-complete is the only "magic" in the system.** Everything else is direct user action → mutator call. If something feels confusing later, look there first.

---

## 7. What you can change without breaking anything

- **Add units / lessons / steps** by editing `lessons.js`. No code changes needed.
- **Tune XP values** (the `+ 2` and `+ 10`) in `markStepComplete`. They're literals; nothing reads them.
- **Restyle the progress bar / step header** in `Learn.jsx` and `Lesson.jsx`. Pure presentation.

## What you should think twice about

- **Renaming a step `id`** that any user has already completed. Their progress for that step disappears (the new id won't match the old saved value). If you must rename, write a one-time migration in `loadProgress`.
- **Removing a step** from a lesson. Same problem — and worse, the lesson may never be markable complete again because old `completedSteps` entries reference a step that no longer exists. If you remove a step, also bump the lesson id (e.g. `foundations-pronouns` → `foundations-pronouns-v2`) so old progress is treated as a different lesson.
- **Changing the meaning of `kind`** values. If you rename `'practice'` to `'check'`, every lesson using it breaks. Add new kinds, don't rename existing ones.
