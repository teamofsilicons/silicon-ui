import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import { UsageMeter, type UsageMeterProps, type UsageMeterSegment } from "@/registry/components/usage-meter/usage-meter";
import { defineDemo } from "../lib/demo";

const segments: UsageMeterSegment[] = [
  { id: "support", label: "Support", value: 412 },
  { id: "finance", label: "Finance", value: 268 },
  { id: "sales", label: "Sales", value: 141 },
];

const box = { width: "min(100%, 460px)", display: "grid", gap: 16, justifyItems: "center" } as const;

function GrowingUsage() {
  const [extra, setExtra] = useState(0);
  const live = segments.map(segment => segment.id === "support" ? { ...segment, value: segment.value + extra } : segment);
  return <div style={box}>
    <div style={{ width: "100%" }}><UsageMeter label="Silicon hours this month" segments={live} limit={1000} unit="hours" decimals={0} /></div>
    <div style={{ display: "flex", gap: 8 }}>
      <Button variant="secondary" size="sm" onClick={() => setExtra(extra + 60)}>Add 60 support hours</Button>
      <Button variant="ghost" size="sm" disabled={extra === 0} onClick={() => setExtra(0)}>Reset</Button>
    </div>
  </div>;
}

export default defineDemo<UsageMeterProps>({
  props: { label: "Silicon hours this month", segments, limit: 1000, unit: "hours", decimals: 0 },
  Preview: ({ props }) => <div style={box}><div style={{ width: "100%" }}><UsageMeter {...props} /></div></div>,
  examples: [
    {
      title: "Filling up",
      description: "Segments re-flow and digits roll as usage grows. Past warnAt the status warns, and over the limit it says so.",
      render: () => <GrowingUsage />,
    },
  ],
  usage: `<UsageMeter
  label="Silicon hours this month"
  limit={1000}
  unit="hours"
  decimals={0}
  segments={[
    { id: "support", label: "Support", value: 412 },
    { id: "finance", label: "Finance", value: 268 },
  ]}
/>`,
});
