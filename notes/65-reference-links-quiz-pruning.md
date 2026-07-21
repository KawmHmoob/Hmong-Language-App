# Reference Grammar Links · Alphabet Quiz Pruning · Speak Nav Parity

## 1. Every "Learn this →" link in Reference was broken

The grammar cheat sheets carry a `lesson: { unitId, lessonId }` that renders a
"Learn this" link into the lesson that explains the table. Four of the six
pointed at a unit those lessons **no longer live in**:

```js
lesson: { unitId: 'foundations', lessonId: 'foundations-pronouns' }  // ✗ 404
lesson: { unitId: 'grammar',     lessonId: 'foundations-pronouns' }  // ✓
```

### Why it broke, and why it was invisible
When Foundations was narrowed to the alphabet (notes/46), pronouns, verbs, tense
markers, and classifiers **moved to the Grammar unit**. Their lesson **ids** kept
the `foundations-` prefix on purpose — ids are progress keys, and renaming one
resets that lesson for every existing learner.

So the id stayed truthful while the unit changed underneath it, and
`getLesson(unitId, lessonId)` does a two-step lookup: find the unit, then find
the lesson *inside* it. A correct id in the wrong unit returns `null`.

> **The id being right is what made this hard to spot.** Nothing looked stale —
> `foundations-pronouns` is still the real id. Only the *pairing* was wrong.

Fixed: the four grammar-unit tables now say `unitId: 'grammar'`. The two
Numbers & Time tables were already correct.

**Worth a guard.** `scripts/content/ids.mjs` validates `familyId` references but
not `lesson: {unitId, lessonId}` pairs. A checker that resolves every Reference
→ lesson link would have caught this the day the unit moved.

## 2. Consonant + vowel quizzes commented out

`alphabet-consonants`, `alphabet-double-consonants`, and `alphabet-vowels` are
commented out. The Alphabet quiz group is now just `alphabet-tones`.

**Why:** the Speak drills already test these letters, and they test them
*better*. A letter's sound is a **production** skill — picking "voiceless l" off
a list of four proves you can read a description, not that you can say `hl`.
Same reasoning that replaced the alphabet mini-quizzes with speak drills
(notes/50) and the vowel mini-quiz with a vowel drill (notes/60). Those lessons
had already stopped pointing at these quizzes; the quizzes just stayed listed.

**Tone Markers stays.** Identifying which marker carries which tone genuinely
*is* recognition — you're reading a letter and naming a pitch. Multiple choice
fits that.

Commented, not deleted — and two things survive on purpose:
- The `getQuizDataset` adapters (`case 'alphabet-consonants'` …) still exist, so
  restoring is uncommenting one block, not rebuilding two.
- **Past scores are untouched.** Quiz ids are progress keys; anyone who took
  these keeps their `quizScores` entries. The quiz just isn't listed.

Checked for dangling references first — only comments mention them now. The one
live `mini-quiz` step (`tones.js` → `alphabet-tones`) points at a quiz that
stays.

## 3. Speak navigation now matches the quiz

Speak's prev/next were bare underlined text links (`← Nyob zoo`); the quiz used
`btn-secondary` buttons. Same job, two different treatments.

Both Speak screens now use `btn-secondary` with arrow icons:

```jsx
<Link to={…} className="btn-secondary gap-1.5 min-w-0">
  <span className="truncate">{next.hmong}</span>
  <ArrowRightIcon size={15} />
</Link>
```

Two reasons beyond consistency:
- **An underlined text link reads as a footnote**, not as "move to the next
  thing." The primary forward action shouldn't look like fine print.
- **Tap target.** A line of small text is a poor mobile target; `btn-secondary`
  carries real padding (same concern as notes/63's quiz work).

`truncate min-w-0` keeps a long phrase (`Koj puas nyob zoo?`) from blowing out
the row — it clips instead of pushing the other button off-screen.

Also swapped the dead-end "Back to Speak →" for **"Finish →"** on the last item;
finishing a set and abandoning it aren't the same action.

## 4. Text arrows → real icons

`→`, `←`, and `↺` were being typed as literal characters in button and link
labels ("Take the quiz →", "← Prev", "↺ Restart"). Replaced with
`ArrowRightIcon` / `ArrowLeftIcon` / `RefreshIcon` across 9 call sites.

Why it's worth doing beyond looking cheap:
- **Typographic arrows render inconsistently** across fonts and platforms —
  weight, size, and vertical position all drift, and `↺` in particular falls
  back to a different font on many systems.
- **They're read aloud by screen readers** ("rightwards arrow"), where an
  `aria-hidden` SVG is silent. Every icon in the set already sets
  `aria-hidden`.
- They can't take a size or inherit stroke weight the way the icon set does.

Containers got `inline-flex items-center gap-1.5` — an inline SVG sits on the
text baseline otherwise and rides low next to its label.

Left alone: arrows inside **code comments**, the dev-only `/tone-eval` table
header (where ↓/→ label axes), and the dead `Matching` component.

### The bug this created, and the guard that now catches it
Two files got `<ArrowRightIcon/>` but **not the import** — and `npm run build`
**passed**. Vite bundles an undefined identifier without complaint; it's a
runtime crash, so the page would have gone white the moment a user opened it.

`scripts/content/icons.mjs` now checks that every `<SomethingIcon/>` used in
JSX is actually imported (or defined locally). It strips comments first so a
commented-out example doesn't count as usage — same lesson as notes/58 and
notes/62 about checkers that cry wolf.

> **A green build is not proof the page renders.** Anything resolved at runtime
> — component names, dynamic imports, context values — needs its own check.

## Files
- `src/data/reference.js` — 4 grammar tables repointed to `unitId: 'grammar'`
- `src/pages/{Home,Speak,Words,WordsSession,VocabList,Lesson,BattlePass}.jsx`,
  `src/components/home/TodayCard.jsx` — text arrows → icons
- `scripts/content/icons.mjs` — the icon-import guard
- `src/data/quizzes.js` — consonant/double-consonant/vowel quizzes commented out
- `src/pages/SpeakPhrase.jsx` — `btn-secondary` nav + arrow icons
- `src/pages/SpeakFamily.jsx` — same
