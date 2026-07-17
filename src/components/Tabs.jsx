import { NavLink } from 'react-router-dom'

// Segmented control for sub-views inside a page (Alphabet, Course, Notebook).
// Same API as always: basePath + tabs [{ id, label }]. NavLink supplies
// aria-current automatically, so screen readers hear the selected segment.
export default function Tabs({ basePath, tabs }) {
  return (
    <div className="inline-flex flex-wrap gap-1 mb-6 p-1 rounded-full bg-cream-100 border border-cream-200">
      {tabs.map((t) => (
        <NavLink
          key={t.id}
          to={`${basePath}/${t.id}`}
          className={({ isActive }) =>
            `px-4 py-2 min-h-[40px] inline-flex items-center text-sm rounded-full transition-colors ${
              isActive
                ? 'bg-cream-50 text-stone-900 font-semibold shadow-warm'
                : 'text-stone-600 font-medium hover:text-stone-900'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}
