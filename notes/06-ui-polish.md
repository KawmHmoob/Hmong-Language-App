# UI Polish

## What
Cross-cutting bits: skeleton loading on route change, breadcrumbs on nested pages, an empty-state for vocab categories with no words, and a 404 fallback.

## Files
- `src/components/common/SkeletonCard.jsx` — pulsing tan/stone block
- `src/components/common/Breadcrumbs.jsx` — `Home > Vocabulary > Animals` style nav
- `src/pages/NotFound.jsx` — catch-all route
- `EmptyState` (defined inline in `VocabList.jsx`) — illustration + "coming soon" copy
- Skeleton trigger lives in `src/components/Layout.jsx` (`useEffect` on `location.pathname`)

## Why
- **Skeleton on route change (100ms)** — gives the perception of activity even though all data is local. Set on every navigation via `useEffect` on `location.pathname`.
- **Inline EmptyState** — only used in one place; pulling it into its own file would be premature.
- **Breadcrumbs only on deep pages** — top-level pages already have a clear `<h2>` and the navbar; breadcrumbs would be noise.

## Code anatomy

### Route-change skeleton

```jsx
// src/components/Layout.jsx
const location = useLocation()
const [loading, setLoading] = useState(false)

useEffect(() => {
  setLoading(true)
  const t = setTimeout(() => setLoading(false), 100)
  return () => clearTimeout(t)
}, [location.pathname])

return (
  <main>
    {loading ? <SkeletonCard /> : <Outlet />}
  </main>
)
```

The cleanup returned from the effect (`clearTimeout`) prevents the skeleton from getting stuck if you navigate again before 100ms elapses.

### Breadcrumbs API

```jsx
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'

<Breadcrumbs
  items={[
    { label: 'Home', to: '/' },
    { label: 'Vocabulary', to: '/vocabulary' },
    { label: cat.title },                         // last item: no `to` → plain text
  ]}
/>
```

Items with a `to` render as `<Link>`. The last item is always plain text (current page). The component renders nothing else — no container styling beyond margin-bottom.

### EmptyState pattern

```jsx
function EmptyState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-stone-400 bg-white/60 p-10 text-center">
      <div className="text-5xl mb-3">📚</div>
      <h3 className="text-lg font-semibold text-stone-900">Words coming soon</h3>
      <p className="text-sm text-stone-600 mt-1">
        This category is being built. Check back later.
      </p>
    </div>
  )
}
```

It's defined at the bottom of `VocabList.jsx` (not exported) — this is intentional, since it's only used there. If you need empty states in other places, lift it into `src/components/common/EmptyState.jsx` and accept `{ icon, title, message }` as props.

### SkeletonCard

```jsx
// src/components/common/SkeletonCard.jsx
export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-cream-200/60 border border-cream-200 ${className}`}>
      <div className="h-5 w-1/3 bg-cream-300/70 rounded m-4" />
      <div className="h-3 w-2/3 bg-cream-300/50 rounded mx-4 mb-4" />
    </div>
  )
}
```

Use `<SkeletonCard className="h-24" />` to control height. Tailwind's `animate-pulse` is the only animation needed.

### NotFound route

The catch-all is registered last inside the layout route so the navbar and footer still render around it:

```jsx
<Route element={<Layout />}>
  {/* all other routes */}
  <Route path="*" element={<NotFound />} />
</Route>
```

## Where breadcrumbs appear

- `/quiz/:topicId` — Home > Quizzes > <Quiz Title>
- `/vocabulary` — Home > Vocabulary
- `/vocabulary/:categoryId` — Home > Vocabulary > <Category>
- `/vocabulary/:categoryId/:wordId` — Home > Vocabulary > <Category> > <Word>

Add them to a new page by importing `Breadcrumbs` and passing the path you want shown.
