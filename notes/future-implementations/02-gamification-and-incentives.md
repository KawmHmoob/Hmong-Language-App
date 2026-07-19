# Gamification, Leaderboards & Incentivized Contribution (DESIGN)

Status: **design / not built.** Extends
[01-pronunciation-dataset.md](01-pronunciation-dataset.md) (scoring + the corpus)
and the ethics constraints there. Read that first — consent still governs
everything here.

Built so far: **"Say this today"** on the Speak hub — one rotating phrase, same
for every user, derived from the date (`src/lib/daily.js`). That's the daily
anchor a streak or leaderboard would hang off.

---

## ⚠️ The core contradiction — resolve this before building

You want two things that pull against each other:

1. **Gamification** — points and a leaderboard for *good* pronunciation.
2. **A balanced corpus** — including *bad* and *mediocre* attempts, because a
   model can't learn the good/bad boundary from good examples only.

> **If points reward high scores, nobody will ever submit a bad one.**

Users optimize for whatever the leaderboard measures. Reward score and you get:
learners recording only their best takes, deleting bad ones, gaming the mic
(getting closer, exaggerating), and eventually a corpus that's uniformly polished
— i.e. exactly the data you *don't* need, harvested at the cost of the data you
do. Incentivized annotation has this failure mode everywhere; it's not
hypothetical.

### The resolution: reward *effort and improvement*, not *score*

| Reward this | Not this |
| --- | --- |
| Attempts made, words covered | Absolute score |
| Daily streak, consistency | "Perfect" runs |
| **Improvement** on a word over time | Being good already |
| Completing a family/drill | Leaderboard rank by accuracy |

This aligns the incentive with both goals: an honest first attempt (valuable
"bad" data) still earns points, and a learner who *starts* bad and improves
earns the **most** — which is also the person the app helped most. The
leaderboard becomes "who practiced hardest," not "who was already fluent."

Which is fairer anyway: a native speaker would otherwise top the board forever,
and a beginner — the actual target user — would never place.

---

## The accidental gift: retry-until-perfect is ideal training data

Your instinct that redoing until perfect "ironically helps them pronounce
correctly" is right, and it produces something better than you may realize:

> A sequence of attempts by the **same speaker** on the **same word**,
> progressing bad → good.

That's a controlled comparison. Speaker identity, mic, room, and word are all
held constant, so the **only** thing varying is pronunciation quality. Most
speech corpora can't isolate that — they compare different people saying
different things. Keeping the whole retry sequence (with consent) is more
valuable than keeping only the final good take.

**Design consequence:** store attempts as a *series* keyed to (user, word,
session), not as one overwritten best-take. Label them by position and score so
the progression is recoverable.

---

## Rewards without payroll

Coupons/prizes instead of paying annotators is a reasonable bootstrap, with
caveats worth knowing up front:

- **Rewards are compensation.** Once something of value is exchanged, you may
  cross from "user donates data" into "contractor supplies data" — which touches
  tax, terms, and (in some places) minor-labor rules. Sweepstakes/contests carry
  their own regulations that vary by jurisdiction. Cheap to structure correctly
  *before* launch, expensive to unwind after.
- **Consent framing changes.** Paid/incentivized contribution needs to be
  disclosed as such. "Donate to help Hmong language research" and "earn rewards
  for recordings" are different asks and shouldn't be blurred.
- **Community optics.** A Hmong-language app that turns elders' and learners'
  voices into a private asset via coupons reads badly, however well-intended.
  Openly-licensed corpus + credit to contributors keeps this on the right side —
  see the ownership question in note 01.
- **Cheaper alternatives that avoid all of it:** recognition (badges, a
  contributors page), Pro-tier access as the reward (costs you nothing marginal,
  and self-selects for people who value the app), or early access to features.
  **Pro access for contribution is probably the best first reward** — no money
  changes hands, no leaderboard gaming incentive, and it deepens engagement.

---

## Individual-word mode + the daily cap

Per-word practice (vs. phrases) is the right long-term shape — it's how you get
coverage across the sound inventory. The **10-words-a-day cap** is a good
instinct for three separate reasons:

1. **Cost** — if scoring ever runs server-side, unbounded recording is unbounded spend.
2. **Data quality** — a fatigued user on word #80 produces noise, not signal.
3. **Retention** — a finite daily goal is the entire engine behind SRS apps
   (it's already how `DAILY_NEW_LIMIT` works in Words, notes/35).

Reuse the pattern: derive the day's set deterministically (`src/lib/daily.js`),
cap it, and let the streak do the motivating.

---

## Data model sketch (extends note 01)

```
speak_attempt
  id, user_id, word_id, session_id
  attempt_index        1, 2, 3… within the session   ← the progression
  score_overall / tone / timing / clarity
  created_at
  donated              bool — consent, per attempt

user_points
  user_id
  points_total
  attempts, words_covered, streak_days
  improvement_points   ← weighted heaviest (see the table above)

leaderboard  (derived, never a stored rank)
  period: daily | weekly | all-time
```
Compute the leaderboard from points on read. Never store a rank — it goes stale
and invites the "why did I drop" support burden.

---

## Suggested build order
1. **Core scoring first** (note 01 MVP: reference corpus + pitch overlay). Without
   a trustworthy score, points are meaningless and a leaderboard is noise.
2. **Personal stats** — attempts, streak, per-word best. Motivating on its own,
   no social pressure, no gaming surface.
3. **Points on effort/improvement**, tuned privately before anyone sees a board.
4. **Leaderboard** — start friends/small-cohort, not global. Global boards get
   gamed and demoralize beginners.
5. **Rewards** — Pro access first; only consider material prizes with legal
   review.

**Do not ship a leaderboard before the score is calibrated** (notes/19 covers
proving a score agrees with human ears). A leaderboard built on a flaky score
teaches users to game a broken metric, and you can't un-teach that.

## Open questions
- Are points awarded for *donated* attempts only, or all attempts? (Donation-only
  creates pressure to donate — that undermines free consent.)
- How do you prevent trivial farming (recording silence 100×)? The spam gate from
  note 01 helps, but points need their own floor.
- Native speakers on the leaderboard — separate category, or excluded?
- Does a reward change the donation consent text? (Almost certainly yes.)
