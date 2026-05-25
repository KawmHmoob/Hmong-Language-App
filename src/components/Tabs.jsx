import { NavLink } from 'react-router-dom'

export default function Tabs({ basePath, tabs }) {
  return (
    <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-md bg-cream-100 border border-cream-200 w-fit">
      {tabs.map((t) => (
        <NavLink
          key={t.id}
          to={`${basePath}/${t.id}`}
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium rounded transition ${
              isActive
                ? 'bg-cream-50 text-clay-700 shadow-warm'
                : 'text-stone-600 hover:text-clay-700'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}
