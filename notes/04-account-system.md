# Account System

## What
A simulated auth layer that stores a user object in localStorage. If no user is found, the app treats the visitor as a guest and shows a banner inviting them to register. Designed so a Supabase swap later touches only the four functions in `AuthContext`.

## Files
- `src/context/AuthContext.jsx` — provider with `login`, `register`, `logout`, `updateProfile`
- `src/components/account/LoginForm.jsx` — `/login`
- `src/components/account/RegisterForm.jsx` — `/register`
- `src/components/account/ProfilePage.jsx` — `/account`
- `src/components/account/GuestBanner.jsx` — shown in Layout when `user.isGuest`

## Why
- **Always have a user object** — even guests get a stable `{ id: 'guest', isGuest: true }` so downstream code (notably `ProgressContext`) can treat the user uniformly. No null-checks scattered through components.
- **Dialect lives on the user** — both `/settings` and `/account` need it; making it a user field means there's one source of truth and no extra context.
- **Simulated auth, real shape** — the user object matches what a Supabase `users` row would contain (id, email, joinedAt, etc). When the backend lands, only the body of `login` / `register` changes; the consuming components stay the same.

## Code anatomy

### User shape

```js
{
  id: 'devan',                    // primary key — also used to namespace progress
  username: 'devan',
  displayName: 'Devan Lee',
  email: 'devan@example.com',
  dialectPreference: 'white',     // 'white' | 'green'
  joinedAt: '2026-05-06T12:00:00.000Z',
  isGuest: false,
}
```

For guests:
```js
{ id: 'guest', username: 'guest', displayName: 'Guest', email: '',
  dialectPreference: 'white', joinedAt: null, isGuest: true }
```

### Provider skeleton

```jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadFromStorage() || guestUser)

  useEffect(() => { saveToStorage(user) }, [user])

  const login    = useCallback((credentials) => { /* build user, setUser, return */ }, [])
  const register = useCallback((data)        => { /* build user, setUser, return */ }, [])
  const logout   = useCallback(()            => { setUser(guestUser) }, [])
  const updateProfile = useCallback((patch)  => { setUser(prev => ({ ...prev, ...patch })) }, [])

  return <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
    {children}
  </AuthContext.Provider>
}
```

`saveToStorage` deliberately removes the key when the user is a guest — no point persisting "guest" identity.

## Reading the user in any component

```jsx
import { useAuth } from '../context/AuthContext.jsx'

function MyComponent() {
  const { user, login, logout, updateProfile } = useAuth()

  if (user.isGuest) return <p>Please log in.</p>

  // change one field:
  const onChange = (e) => updateProfile({ dialectPreference: e.target.value })
}
```

The `isGuest` boolean is the canonical "is this a real user?" check. Don't compare `user.id === 'guest'` — `isGuest` makes the intent obvious.

## How dialect stays in sync

Both `Settings.jsx` and `ProfilePage.jsx` use the same pattern:

```jsx
<select
  value={user.dialectPreference}
  onChange={(e) => updateProfile({ dialectPreference: e.target.value })}
>
```

Because both read from the same context, changing it in one place updates the other instantly. No extra wiring needed.

## Form pattern

The login and register forms use controlled local state, then call into the context on submit:

```jsx
const { login } = useAuth()
const navigate = useNavigate()
const [username, setUsername] = useState('')

const submit = (e) => {
  e.preventDefault()
  if (!username) return
  login({ username })          // updates context + localStorage
  navigate('/account')         // route forward
}
```

Validation is intentionally minimal (just `required` on inputs) — Supabase's signup flow will replace this and provide real validation/error handling.

## Known limitations (intentional, MVP)

- No password hashing — there's no password storage at all yet, login just trusts the form.
- No "log in as a different user" UX — `logout` returns to guest, then user logs in.
- Guest progress does not auto-merge into the account on first login. (Could be added: read guest progress in `register`, write to the new user key. See [instructions/supabase-integration.md](../instructions/supabase-integration.md) section 6.)
