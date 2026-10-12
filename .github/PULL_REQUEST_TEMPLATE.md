## What this changes

<!-- One or two sentences. Link the request: Closes #123 -->

## Items

<!-- The component or block ids this touches, for example `date-picker`. -->

## For a new component or variant (docs/new-components.md)

- [ ] The request issue is **approved**, and its plan matches what this builds
- [ ] `npm run check:component -- <name>` passes (add `--base main` for a variant of an existing component); the report is committed in `stories/reports/`
- [ ] New components are registered with `"status": "experimental"`; promoting to stable is its own pull request
- [ ] Checked in Storybook: light and dark, desktop and phone widths, keyboard, reduced motion
- [ ] Design approval (Anil) and technical approval (an engineer)

## Every change

- [ ] `npm run check` passes (typecheck, lint, registry, every component on tokens)
- [ ] Demo added or updated in `site/demos/` (it is also the Storybook story)
- [ ] Changelog line added
- [ ] Screenshots or a short recording attached for visual changes
