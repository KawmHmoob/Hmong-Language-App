# Content Fill — Slice A of the Cleanup Pass

## What
Every `PLACEHOLDER` string in `src/` was replaced with real teaching content across
**11 lesson files**: intro paragraphs completed, every example `note` filled with a
short useful pointer (tone, literal meaning, usage, or common confusion), and every
fake practice step (`Option A…`, answer `Option A`) replaced with a real question
whose `answer` exactly matches one option. One **content error was corrected**:
`Nrhh` was removed from quadruple-consonants (not a standard White Hmong RPA
cluster — the attested set is nplh, ntsh, ntxh). Confident example words were added
to the triple/quadruple consonant tables (Nplooj, Ntses, Hnyav, Nplhaib, Ntshai,
Ntxhais…); uncertain slots were left empty rather than guessed.

This was Slice A of the prompt in [26-cleanup-prompt.md](26-cleanup-prompt.md).
Slices B (dead code/bugs), C (content unification), D (RN folder) are **not run
yet** — the pass stops here for human review of the Hmong.

## Why
- Placeholder lessons were shipping-blockers: a learner hitting "PLACEHOLDER
  practice question / Option A" loses trust instantly.
- Practice answers must *teach*: each question now tests the lesson's single core
  idea (e.g. classifiers → "which classifier for people/animals?"), with
  distractors drawn from the same lesson so wrong answers are plausible.
- **Precision over completeness** governed the Hmong: anything not well-attested
  got a `// TODO-VERIFY:` comment or was left blank. Wrong Hmong in a heritage
  learning app is worse than a visible gap.

## How the content was written (the rules applied)
1. **IDs untouched.** All lesson/step ids are progress keys in users' saved data —
   only strings inside steps changed. (Verified: no id line was edited.)
2. **Intros teach one extra concept** beyond the first sentence that already
   existed: tense markers exist (action verbs), pronoun+classifier+noun pattern
   (possessives), "yog = equals, nyob = located" (yog), question word sits last
   (how much), teens stack on kaum (numbers), demonstrative follows the noun.
3. **Notes are one sentence, concrete**: a literal gloss ("nyob zoo" = live well),
   a collocation ("noj mov"), a homophone warning (peb = three/we, plaub =
   four/hair), or a tone pointer (final -s = low tone).
4. **`audio: ''` stayed empty everywhere** — no fabricated paths (per
   [audio-files.md](../instructions/audio-files.md)).
5. **Uncertainty is visible in the code**: `// TODO-VERIFY: <what to check>`
   sits on the exact line, so the review list below can be regenerated any time
   with `grep -rn "TODO-VERIFY" src/`.

## For native-speaker review (the TODO-VERIFY list)
Run `grep -rn "TODO-VERIFY" src/` to regenerate. As of this pass:

| File | Item | What to check |
|---|---|---|
| how-much.js | "xav tau" note | literal gloss "think-get" |
| numbers.js | Xya note | best plain-English hint for RPA "x" sound |
| pronouns-demonstratives.js | intro + "Ko" note | exact nuance split between "ko" and "ntawd" |
| time.js | intro + "Teev" | "ob teev" as natural clock phrasing; hour vs o'clock |
| time.js | "Tav su" | literal sense |
| time.js | "Nag hmo" | primary sense: yesterday vs last night |
| triple-consonants.js | Hml, Nch, Nph, Nth | need attested example words (left blank / candidates noted) |
| triple-consonants.js | Nkhaus, Plhu | confirm spellings/glosses |
| quadruple-consonants.js | header | confirm "Nrhh" removal was correct |

Also flagged (not TODO-VERIFY comments, but worth eyes):
- **dual-consonants.js**: ~24 `englishSound` descriptions still empty — real content
  work for a native speaker session, noted in the file header.
- **dual-consonants.js**: the existing example "Chiaj" for Ch looks suspect —
  pre-existing data, not touched this pass; verify it alongside the list above.

## How to extend
- Filling a remaining blank (`hmongExample: ''`): add the word + gloss, delete the
  TODO-VERIFY comment on that line.
- New lesson content follows the same three rules: one-sentence concrete notes,
  practice answer exactly matching an option, TODO-VERIFY anything unattested.
- When audio lands, fill `audio:`/`audioFile:` per instructions/audio-files.md —
  the UI upgrades itself (see [22-speak-section.md](22-speak-section.md)).

## Gotchas
- `grep -ri placeholder src/` (case-insensitive) still matches `placeholder=` HTML
  input attributes in Notebook.jsx and Search.jsx — those are real UI props, not
  content. Use case-sensitive `grep -rn "PLACEHOLDER" src/` for the content check.
- Practice options are compared by exact string equality in Lesson.jsx — if you
  reword an option, reword `answer` identically.
- The consonant mini-quizzes still point at the generic `alphabet-consonants` quiz
  (pre-existing); a dedicated triple/quad quiz is future work for quizzes.js.
