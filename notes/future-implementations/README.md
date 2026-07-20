# Future Implementations

Design sketches for things **not built yet** — ideas worked out far enough to
build from later, but deliberately kept out of the main `notes/` audit trail
(which documents what *exists*). When one of these ships, its real
implementation note moves to `notes/NN-…` and the sketch here gets a "→ shipped
as note NN" pointer.

Distinct from [../11-future-implementations.md](../11-future-implementations.md),
which is a short backlog *list*. This folder holds full design docs.

## Index
- [01-pronunciation-dataset.md](01-pronunciation-dataset.md) — Speak scoring +
  the community Hmong-voice dataset: reference corpus, tone-contour comparison,
  result tracking, and the consent model.
- [02-gamification-and-incentives.md](02-gamification-and-incentives.md) — Points,
  leaderboards, and rewards-instead-of-payroll — and the contradiction between
  rewarding high scores and needing bad-pronunciation data.
- [03-corpus-strategy.md](03-corpus-strategy.md) — **The layer above both:** why
  the labeled corpus (not the audio) is the asset, why learner *errors* are the
  scarce part, the label-integrity failure modes, consent as a hard gate — plus
  a reconciliation against shipped code, including three things that must be
  settled **before the first utterance is stored**.
