# Guardrails

Two checks ship inside `@teamofsilicons/silicon-ui`. Together they make the [rules](rules.md) automatic: a screen
that re-creates a component or uses a raw value fails, with a message that says what to use instead.

| Check | Catches |
| --- | --- |
| ESLint config `@teamofsilicons/silicon-ui/eslint` | raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`; importing a component's CSS module; importing a local copy of a component |
| `silicon-ui-check` | raw spacing, radius, colour, font-size or z-index values in CSS modules |

They run in three places: in the editor and CI (lint), and after every AI edit (the Claude Code hook).

## 1. ESLint

```js
// eslint.config.mjs
import siliconUi from "@teamofsilicons/silicon-ui/eslint";

export default [
  ...yourConfig,
  ...siliconUi(),
];
```

Options: `files` (default every `.tsx`/`.jsx`), `ignores` (for a marked exception), `elements` (the element →
component table), `extraSyntax` / `extraImports` (your own entries for the two rules, because ESLint replaces a
rule's options rather than merging them; put `siliconUi()` last).

What a failure looks like:

```
6:29  error  <button> is not allowed here. Use Button (actions) or ButtonLink (navigation) from @teamofsilicons/silicon-ui
1:1   error  '@teamofsilicons/silicon-ui/button/button.module.css' import is restricted from being used by a pattern.
             Do not borrow a Silicon UI component's CSS. Render the component; if it lacks a variant, add it to the library
```

**An existing app with violations:** record them once with ESLint's bulk suppressions, so only new ones fail:

```sh
npx eslint . --suppress-all      # writes eslint-suppressions.json; commit it
npx eslint . --prune-suppressions # after fixing some, shrink the file
```

## 2. silicon-ui-check

Configure it in the app's `package.json`:

```json
"siliconUi": {
  "css": ["components/**/*.module.css", "app/**/*.module.css"],
  "ignore": ["styles/tokens.css"],
  "baseline": "silicon-ui-baseline.json"
}
```

Then:

```sh
npx silicon-ui-check                    # check every configured file
npx silicon-ui-check path/to/a.css      # check one file
npx silicon-ui-check --update-baseline  # record today's raw values (see below)
```

What a failure looks like:

```
components/landing/landing.module.css
  9  spacing: gap uses 20px; use a spacing token: var(--space-tight|related|group|inset|comfort|section|block|page|stage|screen)
  11  font-size: font-size uses 1.125rem; use a type token: var(--text-xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)
```

What it checks: `padding*`, `margin*`, `gap`, `inset*`, `top/right/bottom/left`, `scroll-margin/padding*` (space),
`border-*radius` (radius), any colour literal (`#hex`, `rgb()`, `hsl()`, `oklch()`, `oklab()`, `lab()`, `lch()`,
`color()`), `font-size`, and `z-index` of 10 or more, or -10 or less (layer; -9 to 9 is a local order inside a
component). Anything inside `var()` passes, fallbacks included. `em`, `%`, `ch`, `vw`/`vh`/`cq*`
pass. It skips custom property definitions (`--x: …`), `@keyframes`, and the visually hidden block (`.srOnly`).

### The baseline (adopting it in an existing app)

An app that predates the checks has raw values everywhere. `--update-baseline` records how many each file has, per
rule, in `silicon-ui-baseline.json`. From then on a file fails only when it has **more** than its baseline, so
legacy code is tolerated and new drift is not. When you clean a file, run `--update-baseline` again so its count
drops; counts should only ever go down. A file you redesign should leave the baseline entirely.

## 3. The Claude Code hook

This is what stops an AI agent from drifting while it works. After every file edit, the hook checks that file
(`silicon-ui-check` for CSS, the app's ESLint for `.ts`/`.tsx`). If it fails, the edit is reported back to the agent
with the problems, and the agent fixes them before moving on.

Add to the repository's `.claude/settings.json` (commit it, so everyone gets it):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/node_modules/.bin/silicon-ui-check --hook" }
        ]
      }
    ]
  }
}
```

In a repository where the app is in a subfolder (`web/`), use `"$CLAUDE_PROJECT_DIR"/web/node_modules/.bin/silicon-ui-check --hook`.
The hook finds the app's `package.json` from the edited file, so one hook serves several apps.

## 4. CI

Run both in the app's lint step so a pull request cannot add drift:

```json
"scripts": {
  "lint": "eslint --max-warnings=0 . && silicon-ui-check"
}
```

## What the guardrails do not catch

They are a floor, not a review. Still check by eye: layout and hierarchy, copy, a component used for the wrong job,
inline `style={{ … }}` values in TSX, and custom properties defined with raw values inside component CSS.
