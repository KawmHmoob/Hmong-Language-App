// Building blocks shared by the two password-reset pages: a centered card, a
// labeled input, and a status notice. Tokenized like everything else; the
// notice colors are the success/danger pairs already checked by
// scripts/theme/contrast.mjs. See notes/73.

export function AuthCard({ title, intro, children }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl bg-cream-50 border border-cream-200 p-6 sm:p-8 shadow-warm">
        <h1 className="font-display text-3xl text-stone-900">{title}</h1>
        {intro && <p className="mt-2 text-stone-700 leading-relaxed">{intro}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

// `hint` sits under the label; `error` replaces it and is announced by screen
// readers via aria-describedby + aria-invalid.
export function Field({ id, label, hint, error, ...input }) {
  const describedBy = error || hint ? `${id}-desc` : undefined
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold text-stone-900 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-lg bg-cream-50 border px-3.5 py-3 text-base text-stone-900 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-clay-600 ${
          error ? 'border-danger-500' : 'border-cream-300'
        }`}
        {...input}
      />
      {(error || hint) && (
        <p id={describedBy} className={`mt-1.5 text-sm ${error ? 'text-danger-700' : 'text-stone-600'}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

// role="alert" for errors (interrupts), role="status" for success (polite).
export function Notice({ tone = 'danger', children }) {
  const cls =
    tone === 'success'
      ? 'bg-success-50 border-success-200 text-success-900'
      : 'bg-danger-50 border-danger-200 text-danger-900'
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm leading-relaxed mb-4 ${cls}`}>
      {children}
    </div>
  )
}
