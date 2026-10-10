import { useState } from "react";

import { Streamgraph, type StreamgraphDatum, type StreamgraphProps, type StreamgraphSeries } from "@/registry/components/streamgraph/streamgraph";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

const DAY = 86_400_000;
const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
// Weeks start on the Monday of the current week.
const thisWeek = today - ((new Date(today).getUTCDay() + 6) % 7) * DAY;
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const series: StreamgraphSeries[] = [
  { key: "billing", label: "Billing" },
  { key: "onboarding", label: "Onboarding" },
  { key: "integrations", label: "Integrations" },
  { key: "access", label: "Access requests" },
  { key: "bugs", label: "Bug reports" },
];

/** Weekly tickets by topic over the last 52 weeks. Each topic swells and fades on its own rhythm. */
const year: StreamgraphDatum[] = (() => {
  const random = seeded(19);
  return Array.from({ length: 52 }, (_, index) => {
    const t = thisWeek - (51 - index) * 7 * DAY;
    const wave = (period: number, phase: number) => 1 + .45 * Math.sin((index / period) * Math.PI * 2 + phase);
    return {
      key: new Date(t).toISOString().slice(0, 10),
      label: `Week of ${short.format(t)}`,
      axisLabel: short.format(t),
      values: {
        billing: Math.round(220 * wave(13, 0) + random() * 30),
        onboarding: Math.round(140 * wave(26, 1.2) * (1 + index / 80) + random() * 20),
        integrations: Math.round(110 * wave(17, 2.4) + random() * 20),
        access: Math.round(80 * wave(9, .6) + random() * 15),
        bugs: Math.round(60 * (index > 30 && index < 38 ? 2.2 : 1) + random() * 15),
      },
    };
  });
})();

const ranges: Record<string, StreamgraphDatum[]> = { "12w": year.slice(-12), "26w": year.slice(-26), "52w": year };

function RangeStream(props: StreamgraphProps) {
  const [range, setRange] = useState("26w");
  return <div style={{ display: "grid", gap: 16, width: "min(100%, 640px)" }}>
    <SegmentedControl label="Range" value={range} onValueChange={setRange} options={[{ value: "12w", label: "12 weeks" }, { value: "26w", label: "26 weeks" }, { value: "52w", label: "52 weeks" }]} />
    <Streamgraph {...props} data={ranges[range]!} />
  </div>;
}

export default defineDemo<StreamgraphProps>({
  props: { data: ranges["26w"], series, label: "Support tickets by topic", unit: "tickets", categoryLabel: "Week" },
  hideControls: ["data", "series", "hiddenSeries", "defaultHiddenSeries"],
  Preview: ({ props }) => <RangeStream {...props} />,
  examples: [
    {
      title: "Flat baseline, no legend",
      description: "offset=\"zero\" stacks from the axis, which reads better when totals matter more than flow.",
      render: () => <div style={{ width: "min(100%, 560px)" }}>
        <Streamgraph label="Support tickets by topic" unit="tickets" categoryLabel="Week" offset="zero" legend={false} height={200} series={series.slice(0, 3)} data={ranges["12w"]!} />
      </div>,
    },
  ],
  usage: `<Streamgraph
  label="Support tickets by topic"
  unit="tickets"
  series={[
    { key: "billing", label: "Billing" },
    { key: "onboarding", label: "Onboarding" },
    { key: "integrations", label: "Integrations" },
  ]}
  data={[
    { key: "2026-09-28", label: "Week of Sep 28", axisLabel: "Sep 28", values: { billing: 241, onboarding: 166, integrations: 98 } },
    { key: "2026-10-05", label: "Week of Oct 5", axisLabel: "Oct 5", values: { billing: 212, onboarding: 181, integrations: 124 } },
  ]}
/>`,
});
