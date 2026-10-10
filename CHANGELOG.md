# Changelog

Changes ship continuously from `main`. Every item links to its live preview on [ui.teamofsilicons.com](https://ui.teamofsilicons.com).

## 2026-10-10

Silicon UI is live.

### Added

- **Docs site** at [ui.teamofsilicons.com](https://ui.teamofsilicons.com): a live preview of every component and block, with controls generated from its props, an event log, examples, install steps, usage and the full API reference.
- **The `@silicon-ui` registry.** Install anything with `npx shadcn@latest add @silicon-ui/<id>`, or from `https://ui.teamofsilicons.com/r/<id>.json`.
- **AI-readable docs:** `llms.txt` and a Markdown page per item at `/<id>.md`.
- `npm run build:registry` builds `public/r` from the source in this repository.

### Changed

- Started from [Arc](https://github.com/kuratlielia/arc-library) v1.1.0 by Elia Kuratli (MIT): 108 components and 22 blocks.
- Renamed everything to Silicon UI:
  - Items install into `components/silicon-ui/`.
  - The foundation items are now `silicon-foundation` and `silicon-motion-tokens`.
  - The gradient tokens are now `--silicon-gradient-*`.
  - `ArcProvider` is now `SiliconProvider`, in `lib/silicon-provider.tsx`.
- Demo media now ships with the docs site.
