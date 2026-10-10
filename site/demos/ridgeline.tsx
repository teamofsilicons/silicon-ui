import { useState } from "react";

import { Ridgeline, type RidgelineProps, type RidgelineSeries } from "@/registry/components/ridgeline/ridgeline";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Observations around a median with a long right tail, like real response times. Anything past 45 minutes is left out. */
function sample(seed: number, median: number, spread: number, count = 160) {
  const random = seeded(seed);
  return Array.from({ length: count }, () => {
    const normal = Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    return Math.max(.5, Math.round(median * Math.exp(normal * spread) * 10) / 10);
  }).filter(value => value <= 45);
}

/** Short labels: the label gutter is narrow (52px), so names longer than about seven characters are truncated. */
const queues = [
  { id: "login", label: "Login", before: [9, .45], after: [2.5, .5] },
  { id: "billing", label: "Billing", before: [20, .45], after: [5, .5] },
  { id: "orders", label: "Orders", before: [15, .4], after: [4, .5] },
  { id: "refunds", label: "Refund", before: [24, .4], after: [8, .5] },
  { id: "api", label: "API", before: [28, .35], after: [16, .45] },
  { id: "sso", label: "SSO", before: [24, .35], after: [20, .4] },
] as const;

/** First response times by queue, in minutes, before and after the support silicons went live. */
const datasets: Record<string, RidgelineSeries[]> = {
  before: queues.map((queue, index) => ({ id: queue.id, label: queue.label, values: sample(index * 31 + 1, queue.before[0], queue.before[1]) })),
  after: queues.map((queue, index) => ({ id: queue.id, label: queue.label, values: sample(index * 31 + 2, queue.after[0], queue.after[1]) })),
};

const minutes = (value: number) => `${Math.round(value * 10) / 10} min`;

function SwitchingRidges(props: RidgelineProps) {
  const [period, setPeriod] = useState("after");
  return <div style={{ display: "grid", gap: 16, width: "min(100%, 600px)" }}>
    <SegmentedControl label="Period" value={period} onValueChange={setPeriod} options={[{ value: "before", label: "Before silicons" }, { value: "after", label: "With silicons" }]} />
    <Ridgeline {...props} series={datasets[period]!} />
  </div>;
}

export default defineDemo<RidgelineProps>({
  props: { series: datasets.after, label: "First response time by queue", unit: "min", formatValue: minutes, domain: [0, 45] },
  hideControls: ["series", "domain", "active", "defaultActive"],
  Preview: ({ props }) => <SwitchingRidges {...props} />,
  examples: [
    {
      title: "Untinted, tighter rows",
      description: "Without tint every ridge shares one color; a smaller overlap keeps neighbours apart.",
      render: () => <div style={{ width: "min(100%, 520px)" }}>
        <Ridgeline label="Invoice processing time by entity" unit="h" tint={false} overlap={1.4} rowHeight={26} formatValue={value => `${Math.round(value * 10) / 10} h`} series={[
          { id: "us", label: "US", values: sample(91, 4, .4, 120) },
          { id: "uk", label: "UK", values: sample(92, 6, .35, 120) },
          { id: "de", label: "DE", values: sample(93, 9, .3, 120) },
          { id: "in", label: "IN", values: sample(94, 5, .5, 120) },
        ]} />
      </div>,
    },
    {
      title: "Empty",
      render: () => <div style={{ width: "min(100%, 520px)" }}><Ridgeline label="First response time by queue" series={[]} emptyLabel="No tickets in this period" /></div>,
    },
  ],
  usage: `<Ridgeline
  label="First response time by queue"
  unit="min"
  domain={[0, 45]}
  series={[
    { id: "billing", label: "Billing", values: [3.1, 2.8, 4.6, 3.9, 12.4] },
    { id: "refunds", label: "Refunds", values: [5.2, 6.8, 4.9, 9.1, 18.0] },
  ]}
/>`,
});
