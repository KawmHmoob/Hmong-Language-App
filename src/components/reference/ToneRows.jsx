import AudioButton from '../common/AudioButton.jsx'

// The tone rows — marker, name, description, Hmong name, audio. Extracted
// from Reference.jsx so the Tones LESSON renders tones with the SAME markup
// as the Reference page (the generic examples list mangled them).
//
// `heading` defaults to the Reference page's heading; pass null to omit it
// (the lesson supplies its own step title).
//
// items: [{ marker, name, description, example2, audio }]
export default function ToneRows({ items, heading = 'Cov Tsiaj Ntawv Cim' }) {
  return (
    <div className="space-y-2">
      {heading && (
        <h3 className="font-display text-xl text-stone-900">{heading}</h3>
      )}
      {items.map((t) => (
        <div key={t.name} className="surface flex items-center gap-4 p-4">
          <div className="w-10 font-display text-2xl text-clay-700 text-center">
            {t.marker || '–'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-stone-800">{t.name}</div>
            <div className="text-sm text-stone-600">{t.description}</div>
          </div>
          <div className="text-sm text-stone-700 italic hidden sm:block">{t.example2}</div>
          <AudioButton audioSrc={t.audio} wordId={t.name} />
        </div>
      ))}
    </div>
  )
}
