# Building screens with AI agents

Silicon UI is set up so an AI agent builds screens the same way a careful engineer would: it imports components, it
uses tokens, and when something is missing it stops instead of improvising. Three things make that work.

1. **It knows what exists**: the catalog `@teamofsilicons/silicon-ui/components.json` and the live docs.
2. **It is told the rules**: the `AGENTS.md` block below.
3. **It cannot drift unnoticed**: the Claude Code hook ([guardrails.md](guardrails.md#3-the-claude-code-hook)) checks
   every file it edits and hands the problems back.

## The AGENTS.md block

Paste this into the app's `AGENTS.md` (or `CLAUDE.md`):

```markdown
## Silicon UI (the design system)

Build every screen with `@teamofsilicons/silicon-ui`. Rules: https://github.com/teamofsilicons/silicon-ui/blob/main/docs/rules.md

- Before writing UI, read `node_modules/@teamofsilicons/silicon-ui/components.json` (every component, its import
  path and exports) and the component's types in `node_modules/@teamofsilicons/silicon-ui/components/<name>/`.
  Live previews: https://ui.teamofsilicons.com/<name>.
- Import components from `@teamofsilicons/silicon-ui/<name>`. Never write a raw <button>, <input>, <select>,
  <textarea> or <dialog>; never copy, patch or restyle a component; never import its .module.css.
- In CSS, spacing, radius, colour and font-size come from tokens: var(--space-*), var(--radius-*), var(--…colour…),
  var(--text-*). No raw px, rem, hex, rgb() or oklch() for those. A z-index of 10 or more is a var(--layer-*) token;
  the app's own header, sidebar and toolbars stay below var(--layer-overlay).
- The product's look is set only in the theme file (styles/tokens.css). Do not change it to make a screen work.
- If a component, variant or behaviour is missing: STOP and tell me what is missing. Do not build a workaround.
- A hook checks every file you edit. When it reports problems, fix them before doing anything else.
- Before finishing: lint and `silicon-ui-check` pass.
```

## How an agent should work on a screen

1. Read the design (a spec, a sketch, a reference) and list the components it needs from the catalog.
2. If anything is missing, report it and wait.
3. Build the layout with the screen's own CSS module, using spacing tokens for every gap.
4. Compose components; pass `className` only for placement.
5. Let the hook and lint correct it; finish when both pass.
6. Look at it in the browser at desktop and phone widths before calling it done. The checks prove consistency, not
   that it is good.

## The catalog

`components.json` is generated on every build. Each entry:

```json
{ "name": "metric-card", "import": "@teamofsilicons/silicon-ui/metric-card", "title": "Metric card",
  "description": "A compact summary for a number that needs context.", "exports": ["MetricCardProps", "MetricCard"] }
```

Props, with their documentation, are in each component's `.d.ts` next to it.
