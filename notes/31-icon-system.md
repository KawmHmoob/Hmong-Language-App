# Icon System — Priority 2 of the "2011 fix" (+ header polish)

## What
Every emoji and text glyph used as UI chrome is gone, replaced by a single
consistent inline-SVG icon set at `src/components/icons/index.jsx`. Also in this
pass (owner request): the gradient came off the Home "Nyob zoo." hero, and the
header got a professional tidy — the italic tagline became a tracked uppercase
wordmark line, and all header buttons share one hover/radius treatment.

## Why
Emoji-as-icons was the single biggest "2011" tell: they render differently on
every OS, can't take the theme's color, can't change weight for active states,
and read as clip-art next to real typography. A drawn set inherits `currentColor`
— which means the icons are automatically correct in **all three themes** and can
carry section accents (clay on Speak surfaces, blush on Words) with a text class.

## The icon language (rules for new icons)
- **24×24 viewBox**, drawn on the grid with ~2px breathing room
- **stroke="currentColor", strokeWidth 2, round caps + joins**
- fill only as a tint (`fillOpacity ≤ 0.2`) or for solid glyphs (Play)
- **color always comes from the parent** (`className="text-clay-600"`)
- default render size 20; pass `size={13|16|22|32}` to fit context
- one exported component per icon, `aria-hidden` by default (pair with
  `sr-only` text when the icon is the only content, as AudioButton does)

A shared `base()` helper stamps those attributes so each icon is just its paths
— copy any existing icon as a template.

## The replacement map
| Was | Now | Where |
|---|---|---|
| 🔥 / ★ | FlameIcon / StarIcon | StreakBadge, XPBadge, QuizEngine score row, Home & Words stats |
| ♪ | VolumeIcon | AudioButton (both sizes) |
| 🔊 ▶ ⇄ 🔁 👍 | Volume/Play/Swap/Refresh/CheckIcon | PronounceStep buttons (now icon + label) |
| 🎙️ 🃏 | MicIcon / CardsIcon | Home door tiles (with section accents) |
| 🎵 ⚡ 🗂️ 📓 📥 ✅ | MusicNote/Zap/Grid/Notebook/Inbox/CheckCircleIcon | Words hub tiles |
| ◆ 🔒 ✓ | LockIcon / CheckIcon | Learn + Speak Pro/Done badges |
| 🐾 🍚 👨… | **CategoryIcon** (see below) | Vocab grid, list header, Words chips |

**Kept as emoji, deliberately:** 🎉 in the Words session-complete and
caught-up messages — that's *content* (celebration), not chrome. That's the
rule going forward: emoji may celebrate, they may not navigate.

## The CategoryIcon pattern (data stays hand-editable)
`vocabulary.js` keeps its `emoji: '🐾'` fields untouched — plain, hand-editable
data is a house rule, and deleting the field would force every future category
author to draw an SVG. Instead the UI layer holds a map:

```jsx
const categoryIcons = { animals: PawIcon, food: BowlIcon, man: PersonIcon, … }
export function CategoryIcon({ category, size, className }) {
  const Icon = categoryIcons[category?.id]
  if (Icon) return <Icon size={size} className={className} />
  return <span style={{ fontSize: size * 0.9 }}>{category?.emoji}</span> // fallback
}
```
Tradeoff, explicitly: a new category shows its emoji until someone adds a map
entry — **graceful degradation instead of a data migration**. Consumers never
know which they got.

## Header polish (the "more professional" ask)
- Home hero: `text-gradient` removed from "Nyob zoo." — now plain ink serif.
  (The `.text-gradient` utility remains in index.css, unused, for Neon-theme
  moments; delete it if it stays unused.)
- Tagline: *italic sentence* → tracked uppercase micro-label ("LEARN HMONG") —
  italic taglines under logos are a 2011 blog signature; tracked caps read as a
  wordmark.
- All header controls now share `rounded-md` + `hover:bg-stone-900/10`
  (token-based, theme-correct) instead of the washy `hover:bg-white/30`.
- StreakBadge also dropped its hardcoded `bg-orange-200` for cream/clay tokens —
  it was the last theme-escaping color in the header.

## How to extend
- **New icon:** copy an existing one, keep the rules above, export it. Don't
  import from an icon library — the no-packages rule stands, and mixed icon
  DNA (different grids/weights) is visible instantly.
- **New category icon:** add one line to `categoryIcons`.
- **RN note:** these components port almost verbatim — swap `<svg>/<path>` for
  `react-native-svg`'s `<Svg>/<Path>` (already in the RN repo's deps).

## Files
- `src/components/icons/index.jsx` — **new**, the set + CategoryIcon
- Replacements: `StreakBadge`, `XPBadge`, `AudioButton`, `QuizEngine`,
  `PronounceStep`, `Home`, `Words`, `Speak`, `Learn`, `VocabCategoryGrid`,
  `VocabList`
- Header polish: `Navbar.jsx`, `Home.jsx`
- Verification: `grep -rnE "🔥|★|♪|▶|⇄|◆|🔒" src --include=*.jsx` → only 🎉 remains
