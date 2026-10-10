# Docs site

Live previews and docs for every component and block in this registry. A Next.js app, exported as static HTML.

```bash
npm install
npm run site:dev     # http://localhost:3000
npm run site:build   # static site in site/out, plus the registry JSON at /r/<item>.json
```

## How it works

- `scripts/extract.mjs` builds `generated/catalog.json` before every dev and build run. It takes the sidebar groups
  from the README tables, the item metadata from `registry.json`, and each component's props (types, defaults,
  JSDoc) from its TypeScript source. The API tables, controls and usage snippets all come from this file, so they
  stay in sync with the code.
- `demos/<item>.tsx` holds the demo data for each item. See `demos/README.md`.
- `/check` renders every demo on one page and lists any that throw. It isn't linked from the site.
- The site's styling is built on `registry/foundation.css`, so a token change restyles the components and the docs together.

## Deploying

`vercel.json` at the repository root builds this site. Import the repository into Vercel and deploy, no settings
needed. Demo photos and logos (`/media`, `/block-logos`) are not in this repository, so the site proxies them from
ui.teamofsilicons.com, through `vercel.json` in production and `next.config.mjs` in development.
