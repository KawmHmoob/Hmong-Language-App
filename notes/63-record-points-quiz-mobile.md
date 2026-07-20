# Points on Record · Quiz Mobile · Obvious Study Buttons

Three related UX changes, one session.

## 1. Points fire when you RECORD, not when you click Next

Before: `awardPoints('speak-attempt')` lived in `SpeakPhrase.handleDone` — you
only earned points by pressing **Next**. Record five takes, skip Next, earn
nothing. Backwards, because the recording IS the valuable act (it's the corpus
contribution, notes/57).

Now the award fires from `PronounceStep` the moment a take is scored, via a new
`onTake(result)` callback:

```js
scoreTake(clip.blob, phrase.audio).then((r) => {
  setResult(r)
  if (r?.user?.length > 0) onTakeRef.current?.(r)  // voice captured → award
})
```

Three deliberate details:

- **Guarded by `r.user.length > 0`** — silence (`reason: 'no-voice'`, empty
  contour) isn't a contribution and earns nothing. A wrong or flat take DOES
  earn — that's exactly the scarce error data the corpus wants.
- **`onTakeRef` (a ref), not `onTake` in the effect deps** — an inline parent
  callback changes identity every render; putting it in the scoring effect's
  deps would re-run scoring (and re-award) on every render. The ref holds the
  latest; the effect fires it without depending on it.
- **Still uncapped, still unguarded by `done`** — every take is a new clip worth
  having. `speak-attempt` = 4 pts, no daily cap (notes/57).

The learner now sees a **"+4 points"** chip under the score. Its number reads
from `POINT_SOURCES['speak-attempt'].points`, so the display can never drift
from what's actually granted.

> `SpeakFamily` doesn't use `PronounceStep` (still a placeholder), so this is
> phrase-practice only for now.

## 2. Quizzes made mobile-accessible

The quiz was built desktop-first — cramped tap targets and heavy padding on a
phone:

| | Before | After |
|---|---|---|
| Answer options | `p-3 text-sm` | `p-4 min-h-[3.25rem] text-base` |
| Option grid | `sm:grid-cols-2` | same — 1 col on phone (thumb-reachable), 2 from sm |
| Quiz container | `p-8` | `p-4 sm:p-8` |
| Prompt | `text-3xl` | `text-2xl sm:text-3xl`, `break-words min-w-0` |
| Lock-gate button | inline `btn-primary` | `w-full sm:w-auto`, bigger |

`min-h-[3.25rem]` (~52px) clears the ~44px touch-target floor. `active:scale`
gives tactile press feedback. `break-words min-w-0` stops a long Hmong prompt
from shoving the audio button off-screen.

## 3. The study/learn button, made obvious everywhere

The path from "I need to learn these words" to the word bank was a whisper of
text or hidden behind a lock. Three places now make it a clear action:

**Locked quiz (QuizEngine gate):** rebuilt as one prominent, full-width-on-mobile
`Study the <category> words` button with a **progress bar** (`studied / needed`)
so "how close am I" is instant. "Back to Quizzes" demoted to a quiet link — one
primary action, not two competing buttons.

**During any vocab quiz:** a persistent `Study the <category> words` link in the
header. A learner mid-quiz who realizes they're guessing can reach the words
without quitting. Only vocab quizzes carry `unlock.category`, so it shows only
where it makes sense.

**Quiz menu cards:** the locked card's footer went from tiny text
(`Study N more to unlock →`) to a button-shaped CTA with a book icon and a tint
fill. The whole card is one `<Link>` to the word bank, so the footer just has to
*look* tappable — it now does.

## Files
- `src/components/speak/PronounceStep.jsx` — `onTake` callback, "+points" chip
- `src/pages/SpeakPhrase.jsx` — award moved from `handleDone` to `handleTake`
- `src/pages/QuizEngine.jsx` — mobile tap targets/padding, header study link, rebuilt lock gate
- `src/pages/QuizMenu.jsx` — button-shaped study CTA on locked cards
