# Intro Formatting — Subheads and Example Lines

## What
`IntroStep` now understands two opt-in prefixes inside a lesson's `body` array:

```js
'## Morning and evening'      → a subheading
'> 6:30 a.m. — Rau teev pebcaug sawv ntxov'  → an indented example line
```

Everything else renders as a plain paragraph, exactly as before.

## Why
`body` was a flat `string[]` rendered as identical `<p>` tags. Fine for a
four-paragraph intro. The time lesson runs to ~25 entries, and the result was an
undifferentiated column where:

- section breaks were invisible — every idea looked equally important
- one-word entries (`'Example:'`) each became their own paragraph
- Hmong forms were buried mid-sentence, so the **pattern being taught** —
  hour → `teev` → minutes → a.m./p.m. — never visually emerged

The content was right; the rendering flattened it.

## The implementation
```jsx
if (p.startsWith('## ')) return <h4 …>{p.slice(3)}</h4>
if (p.startsWith('> '))  return <p className="border-l-2 border-clay-600/40 pl-4 …">{p.slice(2)}</p>
return <p key={i}>{p}</p>
```

Three properties worth keeping:

- **Backwards compatible.** Grepped first: no existing lesson string begins with
  `## ` or `> `, so every other intro renders byte-identically. A formatting
  feature that silently reflows existing content isn't opt-in.
- **Not markdown.** Two prefixes, handled literally, no parser and no
  dependency. The moment this needs bold/links/lists, that's the signal to
  reconsider — but two prefixes don't justify a markdown pipeline.
- **Tolerates holes.** `if (typeof p !== 'string') return null` — a stray comma
  in a data file produces a sparse array (`['a', , 'b']`), which is easy to
  write and previously rendered a blank paragraph. One already existed.

The `>` line uses a left border in the accent color rather than italics or
quotes: the content is Hmong the learner should *say*, and a left rule reads as
"specimen" where italics read as "aside".

## Rewriting the time lesson
The lesson body was restructured into five sections — the pattern, the `mus`
variant, `thiab`, morning/evening, and `teev` for duration.

**Every Hmong string is unchanged.** Only the English framing was reorganised,
and each Hmong form was lifted onto its own `> ` line. This matters: rewriting
prose is editing, rewriting the target language is authoring, and the second one
needs a native speaker (notes/27). The `// TODO-VERIFY` markers were preserved
and two more added.

The one-word `'Example:'` entries disappeared — a `> ` line is self-evidently an
example, so the label was pure scaffolding.

## Flagged, not fixed
Three items where the Hmong looks inconsistent. Left as written, marked
`TODO-VERIFY`, because each is a language question:

| In the lesson | Question |
|---|---|
| `plaub teev tsuas ntuj` | `tsuas ntuj` vs `tsaus ntuj` used everywhere else — likely the same word |
| `Kuv yuav muag koj pebcaug feeb…` | `muag` is "to sell"; the gloss says "give", which would be `muab` |
| `Tamsim nov` | vs `tam sim no`; the drill was aligned to the lesson's spelling |

Plus the three lesson↔word-bank spellings already open in notes/58
(`teev sij`, `tav su dua`, `yav tsaus ntuj`).

## How to extend
- Long intro? Break it with `## `. If a section needs more than ~4 paragraphs,
  it probably wants to be its own step.
- Adding a third prefix? Prefer a new **step kind** — `intro` is for prose, and
  a body string that needs a table or a grid is describing a different shape
  (see `letters` / `tones`, notes/47).

## Files
- `src/pages/Lesson.jsx` — `IntroStep`
- `src/data/lessons/time-explained.js` — the rewritten body
- `src/data/wordFamilies.js` — `Tamsim nov` alignment, +1 phrase
