import { useEffect, useRef } from 'react'

// A reusable confirm dialog — replaces window.confirm (which is unstyleable,
// theme-blind, and jarring). Render it always; it shows only when `open`.
//
// Accessibility: role="dialog" + aria-modal, Escape cancels, backdrop click
// cancels, and focus moves to the confirm button on open (and restores on
// close). Body scroll is locked while it's up.
//
// Usage:
//   const [open, setOpen] = useState(false)
//   <ConfirmModal open={open} title="…" message="…" confirmLabel="Quit"
//     onConfirm={() => { setOpen(false); doIt() }} onCancel={() => setOpen(false)} />

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)
  const restoreRef = useRef(null)

  useEffect(() => {
    if (!open) return
    // remember what was focused, move focus into the dialog, lock scroll
    restoreRef.current = document.activeElement
    confirmRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      // restore focus to the trigger so keyboard users aren't dumped at the top
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus()
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* backdrop — click to cancel */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="relative surface-elevated w-full max-w-sm p-6 text-center">
        <h2 id="confirm-title" className="font-display text-2xl text-stone-900 mb-2">
          {title}
        </h2>
        {message && <p className="text-stone-700 mb-6 leading-relaxed">{message}</p>}

        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn-ghost">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={destructive ? 'btn-danger' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
