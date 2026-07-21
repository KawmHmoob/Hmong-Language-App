// Section-level "this is beta" banner.
//
// Distinct from WarningRibbon (app-wide, sits in Layout above every page).
// This one is placed BY a section that wants it, so the message can be
// specific about what's unfinished there.
//
// Tokenized (clay/cream), so it themes in light/dark/neon like everything else
// — no raw palette colors. See notes/55.

export default function BetaRibbon({ title = 'Beta', children }) {
  return (
    <div
      role="note"
      className="flex flex-wrap items-start gap-x-3 gap-y-1 rounded-xl border border-clay-600/30 bg-clay-600/10 px-4 py-3 mb-6"
    >
      <span className="inline-flex items-center shrink-0 rounded-full bg-clay-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cream-50">
        {title}
      </span>
      <p className="text-sm text-stone-800 leading-relaxed min-w-0 flex-1">{children}</p>
    </div>
  )
}
