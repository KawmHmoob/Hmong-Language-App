# Quiz Audio + Prompt Blurb

## What
Quiz questions can now **play the sound they're asking about**, and optionally
show a **blurb** — a transcript line under the prompt. First use: the tone
markers quiz plays each tone and shows its Hmong name (*Cim Siab*) so the learner
can see what they're hearing.

## The bug
`MultipleChoice` in `QuizEngine.jsx` rendered:
```jsx
<AudioButton audioSrc={null} wordId={question.prompt} />   // ← hardcoded
```
An audio button that could **never** play, on every quiz question, forever. Same
anti-pattern the Reference page had (notes/40): the component was wired for audio
but the value was nailed to `null`, so no amount of data would light it up.

> **Pattern to watch for: `audioSrc={null}` / `src={null}` hardcoded in a
> component that clearly wants a real value.** It's usually scaffolding someone
> left behind, and it fails *silently* — the control renders in its disabled
> state and looks intentional. Grep for it after any audio work.

## The fix — three thin layers
Audio was already in the data; it just had nowhere to travel. Each layer passes
it through untouched:

**1. Dataset adapters** (`getQuizDataset`) now emit `audio`, and optionally `blurb`:
```js
case 'alphabet-tones':
  return tones.map((t) => ({
    prompt: t.marker || '(no marker)',
    answer: t.name,
    audio: t.audio,
    blurb: t.example2,   // the tone's Hmong name — what the recording says
  }))
```
Also added to `alphabet-consonants`, `alphabet-vowels`, and the auto-generated
`vocab-*` quizzes (which pass the bare `audioFile` — `resolveSrc` prepends
`AUDIO_BASE`, so both path forms work; notes/40).

**2. `buildQuestions`** copies both fields onto the question object. They're
**optional** — a dataset without them yields `undefined`, and `AudioButton`
renders its normal disabled state. No quiz needed changing to keep working.

**3. `MultipleChoice`** renders them:
```jsx
<AudioButton audioSrc={question.audio} wordId={question.prompt} size="lg" />
<h3 …>{question.prompt}</h3>
{question.blurb && <p className="text-sm text-stone-600 italic mt-2">{question.blurb}</p>}
```

The whole change is *plumbing* — no new component, no new state. That's the
tell that the original `null` was an oversight rather than a design.

## Why a `blurb` rather than reusing an existing field
The tone quiz asks "what tone is this marker?" and plays the recording. Without
text, a learner hears audio with no anchor. `blurb` is deliberately **generic**
(a transcript/caption slot), not `hmongName` — so other quizzes can use it for
whatever their recording says.

⚠️ **Trade-off, flagged:** for the tone quiz the blurb shows the tone's *Hmong*
name while the options are its *English* names. A learner who knows the pairing
(*Cim Siab* = High) effectively gets the answer. That's intentional here — the
goal is sound↔name association, not a gotcha — but if the quiz should stay a
real test, move the blurb into the feedback panel so it appears **after**
answering instead of with the prompt.

## How to extend
- **Give any quiz audio:** add `audio` to its adapter in `getQuizDataset`. That's it.
- **Add a caption:** add `blurb`. Omit it and nothing renders.
- **Audio silent?** The path must point at a real file — check with the disk-vs-data
  loop in notes/42/44. A wrong path gives an *enabled* button that 404s quietly.

## Files
- `src/pages/QuizEngine.jsx` — `buildQuestions` threads `audio`/`blurb`;
  `MultipleChoice` renders them (removed the hardcoded `null`)
- `src/data/quizzes.js` — adapters emit `audio` (+ `blurb` for tones)
