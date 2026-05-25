# Supabase Integration

The app currently fakes auth with `localStorage`. This guide swaps in Supabase. The frontend abstractions were chosen so this swap touches **only two files**: `src/context/AuthContext.jsx` and `src/context/ProgressContext.jsx`.

## 1. Install the SDK

```
npm install @supabase/supabase-js
```

## 2. Create a Supabase client

`src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
```

Add `.env.local` to project root (gitignored) with:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ…
```

## 3. Schema (run in Supabase SQL editor)

```sql
-- profiles: 1:1 with auth.users
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  email text,
  dialect_preference text default 'white',
  joined_at timestamptz default now()
);

-- progress: one row per user, JSON blob
create table progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- RLS: users can only read/write their own rows
alter table profiles enable row level security;
alter table progress enable row level security;

create policy "self read profiles" on profiles for select using (auth.uid() = id);
create policy "self write profiles" on profiles for update using (auth.uid() = id);
create policy "self insert profiles" on profiles for insert with check (auth.uid() = id);

create policy "self rw progress" on progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 4. Update AuthContext

In `src/context/AuthContext.jsx`, replace the bodies of `login`, `register`, `logout`, and the initial-load logic. Keep the same exported API and user shape — components don't need to change.

```js
// Initial load
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) hydrateProfile(session.user.id)
    else setUser(guestUser)
  })
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) hydrateProfile(session.user.id)
    else setUser(guestUser)
  })
  return () => sub.subscription.unsubscribe()
}, [])

const login = useCallback(async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return hydrateProfile(data.user.id)
}, [])

const register = useCallback(async ({ email, password, username, displayName, dialectPreference }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  await supabase.from('profiles').insert({
    id: data.user.id,
    username, display_name: displayName,
    email, dialect_preference: dialectPreference,
  })
  return hydrateProfile(data.user.id)
}, [])

const logout = useCallback(async () => {
  await supabase.auth.signOut()
  setUser(guestUser)
}, [])

const updateProfile = useCallback(async (patch) => {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', user.id).select().single()
  if (error) throw error
  setUser({ ...user, ...patch })
}, [user])
```

`hydrateProfile(uid)` should fetch from `profiles` and return a normalized user object matching the existing shape (`{ id, username, displayName, email, dialectPreference, joinedAt, isGuest: false }`).

**Update the LoginForm and RegisterForm** to use `email` instead of (or alongside) `username` since Supabase Auth keys on email.

## 5. Update ProgressContext

Replace `loadProgress` / `saveProgress`:

```js
async function loadProgress(userId) {
  if (userId === 'guest') return JSON.parse(localStorage.getItem('kawmhmoob.progress.guest') || 'null') || initialState
  const { data } = await supabase.from('progress').select('data').eq('user_id', userId).single()
  return data?.data || initialState
}

async function saveProgress(userId, state) {
  if (userId === 'guest') {
    localStorage.setItem('kawmhmoob.progress.guest', JSON.stringify(state))
    return
  }
  await supabase.from('progress').upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() })
}
```

Wrap the save effect in a debounce (e.g. 500ms) to avoid hammering the API on every state change:
```js
useEffect(() => {
  const t = setTimeout(() => saveProgress(userId, state), 500)
  return () => clearTimeout(t)
}, [userId, state])
```

## 6. (Optional) Migrate guest progress on first login

In the new `register`, before calling `setUser`:
```js
const guest = JSON.parse(localStorage.getItem('kawmhmoob.progress.guest') || 'null')
if (guest) {
  await supabase.from('progress').upsert({ user_id: data.user.id, data: guest })
  localStorage.removeItem('kawmhmoob.progress.guest')
}
```
