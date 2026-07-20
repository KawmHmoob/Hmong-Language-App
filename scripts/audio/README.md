# Audio wiring scripts

Run from anywhere with `node scripts/audio/<script>.mjs`. Paths resolve relative
to the repo, so they work regardless of where the checkout lives.

| Script | What it does |
|---|---|
| `match.mjs` | **Dry run.** Prints `ok` / `MISS` / unused for every recording. Run this FIRST, before mutating anything. |
| `wire2.mjs` | Writes `audioFile` into `src/data/vocabulary.js`. Bounded per word; throws on collision rather than guessing. |
| `wire-lessons.mjs` | Writes `audio` onto each lesson's `examples` items. Handles repeated phrases by consuming takes positionally. |
| `verify.mjs` | **The real check.** Re-imports the data and asserts every filename spells the same word as the text beside it, and that every path exists. Exit 1 on any problem. |

Order: `match` → `wire2` → `wire-lessons` → `verify` → `npm run build`.

All three writers are **re-runnable** — they replace an existing value rather
than only filling `null`, so a new batch of recordings needs no script edits.

Adding a new batch of recordings? Add the folder to `FOLDERS` in `match.mjs`:

```js
'action-verbs': ['hmong-action-verbs-', 'verbs'],
//  folder         filename prefix        vocabulary category id
```

**Why `verify.mjs` exists:** an earlier version of the wiring script reported
"wired 56" while having assigned `tseem`'s recording to the word `lawm` — the
screen said one word and the speaker said another. A script's own success count
proves nothing. See [notes/54](../../notes/54-wiring-grammar-audio.md).
