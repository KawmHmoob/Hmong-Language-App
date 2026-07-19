import AudioButton from '../common/AudioButton.jsx'

// The letter tile grid — consonants and vowels. Extracted from Reference.jsx
// so the Learn lessons render letters with the SAME markup as the Reference
// page instead of the generic examples list. One component = one look.
//
// items: [{ letter, sound?, audio? }]
export default function LetterGrid({ items }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {items.map((it) => (
        <div key={it.letter} className="surface p-3 text-center">
          <div className="flex justify-end mb-1">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </div>
          <div className="font-display text-2xl text-clay-700">{it.letter}</div>
          {it.sound && <div className="text-xs text-stone-500 mt-1">{it.sound}</div>}
        </div>
      ))}
    </div>
  )
}
