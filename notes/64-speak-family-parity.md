# Speak Family Parity + Sentence Builder Placeholder

## 1. Word families now practice like phrases

`SpeakFamily` (consonants, vowels) was a **static list with a disabled mic** —
it showed every word at once and said "coming soon." Meanwhile `SpeakPhrase`
was a real one-at-a-time record → score loop. Two Speak surfaces, two different
interactions, for the same activity.

They're the same now: `SpeakFamily` steps through the family one letter at a
time and hands each to the same `PronounceStep`.

### Why this was possible, and wasn't before
The consonant and vowel families are **derived from `reference.js`**
(notes/50, notes/60), which means every word already carries a real recording:

```js
words: g.items.map((c) => ({ id: …, hmong: c.letter, audio: c.audio }))
```

The "coming soon" banner predated the scorer. Once `PronounceStep` could score
anything with a reference, the families qualified — nothing new had to be
recorded. The disabled state had simply outlived its reason.

### The adapter
`PronounceStep` speaks `phrase` shape, so the family word is mapped onto it:

```js
const phrase = {
  id: word.id,
  hmong: word.hmong,
  english: word.english,
  audio: word.audio,
  tip: word.vowel
    ? `${word.consonant} + ${word.vowel} + ${word.tone || '(no tone)'}`
    : family.pattern,   // a bare consonant has no breakdown
}
```

The consonant+vowel+tone breakdown that used to be a static line under each word
becomes the **tone tip** — same information, now shown while you're actually
saying that letter rather than in a list you scroll past.

Two details carried over from `SpeakPhrase` so behaviour matches exactly:
- **`key={word.id}`** on `PronounceStep` — resets recording/score state between
  letters. Without it, the previous letter's take and curve would persist.
- **Points fire on record** (`onTake`), not on advancing (notes/63). Uncapped.

Progress uses the **word id** as the `completedSteps` key, mirroring how phrase
practice uses the phrase id.

### What was removed
The `PASS_SCORE` banner ("beat 80% to advance"). It described a gate that does
not exist — the threshold is still uncalibrated (notes/61), and advertising a
pass mark the app doesn't enforce is worse than saying nothing. `PASS_SCORE`
itself stays in `wordFamilies.js` for when calibration happens.

## 2. Sentence Builder placeholder (`/words/sentences`)

Roadmap Phase 2 (`future-implementations/04`). A route + a page that shows the
intended shape with **no exercise data and no fake interaction**.

The honesty rule it follows is the one the old `SpeakFamily` got right: **a
disabled control beats a faked one.** So the sentence "pieces" render as static
chips, deliberately NOT draggable — a drag affordance that does nothing is worse
than no affordance at all. The `BetaRibbon` says "Not built" in as many words.

What makes it more than an empty shell: each part links to the lesson that
already teaches it. Classifier → the classifiers lesson, tense marker → tense
markers, and so on. **The grammar this builder would validate against is
largely already written** — that's the useful thing to know, and the page says
it rather than implying the work hasn't started.

Link targets verified against real lesson ids (`foundations-noun-classifiers`,
`foundations-action-verbs`, `foundations-tense-markers`, `grammar-adjectives`) —
a placeholder with broken links is just a broken page.

Surfaced from Words as a `DrillTile` whose blurb reads "Coming soon" so nobody
taps in expecting a drill.

## Files
- `src/pages/SpeakFamily.jsx` — rebuilt as a stepper around `PronounceStep`
- `src/pages/SentenceBuilder.jsx` — new placeholder
- `src/pages/Words.jsx` — tile linking to it
- `src/App.jsx` — `/words/sentences` route
