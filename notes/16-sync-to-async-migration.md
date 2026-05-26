# Sync → Async Migration — Walkthrough

A worked example of what goes wrong when you swap a synchronous data layer (localStorage) for an asynchronous one (Supabase), using the `ProgressContext` debugging session as the case study.

This pattern shows up every time you migrate a piece of state from "read it instantly" to "wait for the network." Reading this once will save you from rediscovering all three traps on three separate features.

Companion to [03-progress-tracking.md](03-progress-tracking.md) (what the context does) and [../instructions/supabase-integration.md](../instructions/supabase-integration.md) (the migration plan).

---

## The setup

We had:

```js
// Sync, localStorage-only
function loadProgress(userId) {
  const raw = localStorage.getItem(KEY_PREFIX + userId)
  return raw ? { ...initialState, ...JSON.parse(raw) } : { ...initialState }
}

function saveProgress(userId, state) {
  localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(state))
}

const [state, setState] = useState(() => loadProgress(userId))
useEffect(() => { setState(loadProgress(userId)) }, [userId])
useEffect(() => { saveProgress(userId, state) }, [userId, state])
```

We swapped in the Supabase versions from the integration doc:

```js
async function loadProgress(userId) {
  if (userId === 'guest') return /* localStorage fallback */
  const { data } = await supabase.from('progress').select('data').eq('user_id', userId).single()
  return data?.data || initialState
}

async function saveProgress(userId, state) {
  if (userId === 'guest') { localStorage.setItem(...); return }
  await supabase.from('progress').upsert({ user_id: userId, data: state, updated_at: ... })
}
```

The function bodies were correct. The app crashed at boot. Three bugs.

---

## Bug 1 — The missing import (the obvious one)

`supabase` was referenced inside both new functions but never imported. The module loaded fine because the references live inside function bodies — JavaScript doesn't resolve free variables until the function actually runs. The crash came at the first call:

```
ReferenceError: supabase is not defined
```

**The lesson.** When you paste a snippet from a doc, your eyes track the *body* of the function. Imports happen at the top of the file — far away on screen — and the doc didn't show them because docs assume context. **Every snippet has invisible scaffolding around it.** A snippet is the body of a function, not a complete file.

A habit worth building: after pasting any snippet that uses a name, jump to the top of the file and verify the import. Five seconds; saves the next twenty minutes.

---

## Bug 2 — Promises in synchronous state slots

This is the one with teeth. Look at the call sites that *used* to work:

```js
const [state, setState] = useState(() => loadProgress(userId))
//                                       ^^^^^^^^^^^^^^^^^^^^^
// Sync version: returns the initial state object. Perfect.
// Async version: returns a Promise. State is now a Promise object.
```

Then every consumer that does `state.completedLessons.includes(stepId)` reads `undefined.includes(...)` because Promises don't have a `completedLessons` property. The app white-screens with `Cannot read properties of undefined (reading 'includes')`.

Same problem in the load effect:

```js
useEffect(() => { setState(loadProgress(userId)) }, [userId])
// setState receives a Promise. Now state IS a Promise, not the resolved data.
```

**The lesson.** A function's return type is part of its signature. When you change return type from `T` to `Promise<T>`, **every call site that consumed the return value has to change too**. The function-signature change is one edit; the consumer audit is the real migration work.

The fix has two parts:

```js
// 1. Seed state with a synchronous default
const [state, setState] = useState(initialState)

// 2. Load asynchronously, then setState with the resolved value
useEffect(() => {
  loadProgress(userId).then((next) => setState(next))
}, [userId])
```

There's no escaping this. **You cannot make `useState` async.** React's design assumes synchronous initialization. The only way to fold async loading into a useState model is: default-now, replace-later.

The brief moment between mount and load completion is the "loading flicker" — users see default/empty state for one render. For most apps that's tolerable; if you want to hide it, render a skeleton until the load resolves.

---

## Bug 3 — The silent data-loss trap

This is the one nobody warns you about and it's the one that ruins users' lives in production.

After fixing bugs 1 and 2, the code looks like:

```js
const [state, setState] = useState(initialState)
useEffect(() => { loadProgress(userId).then(setState) }, [userId])
useEffect(() => { saveProgress(userId, state) }, [userId, state])
```

Walk through the mount sequence with the user's eyes:

1. Render 1: `state = initialState` (everything empty/zero).
2. **The save effect fires.** It sends `{ data: initialState }` to Supabase, debounced 500ms.
3. The load effect fires too. Network round-trip starts.
4. ~50ms later: save's 500ms timer hasn't elapsed yet. So far so good.
5. ~600ms later: save's 500ms timer fires *before* the load resolves. We just upserted empty state to the user's row.
6. ~700ms later: load resolves with what we just wrote — empty state.

**The user's real progress was silently overwritten with zeros.**

In localStorage land this bug didn't exist because save was synchronous, load was synchronous, mount-render-mount-render happened in microseconds, and there was no "in-flight" window. Adding the network creates the window. The window is where data dies.

### The fix — gate the save on a `hydrated` flag

```js
const [state, setState] = useState(initialState)
const [hydrated, setHydrated] = useState(false)

useEffect(() => {
  let active = true
  setHydrated(false)
  loadProgress(userId).then((next) => {
    if (!active) return
    setState(next)
    setHydrated(true)        // (a)
  })
  return () => { active = false }
}, [userId])

useEffect(() => {
  if (!hydrated) return       // (b)
  const t = setTimeout(() => saveProgress(userId, state), 500)
  return () => clearTimeout(t)
}, [userId, state, hydrated])
```

- (a) Only mark hydrated *after* the load completes and writes real data into state.
- (b) Save effect bails out until hydrated. The empty default never reaches the database.

**The mental model.** Two states have to come into the picture: "what is the data" and "is the data trustworthy yet." With local-only storage these were the same answer. With remote storage they're different. The `hydrated` flag is the second answer.

### Why `setHydrated(false)` runs on userId change

When the user logs out and back in, `userId` changes. The load effect re-fires. During the gap between the new `userId` and the new data resolving, the save effect *must not* write user A's old state to user B's row. Resetting `hydrated` to false on every userId change closes that window.

### The race-condition guard — the `active` flag

Same pattern as in `AuthContext`. Imagine this sequence:

1. User is logged in as A. `userId = 'A'`. Load fires.
2. Mid-load, user logs out. `userId = 'guest'`. Effect cleans up, new load fires for guest.
3. The promise from step 1 still resolves later — and would call `setState(userA_data)` *after* the guest load finished. User A's data ends up in the guest's state.

`active` solves this:

```js
let active = true
loadProgress(userId).then((next) => {
  if (!active) return       // we've moved on; don't write stale data
  setState(next)
  setHydrated(true)
})
return () => { active = false }
```

The cleanup runs before the next effect; `active` flips false; the stale promise's `.then` becomes a no-op. **Async callbacks must always check that they're still relevant.**

---

## The general rule

When you change a function from sync to async, three things must change *together*. If you do one or two without the third, the bug is silent or delayed.

| Change | Sync version | Async version |
|---|---|---|
| **Initial value** | `useState(() => load(...))` | `useState(default)` + load effect |
| **Load path** | `setState(load(...))` | `load(...).then(setState)` with `active` guard |
| **Save path** | `useEffect save` | `useEffect save` **gated by `hydrated`** |

The first two are about correctness — the app crashes if you skip them. The third is about safety — the app *runs* without it, and silently destroys real data.

The third is the one that bites people in production. Write it down. Tape it to your monitor. Whatever it takes.

---

## Three things to remember

1. **A snippet from a doc is never a complete file.** Imports, dep arrays, helper definitions, and surrounding state machinery are all your job. If a paste "doesn't work," the bug is almost always in the missing scaffolding, not in the snippet.

2. **`useState` cannot be async.** Seed it with a sync default and replace via effect. Plan for the brief default-state render between mount and load.

3. **Add a `hydrated` flag whenever you migrate from local to remote.** The save effect must know whether the state in memory came from the source of truth or from your default seed. If it can't tell, it will eventually overwrite real data with your default.

---

## Things to look for elsewhere in this codebase

The same pattern will repeat when you migrate other contexts. Specifically:

- **`SubscriptionContext`** — when you swap localStorage for the `subscriptions` table. Same three bugs are waiting. Apply the `hydrated` gate.
- **`NotebookContext`** — same story if/when notes move server-side.
- **Anywhere you add a "fetch on mount + save on change" pattern** for new feature data.

Use this note as a checklist when doing those migrations. Each one looks "easy" in isolation; each one has the same data-loss trap.

---

## What's still imperfect

- **Loading flicker.** Users see `xp: 0` for a beat between mount and load. Not a bug; a UX seam. Add a skeleton or block render on `hydrated` if it bothers you.
- **Guest progress orphaning.** A guest who registers and logs in starts fresh — their guest localStorage progress isn't migrated. The integration doc has a snippet for this (step 6). Defer until you actually have guests converting to accounts.
- **Save errors are silently dropped.** `saveProgress` doesn't surface failures. If Supabase is down or RLS rejects the write, the user's local state diverges from the server's. Add an error toast when this becomes a real concern.
- **Debounce timing.** 500ms means up to half a second of unsaved state on close. Probably fine; if not, lower it (more writes) or add a `beforeunload` flush.

None of these are blocking. They're items for the "before we have real users" punch list.
