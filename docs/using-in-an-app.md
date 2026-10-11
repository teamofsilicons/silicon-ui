# Using Silicon UI in an app

## Install

```sh
npm install @teamofsilicons/silicon-ui
```

React 19 is required. The Radix primitives, Motion and Lucide icons come with it.

## Load the tokens once

In the root layout (Next.js `app/layout.tsx`) or the entry file (Vite `main.tsx`):

```tsx
import "@teamofsilicons/silicon-ui/styles.css";
```

Then import your own theme file after it (see [Theming](#theming)).

## Import components

Each component has its own path, so an app only ships what it uses:

```tsx
import { Button } from "@teamofsilicons/silicon-ui/button";
import { ButtonLink } from "@teamofsilicons/silicon-ui/button-link";
import { Dialog, DialogContent } from "@teamofsilicons/silicon-ui/dialog";
```

The import path is the component's name on [ui.teamofsilicons.com](https://ui.teamofsilicons.com), which shows
every prop and variant live. `@teamofsilicons/silicon-ui/components.json` lists every component with its exports.

Components bring their own CSS modules; Next.js and Vite load them automatically. Also available:

| Path | What |
| --- | --- |
| `@teamofsilicons/silicon-ui/provider` | `SiliconProvider`: the link and image elements components render |
| `@teamofsilicons/silicon-ui/motion-tokens` | durations, easings and springs for your own Motion animations |
| `@teamofsilicons/silicon-ui/lib/<name>` | shared helpers, such as `return-focus` and `escape` for custom layers |
| `@teamofsilicons/silicon-ui/eslint` | the guardrail rules ([guardrails.md](guardrails.md)) |

## Links and images

Components render a plain `<a>` and `<img>`. To use your router's link and your framework's image, wrap the app once:

```tsx
import Link from "next/link";
import Image from "next/image";
import { SiliconProvider } from "@teamofsilicons/silicon-ui/provider";

<SiliconProvider link={Link} image={Image}>{children}</SiliconProvider>
```

For a link that looks like a button, use `ButtonLink`. It renders on the server with no script; pass `as={Link}` for
client-side navigation.

## Theming

A product changes how Silicon UI looks **only through tokens**, never by editing or restyling a component. Set them
in a theme file loaded after `styles.css`:

```css
/* styles/tokens.css */
:root {
  --background: #FFFDF9;          /* surfaces and text: see foundation.css for the full list */
  --foreground: #1E1E1C;
  --accent: #1F5CB1;
  --primary: #1F5CB1;             /* filled primary buttons */
  --primary-foreground: #FFFFFF;
  --avatar-radius: 30%;           /* profile pictures: circles by default */
  --avatar-corner-shape: squircle;
  --font-body: "BDO Grotesk", system-ui, sans-serif;
}
```

On `<html>`:

| Attribute | Values |
| --- | --- |
| `data-theme` | `light`, `dark` |
| `data-accent` | `neutral`, `violet`, `blue`, `green`, `amber`, `orange`, `coral`, `rose` |
| `data-corners` | `squircle` (default), `round` |

### What an app may and may not change

| May | May not |
| --- | --- |
| Set any token's value in its theme file | Edit a component's code or copy it into the app |
| Add its own tokens for its own layouts (named by role, e.g. `--page-narrow`) | Import a component's `.module.css` to style its own element |
| Style its own layout around components (grid, columns, page width) | Override a component's internal classes |
| Pass `className` for placement (margins, grid area, width) | Use `className` to change a component's colour, radius, padding or type |

If a component needs to look or behave differently, that is a library change: see [contributing.md](contributing.md).

## Spacing, radius and type scales

Use these in your own CSS too (`silicon-ui-check` enforces it):

| Space | px | | Radius | px | | Type | rem |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `--space-tight` | 4 | | `--radius-detail` | 2 | | `--text-xs` | .75 |
| `--space-related` | 8 | | `--radius-control` | 6 | | `--text-sm` | .875 |
| `--space-group` | 12 | | `--radius-container` | 8 | | `--text-base` | 1 |
| `--space-inset` | 16 | | `--radius-overlay` | 12 | | `--text-lg` | 1.125 |
| `--space-comfort` | 20 | | `--radius-full` | 999 | | `--text-xl` | 1.375 |
| `--space-section` | 24 | | | | | `--text-2xl` | 1.75 |
| `--space-block` | 32 | | | | | `--text-3xl` | 2.25 |
| `--space-page` | 48 | | | | | `--text-4xl` | 3.25 |
| `--space-stage` | 64 | | | | | `--text-5xl` | 4.5 |
| `--space-screen` | 80 | | | | | | |

Under squircle corners the radii are compensated automatically (4 / 11 / 14 / 21), so both corner shapes feel
equally round.
