# The Lesson Study→Quiz Gate, Flashcard Flip, and the Font Swap

> Supersedes earlier drafts (a two-card study *screen*, then an auto-*redirect*).
> The final model is a **study → gated quiz**: the examples step hands you off to
> the word bank, and the quiz step stays LOCKED until you've studied. Font is
> **Nunito**; 11 lessons converted. Current state below.

## 1. Lessons: explain → study → (gated) quiz
The old lesson was *explain → list the words → ask ONE multiple-choice question.*
Everything after "explain" was a worse copy of something that already existed:

| Lesson step | The real thing it duplicated |
| --- | --- |
| `examples` (word list) | `vocabulary.js` — SRS-scheduled words, with audio |
| `practice` (1 question) | `vocab-<cat>` quiz — 10 questions, auto-generated, scored |

And the quiz was the weaker sin. **Quizzing someone on words they read 30 seconds
ago tests nothing** — still in working memory. So the new shape enforces an order:

> **Explain (intro) → study the real word bank (examples handoff) → prove it
> (gated quiz).** You cannot take the quiz until you've gone to study. The gate
> is the point: it makes "study first" structural, not a suggestion.

`examples` **stays** — its job is *illustrative cases with teaching notes* ("Noj
mov — literally 'eat rice'"), not inventory. The inventory lives in Words.

### The three moving parts
```
examples step ──[Study the N words]──▶ /vocabulary/<cat>   (sets the "studied" flag)
                                                  │
quiz step:  locked ◀── flag absent ── │ ── flag present ──▶ Take the quiz → /quiz/vocab-<cat>
```

1. **The studied flag.** A `completedSteps` entry `"<lessonId>-studied"`, set when
   the learner clicks "Study the words." It's deliberately **not** a real step id,
   so it never counts toward lesson-completion percent — it only gates the quiz.
   ```js
   const studiedFlag = (lesson) => `${lesson.id}-studied`
   // set via markStepComplete(studiedFlag(lesson))  — no lessonId, no completion side-effects
   ```
2. **The handoff** lives on the `examples` step (`<StudyHandoff>`), and also on the
   locked quiz screen, so you can start studying from either. One shared
   `useStudyHandoff(lesson)` marks the flag then navigates to the category.
3. **The quiz step** (`<QuizStep>`, the lesson's last step) reads the flag:
   - flag absent → a **locked** card ("Study the words first" + a study button)
   - flag present → "Take the quiz" → `/quiz/vocab-<cat>`, with best score + Finish

**Why a flag and not just "did they visit the page?"** We can't observe navigation
after the fact, and tracking per-word `known` status would make "studied" mean
"mastered," which is too strict for a gate. Clicking *Study* is the honest signal
of intent; the SRS handles actual mastery over time.

### Completion
Taking the quiz on its own page writes a `quizScores` entry; a `useEffect` in
`Lesson` watches for a `vocab-<cat>` score and **auto-completes the quiz step**
(and the lesson) — so finishing the quiz finishes the lesson even if you never
click "Finish." Same mechanism the consonant `mini-quiz` steps already used,
extended to derive the quiz id from `lesson.vocab`.

### `vocab:` is the link
`vocab` names a category id from `vocabulary.js` — the single source. The quiz id
is **conventional, not configured**: `vocab-${category.id}` is exactly what
`vocabQuizzes` auto-generates. Name the category and the quiz already exists.

### `practice` is commented, not retired
Every vocab quick-check is wrapped in `/* … */` with a `// quick-check removed`
note. The step *kind* survives because the **reading** lessons still use it for
genuine comprehension checks — testing understanding of prose you just read, not
recall from a list. Different job, kept.

### Six new categories made the handoff possible
Seven concept lessons had no category to point at — words lived only as inline
`examples`. Added to `vocabulary.js`: **pronouns, numbers, tense-markers,
demonstratives, reciprocals, yog-to-be** (39 words). Now drillable, schedulable,
each with an auto `vocab-<id>` quiz.

### Coverage
**Converted (11):** action-verbs, how-much, noun-classifiers, time, pronouns,
pronouns-demonstratives, possessive-pronouns, numbers, tense-markers,
sib-reciprocals, yog-to-be. **Not converted, on purpose:** consonant lessons
(letters, end in an alphabet `mini-quiz`), greetings-farewells (greetings live in
Speak), readings (keep their comprehension `practice`).

## 2. Flashcard: real CSS 3D flip
Was a conditional render (instant swap). Now a genuine Y-axis flip — **pure CSS**:
```css
.flip-scene { perspective: 1200px; }
.flip-card  { transform-style: preserve-3d; transition: transform 0.5s …; }
.flip-card.is-flipped { transform: rotateY(180deg); }
.flip-face  { backface-visibility: hidden; }
.flip-face-back { position: absolute; inset: 0; transform: rotateY(180deg); }
```
- **Both faces always in the DOM**; `backface-visibility: hidden` hides the one
  turned away — that's what makes it a flip, not a crossfade.
- **Back is pre-rotated 180°** and absolutely positioned over the front.
- **Reduced motion is free** — the global kill-switch flattens the transition to
  ~0ms (instant swap, same info). No component handling.
- **A11y:** the card is a real `<button>` with a face-stating `aria-label`; the
  audio button `stopPropagation`s so tapping it doesn't flip.

**RN note:** `rotateY` + `backfaceVisibility` exist in RN's transform API — this
ports. `perspective` differs (RN puts it inside the transform array). Small tweak.

## 3. Font swap — Fraunces/Inter → Nunito
Fraunces + Inter is the default "AI product" pairing (Inter reads as
Claude/Linear/every SaaS; Fraunces is characterful but spiky). Swapped for
**Nunito** (display + all Hmong text) + **Nunito Sans** (body) — rounded, warm,
**no serif**.

The important part: the Tailwind key was renamed **`serif` → `display`** across 75
usages in 28 files. A `serif` token pointing at a rounded sans is the `blush-200`
trap again — a name that lies. `font-display` now means "the Hmong/heading face,"
whatever it is. Also tuned per-font: tracking `-0.015em → -0.01em`, weight `600 →
700` (Nunito needs it to carry display sizes), and Inter's `font-feature-settings`
removed (they select Inter-specific glyphs). **Swapping fonts touches 3 places**
(noted in `index.html`): the Fonts link, `tailwind.config.js`, the two `@layer
base` rules.

## Also in this batch (small but real)
- **`btn-ghost` had no background** — invisible on the seafoam page background
  (only looked fine inside a cream card). Added `bg-cream-50`. Fixed "See all
  lessons", "Show all quizzes", etc.
- **Lesson Back button** vanished on practice/mini-quiz steps, stranding the user.
  Now always present (a real button, not an underlined link); only Continue is
  conditional.

## Gotchas
- The **word-list duplication is still not fixed at the data layer**: `examples`
  items are inline `{hmong, english, note}` with no ids, so they can't enter the
  SRS queue directly. The handoff routes *around* this; the real fix is the
  unification in [26-cleanup-prompt.md](26-cleanup-prompt.md) Slice C.
- `Lesson.jsx` now imports `getCategory` — the player depends on vocabulary data.
  One read-only import; that's the coupling the handoff buys.
- The 4 earlier-converted lessons still carry a `blurb` on their `study` step; it's
  now unused (the redirect shows only "Taking you to the words…"). Harmless.

## Files
- `src/pages/Lesson.jsx` — `StudyStep` redirects; always-on Back; `useRef`
- `src/data/lessons/*.js` — 11 lessons: `vocab` + `study`, `practice`/`mini-quiz` commented
- `src/data/vocabulary.js` — 6 new grammar-concept categories
- `src/components/vocabulary/Flashcard.jsx` — 3D flip
- `src/index.css` — flip utilities; `btn-ghost` fill; heading font/tracking/weight
- `index.html`, `tailwind.config.js` — Nunito; `serif` key → `display`
