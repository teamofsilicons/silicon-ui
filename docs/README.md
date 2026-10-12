# The Silicon design system

Silicon UI is how every Team of Silicons product looks, moves and reads the same, whoever builds the screen: a
designer, an engineer or an AI agent. It is three things working together:

1. **A library** of tokens and components, published to npm as `@teamofsilicons/silicon-ui`.
2. **Rules** for building screens with it ([rules.md](rules.md)).
3. **Guardrails** that enforce the rules automatically ([guardrails.md](guardrails.md)), so drift is caught when it
   is written, not found later on a screen.

The rest of this folder explains each part.

| Read this | When |
| --- | --- |
| [using-in-an-app.md](using-in-an-app.md) | Adding Silicon UI to an app, theming it for a product |
| [rules.md](rules.md) | Before building any screen |
| [guardrails.md](guardrails.md) | Setting up the checks and the Claude Code hook in an app |
| [ai-agents.md](ai-agents.md) | Letting AI agents build screens (the `AGENTS.md` block every app adds) |
| [inventory.md](inventory.md) | Everything the library has, with variants and status (generated) |
| [new-components.md](new-components.md) | Needing something new: when it is a new component or a variant, and the flow from request to stable |
| [contributing.md](contributing.md) | Fixing a component, adding a variant or a new component |
| [releasing.md](releasing.md) | Publishing a new version to npm |

## The layers

```
tokens        foundation.css: colour, space, radius, type, motion          → silicon-ui/styles.css
components    Button, Input, Dialog, Tabs, MetricCard … (110)              → silicon-ui/<name>
blocks        sign-in, hero-section, pricing … (22), copied into an app    → shadcn registry
screens       an app's pages, built only from the layers above             → the app's own repo
```

Each layer may only use the ones above it. A screen never sets a raw spacing, colour or radius; it uses a token. A
screen never re-creates a component; it imports it. When a screen needs something the library lacks, the library
grows (see [contributing.md](contributing.md)), and every app gets it.

**Components come from npm, blocks are copied.** A component is installed as a package, so its code lives in
`node_modules` where no one edits it by accident, and a fix ships to every app with a version bump. A block (a
pricing section, a sign-in card) is a starting point you are meant to adapt, so it is copied into the app with the
shadcn CLI; it is still built only from package components and tokens.

## Where things live

| What | Where |
| --- | --- |
| Library source | `registry/components/<name>/`, shared helpers in `lib/`, tokens in `registry/foundation.css` |
| Live previews and props | [ui.teamofsilicons.com](https://ui.teamofsilicons.com) (`site/`, one demo per item in `site/demos/`) |
| Storybook | `npm run storybook`: the same demos as stories, with controls and theme, accent and corner switches |
| npm package | `@teamofsilicons/silicon-ui`, built by `npm run build:package` from `packaging/` |
| Component catalog | `@teamofsilicons/silicon-ui/components.json`: every component, its import path and exports |
| Guardrails | `@teamofsilicons/silicon-ui/eslint` and the `silicon-ui-check` command, both in the package |
| This documentation | `docs/` |

## Why it is built this way

Earlier attempts rebuilt each Arc component from scratch with AI and measured the result against screenshots of
the Arc site. That was slow, flaky and still drifted. Silicon UI instead forks [Arc](https://github.com/kuratlielia/arc-library)'s
own code (MIT) and changes only what makes it Silicon: the spacing and radius scales, squircle corners, and
fixes that came from real products. Consistency comes from importing one library and checking against its tokens,
not from copying and comparing.
