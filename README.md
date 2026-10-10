<h1 align="center">Silicon UI</h1>

<p align="center">React components and blocks with calm, physical motion.<br>Free and open source. Install with the shadcn CLI or copy the code.</p>

<p align="center">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-111111?style=flat-square"></a>
  <a href="https://ui.teamofsilicons.com"><img alt="shadcn registry: @silicon-ui" src="https://img.shields.io/badge/shadcn%20registry-%40silicon--ui-111111?style=flat-square"></a>
  <a href="https://github.com/teamofsilicons/silicon-ui/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/teamofsilicons/silicon-ui/ci.yml?branch=main&style=flat-square&label=CI"></a>
  <img alt="108 components" src="https://img.shields.io/badge/components-108-1f5cb1?style=flat-square">
  <img alt="22 blocks" src="https://img.shields.io/badge/blocks-22-1f5cb1?style=flat-square">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-111111?style=flat-square">
</p>

<p align="center">
  <a href="https://ui.teamofsilicons.com"><b>Docs and live previews</b></a>
  &nbsp;·&nbsp;
  <a href="#install"><b>Install</b></a>
  &nbsp;·&nbsp;
  <a href="#components"><b>Components</b></a>
  &nbsp;·&nbsp;
  <a href="#blocks"><b>Blocks</b></a>
  &nbsp;·&nbsp;
  <a href="#ai-tools"><b>AI tools</b></a>
</p>

Silicon UI is a library of React components and blocks with calm, physical motion, made by [Team of Silicons](https://teamofsilicons.com). Every item is plain source you own: CSS modules on a small set of design tokens, [Motion](https://motion.dev) for animation, keyboard support, and a reduced motion path for every animation. Install anything with the shadcn CLI or copy the files by hand. It works in Next.js and Vite, with or without Tailwind. Everything here is free and MIT licensed: **108 components and 22 blocks**, plus the design and motion tokens they share. Every one of them has a live preview, with props you can change, at [ui.teamofsilicons.com](https://ui.teamofsilicons.com).

## Contents

- [Install](#install)
  - [Requirements](#requirements)
  - [With the shadcn CLI](#with-the-shadcn-cli)
  - [Copy and paste](#copy-and-paste)
- [Usage](#usage)
- [Theming](#theming)
- [Components](#components)
- [Blocks](#blocks)
- [AI tools](#ai-tools)
- [Troubleshooting](#troubleshooting)
- [How releases work](#how-releases-work)
- [Repository layout](#repository-layout)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Install

### Requirements

- **React 19** with TypeScript. The source compiles under `strict`, `noUncheckedIndexedAccess` and `verbatimModuleSyntax`, and needs `lib` ES2023 or newer (a few items use `findLast`)
- **Next.js** (App Router) or **Vite**
- **[motion](https://www.npmjs.com/package/motion)** for animation. Some items also use [lucide-react](https://lucide.dev) or a [Radix UI](https://www.radix-ui.com) primitive; the CLI installs whatever an item needs.
- The `@/*` import alias (Next.js and shadcn set it up by default)

No Tailwind is required. Silicon UI styles are CSS modules that read CSS variables.

### With the shadcn CLI

Register the `@silicon-ui` namespace once in `components.json`:

```json
{
  "registries": {
    "@silicon-ui": "https://ui.teamofsilicons.com/r/{name}.json"
  }
}
```

Then add items by name. Local dependencies, such as the components inside a block, come along automatically:

```bash
npx shadcn@latest add @silicon-ui/button @silicon-ui/dialog
```

Every item also installs from its full URL, without touching `components.json`:

```bash
npx shadcn@latest add https://ui.teamofsilicons.com/r/button.json
```

Install the design tokens once per app with `npx shadcn@latest add @silicon-ui/silicon-foundation`, then import them at the root of your app. Components only pull in the motion presets (`silicon-motion-tokens`) and never reinstall `foundation.css`, so you can also keep the tokens in your own theme package.

```tsx
// app/layout.tsx (Next.js) or src/main.tsx (Vite)
import "@/components/silicon-ui/foundation.css";
```

<details>
<summary><b>Setting up a new project</b></summary>

<br>

**Next.js**

```bash
npx create-next-app@latest my-app
cd my-app
npx shadcn@latest init
```

Accept the default `@/*` import alias.

**Vite**

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npx shadcn@latest init
```

Map `@/*` to `src` in `tsconfig.json` and `vite.config.ts`, as shadcn expects:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

</details>

### Copy and paste

1. Install the shared packages: `npm install motion lucide-react`.
2. Copy `registry/foundation.css`, `registry/motion-tokens.ts` and `lib/motion-tokens.ts` from this repository into the same paths under your `@/` root, and import the CSS once at the root.
3. Copy the item's folder from `registry/components/<id>/` or `registry/blocks/<id>/`, keeping the path. Copied files keep this repository's layout and import each other through `@/`; the CLI install above rewrites that for you. Its `public/r/<id>.json` file lists every file and npm package it needs.

Each page on [ui.teamofsilicons.com](https://ui.teamofsilicons.com) also lists the exact files under Installation.

## Usage

The CLI puts every file in a `silicon-ui/` folder under the `components` alias in your `components.json`, for example `components/silicon-ui/button/button.tsx`, or `src/components/silicon-ui/…` in a `src/` project or monorepo package. Silicon UI files import each other with relative paths, so any alias setup works; move the `silicon-ui/` folder as a whole if you want it elsewhere. Use them like any local component:

```tsx
import { Button } from "@/components/silicon-ui/button/button";

export default function Page() {
  return <Button>Save changes</Button>;
}
```

The code is yours: edit it, rename it, move it. There is no runtime package to keep in sync.

## Theming

Components read semantic tokens, never raw colors. Change a token in `foundation.css` (`components/silicon-ui/foundation.css` after a CLI install) and every component follows, in both themes.

| Token | Used for |
| --- | --- |
| `--background` | The page behind everything |
| `--surface`, `--surface-raised`, `--surface-muted` | Cards and inputs, floating layers, quiet fills |
| `--foreground`, `--text-secondary`, `--text-muted` | Primary, supporting and hint text |
| `--border`, `--border-subtle`, `--border-strong` | Separators and edges |
| `--accent`, `--accent-strong`, `--accent-subtle` | Selection, progress and helpful context |
| `--success`, `--warning`, `--danger` | Status, always paired with a label |
| `--radius-detail`, `--radius-control`, `--radius-container`, `--radius-overlay`, `--radius-full` | Marks, controls, cards and menus, dialogs and sheets, pills and dots. Squircle radii are 4 / 11 / 14 / 21, which feel like round 2 / 6 / 8 / 12 |
| `--space-tight` … `--space-screen` | Spacing by role: tight 4, related 8, group 12, inset 16, comfort 20, section 24, block 32, page 48, stage 64, screen 80 |
| `--font-display`, `--font-body` | Geist for headings, Inter for everything else |

- **Dark mode:** set `data-theme="dark"` on `<html>`. Dark values are tuned separately, not inverted.
- **Corners:** squircles by default. Every rounded corner is drawn with `corner-shape: squircle` where the browser supports it, and as a round corner elsewhere. A squircle reads about half as round as a circular corner at the same radius, so squircle mode uses larger radii (about 1.8×) to feel the same. Circles and capsules (spinners, dots, avatars, pills) always stay round. Set `data-corners="round"` on `<html>` (or any element) for round corners at 2 / 6 / 8 / 12.
- **Accent:** set `data-accent` on `<html>` to `neutral`, `violet`, `blue`, `green`, `amber`, `orange`, `coral` or `rose`.
- **Motion:** springs and durations live in `lib/motion-tokens.ts` (`components/silicon-ui/lib/motion-tokens.ts` after a CLI install). Every animation respects `prefers-reduced-motion`.

Every token is shown live on the [Foundation page](https://ui.teamofsilicons.com/foundation).

## Components

108 free components, grouped as on the site. Click a name for the live preview and docs.

[Actions](#actions) (17) · [Inputs](#inputs) (34) · [Disclosure](#disclosure) (13) · [Feedback](#feedback) (9) · [Data](#data) (30) · [Text](#text) (4) · [Special](#special) (1)

### Actions

**Buttons**

| Component | Description | Install |
| --- | --- | --- |
| [Button](https://ui.teamofsilicons.com/button) | A clear, responsive action with quiet secondary states. | `npx shadcn@latest add @silicon-ui/button` |
| [Action button](https://ui.teamofsilicons.com/action-button) | A compact button for frequent toolbar actions. | `npx shadcn@latest add @silicon-ui/action-button` |
| [Split button](https://ui.teamofsilicons.com/split-button) | A primary action with a menu of nearby alternatives. | `npx shadcn@latest add @silicon-ui/split-button` |
| [Button group](https://ui.teamofsilicons.com/button-group) | Related actions joined into one surface with hairline dividers: a hover highlight glides between segments, the pressed one answers in place, and an attached menu can close the row. | `npx shadcn@latest add @silicon-ui/button-group` |
| [Floating button group](https://ui.teamofsilicons.com/floating-button-group) | Separate soft buttons in a quiet tray, with one shared highlight that morphs from button to button as you move, and a pressed state that settles in place. | `npx shadcn@latest add @silicon-ui/floating-button-group` |
| [Expanding button group](https://ui.teamofsilicons.com/expanding-button-group) | Icon buttons in a compact group: the one you point at or focus grows to reveal its label while its neighbours slide aside, and an action confirms in place. | `npx shadcn@latest add @silicon-ui/expanding-button-group` |
| [Copy button](https://ui.teamofsilicons.com/copy-button) | Copy a value with immediate confirmation. | `npx shadcn@latest add @silicon-ui/copy-button` |
| [Confirm morph](https://ui.teamofsilicons.com/confirm-morph) | A destructive button that morphs into an inline confirmation, a spinner, and a result with undo. | `npx shadcn@latest add @silicon-ui/confirm-morph` |

**Gestures**

| Component | Description | Install |
| --- | --- | --- |
| [Hold to confirm](https://ui.teamofsilicons.com/hold-to-confirm) | Confirm a destructive action by holding, not tapping. | `npx shadcn@latest add @silicon-ui/hold-to-confirm` |
| [Swipe actions](https://ui.teamofsilicons.com/swipe-actions) | Reveal row actions with a swipe, or from the same actions in a menu. | `npx shadcn@latest add @silicon-ui/swipe-actions` |

**Menus**

| Component | Description | Install |
| --- | --- | --- |
| [Dropdown menu](https://ui.teamofsilicons.com/dropdown-menu) | A focused list of actions anchored to a trigger. | `npx shadcn@latest add @silicon-ui/dropdown-menu` |
| [Context menu](https://ui.teamofsilicons.com/context-menu) | Secondary actions kept close to the selected object. | `npx shadcn@latest add @silicon-ui/context-menu` |
| [User menu](https://ui.teamofsilicons.com/user-menu) | Your account, settings, theme, and sign out behind the avatar. Opens as a bottom sheet on phones. | `npx shadcn@latest add @silicon-ui/user-menu` |

**Theme**

| Component | Description | Install |
| --- | --- | --- |
| [Theme switcher](https://ui.teamofsilicons.com/theme-switch) | Four smooth ways to move between light and dark appearance. | `npx shadcn@latest add @silicon-ui/theme-switch` |
| [Eclipse](https://ui.teamofsilicons.com/theme-switch-eclipse) | The next appearance crosses the page like an eclipse. | `npx shadcn@latest add @silicon-ui/theme-switch-eclipse` |
| [Split](https://ui.teamofsilicons.com/theme-switch-split) | The next appearance opens from a slim center seam. | `npx shadcn@latest add @silicon-ui/theme-switch-split` |
| [Rise](https://ui.teamofsilicons.com/theme-switch-rise) | The next appearance rises into place. | `npx shadcn@latest add @silicon-ui/theme-switch-rise` |

### Inputs

**Text fields**

| Component | Description | Install |
| --- | --- | --- |
| [Input](https://ui.teamofsilicons.com/input) | A single line field with clear labels and useful states. | `npx shadcn@latest add @silicon-ui/input` |
| [Textarea](https://ui.teamofsilicons.com/textarea) | A multiline field for notes, descriptions, and longer text. | `npx shadcn@latest add @silicon-ui/textarea` |
| [Password field](https://ui.teamofsilicons.com/password-field) | Capture sensitive text with a visible reveal control. | `npx shadcn@latest add @silicon-ui/password-field` |
| [Password strength](https://ui.teamofsilicons.com/password-strength) | Show how strong a new password is while it is typed. | `npx shadcn@latest add @silicon-ui/password-strength` |
| [Search field](https://ui.teamofsilicons.com/search-field) | A recognizable search entry point with clear affordances. | `npx shadcn@latest add @silicon-ui/search-field` |
| [Expanding search](https://ui.teamofsilicons.com/expanding-search) | An icon that morphs into a search field with results beneath it. | `npx shadcn@latest add @silicon-ui/expanding-search` |
| [Inline edit](https://ui.teamofsilicons.com/inline-edit) | Rename in place: the text becomes a field without moving. | `npx shadcn@latest add @silicon-ui/inline-edit` |

**Special inputs**

| Component | Description | Install |
| --- | --- | --- |
| [Number field](https://ui.teamofsilicons.com/number-field) | Enter a bounded number with clear increment controls. | `npx shadcn@latest add @silicon-ui/number-field` |
| [Money input](https://ui.teamofsilicons.com/money-input) | A currency field with live grouping, stable width, rolling digits, and minor-unit output. | `npx shadcn@latest add @silicon-ui/money-input` |
| [Phone input](https://ui.teamofsilicons.com/phone-input) | A phone field with a country picker, formatting as you type, and E.164 output. | `npx shadcn@latest add @silicon-ui/phone-input` |
| [Tag input](https://ui.teamofsilicons.com/tag-input) | Turn short text values into removable tags. | `npx shadcn@latest add @silicon-ui/tag-input` |
| [Mention input](https://ui.teamofsilicons.com/mention-input) | A textarea with @people and #channel mentions that act as single tokens, with suggestions at the caret. | `npx shadcn@latest add @silicon-ui/mention-input` |
| [Shortcut recorder](https://ui.teamofsilicons.com/shortcut-recorder) | Record key combinations into key caps, with conflict warnings, Kbd, and a searchable cheatsheet. | `npx shadcn@latest add @silicon-ui/shortcut-recorder` |

**Selects**

| Component | Description | Install |
| --- | --- | --- |
| [Select](https://ui.teamofsilicons.com/select) | A compact choice field with a keyboard friendly menu. | `npx shadcn@latest add @silicon-ui/select` |
| [Combobox](https://ui.teamofsilicons.com/combobox) | Search and select from a list without leaving the field. | `npx shadcn@latest add @silicon-ui/combobox` |
| [Multi-select](https://ui.teamofsilicons.com/multi-select) | Select several values while keeping the field readable. | `npx shadcn@latest add @silicon-ui/multi-select` |
| [Morph select](https://ui.teamofsilicons.com/morph-select) | A select whose trigger grows into the list, with a gliding highlight and type-ahead. | `npx shadcn@latest add @silicon-ui/morph-select` |
| [Chip group](https://ui.teamofsilicons.com/chip-group) | Filter by a few facets with chips that morph as you pick them. | `npx shadcn@latest add @silicon-ui/chip-group` |

**Toggles**

| Component | Description | Install |
| --- | --- | --- |
| [Radio cards](https://ui.teamofsilicons.com/radio-cards) | Selectable option cards with a sliding selection ring, price and description slots, and radio keyboard behavior. | `npx shadcn@latest add @silicon-ui/radio-cards` |
| [Billing toggle](https://ui.teamofsilicons.com/billing-toggle) | A monthly and yearly switch with a savings badge and prices that roll to the new amount. | `npx shadcn@latest add @silicon-ui/billing-toggle` |
| [Checkbox](https://ui.teamofsilicons.com/checkbox) | A binary choice with a precise, legible state. | `npx shadcn@latest add @silicon-ui/checkbox` |
| [Radio group](https://ui.teamofsilicons.com/radio-group) | Choose one option from a visible set. | `npx shadcn@latest add @silicon-ui/radio-group` |
| [Switch](https://ui.teamofsilicons.com/switch) | A tactile toggle for settings that take effect immediately. | `npx shadcn@latest add @silicon-ui/switch` |
| [Segmented control](https://ui.teamofsilicons.com/segmented-control) | Switch between a small set of related views. | `npx shadcn@latest add @silicon-ui/segmented-control` |

**Sliders**

| Component | Description | Install |
| --- | --- | --- |
| [Slider](https://ui.teamofsilicons.com/slider) | Pick a value or a range on a track that follows your finger. | `npx shadcn@latest add @silicon-ui/slider` |
| [Elastic slider](https://ui.teamofsilicons.com/elastic-slider) | A slider that stretches like rubber past its ends, with a swaying value tag and detents the thumb clicks into. | `npx shadcn@latest add @silicon-ui/elastic-slider` |

**Pickers**

| Component | Description | Install |
| --- | --- | --- |
| [Calendar](https://ui.teamofsilicons.com/calendar) | Browse dates in a clear, compact month view. | `npx shadcn@latest add @silicon-ui/calendar` |
| [Date picker](https://ui.teamofsilicons.com/date-picker) | Choose a date without losing context. | `npx shadcn@latest add @silicon-ui/date-picker` |
| [Date range picker](https://ui.teamofsilicons.com/date-range-picker) | A range picker that grows from its trigger into two months with presets and a stretching range highlight. | `npx shadcn@latest add @silicon-ui/date-range-picker` |
| [Time picker](https://ui.teamofsilicons.com/time-picker) | Choose a time with sensible keyboard behavior. | `npx shadcn@latest add @silicon-ui/time-picker` |
| [Color picker](https://ui.teamofsilicons.com/color-picker) | A swatch that grows into a picker with format morphing, eyedropper, saved swatches, and contrast readout. | `npx shadcn@latest add @silicon-ui/color-picker` |

**Editors**

| Component | Description | Install |
| --- | --- | --- |
| [Rich text editor](https://ui.teamofsilicons.com/rich-text-editor) | A lightweight editor with markdown shortcuts, a floating toolbar, a slash menu, and HTML and markdown output. | `npx shadcn@latest add @silicon-ui/rich-text-editor` |
| [Signature pad](https://ui.teamofsilicons.com/signature-pad) | Smooth ink that thins with speed, with undo, replay, and PNG or SVG export. | `npx shadcn@latest add @silicon-ui/signature-pad` |
| [File dropzone](https://ui.teamofsilicons.com/file-dropzone) | A generous target for dropping one or more files. | `npx shadcn@latest add @silicon-ui/file-dropzone` |

### Disclosure

**Navigation**

| Component | Description | Install |
| --- | --- | --- |
| [Tabs](https://ui.teamofsilicons.com/tabs) | Switch between related content in the same context. | `npx shadcn@latest add @silicon-ui/tabs` |
| [Breadcrumb](https://ui.teamofsilicons.com/breadcrumb) | Show where a page sits in a hierarchy. | `npx shadcn@latest add @silicon-ui/breadcrumb` |
| [Pagination](https://ui.teamofsilicons.com/pagination) | Move through a long collection with clear bounds. | `npx shadcn@latest add @silicon-ui/pagination` |

**Expand**

| Component | Description | Install |
| --- | --- | --- |
| [Scroll area](https://ui.teamofsilicons.com/scroll-area) | A native scroll container with thin overlay scrollbars and edge fades that appear only when content overflows. | `npx shadcn@latest add @silicon-ui/scroll-area` |
| [Accordion](https://ui.teamofsilicons.com/accordion) | Progressively reveal supporting information in place. | `npx shadcn@latest add @silicon-ui/accordion` |
| [Expandable card](https://ui.teamofsilicons.com/expandable-card) | Give a dense card more room when requested. | `npx shadcn@latest add @silicon-ui/expandable-card` |
| [Resizable panels](https://ui.teamofsilicons.com/resizable-panels) | Trade space between panes by dragging the divider between them. | `npx shadcn@latest add @silicon-ui/resizable-panels` |

**Overlays**

| Component | Description | Install |
| --- | --- | --- |
| [Dialog](https://ui.teamofsilicons.com/dialog) | A focused surface for decisions that need attention. | `npx shadcn@latest add @silicon-ui/dialog` |
| [Drawer](https://ui.teamofsilicons.com/drawer) | A temporary side surface for focused work. | `npx shadcn@latest add @silicon-ui/drawer` |
| [Bottom sheet](https://ui.teamofsilicons.com/bottom-sheet) | A sheet that rests at a peek or full height and follows your finger. | `npx shadcn@latest add @silicon-ui/bottom-sheet` |
| [Popover](https://ui.teamofsilicons.com/popover) | A small anchored surface for contextual information. | `npx shadcn@latest add @silicon-ui/popover` |
| [Hover card](https://ui.teamofsilicons.com/hover-card) | Preview a person or link on hover or focus without leaving the page. | `npx shadcn@latest add @silicon-ui/hover-card` |
| [Tooltip](https://ui.teamofsilicons.com/tooltip) | Short supporting text for unfamiliar controls. | `npx shadcn@latest add @silicon-ui/tooltip` |

### Feedback

**Messages**

| Component | Description | Install |
| --- | --- | --- |
| [Alert](https://ui.teamofsilicons.com/alert) | A persistent message that helps people recover or continue. | `npx shadcn@latest add @silicon-ui/alert` |
| [Toast](https://ui.teamofsilicons.com/toast) | Brief confirmation for a completed background action. | `npx shadcn@latest add @silicon-ui/toast` |
| [Toast stack](https://ui.teamofsilicons.com/toast-stack) | Stack short results at the edge until you reach for them. | `npx shadcn@latest add @silicon-ui/toast-stack` |
| [Announcement bar](https://ui.teamofsilicons.com/announcement-bar) | A top banner that rotates messages, counts down, and collapses smoothly when dismissed. | `npx shadcn@latest add @silicon-ui/announcement-bar` |

**Progress**

| Component | Description | Install |
| --- | --- | --- |
| [Progress](https://ui.teamofsilicons.com/progress) | Show how much of a known task is complete. | `npx shadcn@latest add @silicon-ui/progress` |
| [Skeleton](https://ui.teamofsilicons.com/skeleton) | Reserve space while content is still loading. | `npx shadcn@latest add @silicon-ui/skeleton` |
| [Stepper](https://ui.teamofsilicons.com/stepper) | Show where a person is in a multi-step flow and what is done. | `npx shadcn@latest add @silicon-ui/stepper` |
| [Countdown](https://ui.teamofsilicons.com/countdown) | A launch countdown with rolling digits that morphs into a live state at zero. | `npx shadcn@latest add @silicon-ui/countdown` |
| [Usage meter](https://ui.teamofsilicons.com/usage-meter) | Show what fills an allowance and how close it is to the limit. | `npx shadcn@latest add @silicon-ui/usage-meter` |

### Data

**Avatars**

| Component | Description | Install |
| --- | --- | --- |
| [Avatar](https://ui.teamofsilicons.com/avatar) | A compact identity marker for people and accounts. | `npx shadcn@latest add @silicon-ui/avatar` |
| [Avatar group](https://ui.teamofsilicons.com/avatar-group) | Show a team or set of contributors in a small space. | `npx shadcn@latest add @silicon-ui/avatar-group` |
| [Badge](https://ui.teamofsilicons.com/badge) | A small label for status, category, or metadata. | `npx shadcn@latest add @silicon-ui/badge` |

**Cards**

| Component | Description | Install |
| --- | --- | --- |
| [Card](https://ui.teamofsilicons.com/card) | A contained group of related content and actions. | `npx shadcn@latest add @silicon-ui/card` |
| [Metric card](https://ui.teamofsilicons.com/metric-card) | A compact summary for a number that needs context. | `npx shadcn@latest add @silicon-ui/metric-card` |
| [Empty state](https://ui.teamofsilicons.com/empty-state) | A useful next step when there is nothing to show yet. | `npx shadcn@latest add @silicon-ui/empty-state` |

**Charts**

| Component | Description | Install |
| --- | --- | --- |
| [Line chart](https://ui.teamofsilicons.com/line-chart) | A multi-series line chart with a gliding crosshair, legend toggles, and paths that morph between ranges. | `npx shadcn@latest add @silicon-ui/line-chart` |
| [Bar chart](https://ui.teamofsilicons.com/bar-chart) | Compare one measure across days and scrub any bar for its value. | `npx shadcn@latest add @silicon-ui/bar-chart` |
| [Donut chart](https://ui.teamofsilicons.com/donut-chart) | A donut whose arcs morph between datasets, with the active value rolling into the center. | `npx shadcn@latest add @silicon-ui/donut-chart` |
| [Streamgraph](https://ui.teamofsilicons.com/streamgraph) | Layered streams on a wiggle baseline that morph between ranges, with a layer you can isolate and read week by week. | `npx shadcn@latest add @silicon-ui/streamgraph` |
| [Brush chart](https://ui.teamofsilicons.com/brush-chart) | A dense time series with an overview strip: drag a window to zoom, resize it by its handles, and read events in place. | `npx shadcn@latest add @silicon-ui/brush-chart` |
| [Waffle chart](https://ui.teamofsilicons.com/waffle-chart) | A ten by ten unit chart where every cell is one percent, and cells fly to their new group when the data changes. | `npx shadcn@latest add @silicon-ui/waffle-chart` |
| [Slope chart](https://ui.teamofsilicons.com/slope-chart) | Before and after on two axes: lines draw in, rank moves sit beside each value, and switching datasets slides every line to its new slope. | `npx shadcn@latest add @silicon-ui/slope-chart` |
| [Sparkline](https://ui.teamofsilicons.com/sparkline) | Show a compact trend beside a value. | `npx shadcn@latest add @silicon-ui/sparkline` |
| [Gauge](https://ui.teamofsilicons.com/gauge) | Show a value against a known range. | `npx shadcn@latest add @silicon-ui/gauge` |
| [Activity heatmap](https://ui.teamofsilicons.com/activity-heatmap) | See a year of activity at a glance, one square per day. | `npx shadcn@latest add @silicon-ui/activity-heatmap` |
| [Animated counter](https://ui.teamofsilicons.com/animated-counter) | Give changing totals a clear sense of movement. | `npx shadcn@latest add @silicon-ui/animated-counter` |
| [Ridgeline](https://ui.teamofsilicons.com/ridgeline) | Overlapping distributions, one ridge per group: hover to lift a ridge and read its quartiles, switch datasets and every curve morphs. | `npx shadcn@latest add @silicon-ui/ridgeline` |
| [Treemap](https://ui.teamofsilicons.com/treemap) | A squarified treemap: click to drill and the tiles grow to fill the view, with a breadcrumb back and metrics that morph every tile. | `npx shadcn@latest add @silicon-ui/treemap` |

**Tables**

| Component | Description | Install |
| --- | --- | --- |
| [Sortable data table](https://ui.teamofsilicons.com/sortable-data-table) | Compare structured records with sortable columns. | `npx shadcn@latest add @silicon-ui/sortable-data-table` |
| [Tree view](https://ui.teamofsilicons.com/tree-view) | Navigate nested folders and structured content. | `npx shadcn@latest add @silicon-ui/tree-view` |
| [Filter toolbar](https://ui.teamofsilicons.com/filter-toolbar) | Keep collection filters close and easy to reset. | `npx shadcn@latest add @silicon-ui/filter-toolbar` |
| [Code block](https://ui.teamofsilicons.com/code-block) | Present code with legible hierarchy and copy access. | `npx shadcn@latest add @silicon-ui/code-block` |
| [JSON viewer](https://ui.teamofsilicons.com/json-viewer) | A collapsible JSON tree with search, paging for long arrays, and copy value or path. | `npx shadcn@latest add @silicon-ui/json-viewer` |

**Activity**

| Component | Description | Install |
| --- | --- | --- |
| [Timeline](https://ui.teamofsilicons.com/timeline) | Follow what happened, newest first, grouped by day. | `npx shadcn@latest add @silicon-ui/timeline` |
| [Comment thread](https://ui.teamofsilicons.com/comment-thread) | Threaded comments with replies, reactions, mentions, inline edit, and resolve. | `npx shadcn@latest add @silicon-ui/comment-thread` |
| [Chat thread](https://ui.teamofsilicons.com/chat-thread) | A chat thread with grouped messages, reactions, read receipts, typing, and a composer with attachments. | `npx shadcn@latest add @silicon-ui/chat-thread` |

**Media**

| Component | Description | Install |
| --- | --- | --- |
| [Image compare](https://ui.teamofsilicons.com/image-compare) | Drag a divider across two images to see what changed. | `npx shadcn@latest add @silicon-ui/image-compare` |
| [Carousel](https://ui.teamofsilicons.com/carousel) | Browse a row of slides by dragging, flicking, or arrowing through them. | `npx shadcn@latest add @silicon-ui/carousel` |
| [Card stack](https://ui.teamofsilicons.com/card-stack) | Review a deck one card at a time, with a throw and an undo. | `npx shadcn@latest add @silicon-ui/card-stack` |

### Text

**Text effects**

| Component | Description | Install |
| --- | --- | --- |
| [Text reveal](https://ui.teamofsilicons.com/text-reveal) | Reveal a short piece of content with restrained motion. | `npx shadcn@latest add @silicon-ui/text-reveal` |
| [In-view title](https://ui.teamofsilicons.com/in-view-title) | Bring a section title in as it scrolls into view. | `npx shadcn@latest add @silicon-ui/in-view-title` |
| [Text morph](https://ui.teamofsilicons.com/text-morph) | Morph a label into its next state, letter by letter. | `npx shadcn@latest add @silicon-ui/text-morph` |
| [Text shimmer](https://ui.teamofsilicons.com/text-shimmer) | Show ongoing work with a calm light across the words. | `npx shadcn@latest add @silicon-ui/text-shimmer` |

### Special

**Type**

| Component | Description | Install |
| --- | --- | --- |
| [Slot text](https://ui.teamofsilicons.com/slot-text) | Text and numbers that spin into their new value on staggered slot machine reels. | `npx shadcn@latest add @silicon-ui/slot-text` |

## Blocks

22 free blocks: complete sections and screens built from Silicon UI components.

### App shell

| Block | Description | Install |
| --- | --- | --- |
| [Page header](https://ui.teamofsilicons.com/page-header) | A project page header that folds into a compact bar as you scroll, with tabs whose counts roll. | `npx shadcn@latest add @silicon-ui/page-header` |
| [Command palette](https://ui.teamofsilicons.com/command-palette) | A complete keyboard driven action surface with search, grouped results, and shortcuts. | `npx shadcn@latest add @silicon-ui/command-palette` |
| [Notification center](https://ui.teamofsilicons.com/notification-center) | A home for updates with read state, grouped information, and animated disclosure. | `npx shadcn@latest add @silicon-ui/notification-center` |
| [Empty states](https://ui.teamofsilicons.com/empty-states) | Four empty states in one illustration whose shapes morph between scenes as you switch tabs. | `npx shadcn@latest add @silicon-ui/empty-states` |

### Auth

| Block | Description | Install |
| --- | --- | --- |
| [Sign up form](https://ui.teamofsilicons.com/signup-form) | An account creation flow with field validation, password strength, and a clear completion state. | `npx shadcn@latest add @silicon-ui/signup-form` |
| [Sign in](https://ui.teamofsilicons.com/sign-in) | A sign in card that morphs from email to a six digit code to your account. | `npx shadcn@latest add @silicon-ui/sign-in` |
| [Centered login](https://ui.teamofsilicons.com/login-centered) | A passkey-first login card on a quiet ring backdrop that morphs through email and code. | `npx shadcn@latest add @silicon-ui/login-centered` |
| [OTP input](https://ui.teamofsilicons.com/otp-input) | A six digit verification flow with paste support and keyboard navigation. | `npx shadcn@latest add @silicon-ui/otp-input` |

### Pricing

| Block | Description | Install |
| --- | --- | --- |
| [Plan comparison](https://ui.teamofsilicons.com/plan-comparison) | Compare meaningful differences between plans and billing periods. | `npx shadcn@latest add @silicon-ui/plan-comparison` |

### Media

| Block | Description | Install |
| --- | --- | --- |
| [File upload](https://ui.teamofsilicons.com/file-upload) | A complete file selection flow with constraints, progress, and error feedback. | `npx shadcn@latest add @silicon-ui/file-upload` |

### Heroes

| Block | Description | Install |
| --- | --- | --- |
| [Hero section](https://ui.teamofsilicons.com/hero-section) | Three full screen SaaS heroes: a live dashboard rising from the bottom edge over a drifting mesh, a workflow graph that routes sample events node by node, and editorial type over a mesh gradient. | `npx shadcn@latest add @silicon-ui/hero-section` |

### Features

| Block | Description | Install |
| --- | --- | --- |
| [Comparison table](https://ui.teamofsilicons.com/comparison-table) | An us versus them table with a sticky header, a highlighted column, and a stacked phone view. | `npx shadcn@latest add @silicon-ui/comparison-table` |

### Social proof

| Block | Description | Install |
| --- | --- | --- |
| [Logo marquee](https://ui.teamofsilicons.com/logo-marquee) | A quiet, continuously moving row of brand marks with a pause control. | `npx shadcn@latest add @silicon-ui/logo-marquee` |
| [Stats band](https://ui.teamofsilicons.com/stats-band) | Headline numbers that count up in view, each with a tiny visual that proves it and a context line on hover, plain or in a hairline grid. | `npx shadcn@latest add @silicon-ui/stats-band` |

### Content

| Block | Description | Install |
| --- | --- | --- |
| [Changelog feed](https://ui.teamofsilicons.com/changelog-feed) | Release notes you can filter, open in place, and scroll through month by month. | `npx shadcn@latest add @silicon-ui/changelog-feed` |
| [FAQ section](https://ui.teamofsilicons.com/faq-section) | FAQs as an accordion, a topic rail, or a searchable list that highlights matches. | `npx shadcn@latest add @silicon-ui/faq-section` |
| [Contact section](https://ui.teamofsilicons.com/contact-section) | A validated contact form that morphs into a confirmation, support channels, and office cards with local times. | `npx shadcn@latest add @silicon-ui/contact-section` |
| [Blog grid](https://ui.teamofsilicons.com/blog-grid) | A blog index with a featured post, category filter, post cards, pagination and an in-place reader. | `npx shadcn@latest add @silicon-ui/blog-grid` |

### Headers and footers

| Block | Description | Install |
| --- | --- | --- |
| [Site header](https://ui.teamofsilicons.com/site-header) | A sticky website header that turns solid on scroll, with a gliding active link, mega menu panels, and a mobile sheet. | `npx shadcn@latest add @silicon-ui/site-header` |
| [Site footer](https://ui.teamofsilicons.com/site-footer) | A website footer with link columns and newsletter, a minimal layout, and a large fading Silicon UI mark. | `npx shadcn@latest add @silicon-ui/site-footer` |
| [CTA section](https://ui.teamofsilicons.com/cta-section) | A call to action as a centered closing section, a split beside a setup card that completes itself, or a dismissible banner. | `npx shadcn@latest add @silicon-ui/cta-section` |
| [Newsletter signup](https://ui.teamofsilicons.com/newsletter-signup) | An email signup framed by a stack of past issues; subscribing drops the next issue, addressed to you, onto the front. | `npx shadcn@latest add @silicon-ui/newsletter-signup` |

## AI tools

Silicon UI is built to be used from AI coding tools.

- **shadcn MCP server:** shadcn's own MCP server can search and install from any registry, including this one. Run `npx shadcn@latest mcp init` in your project, then ask your assistant to add items from `@silicon-ui`.
- **llms.txt:** [`https://ui.teamofsilicons.com/llms.txt`](https://ui.teamofsilicons.com/llms.txt) lists every item with a link to its Markdown docs.
- **Markdown docs:** every item has a Markdown version at `https://ui.teamofsilicons.com/<id>.md`, with install steps, usage and the full props reference.

## Troubleshooting

<details>
<summary><b>Cannot find module <code>@/registry/...</code></b></summary>

<br>

Silicon UI files import each other through the `@/*` alias. Map it to your project root in `tsconfig.json` (and in `vite.config.ts` for Vite). See [Setting up a new project](#with-the-shadcn-cli).

</details>

<details>
<summary><b>Components render without styles or colors</b></summary>

<br>

Import the tokens once at the root: `import "@/registry/foundation.css";`. If the file is missing, run `npx shadcn@latest add @silicon-ui/silicon-foundation`.

</details>

<details>
<summary><b>The CLI says <code>@silicon-ui</code> is an unknown registry</b></summary>

<br>

Add the `registries` entry to `components.json` (see [With the shadcn CLI](#with-the-shadcn-cli)), or install from the full URL: `npx shadcn@latest add https://ui.teamofsilicons.com/r/<id>.json`.

</details>

<details>
<summary><b>Dark mode does not switch</b></summary>

<br>

Silicon UI follows the `data-theme` attribute on `<html>`, not the `dark` class. Set `data-theme="dark"` before the page paints to avoid a flash of the light theme.

</details>

<details>
<summary><b>Links and images: using next/link, next/image or your own components</b></summary>

<br>

Components render a plain `<a>` and `<img>`, so they work in Vite, Remix, Astro or plain React. To route them through Next.js, or through your own `Link` (for example a locale-aware one), wrap the app once with `SiliconProvider`. It installs with the components that use it.

```tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { SiliconProvider } from "@/components/silicon-ui/lib/silicon-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SiliconProvider link={Link} image={Image}>{children}</SiliconProvider>;
}
```

`link` receives `href` plus anchor attributes, and `image` receives `src`, `alt`, `width` and `height` or `fill`, `sizes` and `priority`, the same props next/image takes.

A few blocks are Next.js page examples and still import `next/image` or `next/link` directly: [`changelog-feed`](https://ui.teamofsilicons.com/changelog-feed), [`site-header`](https://ui.teamofsilicons.com/site-header), [`newsletter-signup`](https://ui.teamofsilicons.com/newsletter-signup). In another framework, replace `Image` with `<img>` (or `SiliconImage` from `silicon-provider`) and `Link` with `<a>`.

</details>

<details>
<summary><b>Animations do not play</b></summary>

<br>

Silicon UI honors the reduced motion setting of your operating system and swaps movement for simple fades. Turn it off to see the full motion, and make sure `motion` is installed.

</details>

<details>
<summary><b>The CLI asks to overwrite <code>foundation.css</code></b></summary>

<br>

Only `silicon-foundation` writes `foundation.css`; components and blocks depend on `silicon-motion-tokens` instead. If you re-run `add @silicon-ui/silicon-foundation` after customizing your tokens, answer no to keep your file, or keep your overrides in a separate stylesheet loaded after it.

</details>

## How releases work

Changes ship continuously. Every merge to `main` rebuilds the registry and redeploys [ui.teamofsilicons.com](https://ui.teamofsilicons.com), so the code here always matches what the CLI installs. Items are not versioned: run `npx shadcn@latest add @silicon-ui/<id> --overwrite` to pull the latest copy of anything you installed, and check the [changelog](./CHANGELOG.md) for what changed. Watch or star the repository to hear about new items.

## Repository layout

```text
registry/foundation.css      design tokens, light and dark themes
registry/motion-tokens.ts    motion presets
lib/motion-tokens.ts         motion presets, shared path
lib/                         small shared helpers
registry/components/<id>/    components
registry/blocks/<id>/        blocks
registry.json                shadcn registry index
public/r/<id>.json           built registry items, one per component or block (npm run build:registry)
site/                        the docs site at ui.teamofsilicons.com, with one demo per item in site/demos
```

## Contributing

Bug reports, fixes, new components and ideas are welcome, and pull requests are merged here directly. Read [CONTRIBUTING.md](./CONTRIBUTING.md) first, and please follow the [code of conduct](./CODE_OF_CONDUCT.md). To report a security issue, see [SECURITY.md](./SECURITY.md).

## Credits

Silicon UI started as a fork of [Arc](https://github.com/kuratlielia/arc-library) by Elia Kuratli, released under the MIT License. Thank you for the foundation. Demo photographs are from [Unsplash](https://unsplash.com); see [site/public/media/CREDITS.md](./site/public/media/CREDITS.md).

## License

[MIT](./LICENSE) © 2026 Team of Silicons, and © 2026 Elia Kuratli for the original Arc code.
