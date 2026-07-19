# Tone Drill Derivation + Wrong-Answer Highlight

Two fixes: the tone drill was teaching *different tone names than the lessons*,
and a wrong quiz answer gave no visual feedback about what you picked.

---

## 1. The tone drill had drifted

`toneDrill.js` hardcoded a tone name next to each word. When the tones were
later renamed in `reference.js`, the drill kept the old names — so the app
taught one vocabulary and tested another:

| toneDrill.js said | reference.js says |
| --- | --- |
| Mid-rising | **Rising** |
| Mid-low breathy | **Mid-Falling with Air** |
| Low-falling glottalized | **Low-Falling** |
| Low-rising | **Low-Rising** (capital R) |

Four of eight wrong. And it failed *silently*: the quiz builds its distractors
from its own dataset, so every question was internally consistent and nothing
looked broken — the names were just wrong relative to the lessons. **Duplication
bugs don't crash; they quietly disagree.**

### The fix: derive the answer from the word
In RPA the **final letter of a syllable IS the tone marker** (`b j v s g m d`, or
absent for mid). The word already contains its own answer, so the tone name
never needed to be written down:

```js
import { tones } from './reference.js'
const NAME_BY_MARKER = Object.fromEntries(tones.map((t) => [t.marker, t.name]))
const MARKERS = new Set(tones.map((t) => t.marker).filter(Boolean))

export function toneOf(word) {
  const last = word.slice(-1).toLowerCase()
  return MARKERS.has(last) ? NAME_BY_MARKER[last] : NAME_BY_MARKER['']
}

export const toneDrillWords = words.map((word) => ({ word, tone: toneOf(word) }))
```
`toneDrill.js` is now just a **list of words**. Rename a tone in `reference.js`
and the drill follows automatically — the drift is structurally impossible.

**Why the derivation is safe:** no RPA tone marker is also a vowel
(`a e i o u w`), so a word ending in a vowel is unambiguously the mid tone.
`ua`, `li`, `hu`, `po` → Mid. `nrov` → Rising. `sawg` → Mid-Falling with Air.

This is the same move as `consonantGroups` (notes/43) and the derived lesson
examples (notes/45): **if a value can be computed from data you already have,
computing it removes a whole class of bug.**

---

## 2. A wrong answer now shows red

`MultipleChoice` highlighted the correct answer green and dimmed everything
else — so after a wrong pick you saw the right answer, but **not which one you
chose**. With four dimmed options you couldn't tell your mistake from the two
you never considered.

The component didn't know: `onPick` handed the choice to the quiz reducer and
kept nothing locally. Fixed with one piece of state:

```jsx
const [picked, setPicked] = useState(null)   // in QuizEngine
…
if (showResult && isAnswer)        cls = 'border-emerald-500 bg-emerald-50'  // correct
else if (showResult && opt === picked) cls = 'border-red-500 bg-red-50'      // your wrong pick
else if (showResult)               cls = 'border-cream-200 bg-cream-50 opacity-60'
```

Note the `else if` chain — the original used two independent `if`s, so the
"dim everything that isn't the answer" rule would have overwritten the red.

`picked` is cleared in **both** places feedback resets (Next, and Retry) —
otherwise the previous question's pick bleeds into the next one and reds an
unrelated option. Easy leak to miss when adding state next to existing state.

This matches `PracticeStep` in `Lesson.jsx`, which already did it correctly —
the quiz was the odd one out.

## How to extend
- **New tone-drill words:** add the bare string to the `words` array. The tone
  is computed; don't write it.
- **Non-standard syllable** whose final letter isn't its tone: `toneOf()` would
  mislabel it. Such a word doesn't belong in a *tone* drill — leave it out.
- **New quiz feedback states:** keep the `else if` chain ordered
  correct → picked → dimmed.

## Files
- `src/data/toneDrill.js` — word list only; `toneOf()` derives the tone name
- `src/pages/QuizEngine.jsx` — `picked` state, red wrong-answer style, resets
