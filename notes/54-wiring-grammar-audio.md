# Wiring the Grammar Audio — and the Off-By-One-Comma Bug

## What
97 recordings wired up across the Grammar unit:

- **60 vocabulary words** — `audioFile` on `pronouns`, `verbs`, `tense-markers`,
  `classifiers`, `demonstratives`, `yog-to-be`. Drives flashcards, the word list,
  word detail, and quiz audio.
- **37 lesson example items** — `audio` on the `examples` step of seven Grammar
  lessons, so the words are audible *inside* the lesson too.

Three words are still deliberately silent — see "What's still missing."

## The mapping problem
The files are named by the **Hmong word**; the data is keyed by **word id**.

```
grammar/action-verbs/hmong-action-verbs-nyeem.mp3   ← the word
verbs-read                                          ← the id
```

So the join key is `hmongRPA`, slugified. Two spellings had to be accepted,
because the recordings aren't internally consistent about spaces:

```js
export function keysFor(hmong) {
  const base = hmong.toLowerCase().replace(/[?.,!]/g, '').trim()
  return [base.replace(/\s+/g, '-'),   // 'ntawm no'  -> ntawm-no      ✓
          base.replace(/\s+/g, '')]    // 'tab tom'   -> tabtom        ✓
}
```

`puas yog?` also needed the `?` stripped. **The slug function is the whole
integration** — get it wrong and you get silent 404s, which is the failure mode
notes/42 is entirely about.

## The bug worth remembering
The first version found each word's field by searching forward from its id:

```js
const at = vocab.indexOf(`id: '${w.id}',`)
const nullAt = vocab.indexOf('audioFile: null,', at)   // ← WRONG
```

Looks reasonable. It corrupted the data.

**Why:** when `audioFile` is an object's *last* field it's written
`audioFile: null }` — **no trailing comma**. The pattern `audioFile: null,`
doesn't match that, so the search sailed past the word's own object and landed
on the *next* word's field. Result:

```
tense-markers-completed ("lawm")  ->  hmong-tense-markers-tseem.mp3
yog-to-be-located       ("nyob")  ->  hmong-demonstratives-ntawm-no.mp3
```

The screen said **lawm** and the speaker said **tseem**. That is worse than
silence: a missing file is obvious the moment you tap it, but *confidently wrong
audio in a pronunciation app teaches the wrong pronunciation*, and the learner
has no way to know. It also would have poisoned the recorded-speech dataset,
since the reference audio would be labeled with the wrong word.

**The fix is two changes, and the second matters more than the first:**

```js
const FIELD = 'audioFile: null'          // 1. no comma — matches both forms

let end = vocab.indexOf("id: '", at + 5) // 2. BOUND to this word's own object
if (nullAt >= end) throw new Error(...)  //    and REFUSE rather than guess
```

Dropping the comma fixed the symptom. **Bounding the search fixed the class.**
Any future field-shape surprise now throws instead of silently writing the wrong
word — the script fails loudly at the seam rather than producing plausible
garbage.

Two more guards, both cheap:

```js
// build the whole plan against pristine text, apply back-to-front so no
// edit shifts a later offset
edits.sort((a, b) => b.at - a.at)

// no two words may claim the same slot
if (seen.has(e.at)) throw new Error(`COLLISION at ${e.at}: ...`)
```

## Verify by meaning, not by exit code
The script reporting "wired 60" proves nothing — the broken version cheerfully
reported "wired 56." The check that actually matters re-imports the data and
asks whether **each file's name spells the same word as the text beside it**:

```js
function agrees(path, hmong) {
  const token = file.slice(prefix.length, -4)   // ...-lawm.mp3 -> 'lawm'
  return keysFor(hmong).includes(token)
}
```

Plus `existsSync` on every path, for the 404 class. `97 verified, 0 problems`.

> A codegen script's own success count is self-reported. Verify the *output*
> against an independent property — here, that the filename and the on-screen
> text describe the same word.

Keep `verify.mjs` around; re-run it after every recording batch.

## Batch 2 — conversations (+19 clips, 119 total)

Added `grammar/conversations/greetings-and-farewells/` (7),
`grammar/conversations/sib-reciporcals/` (6), and the bare `yog` that batch 1
was missing. All 6 reciprocal words and all 7 greeting phrases now have audio.

Three things this batch forced, each worth keeping:

### 1. The scripts are now re-runnable
`wire2.mjs` originally matched only `audioFile: null`, so a second run threw on
every already-wired word — meaning the script had to be *edited* before each new
batch. It now matches either form:

```js
const FIELD_RE = /audioFile: (?:null|'[^']*')/
```

and reports `wired 7 words (63 already correct)`. **A migration script you can
only run once is a script you'll be afraid to run.**

### 2. Multiple takes per phrase
The greetings lesson lists **"Nyob zoo" twice** — once as hello, once as the
farewell — and there are two recordings, `nyob-zoo.mp3` and `nyob-zoo-2.mp3`.
So the index maps a base token to an **array** of takes, and repeated phrases
consume them positionally.

The first version sorted with plain `readdirSync().sort()` and handed out the
takes **backwards**. Cause:

> `-` is 0x2D, `.` is 0x2E — so `nyob-zoo-2.mp3` sorts *before* `nyob-zoo.mp3`.

The comment claimed "sorted so the unnumbered take is first"; the code did the
opposite. Fixed by sorting on the parsed take number:

```js
const takeNo = (token) => { const m = /-(\d+)$/.exec(token); return m ? Number(m[1]) : 1 }
list.sort((a, b) => a.take - b.take)
```

**When ordering carries meaning, sort on the parsed value, never on the string
that happens to contain it.**

### 3. Duplicate phrases broke the React key
`ExamplesStep` keyed rows on `it.hmong`. Two "Nyob zoo" items = duplicate keys,
and both rows shared one audio identity (`wordId`), so playing one lit the
other. Both now key on `${step.id}-${i}`. The list is static and never
reordered, so the index is a safe key here.

A lesson listing the same phrase twice with different senses is **correct
content**, not a data error — the code had to bend, not the lesson.

### Also: nested folders
Paths are now up to four segments (`grammar/conversations/…`). `verify.mjs`
destructured a fixed `[, folder, file]` and produced `undefined`, crashing.
It now takes everything between `grammar/` and the filename as the folder key,
and compares on the **base** token so `nyob-zoo-2` still counts as agreeing with
"Nyob zoo".

## Batch 3 — adjectives, conjunctions, time, numbers, money (226 verified)

Adjectives (25/25), conjunctions (24/24), timeframes (17/19), numbers (10/10),
money (17/18). Audio went 133 → **226 verified**.

Four changes the batch forced:

### 1. The index root moved above `grammar/`
Recordings now live under `vocabulary/` too, so `ROOT` is the audio root and
every `FOLDERS` key carries its own top-level segment
(`grammar/adjectives`, `vocabulary/timeframes`). `verify.mjs` had to stop
assuming a leading `grammar/` segment when deriving the folder key.

### 2. Matching became separator-insensitive
One batch contained `teev-sij`, `tavsu-dua` (half-collapsed), and `tagkis-no`.
Exact-key lookup missed real matches, so comparison now runs through:

```js
export const norm = (s) =>
  s.toLowerCase().replace(/\.\.\./g, ' ').replace(/[?.,!]/g, '').replace(/[\s-]+/g, '')
```

It strips **only** separators, punctuation, and the `...` in split conjunctions
(`txawm ... los` → `txawmlos`). It must never touch letters — a trailing
`-s`/`-b`/`-j` is a **tone marker**, so "hmo" and "hmos" are different words.
Fuzzy-matching there would reintroduce the wrong-audio bug in the one place it
does the most damage: teaching the wrong tone.

That restraint immediately earned its keep — see "hmo vs hmos" below.

`norm` is **exported and shared with `verify.mjs`**. The first run had the
matcher normalizing and the verifier still comparing exact variants, so the
verifier reported phantom mismatches on two entries the matcher had correctly
accepted. **One comparison rule, one place** — two rules drift by definition.

### 3. Two folders, one category
`money` is split across `hmong-money/` and `hmong-how-much/` with different
prefixes, so `buildIndex` merges instead of assigning.

The first attempt merged but still normalized **per folder**, so the second
folder's pass re-processed the first folder's already-converted string entries —
and `x.path` on a string is `undefined`. Every path from the first money folder
silently became `undefined`, and the dry run printed `ok money-duaslas <-
undefined`. Split into collect-then-normalize:

```
PASS 1  every folder pushes raw {take, path}
PASS 2  sort + flatten ONCE, after all folders have contributed
```

**The dry run is what caught it.** A wire-then-check flow would have written 12
`undefined` paths into `vocabulary.js`.

### 4. Duplicate folders, left alone
`vocabulary/adjectives` is a byte-for-byte copy of `grammar/adjectives` (author
keeps it for dataset building), and `vocabulary/time` is an identical copy of
`vocabulary/timeframes`. Neither is in `FOLDERS` — listing them would wire the
same recording under two paths.

Note this is a blind spot in `orphans.mjs`: it matches on **filename**, so a
duplicate folder looks "referenced" because its twin is. It cannot currently
tell you a whole folder is redundant.

## What's still missing
Three words have no recording and are honestly left `null` rather than pointed
at an approximation:

| Word | Hmong | Why |
|---|---|---|
| `pronouns-they-two` | nkawd | never recorded |
| `yog-to-be-located` | nyob | never recorded |
| `time-ib-tag-hmo` | ib tag hmo | recording is `ib-tag-hmo**s**` — a tone difference, not a typo |
| `time-naghmo` | nag hmo | recording is `nag-hmo**s**` — same |
| `money-tus-nqi` | nqi | recording is `tus-nqi`, named after the word **id** not the word |

### "hmo" vs "hmos" — why these two aren't auto-matched
The data says `ib tag hmo` / `nag hmo`; the recordings say `ib-tag-hmos` /
`nag-hmos`. In RPA that final `-s` is a **low tone marker**, so these are
different syllables, not a spelling slip. `norm` deliberately refuses the match.

One of the two is wrong and only a speaker can say which. Silently accepting it
would attach an audibly different tone to the written word — in a tone language,
in an app whose whole point is teaching tone. **Left unwired on purpose.**

`money-tus-nqi` is the opposite problem: the file is named after the word id
(`money-tus-nqi`) while the word itself is just `nqi`. Renaming the file to
`hmong-money-nqi.mp3` wires it with no code change.

*(`yog-to-be-is` was filled in batch 2 — `hmong-yog-to-be-yog.mp3`.)*

The 7 greeting recordings are wired to the **lesson only**. Those phrases still
have no vocabulary category (notes/56), so they can't be drilled in Words or
quizzed — the audio is ready the moment the category exists.

The three `*-yog` phrase files are **not** wasted — they matched the yog-to-be
lesson's `examples` items exactly ("Kuv yog", "Koj yog", "Nws yog"), so they're
wired there. That's the distinction: the **lesson** teaches phrases in context,
the **word bank** drills bare vocabulary. Pointing "Kuv yog" at the word `yog`
would have reintroduced the say-one-thing-show-another bug on purpose.

`action-verbs.js` also has 4 example items (Noj, Haus, Los, Ua) whose words
aren't in the recorded set — left silent.

## Folder typos — now fixed
Two folders were misspelled on disk: `classifers/` (missing an `i`) and
`sib-reciporcals/`. Both were initially left alone so the data matched disk, but
both are now **renamed on disk and in `FOLDERS`** — plus the reciprocal files
themselves, which carried `hmong-sib-reciporcals-` in the filename:

```
grammar/classifers/                 -> grammar/classifiers/
grammar/conversations/sib-reciporcals/hmong-sib-reciporcals-*.mp3
  -> grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-*.mp3
```

⚠️ **The recording pipeline has to match.** If an export recreates the old
spelling, the clips land in a folder nothing reads and go silently 404 — the
notes/42 failure mode exactly. `verify.mjs` catches it; run it after every batch.

Also deleted: `public/assets/audio/vowel/` — a byte-identical duplicate of
`vowels/` (15 files) under a wrong-looking tree (`vowel/double-consonants/`
holding vowel mp3s). Nothing referenced it; confirmed by grep before removing.

## How to extend
1. Drop the new mp3s in `public/assets/audio/<unit>/<group>/`.
2. Add the folder → `[filenamePrefix, categoryId]` entry in `FOLDERS`.
3. Run the matcher **dry** first — it prints every `ok` / `MISS` / unused file.
4. Fix spelling drift at the source (rename the file) rather than adding another
   fallback to `keysFor`. Fallbacks accumulate; consistent filenames don't.
5. Run the wire script, then `verify.mjs`, then build.

## Files
- `src/data/vocabulary.js` — 60 `audioFile` values
- `src/data/lessons/{pronouns,possessive-pronouns,action-verbs,tense-markers,noun-classifiers,pronouns-demonstratives,yog-to-be}.js` — 37 `audio` values
- `public/assets/audio/grammar/**` — 63 recordings
- `instructions/recording-manifest-02.md` — what's recorded vs. outstanding
- `scripts/audio/{match,wire2,verify}.mjs` — the dry-run / wire / verify trio,
  kept in the repo so the next batch doesn't start from scratch. See its README.
