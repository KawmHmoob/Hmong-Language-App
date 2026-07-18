# Confetti Celebration, Flashcard Footer, and Words Breadcrumbs

A cluster of small Words/quiz polish changes. Each is little; together they make
the study→quiz loop feel finished.

## 1. Confetti on a perfect quiz score
`src/components/common/Confetti.jsx` — a one-shot burst of falling ribbons.
**Pure CSS keyframes, no library** (the no-packages rule holds).

### How it works
- The component generates N pieces once (`useMemo`), each with randomized
  position / sideways drift / spin / delay / duration. Those randoms are passed
  **as inline CSS custom properties**; the keyframe in `index.css` reads them:
  ```css
  @keyframes confetti-fall {
    0%   { transform: translate3d(0, -6vh, 0) rotate(0deg); opacity: 1; }
    100% { transform: translate3d(var(--drift), 106vh, 0) rotate(var(--rot)); opacity: .85; }
  }
  ```
  Per-piece variety with **one** keyframe — no 48 separate animations.
- **Colors are theme tokens** (`rgb(var(--c-clay-500))` …), so confetti follows
  light / dark / neon. A hardcoded palette would look wrong in two of three themes.
- **Self-removing:** a timer flips `done` after the animation, unmounting it — it
  never lingers in the DOM or eats input. `pointer-events-none` + `z-50` so it
  rains *over* the results without blocking the buttons under it.

### The reduced-motion decision
It renders **nothing** when `prefers-reduced-motion: reduce`. This is the one spot
where the global CSS kill-switch (notes/21) is the *wrong* tool: flattening the
animation to ~0ms would freeze every piece mid-air at the top of the screen — a
worse artifact than no confetti. So `Confetti.jsx` checks `matchMedia` in JS and
returns null; the static "Perfect score!" banner carries the celebration instead.
**Lesson: a global motion kill-switch handles transitions, but a motion-*only*
effect needs to opt out at the source, not be frozen.**

### Where it fires
`QuizResults.jsx`, only when `accuracy === 100 && questions.length > 0 &&
!reviewing`. The 🎉 emoji in the banner is **content/celebration**, which is
allowed — it's *chrome* emoji-as-icons we banned (notes/31).

### Reuse
It's a generic primitive: `<Confetti count? duration? />`. Good candidates for
later — lesson complete, a streak milestone, first Speak recording that scores
well. Drop it in behind a condition; it cleans up after itself.

## 2. Flashcard footer: no more dead end
On the category page (`VocabList`, study mode), the last card used to leave a
**disabled "Next →"** — a dead end. Now the last card shows the two things a
learner actually wants next:
- **↺ Restart** — loops `cardIdx` back to 0, re-studyable without leaving.
- **Take the quiz →** — the `vocab-<cat>` quiz.

And the **quiz is reachable from both modes**: a persistent "Take the quiz →"
button sits in the header next to the List / Study-Mode toggle, so you don't have
to page to the end of the deck (or even enter study mode) to test yourself.

> **Build gotcha worth remembering:** the Edit tool could not match the existing
> `←` / `→` / `↺` glyphs in this file — they encode differently than the arrows I
> type, same family as the mojibake bug (notes/32). The footer rewrite had to go
> through a Node string-replace anchored on **arrow-free** structure. When editing
> a file with arrows/dashes in this repo, anchor edits on plain-ASCII lines.

## 3. Breadcrumbs route through Words
The vocabulary and quiz pages *are* the Words section (the nav maps `/vocabulary`
and `/quiz` under Words — notes/30/32), but their breadcrumbs skipped it:
`Home › Vocabulary`. Now every deep Words page threads the section:

| Page | Trail |
| --- | --- |
| Vocabulary grid | Home › Words › Vocabulary |
| Category list | Home › Words › Vocabulary › {category} |
| Word detail | Home › Words › Vocabulary › {category} › {word} |
| Quiz engine | Home › Words › Quizzes › {quiz} |
| Session | Home › Words › Session (already correct) |

**Hubs stay breadcrumb-less on purpose.** `Words` and `QuizMenu` use the section
eyebrow (colored dot + label) like the Speak / Learn / Reference hubs — a
breadcrumb on a top-level section would just read "Home › Words" under a hero
that already says "Words." Breadcrumbs are for *depth*, the eyebrow for *place*.

## How to extend
- **Celebrate something else:** `{condition && <Confetti />}` + a static fallback
  line for reduced-motion users. Don't rely on the confetti alone to convey the
  achievement — some users will never see it.
- **New Words-section page:** start its breadcrumb `Home › Words › …`. If it's a
  hub, skip the breadcrumb and use a section eyebrow instead.
- **Tune the burst:** `count` / `duration` props; colors live in the `COLORS`
  token array in `Confetti.jsx`.

## Files
- `src/components/common/Confetti.jsx` — **new**, the burst
- `src/index.css` — `.confetti-piece` + `confetti-fall` keyframes
- `src/components/quiz/QuizResults.jsx` — perfect-score banner + `<Confetti>`
- `src/pages/VocabList.jsx` — restart/quiz footer, header quiz button, breadcrumb
- `src/pages/VocabCategoryGrid.jsx`, `WordDetail.jsx`, `QuizEngine.jsx` — breadcrumbs
