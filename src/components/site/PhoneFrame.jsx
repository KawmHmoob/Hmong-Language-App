import { PhoneIcon } from '../icons/index.jsx'

// A phone-shaped frame around one app screenshot — or, while the screenshot
// hasn't been added yet, a labeled placeholder of the same shape. Which one is
// decided by `screen.src` in data/showcase.js; nothing here needs editing.
//
// The bezel is `stone-900`, which INVERTS per theme (dark ink in light mode,
// light ink in dark/neon). That's intentional: the frame always contrasts with
// the page around it instead of vanishing into a dark background.
export default function PhoneFrame({ screen, className = '', priority = false }) {
  return (
    <figure className={className}>
      <div className="relative mx-auto aspect-[9/19.5] w-full rounded-[2.25rem] border-[9px] border-stone-900 bg-stone-900 shadow-2xl overflow-hidden">
        <span aria-hidden="true" className="absolute top-1.5 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-stone-900 z-10" />
        {screen.src ? (
          <img
            src={screen.src}
            alt={`Kawm Hmoob app: ${screen.label} screen`}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover rounded-[1.6rem]"
          />
        ) : (
          <div className="h-full w-full rounded-[1.6rem] bg-cream-100 grid place-items-center p-4">
            <div className="text-center text-stone-600">
              <PhoneIcon size={30} className="mx-auto mb-2 text-clay-700" />
              <p className="font-display text-lg text-stone-800">{screen.label}</p>
              <p className="text-xs mt-1">Screenshot coming soon</p>
            </div>
          </div>
        )}
      </div>
      {screen.caption && (
        <figcaption className="mt-3 text-center text-sm text-stone-700">{screen.caption}</figcaption>
      )}
    </figure>
  )
}
