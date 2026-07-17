# Cleanup & Content-Fill Prompt (for Fable 5)

A paste-ready prompt for the "clear everything up" pass: fill every PLACEHOLDER with
real Hmong content, kill dead code and known bugs, unify the duplicated content data,
and prep the React Native migration folder.

**How to use:** paste the fenced block into Fable 5 with this repo open. Run it slice
by slice (it's ordered) — approve Slice A's content before letting it continue, since
that's where language accuracy matters. After it finishes, review every `TODO-VERIFY`
marker yourself or with a native speaker before shipping.

---

````text
# ROLE
You are two people at once: a senior React engineer, and a CAREFUL editor of Hmong
language content written in RPA (Romanized Popular Alphabet). Precision beats
completeness: wrong Hmong is worse than missing Hmong.

# CONTEXT
Vite + React 18 app teaching Hmong ("Kawm Hmoob"). Conventions you MUST follow:
- Read notes/README.md and notes/00-architecture.md first. House rules: no new npm
  packages; plain hand-editable JS data in src/data/; state only through the four
  contexts' hooks; Tailwind tokens only (never hex — see notes/24).
- TEACHING NOTES ARE MANDATORY: every slice ships with a numbered note in notes/
  (what/why/how/how-to-extend) + a README.md index line. Work without its note is
  incomplete.

# LANGUAGE ACCURACY RULES (highest priority)
- Dialect: White Hmong (Hmoob Dawb) in standard RPA orthography.
- Only write Hmong you are confident is correct (common, well-attested words and
  phrases). For anything you are less than certain about — spelling, tone letter,
  classifier choice, cultural note — still write your best version BUT mark the line
  with a trailing comment: // TODO-VERIFY: <what to check>
- NEVER invent example sentences with complex grammar to seem thorough. Short and
  right beats long and wrong.
- End your run with a "For native-speaker review" list of every TODO-VERIFY.

# HARD CONSTRAINTS
- IDs ARE SAVED USER DATA. Lesson ids, step ids, quiz ids, word ids, and speak phrase
  ids are stored in users' progress (completedSteps, quizScores, vocabSchedule).
  NEVER rename or delete an existing id. New content gets new ids.
- Do not change component behavior except the explicit bug fixes in Slice B.
- Keep all existing routes working (redirects if anything moves).
- Run `npm run build` after every slice; it must pass.

# SLICE A — Fill every placeholder (do this first, alone, then stop for review)
1. `grep -ri "PLACEHOLDER" src/` — enumerate every hit before editing.
2. For each lesson in src/data/lessons/*.js: replace placeholder intro paragraphs
   with real teaching text (2-4 sentences: what the concept is, why it matters, one
   concrete usage note); replace placeholder `note` fields on examples with a short
   genuinely-useful note (tone pointer, usage register, common mistake); replace
   placeholder practice steps with a real question, 4 plausible options, correct
   `answer` matching one option exactly.
3. Empty `audio: ''` fields stay empty — audio is recorded separately
   (instructions/audio-files.md). Do NOT fabricate audio paths.
4. Also fill placeholder-quality content anywhere else grep finds it (course.js etc.).
5. Deliverable: zero grep hits for PLACEHOLDER, the TODO-VERIFY review list, and the
   teaching note. STOP after this slice for human review of the Hmong.

# SLICE B — Dead code + known bugs
1. Delete src/pages/Review.jsx (unrouted since /review became a redirect — verify
   nothing imports it first).
2. Fix Lesson.jsx ExamplesStep: the audio button does `new Audio(it.audio).play`
   (missing parens, bypasses caching, renders even when audio is ''). Replace with
   the shared AudioButton component (src/components/common/AudioButton.jsx) so
   missing audio shows the disabled state.
3. Grep for remaining hardcoded colors (`text-[#`, `bg-[#`, hex literals in JSX) and
   replace with theme tokens per notes/24. Do not touch index.css variable blocks.
4. Grep for links to dead routes; fix any stragglers.
5. Deliverable: build passes + teaching note documenting each removal/fix and why.

# SLICE C — Unify the content data (the big one; read notes first)
Problem: the same phrase lives in up to four files (course.js everyday lists,
src/data/speak.js, lesson example items, vocabulary.js) with separate audio/gloss
fields. Goal: ONE canonical store, other files reference it.
1. Create src/data/phrases.js: canonical entries
   { id, hmong, english, audio: '', tip?, tags: [] } — seed it by merging the
   duplicates (course everyday + speak.js phrases). Keep ALL existing ids somewhere:
   speak.js phrase ids must keep working (progress keys!), so speak.js entries
   become { ref: '<phrase-id>', id: '<existing-speak-id>', tier? } style references,
   with a resolver helper. Design the exact shape yourself, but the invariants are:
   (a) one place to add/fix a phrase + its audio, (b) zero broken progress keys,
   (c) consumers (Speak pages, Course page, Home phrase-of-the-day) keep working.
2. Update consumers + the helper functions; keep helper APIs stable where possible.
3. vocabulary.js and lesson files stay as-is this pass (they're word/pedagogy scoped)
   — note the future path in the teaching note instead of forcing it now.
4. Deliverable: build passes, Speak/Course/Home visually unchanged, teaching note
   explains the reference model with a diagram.

# SLICE D — React Native migration folder
1. Create rn-migration/ at repo root: README.md (migration checklist mapping every
   current feature → its RN status/plan: exists in KawmHmoob-rn / needs port / web-
   only API to replace), plus tokens.md exporting the three theme variable sets from
   src/index.css as copy-pasteable JS theme objects (see notes/24 RN section).
2. Do NOT modify the KawmHmoob-rn repo; this folder is planning artifacts only.
3. Deliverable: the folder + index it from notes/README.md.

# PROCESS
- Restate your plan + file list per slice before editing. One slice at a time, build
  between slices, STOP after Slice A for content review.
- Call out every assumption and every deviation from these instructions.
- Finish with: summary per slice, the consolidated TODO-VERIFY list, and confirmation
  that `grep -ri PLACEHOLDER src/` is clean and ids were preserved.
````

---

## Notes for you before running it
- **Slice A is the one to babysit.** The model will write real Hmong — most common
  phrases it will get right, but you (or a native speaker) must check the
  TODO-VERIFY list before this ships. Treat unverified Hmong as unshippable.
- Slice C is the riskiest technically (see [note on content duplication in the
  organization discussion]); if you'd rather do it yourself later, just delete
  Slice C from the prompt — A, B, D stand alone.
- The id-stability constraint exists because progress lives in
  localStorage/Supabase keyed by these ids ([03-progress-tracking.md](03-progress-tracking.md),
  [16-sync-to-async-migration.md](16-sync-to-async-migration.md)).
