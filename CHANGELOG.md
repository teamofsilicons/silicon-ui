# Changelog

Changes ship continuously from `main`. Every item links to its live preview on [ui.teamofsilicons.com](https://ui.teamofsilicons.com).

## 2026-10-10 (later)

### Changed

- **Spacing tokens by role.** `--space-tight` 4, `-related` 8, `-group` 12, `-inset` 16, `-comfort` 20, `-section` 24, `-block` 32, `-page` 48, `-stage` 64 and `-screen` 80 replace `--space-1` to `--space-24`. Spaces of 40px are now 48px (`page`) and 96px is now 80px (`screen`).
- **Tighter corners by role.** `--radius-detail` 2px, `-control` 6px, `-container` 8px, `-overlay` 12px and `-full` replace `--radius-control` 18px, `-panel` 26px, `-surface` 34px and `-pill`. Every corner in every component now reads one of these tokens, with no fixed pixel corners left.
- **Squircle corners by default.** Every rounded corner uses `corner-shape: squircle` where the browser supports it, and a round corner elsewhere. Set `data-corners="round"` on `<html>`, or on any element, to switch back. The docs sidebar has a switch to compare the two.

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
