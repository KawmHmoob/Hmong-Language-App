# Share the Component, Not Just the Data

## What
Letters and tones now render **identically in Reference and in Learn lessons**,
because both import the same two components:

- `src/components/reference/LetterGrid.jsx` — the letter tile grid (consonants, vowels)
- `src/components/reference/ToneRows.jsx` — the tone rows (marker · name/description · Hmong name · audio)

Plus two new lesson step kinds that use them:

```js
{ kind: 'letters', title, intro?, items }   // → <LetterGrid>
{ kind: 'tones',   title, intro?, items }   // → <ToneRows heading={null}>
```

## The mistake this fixes (worth internalizing)
The Tones lesson originally derived tone data from `reference.js` and rendered it
through the generic **`examples`** step. That step is built for *word lists* —
`hmong → english → audio → note` — so eight tones came out as unreadable stacks:

```
b
High — Cim Siab
Play audio
Pitch is High. Example: pob (ball)
```

Meanwhile the Reference page rendered the *same data* beautifully with its
purpose-built tone rows.

**The data was never the problem. The renderer was.** I'd correctly avoided
duplicating the *data* (deriving from `reference.js`) and then immediately
duplicated the *presentation* — badly — by pushing purpose-built content through
a generic layout.

> ### The rule
> **Share the component, not just the data.** If Reference already has a good
> layout for something, the lesson **imports that component**. A lesson never
> re-renders the same content its own way.

This is the presentation-layer twin of the data rule in notes/34 (Reference
*states*, lessons *explain*). Deriving data avoids drift in *what* is shown;
sharing components avoids drift in *how* it's shown. You need both.

## The first instinct — and why it was also wrong
The first fix attempt was to **delete** the tables from the lessons entirely and
leave only a `reference: 'tones'` cheat-sheet link. That removed the ugliness but
also removed content the lesson genuinely wanted — a tones lesson that can't show
you the tones is a worse lesson. **"It looks wrong" is a rendering bug, not a
reason to delete the content.** Fix the renderer.

## How the extraction was done safely
Reference's `Grid` and `ToneList` were moved out **byte-identical** and then
imported back under their original local names:

```jsx
// Reference.jsx
import Grid from '../components/reference/LetterGrid.jsx'
import ToneList from '../components/reference/ToneRows.jsx'
```

Because the markup and the call sites are unchanged, the Reference page renders
exactly as before — the extraction is invisible there. That matters: the owner
had tuned that layout and it must not shift.

`ToneRows` takes a `heading` prop defaulting to Reference's `'Cov Tsiaj Ntawv Cim'`
so Reference keeps its heading, while the lesson passes `heading={null}` and
supplies its own step title. **One prop, two contexts, no forked component.**

## Where the step kinds live now
`Lesson.jsx` gained two thin wrappers — a title, an optional intro, then the
shared component:

```jsx
{step.kind === 'letters' && <LettersStep step={step} />}
{step.kind === 'tones'   && <TonesStep   step={step} />}
```

Current users:
| Lesson | Step kind | Data source |
| --- | --- | --- |
| Vowels \| Cov Tab | `letters` | `singleVowels` |
| Double Vowels \| Cov Txooj | `letters` | `doubleVowels` |
| Tones \| Cov Cim | `tones` | `tones` |

## How to extend
- **A tone-contrast lesson** (high vs high-falling, the breathy `-g`…): give it
  `kind: 'tones'` with a filtered subset of `tones` — it looks right for free.
- **A consonant lesson** that should show tiles instead of the examples list:
  `kind: 'letters'` with the relevant slice of `consonants`.
- **New shared visual?** If Reference and a lesson both need it, it goes in
  `src/components/reference/` and both import it. Don't re-implement.
- **Still use `examples`** for actual word lists with glosses and teaching notes —
  that's what it's good at. Choose the step kind by the shape of the content.

## Files
- `src/components/reference/LetterGrid.jsx` — **new**, extracted verbatim
- `src/components/reference/ToneRows.jsx` — **new**, extracted verbatim (+ `heading` prop)
- `src/pages/Reference.jsx` — imports both; local copies removed
- `src/pages/Lesson.jsx` — `LettersStep` / `TonesStep` + render cases
- `src/data/lessons/{tones,vowels,double-vowels}.js` — use the new step kinds
