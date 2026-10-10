import { ComparisonTable } from "@/registry/blocks/comparison-table/comparison-table";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: ComparisonTable,
  props: { maxHeight: "min(760px, 82vh)", cta: { label: "Start free trial", doneLabel: "Trial started" } },
  hideControls: ["differencesOnly", "compareWith"],
  stage: { minHeight: 640 },
  examples: [
    {
      title: "Differences only",
      description: "Rows where every column has the same value start hidden.",
      render: () => <ComparisonTable defaultDifferencesOnly maxHeight={560} />,
      stage: { layout: "fill", minHeight: 560 },
    },
    {
      title: "Stacked",
      description: "Below `stackBelow` the table becomes a two column comparison with a picker for the competitor.",
      render: () => <div style={{ maxWidth: 420, margin: "0 auto" }}><ComparisonTable maxHeight={560} stackBelow={10000} /></div>,
      stage: { layout: "fill", minHeight: 560 },
    },
  ],
  usage: `<ComparisonTable
  columns={columns}
  sections={sections}
  maxHeight="min(760px, 82vh)"
  cta={{ label: "Start free trial", href: "/signup" }}
/>`,
});
