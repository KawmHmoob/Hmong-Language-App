# Alphabet as Its Own Section + the Mojibake Cleanup

## What
Two changes:
1. **Alphabet is now a top-level section** — a fifth primary tab (Home · Learn ·
   Alphabet · Speak · Words) with its own "A" icon and a tan (`cream-600`) accent.
   It is no longer folded under Learn.
2. **Every mojibake sequence in the app was repaired** — 17 instances of garbled
   punctuation (`â€”`, `âœ“`, `â†’`, `â€“`, `â€¦`) across 9 files that were
   rendering as literal garbage to users.

## Part 1 — why Alphabet got promoted (amending notes/30)
[30-four-section-nav.md](30-four-section-nav.md) folded Alphabet into Learn on the
theory that Alphabet/Course/Learn are all "study." The owner overruled it, and the
reasoning is sound: **Alphabet is reference, not coursework.** You don't *complete*
the alphabet — you *consult* it, constantly, from the middle of any other task
("what tone does -j mark again?"). Reference material buried one level down is
reference material you stop using. Course stayed under Learn because it genuinely
is coursework.

That note's rule — *"never add a fifth tab without deleting or merging something"* —
is now formally amended: **five is the ceiling.** The tab bar is thumb-width-bound;
a sixth would put labels at unreadable sizes.

### What changed mechanically
The 4→5 change is three coordinated edits — miss one and it breaks silently:
```jsx
grid-cols-4  →  grid-cols-5      // the tab row
w-1/4        →  w-1/5            // the sliding indicator's width
translateX(active * 100%)        // unchanged — % is relative to the element's
                                 // OWN width, so a 1/5-wide bar steps by 1/5
```
That last line is why the indicator math needed no edit: `translateX(100%)` moves
an element by its own width, not the container's. The pattern scales to any N.

Also: `/alphabet` was removed from Learn's `match` function and given its own, and
Learn's two-card "Reference" row collapsed to a single Course card.

### The accent problem (an honest constraint)
Five sections need five distinguishable accents, and the palette has four usable
hues: stone (Home), seafoam (Learn), clay (Speak), blush (Words). Alphabet got
`cream-600` — a warm tan. It is the weakest of the five: cream-600 sits in the same
warm family as clay/blush, so on the 2px indicator the three warm sections are less
distinct from each other than from seafoam.

Accepted because **the icon carries identity; the accent only reinforces it.** If
this bothers you later, the fix is to add a genuinely distinct hue (a muted gold or
violet) to `tailwind.config.js` + all three theme blocks in `index.css` — not to
re-shuffle the existing four.

## Part 2 — the mojibake cleanup (what this bug IS, since it will recur)
**Symptom:** `Not quite â€" answer:` where `Not quite — answer:` was intended.

**Cause:** a UTF-8 → Windows-1252 → UTF-8 round trip. An em dash (`—`) is stored in
UTF-8 as three bytes `E2 80 94`. If a program reads that file as Windows-1252
(where every byte is its own character), it sees three *characters*: `â` `€` `”`.
Save that back as UTF-8 and the corruption is now real, permanent text. Same story
for `✓` → `âœ“` and `→` → `â†'`. On Windows this happens whenever an editor or tool
guesses the encoding instead of being told.

**The fix**, run as a throwaway script (`node`, then deleted):
```js
const map = [
  ['â€”', '—'], ['â€“', '–'], ['â€¦', '…'],
  ['â€™', '’'], ['â€œ', '“'], ['â€', '”'],
  ['âœ“', '✓'], ['â†’', '→'], ['â†', '←'],
]
for (const [bad, good] of map) s = s.split(bad).join(good)
```
**Two things that matter here:**
1. **Order is load-bearing.** `'â†'` (←) is a *prefix* of `'â†’'` (→). Put the short
   one first and every right-arrow becomes a left-arrow followed by junk. Longest
   sequences first — always, in any replacement table.
2. **Don't be clever with `Buffer.from(s,'latin1')`.** It looks like the elegant
   inverse, but latin1 ≠ cp1252 in the `0x80–0x9F` range (that's exactly where `€`,
   `”`, `œ` live) — the very characters in play. An explicit map is boring and correct.

**Verification:** `grep -rn "â" src --include=*.jsx` → no matches.

**Found alongside:** QuizEngine's feedback read `Not quite answer:` — punctuation
missing entirely, inconsistent with Lesson's `Not quite — answer:`. Repaired and
given the same CheckIcon treatment.

### Preventing a recurrence
- Ensure `.editorconfig` / editor settings force UTF-8 on this repo.
- The real prevention: **stop putting glyphs in strings.** Icons now come from
  `src/components/icons/` ([31-icon-system.md](31-icon-system.md)) — an SVG can't
  be mojibaked. Every `✓`/`→` replaced with a component is a bug that can't return.
  Punctuation (— … ') still can, so this grep is worth rerunning after any bulk
  edit by an outside tool.

## Files
- `src/components/PrimaryNav.jsx` — alphabet section + AlphabetIcon, 4→5 grid
- `src/pages/Learn.jsx` — Alphabet card removed, Course card kept, ArrowRightIcon
- `src/pages/Alphabet.jsx` — section eyebrow, hero line, CheckIcon, mojibake fix
- `src/components/icons/index.jsx` — ArrowRightIcon + ArrowLeftIcon added
- Mojibake repaired in: `ProfilePage`, `QuizEngine`, `VocabList`, `WordDetail`,
  `Course`, `Lesson`, `Notebook`, `Search`, `Alphabet`
