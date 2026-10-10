import { useState } from "react";

import { BrushChart, type BrushChartAnnotation, type BrushChartDatum, type BrushChartProps } from "@/registry/components/brush-chart/brush-chart";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

const DAY = 86_400_000;
const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const launches = { finance: today - 240 * DAY, model: today - 120 * DAY, sales: today - 45 * DAY };

/** A year of tasks completed by silicons each day: quieter weekends, and a step up after each launch. */
const data: BrushChartDatum[] = (() => {
  const random = seeded(2026);
  return Array.from({ length: 365 }, (_, index) => {
    const date = today - (364 - index) * DAY;
    const weekend = [0, 6].includes(new Date(date).getUTCDay()) ? .6 : 1;
    const lift = (date >= launches.finance ? 1.35 : 1) * (date >= launches.model ? 1.2 : 1) * (date >= launches.sales ? 1.25 : 1);
    return { date, value: Math.round((1_800 + index * 2.2) * lift * weekend * (.92 + random() * .16)) };
  });
})();

const annotations: BrushChartAnnotation[] = [
  { date: launches.finance, label: "Finance silicon", description: "Invoice matching and reconciliation went live." },
  { date: launches.model, label: "Model upgrade", description: "Every silicon moved to the faster reasoning model." },
  { date: launches.sales, label: "Sales silicon", description: "Lead research and CRM hygiene went live." },
];

const spans: Record<string, number> = { "30d": 30, "90d": 90, "1y": 365 };

function ControlledRange(props: BrushChartProps) {
  const [preset, setPreset] = useState("90d");
  const [range, setRange] = useState<[number, number]>([today - 89 * DAY, today]);
  const choose = (next: string) => { setPreset(next); setRange([today - (spans[next]! - 1) * DAY, today]); };
  return <div style={{ display: "grid", gap: 16, width: "min(100%, 680px)" }}>
    <SegmentedControl label="Window" value={preset} onValueChange={choose} options={[{ value: "30d", label: "30 days" }, { value: "90d", label: "90 days" }, { value: "1y", label: "1 year" }]} />
    <BrushChart {...props} range={range} onRangeChange={next => { setRange(next); setPreset(""); props.onRangeChange?.(next); }} />
  </div>;
}

export default defineDemo<BrushChartProps>({
  props: { data, annotations, label: "Tasks completed", unit: "tasks", defaultRange: [today - 89 * DAY, today] },
  hideControls: ["data", "annotations", "range", "defaultRange", "minSpan"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 680px)" }}><BrushChart {...props} /></div>,
  examples: [
    {
      title: "Controlled window",
      description: "Presets set the range and the window glides there. Dragging the brush clears the preset.",
      render: () => <ControlledRange data={data} annotations={annotations} label="Tasks completed" unit="tasks" />,
    },
    {
      title: "Empty",
      render: () => <div style={{ width: "min(100%, 560px)" }}>
        <BrushChart data={[]} label="Invoices reconciled" height={160} overviewHeight={40} emptyLabel="No invoices reconciled yet" />
      </div>,
    },
  ],
  usage: `<BrushChart
  label="Tasks completed"
  unit="tasks"
  data={days} // [{ date: Date | epoch ms, value: number }], oldest first
  annotations={[{ date: launchDate, label: "Sales silicon", description: "Lead research went live." }]}
  defaultRange={[ninetyDaysAgo, today]}
/>`,
});
