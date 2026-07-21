# Flashcard Status Badge + Deck Navigation

## 1. The card now says what state it's in

A word is `new`, `learning`, or `known` — but the card showed none of it. The
only signal was which of the two buttons *below* the card looked active, which
is easy to miss and invisible while you're actually reading the word.

Now a small pill sits in the corner of the card:

| Status | Label | Style |
|---|---|---|
| `new` (default, no progress entry) | **New** | neutral cream |
| `learning` | **Learning** | clay (accent) |
| `known` | **Known** | success green |

`new` is shown explicitly rather than left blank — "no badge" is ambiguous
(unstudied? or did the badge fail to render?), and a learner scanning a deck
wants to see which cards they haven't touched.

### On both faces, deliberately
```jsx
<div className="flip-face surface relative …"><StatusBadge status={status} />
<div className="flip-face flip-face-back surface …"><StatusBadge status={status} />
```

Either face can be the one you're looking at. Rendering it once on the front
would mean the status vanishes the moment you flip to check the meaning —
exactly when you're deciding how to mark it.

`relative` had to be added to the front face; the back was already
`absolute inset-0` for the 3D flip, so it could anchor the badge as-is.

### The screen-reader trap
The badge lives *inside* the flip `<button>`, and that button has an explicit
`aria-label`. **An explicit aria-label overrides inner text**, so screen-reader
users would have gotten the word and no status at all. The label now appends it:

```js
aria-label={`${word.hmongRPA}. Tap to reveal the meaning. Status: Learning.`}
```

Worth remembering generally: adding visible text inside an element that already
has an `aria-label` does not make that text available. The label wins.

## 2. Deck navigation, both surfaces

### VocabList (browse a category)
Prev/next were small `btn-ghost` text buttons. Now **48px round targets**
flanking the counter, with a **deck progress bar** above them.

Next is `bg-clay-600` (accent) while Prev is neutral cream — moving forward is
the primary action and should read that way. At the end of the deck, Next is
replaced by Restart + Take the quiz, as before.

### WordsSession (the SRS session) — this one was a real gap
The session **only went forward.** `advance()` incremented; nothing decremented.
Misjudge a card, tap the wrong button, or want a second look, and it was gone
for the rest of the session.

Added a Back button, matched to VocabList's controls. Marking still
auto-advances (that's the fast path); these are the manual overrides.

```
[←]     Mark the card to advance, or skip it     [→]
```

The middle text exists because the two round buttons alone don't explain the
primary interaction — the *marking* is what drives the session, and a learner
seeing only arrows might not realize that.

> A one-way flow through a review queue treats every tap as irreversible. That's
> fine for a timed test and wrong for study.

## Files
- `src/components/vocabulary/Flashcard.jsx` — `STATUS` map, `StatusBadge`, aria-label
- `src/pages/VocabList.jsx` — progress bar, round prev/next
- `src/pages/WordsSession.jsx` — Back button (new), matched controls
