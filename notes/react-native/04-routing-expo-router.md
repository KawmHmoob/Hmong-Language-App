# Routing — `react-router-dom` to Expo Router

Expo Router is file-based, like Next.js. Every file under `app/` is automatically a route.

## Route mapping

| Old route (in `App.jsx`) | New file in `app/` |
|---|---|
| `/` | `app/index.jsx` |
| `/alphabet` (redirect) | `app/alphabet/index.jsx` (renders `<Redirect>`) |
| `/alphabet/:tab` | `app/alphabet/[tab].jsx` |
| `/course` (redirect) | `app/course/index.jsx` |
| `/course/:tab` | `app/course/[tab].jsx` |
| `/learn` | `app/learn/index.jsx` |
| `/learn/:unitId/:lessonId` | `app/learn/[unitId]/[lessonId].jsx` |
| `/vocabulary` | `app/vocabulary/index.jsx` |
| `/vocabulary/:categoryId` | `app/vocabulary/[categoryId]/index.jsx` |
| `/vocabulary/:categoryId/:wordId` | `app/vocabulary/[categoryId]/[wordId].jsx` |
| `/notebook` (redirect) | `app/notebook/index.jsx` |
| `/notebook/:tab` | `app/notebook/[tab].jsx` |
| `/review` | `app/review.jsx` |
| `/search` | `app/search.jsx` |
| `/quiz` | `app/quiz/index.jsx` |
| `/quiz/:topicId` | `app/quiz/[topicId].jsx` |
| `/login` | `app/login.jsx` |
| `/register` | `app/register.jsx` |
| `/account` | `app/account.jsx` |
| `/settings` | `app/settings.jsx` |
| `*` (404) | `app/+not-found.jsx` |

## The root layout

`app/_layout.jsx` is the equivalent of the old `App.jsx` — it wraps every route in the four context providers (Auth → Subscription → Progress → Notebook) and renders the shared `Layout` shell (Navbar + Footer). The actual page renders inside `<Slot />`.

## API translation

| `react-router-dom` | `expo-router` |
|---|---|
| `<Link to="/foo">` | `<Link href="/foo">` |
| `<NavLink>` with `isActive` | Manual `usePathname()` + Pressable (see `Tabs.jsx` for the pattern) |
| `<Outlet />` | `<Slot />` |
| `<Navigate to="..." replace />` | `<Redirect href="..." />` |
| `useNavigate()` → `navigate('/x')` | `useRouter()` → `router.push('/x')` |
| `useParams()` | `useLocalSearchParams()` |
| `useLocation()` (pathname) | `usePathname()` |

## "Wrapper" pages

Some pages in `app/` are one-line re-exports of the actual component in `src/components/`:

```jsx
// app/account.jsx
import ProfilePage from '../src/components/account/ProfilePage.jsx'
export default ProfilePage
```

Why? It keeps the component file plain (testable, importable from elsewhere) while still letting Expo Router pick it up as a route. The "real" code lives in `src/components/` so the `app/` tree stays purely about routing.
