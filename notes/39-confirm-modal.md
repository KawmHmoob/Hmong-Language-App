# ConfirmModal — replacing window.confirm

## What
A reusable confirmation dialog at `src/components/common/ConfirmModal.jsx`, and a
`.btn-danger` utility for destructive actions. First use: the **"Quit quiz?"**
confirmation in `QuizEngine` (was a raw `window.confirm`).

## Why
`window.confirm` works but is wrong for a polished app:
- **Unstyleable** — a grey OS chrome box that ignores the whole theme system.
- **Blocking** — it freezes the JS thread; nothing behind it can update.
- **Jarring** — it reads as "something broke," not "here's a choice."

A real modal is themed, non-blocking, and (the part `window.confirm` can't do)
**accessible in the ways screen-reader and keyboard users need**.

## How it works
Render it always; it shows only when `open`:
```jsx
const [open, setOpen] = useState(false)
<ConfirmModal
  open={open}
  title="Quit quiz?"
  message="…won't be saved."
  confirmLabel="Quit quiz" cancelLabel="Keep going"
  onConfirm={() => { setOpen(false); doIt() }}
  onCancel={() => setOpen(false)}
/>
```

The accessibility work — the reason to have a shared component rather than a
one-off `<div>` — all lives in one `useEffect` that runs while `open`:
- **`role="dialog"` + `aria-modal="true"` + `aria-labelledby`** so assistive tech
  announces it as a modal and reads the title.
- **Focus moves to the confirm button** on open, and **restores to the trigger**
  on close — a keyboard user isn't dumped back at the top of the page.
- **Escape cancels**; **backdrop click cancels**.
- **Body scroll locks** (`overflow: hidden`) while it's up, restored on close.

Because every dialog in the app now flows through this, those guarantees are
made once, not re-litigated per feature.

### The frosted backdrop
`bg-stone-900/50 backdrop-blur-sm` — a themed scrim (stone-900 is ink in both
light and dark), not a hardcoded black. The card is `surface-elevated`, so the
dialog matches every other raised surface in whatever theme is active.

### .btn-danger — the one intentional hardcode
```css
.btn-danger { @apply … bg-red-600 text-white …; }
```
`red-600` / `white` are deliberately **theme-independent**. A warning must read
the same in light, dark, and neon — and a tokenized text color would flip to
*dark-on-red* in dark mode (because `cream-50` inverts). This is the rare case
where NOT tokenizing is the correct call; it's commented as such in `index.css`.

## How to extend
- **Any confirm/delete prompt:** drop in `<ConfirmModal>` with `open` state
  instead of `window.confirm`. Set `destructive={false}` for a non-scary action
  (it swaps `btn-danger` → `btn-primary`).
- Candidates that still use `window.confirm` or should confirm and don't: check
  Notebook (note deletion) and account actions.

## Gotchas
- It's not portaled — it renders inline but uses `fixed inset-0 z-50`, so it
  escapes its parent visually. If a future ancestor sets a stacking context that
  traps it, switch to a portal then.
- **RN note:** React Native has `Modal` built in and `Alert.alert()` for exactly
  this; the accessibility concerns are handled by the platform. This component is
  web-only — on the Expo side use `Alert.alert` or `<Modal>`.

## Files
- `src/components/common/ConfirmModal.jsx` — **new**, the dialog
- `src/index.css` — `.btn-danger` utility
- `src/pages/QuizEngine.jsx` — `window.confirm` → `<ConfirmModal>` (quit flow)
