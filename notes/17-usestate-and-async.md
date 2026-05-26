# Why `useState(() => loadProgress(userId))` Broke

A focused explainer on one specific bug — straight to the point. Companion to [16-sync-to-async-migration.md](16-sync-to-async-migration.md), which covers the broader sync→async pattern. This note is *just* about the `useState` line.

---

## The line in question

```js
const [state, setState] = useState(() => loadProgress(userId))
```

`useState` accepts an initial value. It takes whatever you give it and stores it as state. No magic, no waiting.

## When `loadProgress` was sync

```js
function loadProgress(userId) {
  return { completedLessons: [], xp: 0, /* ... */ }   // returns an OBJECT
}
```

The initializer runs, returns the object, `state` is set to that object. Consumers read `state.completedLessons` and get an array. Works.

## When `loadProgress` became async

```js
async function loadProgress(userId) {
  return { completedLessons: [], xp: 0, /* ... */ }   // STILL looks like an object...
}
```

But here's the rule: **every `async` function returns a Promise. Always. No exceptions.** The `return { ... }` inside the function body doesn't give the caller the object — it gives them a Promise that *will eventually* resolve to that object.

So:

```js
loadProgress('guest')
// → Promise { <pending> }
// NOT { completedLessons: [], xp: 0, ... }
```

The initializer runs, returns a Promise, `state` is set to that Promise. Consumers read `state.completedLessons` and get `undefined`, because Promises don't have a `completedLessons` property. The next call — `undefined.includes(stepId)` — throws.

## Why React can't save you

You might wonder: can't `useState` just "await" the Promise for me? No.

`useState` is synchronous by design. Hooks run in order, every render, in microseconds. React decides which components to render *next* based on what state currently *is*. If `useState` waited for a Promise, the entire render pipeline would stall — and rendering is supposed to be instant.

So React's contract is: **give me a value right now, or I store the Promise object literally.** It chose the second.

## The fix in one sentence

Seed state with a synchronous default, then replace it asynchronously in a `useEffect`:

```js
const [state, setState] = useState(initialState)              // sync default

useEffect(() => {
  loadProgress(userId).then((next) => setState(next))         // async replacement
}, [userId])
```

State is always a real object — first the default, then the loaded data once the network returns. No Promises ever live in state.

## The general rule

> `useState` cannot accept a Promise as state. If your initializer returns one, you have a bug — even if the code looks "the same as before."

Any time you put `async` in front of a function name, scan every call site and ask: "does the caller expect a value, or a Promise?" The function looks the same but its contract changed.

## How to spot it next time

Three signals that you've shoved a Promise into a sync slot:

1. A `console.log(state)` shows `Promise { <pending> }` or `Promise { <fulfilled>: {...} }` instead of a plain object.
2. `state.someField` is `undefined` even though you're sure the data is correct.
3. The error mentions `.includes`, `.map`, or `.length` being undefined.

Any of those three → check the most recent function whose return type you changed.
