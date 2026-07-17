# Navigation & Visual System Prompt (for Fable 5)

The "it looks like 2011" pass. A paste-ready prompt to fix the navigation (primary
ask) and replace the specific visual patterns that date the app — grounded in a real
diagnosis of this codebase rather than generic "make it modern."

**How to use:** paste the fenced block into Fable 5 with the repo open. Run it in the
priority order given; review after Priority 1 (nav) before letting it continue.

## The diagnosis this prompt is built on
What actually reads as dated here (verified by reading the code, not vibes):
1. **Emoji as icons** (🔥 ✨ 🎙️ 🃏 ♪ ★ 🐾) — the single biggest amateur tell.
2. **One `.surface` bordered box for every card on every page** — Bootstrap-panel
   flatness; no elevation hierarchy.
3. **Hairline `divide-y` text rows** with no leading anchor — 2011 table look.
4. **Underlined text links as navigation** ("Back", "Skip →").
5. **Glyph characters as buttons** (`♪`, `▶`, `⇄`) instead of a real icon set.
6. **Flat type scale** — the Hmong text, the actual product, is never the hero.
7. **No section identity** — Speak and Words are visually identical.
8. **IA**: two tabs + a "More" drawer hiding seven overlapping destinations.

---

````text
# ROLE
You are a senior product designer + React engineer. You are fixing a Hmong language-
learning app ("Kawm Hmoob") whose owner says the UI "looks straight out of 2011."
They are right, and the causes are specific — they are listed below. Fix those causes.
Do not do a generic restyle.

# READ FIRST
notes/README.md, notes/00-architecture.md, notes/21-two-section-nav.md (current nav),
notes/24-theming-and-polish.md (the token engine — CRITICAL), notes/25-neon-theme-and-
bento-home.md (bento patterns already in place).

# STACK & HARD RULES (violating these breaks the app)
- Vite + React 18 + react-router-dom v7. Tailwind only. NO new npm packages —
  no icon library, no animation library. Build icons as inline SVG components.
- COLORS: never write a hex or a `dark:` variant. Use semantic tokens
  (bg-cream-50 = surface, text-stone-900 = ink, clay = accent). Three themes
  (light/dark/neon) ride on these — a hardcoded color breaks two of them silently.
- State only through existing hooks (useProgress, useAuth, useSubscription).
  Do not change context shapes or data shapes in src/data/.
- IDs ARE SAVED USER DATA (lesson/step/quiz/word/phrase ids live in users'
  progress). Never rename or delete an id.
- Keep every existing route working; add redirects if anything moves.
- Accessibility is not optional: keyboard-reachable, visible focus, aria labels,
  respects prefers-reduced-motion (a global kill-switch exists in index.css).
- `npm run build` must pass after every priority.
- TEACHING NOTES ARE MANDATORY: each priority ships a numbered note in notes/
  (what / why / how the code works / how to extend) + a README.md index line. The
  owner relearns and re-implements from these. Work without its note is incomplete.

# PRIORITY 1 — NAVIGATION (the main ask; do this first, then STOP for review)
Current state: PrimaryNav.jsx renders a desktop left rail + a mobile bottom tab bar
with exactly two primary tabs (Speak, Words) plus a "More" button opening a sheet
containing Home, Learn, Alphabet, Course, Vocabulary, Notebook, Quiz.

Problems to solve:
a) DISCOVERY: seven destinations are hidden behind "More." Users cannot find what
   they cannot remember. Several of those overlap (Alphabet/Course/Learn are all
   "study"; Vocabulary/Quiz/Notebook are all "words").
b) IDENTITY: Speak and Words look identical — no color, no icon language, no sense
   of place.
c) ORIENTATION: nothing tells the user where they are beyond a small dot.

Your job:
1. Propose an information architecture of THREE OR FOUR primary destinations that
   covers everything currently reachable, with the overlapping pages folded in as
   sub-views (tabs/segments) rather than siblings. Speak and Words must remain
   first-class. Home and Learn are the obvious candidates for the other slots.
   PRESENT THE IA AND YOUR REASONING BEFORE WRITING CODE.
2. Rebuild the nav around it:
   - Mobile: a bottom tab bar that feels 2026 — real icons, active state with a
     filled/weight change plus a moving indicator (CSS transition, not a library),
     safe-area aware, thumb-comfortable hit targets (min 44px).
   - Desktop: a rail that is genuinely useful — icon + label, active state, and
     section color, not a stack of bordered boxes.
   - Give each section an IDENTITY: its own icon and its own accent token usage,
     applied consistently in nav, section hero, and active states.
3. Orientation: make the current section unmistakable. Sub-views within a section
   use a segmented control (build one; there is a primitive to improve in
   src/components/Tabs.jsx), not a second nav bar.
4. Keep the slim top header for identity/status (logo, XP, streak, theme, account).
   Do not re-grow it into a link farm.

# PRIORITY 2 — KILL THE EMOJI, BUILD AN ICON SYSTEM
Emoji currently stand in for icons in: StreakBadge (🔥), XPBadge (★), AudioButton
(♪), Home stat/door tiles (🔥 ✨ 🎙️ 🃏), Words hub tiles (🎵 ⚡ 🗂️ 📓), Speak/quiz
buttons (▶ ⇄ 🔊), and vocabulary category data (emoji: '🐾' etc. in src/data/).
1. Create src/components/icons/ — one consistent inline-SVG set: 24x24 viewBox,
   currentColor stroke, strokeWidth 1.75-2, round caps/joins. Export one component
   per icon. This is the app's icon language; document it.
2. Replace every emoji-as-icon in components with set icons.
3. For src/data/vocabulary.js category `emoji` fields: DO NOT delete the data field
   (hand-editable data is a house rule and other things may read it). Instead map
   category id → icon component in the UI layer, falling back to the emoji if no
   icon exists. Explain the tradeoff in your note.
4. Emoji may REMAIN where they are content/celebration (e.g. a 🎉 in a success
   message), not chrome. Say where you kept them and why.

# PRIORITY 3 — SURFACE, DEPTH, RHYTHM
Right now `.surface` (cream fill + 1px border) is on literally every card, so
nothing is more important than anything else.
1. Introduce a small, documented elevation ladder in index.css @layer components —
   e.g. flat/raised/focal — differing by border+shadow+background, all token-based
   and correct in all three themes. Replace blanket `.surface` usage with the right
   rung per context. Do not add a fourth rung "just in case."
2. Kill the hairline `divide-y` list look: give list rows a leading anchor (icon,
   index numeral, or status dot), real vertical rhythm, and a hover/press state.
   Lesson examples (ExamplesStep in Lesson.jsx), TodayCard, and vocab lists are the
   worst offenders.
3. Replace underlined text links used as navigation ("Back", "Skip →", prev/next on
   /speak/:id) with proper icon/pill buttons.

# PRIORITY 4 — LET THE LANGUAGE BE THE HERO
This app teaches Hmong; the Hmong text should be the most beautiful thing on screen.
1. Establish a real type scale with contrast: oversized Fraunces for Hmong content,
   small uppercase tracked labels for meta, tabular numerals for stats. Document the
   scale.
2. On learning surfaces (Speak practice, flashcards, lesson examples, phrase of the
   day), make the Hmong dramatically larger than the English gloss and give tone
   tips/notes a distinct, quieter treatment.
3. Progress: replace thin rectangular bars with something considered (a ring, or a
   segmented bar) where it is a focal metric; keep a bar where it is incidental.
   The quiz results ring in QuizResults.jsx is a starting point.

# PRIORITY 5 — MOTION & STATES (restraint)
1. Transitions on state change, not decoration: nav indicator slide, progress fill,
   card press, correct/incorrect answer feedback, session-complete celebration.
2. CSS transitions/keyframes only (no animation library). Everything must degrade
   under prefers-reduced-motion.
3. Upgrade empty states and skeletons (SkeletonCard exists) so they have the same
   personality as the rest — an empty state is a design surface, not an apology.

# KEEP — do not "modernize" these away
- The warm cultural identity: cream/clay/seafoam palette, Fraunces + Inter. This is
  a boutique heritage app, NOT a generic SaaS dashboard. Modern ≠ grey + purple.
- The three-theme token engine. Every change must look right in light, dark, AND
  neon — check all three before declaring a priority done.
- The two-front-door concept (Speak / Words) from notes/21.
- All existing functionality, progress logic, and the paywall.

# REACT NATIVE CONSCIOUSNESS
This app migrates to Expo/React Native later (see notes/24 RN section, rn-migration/
if present). Prefer patterns that port: flexbox layouts, token objects, inline SVG
(react-native-svg exists there), transform/opacity animations. Avoid web-only tricks
(backdrop-filter beyond the existing .glass, CSS grid where flex would do, hover as
the ONLY affordance — mobile has no hover). Note anything web-only you rely on.

# DELIVERABLES
1. Priority 1: the IA proposal + rebuilt nav + segmented control + section identity.
2. Priority 2: src/components/icons/ + every chrome emoji replaced.
3. Priority 3: elevation ladder + list rows + link buttons.
4. Priority 4: type scale + language-forward learning surfaces + progress upgrade.
5. Priority 5: motion + empty/loading states.
6. A numbered teaching note per priority, indexed in notes/README.md.

# PROCESS
- State your IA proposal and file list BEFORE any code. STOP after Priority 1 for
  human review — the owner must approve the IA before the rest is built on it.
- One priority at a time; `npm run build` between them; verify all three themes.
- Work in vertical slices (one screen fully right) over touching everything shallowly.
- Call out every assumption and every deviation.
- Finish with: what changed per priority, what you deliberately left alone, and any
  web-only pattern that will need an RN answer later.
````

---

## Notes for you before running it
- **Priority 1 is the one to babysit.** The IA decision (3–4 destinations, what folds
  into what) is a product call, not a styling call — make Fable justify it and approve
  it yourself before it builds on top.
- **Priority 2 is the biggest visual win per line changed.** If you only run one
  priority, run that one: killing emoji-as-icons instantly removes the amateur read.
- The `emoji:` fields in `src/data/vocabulary.js` are deliberately kept (hand-editable
  data is a house rule) — the prompt asks for a UI-layer icon map with emoji fallback
  instead of a data migration.
- Verify in **all three themes** after each priority; a hardcoded color breaks two of
  them silently.
