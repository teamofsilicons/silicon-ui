import { useState } from "react";

import { BarChart, type BarChartDatum, type BarChartProps } from "@/registry/components/bar-chart/bar-chart";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

const DAY = 86_400_000;
const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
const dayMonth = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "narrow", timeZone: "UTC" });
const full = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const year = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "UTC" });

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Tasks the finance silicons finished each day: busier on weekdays, quiet on weekends. */
function daily(days: number, labelFor: (t: number, fromEnd: number) => string | undefined): BarChartDatum[] {
  const random = seeded(41);
  return Array.from({ length: days }, (_, index) => {
    const t = today - (days - 1 - index) * DAY;
    const weekend = [0, 6].includes(new Date(t).getUTCDay());
    return { key: new Date(t).toISOString().slice(0, 10), label: full.format(t), axisLabel: labelFor(t, days - 1 - index), value: Math.round(weekend ? 120 + random() * 60 : 380 + random() * 140) };
  });
}

function monthly(): BarChartDatum[] {
  const random = seeded(7);
  const current = new Date(today);
  return Array.from({ length: 12 }, (_, index) => {
    const t = Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - 11 + index, 1);
    return { key: new Date(t).toISOString().slice(0, 7), label: monthYear.format(t), axisLabel: month.format(t), value: Math.round((6_200 + index * 640) * (.9 + random() * .2)) };
  });
}

const span = (days: number) => `${dayMonth.format(today - (days - 1) * DAY)} – ${dayMonth.format(today)}, ${year.format(today)}`;

const ranges = {
  week: { data: daily(7, t => weekday.format(t)), period: span(7), averageLabel: "Daily average", categoryLabel: "Day" },
  month: { data: daily(30, (t, fromEnd) => fromEnd % 7 === 0 ? dayMonth.format(t) : undefined), period: span(30), averageLabel: "Daily average", categoryLabel: "Day" },
  year: { data: monthly(), period: "Last 12 months", averageLabel: "Monthly average", categoryLabel: "Month" },
};
type Range = keyof typeof ranges;

function RangeChart(props: BarChartProps) {
  const [range, setRange] = useState<Range>("week");
  return <div style={{ display: "grid", gap: 20, width: "min(100%, 560px)" }}>
    <SegmentedControl label="Range" value={range} onValueChange={next => setRange(next as Range)} options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }]} />
    <BarChart {...props} {...ranges[range]} />
  </div>;
}

export default defineDemo<BarChartProps>({
  props: { ...ranges.week, label: "Tasks completed", unit: "tasks" },
  hideControls: ["data", "period", "averageLabel", "categoryLabel"],
  Preview: ({ props }) => <RangeChart {...props} />,
  examples: [
    {
      title: "Compact, without the average",
      render: () => <div style={{ width: "min(100%, 360px)" }}>
        <BarChart label="Hours saved" unit="h" period={span(7)} height={120} showAverage={false} averageLabel="Per day" data={daily(7, t => weekday.format(t)).map(item => ({ ...item, value: Math.round(item.value / 9) }))} />
      </div>,
    },
  ],
  usage: `<BarChart
  label="Tasks completed"
  unit="tasks"
  period="Oct 4 – Oct 10, 2026"
  data={[
    { key: "2026-10-04", label: "Sun, Oct 4", axisLabel: "S", value: 142 },
    { key: "2026-10-05", label: "Mon, Oct 5", axisLabel: "M", value: 468 },
    { key: "2026-10-06", label: "Tue, Oct 6", axisLabel: "T", value: 431 },
  ]}
/>`,
});
