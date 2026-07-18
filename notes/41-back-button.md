# Back Button — built into Breadcrumbs

## What
Every child page (anything nested in a tree) now shows a **"← Back"** button that
goes to its **parent**. It's baked into the `Breadcrumbs` component, so any page
that renders breadcrumbs gets it for free — no per-page wiring.

## Why here, and why the parent (not history.back)
- **In Breadcrumbs, because the trail already encodes the tree.** The parent is
  just "the nearest crumb with a link." Putting the button anywhere else would
  mean re-deriving the hierarchy each page already declares.
- **Link to the parent crumb, NOT `history.back(-1)`.** Browser-back goes to
  *wherever you came from* — a deep link, a search result, another section, an
  external referrer. That is not "up the tree." A deep-linked lesson with no
  history would have a dead back button. Targeting the parent crumb is always
  correct and predictable.

```js
// the parent = last ancestor crumb that has a `to` (current page is last, no `to`)
const parent = items.slice(0, -1).reverse().find((it) => it.to)
```
`.slice(0, -1)` drops the current page; `.reverse().find(has to)` walks up to the
nearest linked ancestor. No parent (e.g. a one-level trail) → no button renders.

## Coverage
Automatic on the 8 content pages that already had breadcrumbs — Lesson, Unit,
SpeakPhrase, WordsSession, VocabCategoryGrid, VocabList, WordDetail, QuizEngine —
plus **Notebook**, which got breadcrumbs (`Home › Words › Notebook`) in this pass
so it'd qualify.

**Deliberately excluded:** Settings, Search, Account, Login, Register. They're
top-level utility pages reached from the persistent header, not tree children —
there's no "parent" to go back to, and the header is always there to leave by.
Adding a back button would just resurrect the history.back ambiguity above.

## Also fixed here
Breadcrumbs used `hover:text-amber-900` — a default-Tailwind amber the styling
system bans (notes/07/24). Swapped to `hover:text-clay-700` (token). The trail's
`/` separators and the new divider are `aria-hidden`, and the back link carries
`aria-label="Back to {parent}"` so screen readers announce the destination.

## How to extend
- **New child page:** render `<Breadcrumbs items={[…]} />` with the full trail
  ending in the current page (no `to` on the last item). Back appears automatically.
- **Want a page to NOT have Back:** don't give it breadcrumbs, or make its trail a
  single item. It's opt-in by virtue of being a tree.
- **RN note:** React Navigation supplies a native header back button per screen;
  this component is web-only and won't port — the RN side gets Back from the
  navigator, not from breadcrumbs.

## Files
- `src/components/common/Breadcrumbs.jsx` — Back button + amber→clay fix
- `src/pages/Notebook.jsx` — breadcrumbs added (so it gets Back)
