import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '../icons/index.jsx'

// Breadcrumb trail + an explicit "Back" button that targets the page's PARENT
// in the tree. The parent is the nearest ancestor crumb that has a `to` (the
// current page is the last item and usually has none). Any page that renders
// Breadcrumbs — i.e. every child page — gets the back button for free.
//
// Why link to the parent crumb, not browser back(-1): the tree parent is
// predictable. history.back() can land anywhere the user came from (a deep
// link, a search result, another section), which isn't "up" — it's "wherever."
export default function Breadcrumbs({ items }) {
  const parent = items.slice(0, -1).reverse().find((it) => it.to)

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
      {parent && (
        <Link
          to={parent.to}
          aria-label={`Back to ${parent.label}`}
          className="inline-flex items-center gap-1 text-md font-medium text-stone-700 hover:text-clay-700 transition-colors shrink-0"
        >
          <ArrowLeftIcon size={16} />
          Back
        </Link>
      )}

      {parent && <span className="text-stone-300" aria-hidden="true">|</span>}

      <nav className="text-md text-stone-700 min-w-0" aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-1 items-center">
          {items.map((item, i) => {
            const last = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-1">
                {item.to && !last ? (
                  <Link
                    to={item.to}
                    className="hover:text-clay-700 underline-offset-2 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={last ? 'font-semibold text-stone-900' : ''}>{item.label}</span>
                )}
                {!last && <span className="text-stone-500" aria-hidden="true">/</span>}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
