# The Lesson↔Word-Bank Gap

## What
The **Yog — To Be** study session was missing the three forms the lesson
actually teaches. Added to the `yog-to-be` category:

| id | Hmong | English |
|---|---|---|
| `yog-to-be-i-am` | kuv yog | I am |
| `yog-to-be-you-are` | koj yog | you are |
| `yog-to-be-he-she-is` | nws yog | he / she is |

Category goes 4 → 7 words. All three already had recordings on disk, so they
came with audio for free.

## Why it happened
A lesson with `vocab: '<categoryId>'` splits the work in two (notes/37):

- the **lesson** explains, in its `examples` step
- the **word bank** drills, from `vocabulary.js`
- the **quiz** tests, gated on having studied (notes/52)

That split is good — it's what removed the redundancy of listing every word
twice. But it created a seam, and **nothing was checking that the two halves
agree.** The yog-to-be lesson taught *Kuv yog / Koj yog / Nws yog / Tsis yog /
Puas yog*; the word bank held *yog / tsis yog / puas yog / nyob*. Two of five
overlapped.

So the learner read one set of words, was sent to "study the words," and got a
different set — including `nyob`, which the lesson only mentions in passing.
Then the quiz tested that second set.

> When one surface explains and another drills, "they cover the same material"
> is an **invariant**, not a coincidence. Unchecked invariants drift.

## The audit
`scripts/content/gap.mjs` compares every `vocab:` lesson's `examples` items
against its category, normalizing case, punctuation, and whitespace:

```js
const inBank = new Set(cat.words.map((w) => norm(w.hmongRPA)))
const gap = taught.filter((t) => !inBank.has(norm(t)))
```

It reads the lesson **files as text** rather than importing `lessons.js`,
because that module uses extensionless imports that Vite resolves and plain
Node does not. Worth knowing before writing the next data script.

Current state — three lessons still have the gap:

```
GAP 4  action-verbs.js   Noj, Haus, Los, Ua
GAP 4  how-much.js       Yog pes tsawg?, Muaj pes tsawg?, Koj xav tau pes tsawg?, Nqi pes tsawg?
GAP 2  time.js           Tav su tag, Yav tsaus ntuj
ok     yog-to-be.js      5 taught / 7 in bank
```

These are **left open deliberately** — they need a Hmong speaker to confirm the
gloss and tags before the words enter the drilled set, and inventing vocabulary
is exactly the kind of content the TODO-VERIFY convention (notes/27) exists to
prevent. The audit makes them visible; it doesn't get to author them.

A gap isn't automatically a bug, either: a category may legitimately hold **more**
than a lesson teaches (`verbs` has 20, the lesson introduces 7). The audit only
flags the other direction — **taught but not drillable** — which is always wrong.

## Knock-on effects, both fine
- **Study gate:** `QUIZ_UNLOCK_RATIO` is 0.5, so unlocking the quiz now takes
  4 studied words instead of 2. Derived, so nothing to update (notes/52).
- **Quiz distractors:** `vocab-yog-to-be` now builds from 7 answers instead of
  4, which makes the deduped option pool healthier (notes/51).
- **Audio:** the three `*-yog` recordings now serve both the lesson's examples
  step and the word bank. Same file, two surfaces — that's reuse, not
  duplication. Verified: `100 verified, 0 problems`.

## No invented Hmong
Only `kuv yog` got an `exampleSentence`, lifted verbatim from the lesson's own
note (*"Kuv yog Hmoob" = I am Hmong*). The other two got none rather than a
sentence I'd have made up. `exampleSentence` is optional and plenty of words go
without — **a blank field is honest; a plausible wrong one is not**, and it
would eventually be recorded as reference audio.

## Cleanup pass — gaps closed

All but one gap is now closed, plus two structural fixes the audit surfaced.

| Fix | Detail |
|---|---|
| **New `greetings` category** | 6 words promoted out of the lesson. They had 7 recordings that nothing could drill. The lesson now declares `vocab: 'greetings'`, so it gets the study handoff + a quiz — and `vocab-greetings` appears automatically, since `quizzes.js` derives one quiz per category. |
| **`verbs` +4** | noj, haus, los, ua — taught in action-verbs, never drillable. |
| **`money` +4** | the four `pes tsawg` price questions. |
| **Duplicate `timeframes` resolved** | see below. |

Every gloss was lifted **verbatim from the lesson that already taught it**. No
Hmong was authored here — that's the TODO-VERIFY line from notes/27, and a data
cleanup is not the place to cross it.

### "Nyob zoo" is one word-bank entry, not two
The greetings lesson lists it twice (hello, and the farewell "stay well"). The
word bank has **one** entry, glossed `hello / stay well`. Two entries sharing a
`hmongRPA` would put two correct answers in the same quiz — the duplicate-answer
bug from notes/51. The lesson teaches the nuance; the word bank drills the word.

### The duplicate `timeframes` category
Two categories shared the id `timeframes`, so `getCategory` returned the first
and the second's 7 words were unreachable. They turned out to be a **cohesive
set** — all `hnub` (day) words: today, everyday, the other day — with zero
overlap against the first category's 19.

So rather than merging into one 26-word pile, the second became its own
category, `timeframes-days` / **"Days & Frequency"**, and was added to the
`time-numbers` theme. Both are now reachable and each stays a sensible study
session. Renaming touched the wrapper *and* the `category:` field on all 7
words, bounded to that block.

### The one gap deliberately left open
```
GAP 2  time.js   Tav su tag, Yav tsaus ntuj
```
This is **not** a missing entry — it's a **disagreement**:

| Lesson teaches | Word bank has |
|---|---|
| `tav su tag` — afternoon | `tav su dua` — afternoon (lit. "past noon") |
| `yav tsaus ntuj` — evening / night | `tsaus ntuj` — night, evening; p.m. |

Adding the lesson's forms would create near-synonym pairs and put two
effectively-correct answers in one quiz. Which spelling is standard is a
**native-speaker call**, not something to resolve by pattern-matching. Closing a
gap by inventing a distinction is worse than leaving it open and labelled.

## How to extend
- Run `node scripts/content/gap.mjs` after editing any lesson or category.
- Closing a gap = add the word to `vocabulary.js`, not remove it from the
  lesson. The lesson's job is to explain in context.
- Keep ids stable — they're progress keys (`vocabProgress`), so a rename silently
  resets that word for every existing learner.

## Files
- `src/data/vocabulary.js` — three words added to `yog-to-be`
- `scripts/content/gap.mjs` — the audit
