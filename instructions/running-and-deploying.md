# Running & Deploying

## Local development

```
npm install
npm run dev          # http://localhost:5173
```

Hot reload is on. Editing any `.jsx` or data file refreshes the browser.

## Production build

```
npm run build        # outputs to dist/
npm run preview      # serves dist/ locally for a smoke test
```

`dist/` is a static bundle — drop it on any static host (Netlify, Vercel, GitHub Pages, S3+CloudFront).

## Important deploy notes

- **SPA fallback** — the app uses cilent-side routing. Configure your host so all unknown paths serve `index.html` (otherwise a refresh on `/quiz/foo` returns 404).
  - Netlify: add `_redirects` with `/* /index.html 200`
  - Vercel: routes are auto-handled
  - Static S3/CloudFront: set the 404 error page to `index.html` with status 200

- **localStorage** — all persistence is in the browser. There's no server. A user clearing site data wipes their progress until Supabase is wired in (see [supabase-integration.md](supabase-integration.md)).

- **Environment variables** — none required today. Once Supabase lands, `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set at build time (Vite inlines them).

## Verifying after a change

```
npm run build
```

A clean build with no warnings is the minimum bar before pushing. Vite will fail fast on syntax errors and missing imports.
