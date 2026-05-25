import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-stone-700 mb-4" aria-label="breadcrumb">
      <ol className="flex flex-wrap gap-1 items-center">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link to={item.to} className="hover:text-amber-900 underline-offset-2 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'font-semibold text-stone-900' : ''}>{item.label}</span>
              )}
              {!last && <span className="text-stone-500">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
