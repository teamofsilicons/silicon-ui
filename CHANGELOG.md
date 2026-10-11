# Changelog

Changes ship continuously from `main`. Every item links to its live preview on [ui.teamofsilicons.com](https://ui.teamofsilicons.com).

## 2026-10-12

### Added

- **npm package.** `npm install silicon-ui`, load `silicon-ui/styles.css` once, and import each component from its own path (`silicon-ui/button`). Components ship compiled with their CSS modules, so apps load only the CSS they use. `silicon-ui/components.json` lists every component and its exports. The shadcn registry stays for blocks and for copying code.
- **Brand and avatar tokens.** `--primary` and `--primary-foreground` fill primary buttons and action buttons (neutral by default, so nothing changes until an app sets its brand colour). `--avatar-radius` and `--avatar-corner-shape` shape profile pictures in Avatar, Avatar group and User menu (circles by default). Button and Action button expose `data-variant` for app theming.

### Fixed

These come from Silicon Accounts, which had fixed them in its own copy.

- **Focus returns to what opened a layer.** Dialog, Drawer and Bottom sheet put focus back on the element that opened them, also when they open from state rather than a Trigger (WCAG 2.4.3). Shared helper: `lib/return-focus.ts`.
- **Escape closes the innermost thing first.** Inside a Dialog, Drawer, Bottom sheet or Popover, Escape first closes an open Combobox list, DatePicker calendar, InlineEdit or ConfirmMorph question, and only the next Escape closes the layer. Shared helper: `lib/escape.ts`.
- **Combobox follows the WAI-ARIA pattern.** Focus alone no longer opens the list (typing, the arrow keys or a click do), leaving the field closes it, and the list is not a Tab stop.
- **Phone input takes a whole number after "+".** Typing "+1 202 555 0142" into the country search moves it into the number field under its country.
- **Timeline announces only news.** Older rows loaded below ("Show older") join quietly instead of sliding in and being announced.
- **Confirm morph confirms from the keyboard at once.** The short re-arming delay now only guards against the opening pointer press.
- **User menu** names the initials it shows, and hides the initials text from screen readers.
- **Command palette** "No matching actions" is styled again (a broken selector).

## 2026-10-11

### Fixed

- **Action button and split button labels morph like Text morph.** Both had their own copy of the text morph, which started the width spring a frame late, staggered new letters by their position in the whole word, and clipped letters with a hard edge, so the morph felt delayed and shifty. Both now use Text morph, and their registry items depend on `text-morph`.
- **Every menu's highlight glides.** The split button menu and Select now use the same gliding highlight as the dropdown menu: it glides between items for the pointer and jumps instantly for the keyboard. The behaviour lives in one shared helper, `lib/menu-highlight.tsx`.

### Changed

- **Circles stay circles.** Anything round by design keeps a true round shape under squircle corners: spinners, dots, avatars, radio buttons, switch tracks and pills (`50%` and `--radius-full`). Closed morph select and expanding search are round too, and turn squircle as they open. Skeleton text lines are capsules.
- **Squircle radii are compensated.** A squircle reads about half as round as a circular corner at the same radius. Squircle mode therefore uses 4 / 11 / 14 / 21 (`detail` / `control` / `container` / `overlay`), which feel like round 2 / 6 / 8 / 12. Round mode, and browsers without `corner-shape`, keep 2 / 6 / 8 / 12.

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
