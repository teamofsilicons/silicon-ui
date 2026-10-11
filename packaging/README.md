# Silicon UI

React components with calm motion, built on the Silicon design tokens. By Team of Silicons.
Browse every component at [ui.teamofsilicons.com](https://ui.teamofsilicons.com).

## Install

```sh
npm install @teamofsilicons/silicon-ui
```

Requires React 19.

## Use

Load the tokens once, in your root layout or entry file:

```tsx
import "@teamofsilicons/silicon-ui/styles.css";
```

Import each component from its own path:

```tsx
import { Button } from "@teamofsilicons/silicon-ui/button";
import { Input } from "@teamofsilicons/silicon-ui/input";

export function Example() {
  return <Button variant="primary">Save</Button>;
}
```

Components carry their own styles as CSS modules, so your bundler (Next.js, Vite) only loads the CSS of the
components you use. Theme, accent and corners are set on `<html>`:

```html
<html data-theme="light" data-accent="neutral" data-corners="squircle">
```

`data-theme` is `light` or `dark`. `data-accent` is `neutral`, `violet`, `blue`, `green`, `amber`, `orange`,
`coral` or `rose`. `data-corners` is `squircle` or `round`.

Fonts: the tokens use `--font-geist` and `--font-inter` when set (for example by `next/font`), and fall back to
Geist Variable, Inter Variable, then sans-serif.

## Links and images

Components render a plain `<a>` and `<img>` by default. To use your framework's, wrap the app once:

```tsx
import Link from "next/link";
import Image from "next/image";
import { SiliconProvider } from "@teamofsilicons/silicon-ui/provider";

<SiliconProvider link={Link} image={Image}>{children}</SiliconProvider>
```

## Catalog

`@teamofsilicons/silicon-ui/components.json` lists every component, its import path and its exports.


## Guardrails

Two checks keep an app on the system, so screens stay consistent however they are built (including by AI):

```js
// eslint.config.mjs: raw <button>, <input>, <select>, <textarea>, <dialog> and borrowed library CSS are errors
import siliconUi from "@teamofsilicons/silicon-ui/eslint";
export default [...yourConfig, ...siliconUi()];
```

```sh
npx silicon-ui-check                    # raw spacing, radius, colour or font size in CSS modules fails
npx silicon-ui-check --update-baseline  # tolerate today's legacy values; only new drift fails
```

Full guide, including the Claude Code hook: [docs/guardrails.md](https://github.com/teamofsilicons/silicon-ui/blob/main/docs/guardrails.md).

## Licence

MIT. Based on [Arc](https://github.com/kuratlielia/arc-library) by Elia Kuratli.
