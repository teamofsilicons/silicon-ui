# Rules for building screens

These rules apply to every screen in every Team of Silicons app, whoever writes it. The guardrails
([guardrails.md](guardrails.md)) check the ones a script can check; the rest are for review.

## 1. Use components, never re-create them

If Silicon UI has it, import it. Never write a raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<dialog>`, and
never rebuild a component's look from scratch or from its CSS.

| You need | Use |
| --- | --- |
| An action | `Button` |
| Navigation that looks like a button | `ButtonLink` |
| A text field | `Input`, `Textarea`, `PasswordField`, `PhoneInput`, `OtpInput`, `SearchField` … |
| A choice | `Select`, `Combobox`, `RadioGroup`, `RadioCards`, `Checkbox`, `Switch`, `SegmentedControl` |
| A layer | `Dialog`, `Drawer`, `BottomSheet`, `Popover`, `Tooltip`, `DropdownMenu` |
| A message | `Alert`, `Toast`, `EmptyState`, `Badge` |
| A number on a dashboard | `MetricCard`, `Sparkline`, `Gauge` |

The full list, with live previews, is at [ui.teamofsilicons.com](https://ui.teamofsilicons.com).

## 2. Tokens for every value that is part of the design

| Property | Use | Never |
| --- | --- | --- |
| padding, margin, gap, inset | `var(--space-*)` | `14px`, `1.5rem` |
| border-radius | `var(--radius-*)` | `7px` |
| colour (any property) | `var(--foreground)`, `var(--accent)` … | `#1F5CB1`, `rgb()`, `oklch()` |
| font-size | `var(--text-*)` | `17px`, `1.0625rem` |
| durations, easings | `var(--duration-*)`, `var(--ease-*)`, or `motionTokens` | `300ms`, `ease-in-out` |

Allowed: `0`, `auto`, keywords, `em`/`%`/`ch` (relative to the text or the box), `vw`/`vh`/`cq*` for fluid layout,
`calc()` of tokens, and 1px hairlines in `border` widths. Sizes that are not spacing (a column's `max-width`, an
icon's `width`) may use px.

When no token fits, do not invent one in a component. Pick the nearest token, and if the design really needs a new
step, propose it for the library.

## 3. Never edit or copy library code

A component's code lives in `node_modules`. Do not copy it into the app, patch it, or import its CSS module. An app
changes Silicon UI's look only through token values in its theme file ([using-in-an-app.md](using-in-an-app.md#theming)).

## 4. Missing something? Stop and send it upstream

If a screen needs a component, variant or behaviour Silicon UI lacks:

1. Stop. Do not build a workaround in the app.
2. Say what is missing (an AI agent reports it to the person it is working with).
3. Add it to the library ([contributing.md](contributing.md)), release, then use it.

**Exceptions** are allowed only when the library change is planned but not done yet. An exception must be:
marked in the code with a comment that says what it replaces and when it goes away, kept in its own file, and
listed in the app's README. Example: Silicon Accounts' date-of-birth field keeps a local copy of the date picker's
styles until `DatePicker` gets a year view.

## 5. Layout is the screen's job

Components do not know where they sit. A screen owns its grid, columns, page width and the space between sections,
and uses spacing tokens for all of it. Give app-level layout tokens role names (`--page-narrow`, `--gutter`) and
define them once in the theme file.

## 6. Accessibility comes with the components

Components handle focus, keyboard, labels and reduced motion. Keep it that way: give every field its `label`, every
icon-only button an `aria-label`, and do not suppress focus outlines.
