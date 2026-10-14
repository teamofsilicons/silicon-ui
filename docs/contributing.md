# Changing the library

A new component or variant starts as a request: see [new-components.md](new-components.md) for when something new
is needed at all, and the flow from request to stable. This page is how to build it.

The library is the only place a component changes. When an app needs a fix, a variant or a new component, it is
made here, released, and then used by the app. This keeps every app consistent and means a fix is made once.

General contribution terms are in [CONTRIBUTING.md](../CONTRIBUTING.md). This page is the design-system workflow.

## Fixing or extending a component

1. Edit `registry/components/<name>/<name>.tsx` and its `.module.css`. Use tokens only ([rules.md](rules.md)); the
   library's own CSS follows the same rules as apps.
2. If the change is a new look an app wants, prefer a **token** over a prop when it is a theme decision (colour,
   shape), and a **prop** when it is a per-use choice (size, variant). Example: brand colour became `--primary`;
   avatar shape became `--avatar-radius` and `--avatar-corner-shape`.
3. Update its demo in `site/demos/<name>.tsx` if the change is visible.
4. Add a line to [CHANGELOG.md](../CHANGELOG.md) under today's date.
5. Run `npm run build:registry` and `npm run check`.

## Adding a component

Worked example: `ButtonLink`, added because Silicon Accounts had rebuilt "a link that looks like a button" three
times from `Button`'s CSS.

1. `registry/components/button-link/button-link.tsx` and `button-link.module.css`. Import shared code with `@/lib/…`
   and other components with `@/registry/components/<name>/<name>`.
2. Register it in `registry.json` (copy a neighbour's entry: name, title, description, categories, dependencies,
   registryDependencies, files, docs, meta).
3. A demo: `site/demos/button-link.tsx` with `defineDemo({ component, props, examples })` (see `site/demos/README.md`).
4. Changelog line, `npm run build:registry`, `npm run check`.
5. `npm run build:package` picks it up automatically: it is importable as `@teamofsilicons/silicon-ui/button-link`
   and listed in `components.json`.

## Bringing an app's fix upstream

Apps sometimes fix a component in place before the library has the fix. Bring it back like this (this is how the
Silicon Accounts round was done):

1. **Find the real edits.** Compare the app's copy with the library source, ignoring import paths. Most differences
   turn out to be path rewrites or type-only noise; the real edits are usually few.
2. **Sort each edit:**
   - a bug or accessibility fix every app needs → into the library as is;
   - a product's look → a token the app sets (never a hard-coded value in the component);
   - a product-only choice → stays in the app's theme file.
3. **Apply onto the current library**, not by copying the app's file over: the library may have moved on since the
   app copied it.
4. If the fix needs a shared helper, put it in `lib/` and add it to every registry item that uses it (as
   `lib/escape.ts` and `lib/return-focus.ts` are listed under `dialog`, `drawer`, `bottom-sheet` and `popover`).
5. Release, then switch the app to the package and delete its copy.

## Checks

| Command | What |
| --- | --- |
| `npm run typecheck` | TypeScript across the registry and lib |
| `npm run lint` | ESLint |
| `npm run check:registry` | every registry file exists, installs where it belongs, and `public/r` is current |
| `npm run check` | all three |
| `npm run site:dev` | the docs site locally, to look at the change |
| `npm run storybook` | Storybook on port 6006: every component and block, with controls and a theme, accent and corner switch |

## Storybook

`npm run storybook` regenerates `stories/` from the docs site's demos (`scripts/build-stories.mjs`) and starts
Storybook. There is nothing to write for it: give a component a demo in `site/demos/<name>.tsx` (its `props` become
the Default story's controls, its `examples` the Examples story) and it appears under its registry category. Do not
edit `stories/*.stories.tsx`; they are regenerated. `npm run build-storybook` writes a static Storybook to
`dist/storybook` for hosting.
