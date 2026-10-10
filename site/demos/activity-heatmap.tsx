import { useState } from "react";

import { ActivityHeatmap, type ActivityDay, type ActivityHeatmapProps } from "@/registry/components/activity-heatmap/activity-heatmap";
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

/** A year of tasks one silicon finished per day, oldest first. It went live `liveFor` days ago and has been ramping up since. */
function yearOf(seed: number, base: number, weekendShare: number, liveFor: number, endOfMonth = 0): ActivityDay[] {
  const random = seeded(seed);
  return Array.from({ length: 365 }, (_, index) => {
    const t = today - (364 - index) * DAY;
    const date = new Date(t);
    const age = liveFor - (364 - index);
    if (age < 0) return { date: date.toISOString().slice(0, 10), count: 0 };
    const weekend = [0, 6].includes(date.getUTCDay()) ? weekendShare : 1;
    const closing = date.getUTCDate() >= 26 ? 1 + endOfMonth : 1;
    const ramp = Math.min(1, .35 + age / 120);
    const quiet = random() < .06 ? 0 : 1;
    return { date: date.toISOString().slice(0, 10), count: Math.round(base * ramp * weekend * closing * quiet * (.5 + random())) };
  });
}

const silicons: Record<string, ActivityDay[]> = {
  support: yearOf(11, 42, .55, 330),
  finance: yearOf(23, 18, .08, 220, 1.6),
};

function SiliconActivity(props: ActivityHeatmapProps) {
  const [silicon, setSilicon] = useState("support");
  const [selected, setSelected] = useState<string | null>(null);
  return <div style={{ width: "min(100%, 960px)" }}>
    <ActivityHeatmap
      {...props}
      days={silicons[silicon]!}
      selectedDate={selected}
      onSelectDate={date => { setSelected(current => current === date ? null : date); props.onSelectDate?.(date); }}
      actions={<SegmentedControl label="Silicon" value={silicon} onValueChange={setSilicon} options={[{ value: "support", label: "Support" }, { value: "finance", label: "Finance" }]} />}
    />
  </div>;
}

/** The last twelve weeks of deployments, with fixed level bounds so a busy week does not wash out the rest. */
const deployments: ActivityDay[] = (() => {
  const random = seeded(5);
  return Array.from({ length: 84 }, (_, index) => {
    const date = new Date(today - (83 - index) * DAY);
    const weekend = [0, 6].includes(date.getUTCDay());
    return { date: date.toISOString().slice(0, 10), count: weekend ? 0 : Math.floor(random() * 7) };
  });
})();

export default defineDemo<ActivityHeatmapProps>({
  props: { days: silicons.support, label: "Tasks finished per day", period: "the last year", unit: { one: "task", other: "tasks" } },
  hideControls: ["days", "selectedDate", "unit", "thresholds"],
  Preview: ({ props }) => <SiliconActivity {...props} />,
  examples: [
    {
      title: "Shorter range, fixed levels",
      description: "Twelve weeks of deployments. thresholds pins the level bounds; weeks start on Monday.",
      render: () => <div style={{ width: "min(100%, 520px)" }}>
        <ActivityHeatmap days={deployments} label="Deployments in the last 12 weeks" period="the last 12 weeks" unit={{ one: "deployment", other: "deployments" }} thresholds={[1, 3, 5]} weekStartsOn={1} />
      </div>,
    },
  ],
  usage: `const [selected, setSelected] = useState<string | null>(null);

<ActivityHeatmap
  label="Tasks finished per day"
  period="the last year"
  unit={{ one: "task", other: "tasks" }}
  days={days} // [{ date: "2026-10-10", count: 42 }], oldest first
  selectedDate={selected}
  onSelectDate={setSelected}
/>`,
});
