# Future Implementations

Backlog of features deliberately deferred from the current build. Each entry says **what**, **why it was deferred**, and **rough shape of the work** so picking it up later is straightforward.

## Additional quiz / exercise types

Current quiz engine ([01-quiz-engine.md](01-quiz-engine.md)) only supports `multiple-choice` and `matching`. The following exercise types are needed before the app can claim to teach *production* (not just recognition):

### 1. Typing / production
- Show English, learner types Hmong (or vice versa).
- Accept-set matching: lowercase, strip diacritic noise, allow alternate spellings.
- New question type: `'typing'`.

### 2. Listening / dictation
- Play audio, learner picks the matching word OR types what they heard.
- Depends on real audio files landing first ([05-audio-placeholder.md](05-audio-placeholder.md)).
- New question types: `'listening-mc'`, `'dictation'`.

### 3. Sentence ordering
- Tokens shown out of order, learner drags/taps them into the correct order.
- Best for grammar lessons (word order, tense markers).
- New question type: `'order'`. Dataset shape: `{ tokens: [...], correctOrder: [...] }`.

### 4. Fill-in-the-blank (cloze)
- Sentence with one word missing; learner types it or selects from options.
- Two variants: `'cloze-typing'` and `'cloze-mc'`.

### Data-model implications
When implementing, extend `getQuizDataset` in [src/data/quizzes.js](../src/data/quizzes.js) to return a typed payload per question type, and add a per-type renderer in `QuizEngine.jsx`. Keep `recordQuizScore` shape stable so historical scores remain comparable.

## Dialogue / conversation lessons

Real language learning is anchored in scenarios ("at the market", "meeting family", "asking directions"), not isolated phrase lists. Current Everyday tab in [src/data/course.js](../src/data/course.js) is a flat list of phrases — useful as reference but not as a teaching unit.

### Shape of the work
- New data file: `src/data/dialogues.js` keyed by scenario.
- Each dialogue: `{ id, scenario, participants, turns: [{ speaker, hmong, english, note? }] }`.
- New page/component to render a dialogue with audio per turn, hide-translation toggle, and a comprehension mini-quiz at the end.
- Tie into the lesson-step model (see lessons.js) as a step type `'dialogue'`.

### Scenarios to seed first
- Greetings & introductions
- Family & clan terms
- At a meal
- Shopping / market
- Asking for directions
- Phone call basics
- Meeting an elder (politeness register)

## Cultural / kinship modules

Hmong is deeply tied to clan structure and kinship terms — generic "uncle/aunt" doesn't map cleanly. Eventually add a dedicated module covering:
- Clan names & their significance
- Maternal vs paternal kinship terms
- Honorifics & speech levels with elders

Deferred until the core lesson runtime is solid.
