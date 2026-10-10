import { useState } from "react";

import { SlopeChart, type SlopeChartProps, type SlopeItem } from "@/registry/components/slope-chart/slope-chart";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

/** Share of tickets each queue's silicon closed without a person stepping in. */
const periods: Record<string, { startLabel: string; endLabel: string; data: SlopeItem[] }> = {
  q2q3: {
    startLabel: "Q2",
    endLabel: "Q3",
    data: [
      { key: "billing", label: "Billing", start: 41, end: 68 },
      { key: "password", label: "Password resets", start: 82, end: 91 },
      { key: "shipping", label: "Shipping", start: 57, end: 63 },
      { key: "refunds", label: "Refunds", start: 34, end: 52 },
      { key: "integrations", label: "Integrations", start: 29, end: 24 },
      { key: "enterprise", label: "Enterprise", start: 18, end: 22 },
    ],
  },
  q1q2: {
    startLabel: "Q1",
    endLabel: "Q2",
    data: [
      { key: "billing", label: "Billing", start: 22, end: 41 },
      { key: "password", label: "Password resets", start: 74, end: 82 },
      { key: "shipping", label: "Shipping", start: 49, end: 57 },
      { key: "refunds", label: "Refunds", start: 31, end: 34 },
      { key: "integrations", label: "Integrations", start: 12, end: 29 },
      { key: "enterprise", label: "Enterprise", start: 15, end: 18 },
    ],
  },
};

const percent = (value: number) => `${value}%`;
const points = (change: number) => `${change > 0 ? "+" : ""}${change} pts`;

function SwitchingSlope(props: SlopeChartProps) {
  const [period, setPeriod] = useState("q2q3");
  return <div style={{ display: "grid", gap: 16, width: "min(100%, 520px)" }}>
    <SegmentedControl label="Comparison" value={period} onValueChange={setPeriod} options={[{ value: "q1q2", label: "Q1 → Q2" }, { value: "q2q3", label: "Q2 → Q3" }]} />
    <SlopeChart {...props} {...periods[period]!} />
  </div>;
}

export default defineDemo<SlopeChartProps>({
  props: { ...periods.q2q3!, label: "Tickets closed without a person", highlightKey: "billing", formatValue: percent, formatChange: points },
  hideControls: ["data", "startLabel", "endLabel", "activeKey"],
  Preview: ({ props }) => <SwitchingSlope {...props} />,
  examples: [
    {
      title: "Two items, no ranks",
      render: () => <div style={{ width: "min(100%, 420px)" }}>
        <SlopeChart label="Median first response" startLabel="Before silicons" endLabel="After" ranks={false} formatValue={value => `${value} min`} formatChange={change => `${change} min`} data={[
          { key: "email", label: "Email", start: 312, end: 4 },
          { key: "chat", label: "Live chat", start: 46, end: 1 },
        ]} />
      </div>,
    },
  ],
  usage: `<SlopeChart
  label="Tickets closed without a person"
  startLabel="Q2"
  endLabel="Q3"
  highlightKey="billing"
  formatValue={value => \`\${value}%\`}
  data={[
    { key: "billing", label: "Billing", start: 41, end: 68 },
    { key: "refunds", label: "Refunds", start: 34, end: 52 },
    { key: "integrations", label: "Integrations", start: 29, end: 24 },
  ]}
/>`,
});
