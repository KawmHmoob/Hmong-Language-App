# SPA Deep-Link 404s + the Fallback Fix

## The bug
Opening a route directly — `https://kawmhmoob.com/contact`, a refresh on any
non-home page, or a shared/bookmarked deep link — returned **404**, even though
the page works fine when navigated to *inside* the app.

## Why
The app is a **single-page app** with client-side routing (`BrowserRouter`).
There is exactly one real file the server can serve: `dist/index.html`. Routing
is JavaScript that runs *after* that file loads.

```
Click /contact inside the app   → React Router swaps the view. Server never asked. ✅
Open /contact directly / refresh → browser asks the SERVER for a file at /contact.
                                    No such file exists → host returns 404.        ❌
```

The server has no idea `/contact` is a route — that knowledge lives in the JS
bundle, which never got a chance to load.

## The fix: an SPA fallback
Tell the host: "for any path you don't recognize, serve `index.html` with a 200
and let the app's router sort it out." Two files, because the config differs by
host and both are harmless when unused:

**`public/_redirects`** — Netlify and Cloudflare Pages both read this. Vite copies
`public/` to `dist/` at build, so it ends up at `dist/_redirects`:
```
/*    /index.html   200
```
The `200` (not 301/302) matters: it serves index.html *at the requested URL*, so
`/contact` stays `/contact` in the address bar and React Router sees the real
path. A redirect would change the URL and lose it.

**`vercel.json`** — Vercel reads this at the repo root (NOT in dist):
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

On whichever host applies, the other file is simply ignored.

## If the host is something else
- **GitHub Pages** — doesn't support fallbacks. The hack: build a `404.html`
  that's a copy of `index.html` (GH Pages serves `404.html` for unknown paths,
  and the app boots from there). Add a postbuild step: `cp dist/index.html
  dist/404.html`.
- **nginx** — `location / { try_files $uri /index.html; }`
- **Apache** — a `.htaccess` rewriting non-file requests to `/index.html`.
- **Firebase Hosting** — `firebase.json` → `"rewrites": [{ "source": "**",
  "destination": "/index.html" }]`.

## Verifying
`npm run build`, then confirm `dist/_redirects` exists (it should print the
rule). After deploy, the real test: open a deep link in a **fresh tab** (or hard
refresh on a sub-page). It should load the page, not a 404.

> This only bites in production. `vite dev` has its own built-in SPA fallback,
> so deep links work locally — which is exactly why the bug hides until deploy.

## Files
- `public/_redirects` — Netlify / Cloudflare Pages fallback (→ `dist/_redirects`)
- `vercel.json` — Vercel fallback (repo root)
