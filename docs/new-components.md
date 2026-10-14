# New components and variants

Screens regularly need something the library does not have. This page is how that need becomes part of Silicon UI
without the library filling up with near-duplicates: first decide **whether** anything new is needed, then take it
through one flow, with the same checks every time.

## 1. Decide what the need really is

Work through these in order and stop at the first that fits. Most needs stop before step 4.

| Step | Ask | If yes | Example |
| --- | --- | --- | --- |
| 1. It exists | Is it in the [inventory](inventory.md) under another name, or already a variant? | Use it. | "A pill toggle" is `SegmentedControl`. |
| 2. Composition | Can a screen or block get it by arranging existing components? | Compose it in the app or as a block. No library change. | A settings row is a label, a description and a `Switch`. |
| 3. Token | Is the difference a product's look (colour, corner shape, avatar shape) rather than a different thing? | Set a token in the app's theme file. If the token does not exist, add the token (a small library change). | Brand-blue primary buttons are `--primary`. |
| 4. Variant | Same job and same structure as an existing component, different look, size or one extra part? | Add a prop to that component. | Tabs with icons are `TabsTrigger icon`. |
| 5. New component | A different job or a different structure, which no prop of an existing component could express without making it confusing? | Request a new component. | A date picker with a year view, if `DatePicker` cannot grow one cleanly. |

Two more tests before a new component:

- **Reuse:** it is needed in at least two places, or it is clearly general (not one screen's arrangement). A
  one-off belongs in the app.
- **Variant creep:** a variant that changes the structure, adds a second job, or needs more than two or three new
  props is usually a new component in disguise. A component with more than about six visual variants should be
  questioned the other way.

Write down which step you stopped at, and why, in the request. That reasoning is what gets reviewed.

## 2. The flow

Every request moves through these stages. The stage is a label on the request issue, and the component's
`meta.status` in `registry.json` once it has code.

```
requested → approved → in design → experimental → stable
                ↘ declined (with the step from section 1 that answers it)
```

| Stage | What happens | Who | Done when |
| --- | --- | --- | --- |
| **Requested** | Someone opens a *Component request* issue in `teamofsilicons/silicon-ui`: the need, where it is used, and the decision from section 1. | Anyone | The form is complete. |
| **Approved** | The request is checked against the inventory and section 1. If it holds, a short **plan** is agreed in the issue (template below). If not, it is declined with the alternative (compose, token, existing variant). | Anil | Anil approves the plan. |
| **In design** | The component is built in a branch: source, CSS module, demo, registry entry with `"status": "experimental"`, changelog line. | Whoever took it | `npm run check:component <name>` passes. |
| **Experimental** | The pull request is merged. The component is in Storybook under its category with an *experimental* badge and its **consistency report**, and in the next npm release, where apps can try it but the guardrails warn against shipping it. | Reviewers | Used in at least one real screen, and reviewed by eye in light and dark, at desktop and phone widths, with keyboard and reduced motion. |
| **Stable** | A small pull request sets `"status": "stable"`. It ships in the next release as a normal component. | Anil | Merged and released. |

**Approval** is one person, Anil, at the two decision points (the plan, and promotion to stable). Technical
correctness is not a separate human sign-off: it is what `npm run check`, `npm run check:component` and CI enforce,
and a change that fails them cannot be merged.

A **variant** goes through the same flow, but usually lighter: the plan is a paragraph, and the change stays
experimental only when it is large.

### The plan (posted in the request issue)

```markdown
**Decision:** variant of `<component>` / new component (step N of new-components.md, because …)
**Name and import:** `@teamofsilicons/silicon-ui/<name>`
**Job:** one sentence.
**Anatomy:** the parts, and which existing components they are (Button, Popover, …).
**Props and variants:** each prop, its values and default.
**States:** hover, focus, active, disabled, loading, error, empty — the ones that apply.
**Tokens:** spacing, radius, colour and type tokens it uses; any new token, and why.
**Motion:** what moves, with which motion tokens; what happens with reduced motion.
**Accessibility:** role, keyboard, labels, focus management.
**Where it will be used first:** the screen that needs it.
```

## 3. Consistency: `npm run check:component <name>`

New components are held to the library's own standard by a script, not by memory. It writes a report that is
shown on the component's Storybook page (the *Consistency* story) and fails if anything required is missing.

| Check | Required | What it looks at |
| --- | --- | --- |
| Tokens only | Yes | The component's CSS has no raw spacing, radius, colour or font size (`silicon-ui-check`, no baseline). |
| Motion from tokens | Yes | CSS transitions and animations use `--duration-*` and `--ease-*`; Motion code uses `motionTokens`, not typed numbers. |
| Reduced motion | Yes, if it moves | A `prefers-reduced-motion` rule or `useReducedMotion()`. |
| Built from the library | Warning | Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` where a Silicon UI component exists. Some primitives legitimately need them; the report lists them for the reviewer. |
| Registered | Yes | A `registry.json` entry with title, description, category and `meta.status`. |
| Demo | Yes | `site/demos/<name>.tsx`, which is also its Storybook story. |
| Changelog | Yes | A line naming it in `CHANGELOG.md`. |
| Props documented | Warning | Each exported prop has a JSDoc comment. |
| Renders | Yes, with `--storybook <url>` | Each of its stories renders without errors or console errors. |

The script is the floor. Review by eye still decides whether the component is *good*: hierarchy, motion feel,
copy, and whether it really is one thing.

## 4. Release

- `npm run build:package` ships every component, experimental ones included, and records each component's status in
  `components.json`.
- The ESLint guardrail (`@teamofsilicons/silicon-ui/eslint`) rejects experimental work until an app opts in with
  `siliconUi({ allowExperimental: ["<component>"] })`, so it can be tried in a branch but is visible in review. It
  works at three levels, all recorded in `registry.json` `meta`:
  - a whole new component: `"status": "experimental"` (any import of it);
  - new parts of a stable component: `"experimental": ["DropdownMenuContent", …]` (those named imports);
  - new values of a stable component's prop: `"experimentalProps": { "Button": { "size": ["xs"] } }` (`<Button size="xs">`).
- In CI, a variant of a stable component is judged on its own changes (against the pull request's base, or the commit
  before a push), so its older code does not fail the change.
- Promoting to stable is the status change plus a release ([releasing.md](releasing.md)). A component that changes
  shape while experimental does not need a breaking version bump; once stable, it does.
