# Demos

One file per registry item: `site/demos/<item-name>.tsx`, where `<item-name>` is the item's `name` in `registry.json`
(for example `button.tsx`, `theme-switch-eclipse.tsx`, `hero-section.tsx`). The file default-exports `defineDemo({...})`
from `../lib/demo`. Read `site/lib/demo.ts` for the full contract.

The site already knows each item's props: `npm run site:extract` reads them from the TypeScript source (types,
defaults, JSDoc) into `site/generated/catalog.json`. From that it builds:

- **Controls** for every simple prop (string-literal unions, booleans, numbers, strings). A demo only supplies the
  data a component cannot render without, and realistic copy.
- **An event log** for every declared `on*` callback. The demo's own handler (in `props` or called from `Preview`)
  still runs.
- **Examples** that render each value of `variant`, `tone`, `size`, `appearance` and `layout` side by side.
- **Usage** code generated from the live control values, unless the demo sets `usage`.

## Writing one

```tsx
import { Badge } from "@/registry/components/badge/badge";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: Badge,
  props: { children: "Live", tone: "success" },
});
```

Use `Preview` when the component needs state or composition. It is rendered as a component, so hooks work. Spread
`props` so the controls still apply, and call `props.onX` from your own handlers so the event log still fills.

```tsx
export default defineDemo<SegmentedControlProps>({
  props: { label: "Range", options },
  hideControls: ["value"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("week");
    return <SegmentedControl {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} />;
  },
});
```

`button.tsx`, `segmented-control.tsx`, `dialog.tsx` and `tabs.tsx` are complete references.

## Rules

- Import components from `@/registry/...`, never from `components/silicon-ui/...`.
- Use realistic, specific copy. The product is Team of Silicons, which deploys AI employees ("silicons") into
  companies, so departments, teams, tickets, invoices, deployments and usage make good sample data. Keep it plausible
  and short.
- Photos and portraits: use `people` and `photos` from `@/lib/media` (served by the site). Never hotlink other images.
- Hide controls the preview owns (`value`, `open`, `checked` when the preview controls them) with `hideControls`.
- Add `examples` for the states that matter and are not covered by the automatic variant row: icons, disabled,
  error, empty, loading, long content, a second configuration. Usually 1 to 3. Do not repeat the variant row.
- Set `usage` when the generated one would be misleading: compound components, controlled state, required data.
  Keep it short and copyable.
- Blocks need no props; `defineDemo({ component: Block })` is often enough. Blocks get the full-width stage.
- Size components sensibly inside the stage: a field or chart wants a width such as
  `style={{ width: "min(100%, 360px)" }}` on a wrapping `div` in `Preview`.
- Only plain inline styles for layout in demos; no new CSS files.
- Type-check: `npm run site:extract && npx tsc -p site/tsconfig.json --noEmit`. Every demo must type-check.
