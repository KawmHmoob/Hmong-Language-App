import Breadcrumbs from './Breadcrumbs.jsx'

// Shared frame for the Privacy Policy and Terms pages, so both read as one
// consistent document set. `updated` is a plain date string.
export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />

      <h1 className="font-display text-4xl sm:text-5xl text-stone-900 mb-2">{title}</h1>
      <p className="text-sm text-stone-600 mb-6">Last updated: {updated}</p>

      {/* Plain-language notice. This is not boilerplate to hide — it's the
          honest framing the whole app takes toward data. */}
      <p className="text-sm rounded-lg bg-cream-100 border border-cream-300 text-stone-700 px-4 py-3 mb-8 leading-relaxed">
        Kawm Hmoob is an early project built by one person. This document
        describes how things work today and will be updated as the app grows.
        It’s written to be readable, not to hide anything in fine print.
      </p>

      <div className="space-y-7 text-stone-800 leading-relaxed">{children}</div>
    </div>
  )
}

// A titled section — keeps both documents visually uniform.
export function Section({ heading, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-stone-900 mb-2">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
