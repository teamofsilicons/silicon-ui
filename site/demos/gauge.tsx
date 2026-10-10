import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import { Gauge, type GaugeProps, type GaugeThreshold } from "@/registry/components/gauge/gauge";
import { defineDemo } from "../lib/demo";

const quota: GaugeThreshold[] = [
  { from: 0, tone: "success", label: "Plenty left" },
  { from: 75, tone: "warning", label: "Running low" },
  { from: 90, tone: "danger", label: "Almost out" },
];

/** Compute used this month against a 1,000 GPU-hour plan. Each click is another day of usage. */
function UsageThroughTheMonth() {
  const days = [312, 486, 640, 781, 868, 934];
  const [day, setDay] = useState(0);
  const used = days[day]!;
  return <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
    <Gauge label="Compute quota" value={used} max={1_000} thresholds={quota} detail={`${used.toLocaleString("en-US")} of 1,000 GPU-hours`} />
    <Button variant="secondary" size="sm" onClick={() => setDay(current => (current + 1) % days.length)}>{day === days.length - 1 ? "Start a new month" : "Next week"}</Button>
  </div>;
}

export default defineDemo<GaugeProps>({
  component: Gauge,
  props: { value: 72, label: "Auto-resolution rate", detail: "1,284 of 1,783 tickets" },
  examples: [
    {
      title: "Thresholds",
      description: "Bands name the state, so it never rests on color alone. The tone and label change as the count crosses each band.",
      render: () => <UsageThroughTheMonth />,
    },
  ],
});
