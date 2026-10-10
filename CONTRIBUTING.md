# Contributing to Silicon UI

Thanks for helping make Silicon UI better. Bug reports, fixes, accessibility improvements, new components and ideas are all welcome.

## Before you start

- **Open an issue first** for anything larger than a small fix, so we can agree on the approach before you spend time on it.
- **Search existing issues** before opening a new one.
- Pull requests are reviewed and merged here directly. Every merge to `main` redeploys [ui.teamofsilicons.com](https://ui.teamofsilicons.com) and the registry.

## Reporting a bug

Use the [bug report form](https://github.com/teamofsilicons/silicon-ui/issues/new?template=bug_report.yml). Include the item id (for example `date-picker`), your framework (Next.js or Vite), browser, and the smallest steps that reproduce it. A screen recording helps a lot for motion bugs.

## Requesting a component

Use the [component request form](https://github.com/teamofsilicons/silicon-ui/issues/new?template=component_request.yml). Describe the job it does and where you would use it; links to examples you like are useful.

## Making a change

```bash
git clone https://github.com/teamofsilicons/silicon-ui.git
cd silicon-ui
npm install
npm run site:dev        # the docs site with live previews, on http://localhost:3000
```

1. Change or add the source in `registry/components/<id>/` or `registry/blocks/<id>/`. A new item also needs an entry in `registry.json` and a row in the README tables (the docs sidebar is built from them).
2. Add or update its demo in `site/demos/<id>.tsx`. See [site/demos/README.md](./site/demos/README.md). Props, the API table and usage are generated from the source.
3. Rebuild the registry: `npm run build:registry`.
4. Run `npm run check` (typecheck, lint and registry validation). CI runs it on every pull request.

Guidelines:

- Keep each pull request focused on one component or block.
- Style with CSS modules and the tokens in `registry/foundation.css`. No raw colors, no new global CSS.
- Animate with the presets in `lib/motion-tokens.ts`, and give every animation a reduced motion branch.
- Use semantic HTML and make every interaction work with the keyboard and a screen reader.
- Check light and dark themes, and a narrow viewport.
- Write copy in sentence case.

## Licensing

By contributing, you agree that your contribution is licensed under the [MIT License](./LICENSE).

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By taking part, you agree to uphold it.
