import { useState } from "react";

import { LineChart, type LineChartDatum, type LineChartProps, type LineChartSeries } from "@/registry/components/line-chart/line-chart";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

const DAY = 86_400_000;
const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const full = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** Small deterministic noise, so the data is the same on every render. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const series: LineChartSeries[] = [
  { key: "silicons", label: "Silicons" },
  { key: "humans", label: "Support team" },
  { key: "previous", label: "Previous period", dashed: true },
];

/** Tickets resolved per day: silicons ramp up while the human team holds steady, with quieter weekends. */
function ticketsFor(days: number, labelEvery: number): LineChartDatum[] {
  const random = seeded(days * 7 + 3);
  return Array.from({ length: days }, (_, index) => {
    const t = today - (days - 1 - index) * DAY;
    const weekend = [0, 6].includes(new Date(t).getUTCDay()) ? .55 : 1;
    const ramp = 1 + index / days * .35;
    const silicons = Math.round((220 + random() * 40) * ramp * weekend);
    const humans = Math.round((96 + random() * 22) * weekend);
    const previous = Math.round((190 + random() * 40) * weekend);
    const fromEnd = days - 1 - index;
    return { key: new Date(t).toISOString().slice(0, 10), label: full.format(t), axisLabel: fromEnd % labelEvery === 0 ? short.format(t) : undefined, values: { silicons, humans, previous } };
  });
}

const ranges: Record<string, LineChartDatum[]> = { "7d": ticketsFor(7, 1), "30d": ticketsFor(30, 5), "90d": ticketsFor(90, 15) };

function RangeChart(props: LineChartProps) {
  const [range, setRange] = useState("30d");
  return <div style={{ display: "grid", gap: 16, width: "min(100%, 600px)" }}>
    <SegmentedControl label="Range" value={range} onValueChange={setRange} options={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "90d", label: "90 days" }]} />
    <LineChart {...props} data={ranges[range]!} />
  </div>;
}

const compute = Array.from({ length: 24 }, (_, hour) => {
  const busy = Math.sin(((hour - 6) / 24) * Math.PI * 2);
  const label = `${String(hour).padStart(2, "0")}:00`;
  return { key: label, label, axisLabel: hour % 6 === 0 ? label : undefined, values: { gpu: Math.round(38 + busy * 26 + (hour % 5) * 2) } };
});

export default defineDemo<LineChartProps>({
  props: { data: ranges["30d"], series, label: "Tickets resolved", unit: "tickets" },
  hideControls: ["data", "series", "hiddenSeries", "defaultHiddenSeries"],
  Preview: ({ props }) => <RangeChart {...props} />,
  examples: [
    {
      title: "Single series",
      description: "One measure needs no legend. Straight segments suit readings sampled on the hour.",
      render: () => <div style={{ width: "min(100%, 560px)" }}>
        <LineChart label="GPU utilisation" unit="%" curve="linear" height={180} categoryLabel="Hour" data={compute} series={[{ key: "gpu", label: "Utilisation" }]} formatTick={value => `${value}%`} />
      </div>,
    },
    {
      title: "Empty range",
      render: () => <div style={{ width: "min(100%, 560px)" }}>
        <LineChart label="Invoices reconciled" data={[]} series={[{ key: "invoices", label: "Invoices" }]} emptyLabel="No invoices reconciled in this range" />
      </div>,
    },
  ],
  usage: `<LineChart
  label="Tickets resolved"
  unit="tickets"
  series={[
    { key: "silicons", label: "Silicons" },
    { key: "humans", label: "Support team" },
    { key: "previous", label: "Previous period", dashed: true },
  ]}
  data={[
    { key: "2026-10-09", label: "Fri, Oct 9", axisLabel: "Oct 9", values: { silicons: 284, humans: 104, previous: 211 } },
    { key: "2026-10-10", label: "Sat, Oct 10", axisLabel: "Oct 10", values: { silicons: 162, humans: 58, previous: 118 } },
  ]}
/>`,
});
