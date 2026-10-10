import { Volume1, Volume2 } from "lucide-react";

import Slider, { type SliderProps } from "@/registry/components/slider/slider";
import { defineDemo } from "../lib/demo";

const usd = (value: number) => `$${value.toLocaleString("en-US")}`;
const hours = (value: number) => `${value} h`;
const icon = { size: 16, strokeWidth: 1.75, "aria-hidden": true, style: { color: "var(--text-muted)" } } as const;

export default defineDemo<SliderProps>({
  props: { label: "Monthly budget", defaultValue: 2400, min: 0, max: 10000, step: 100, format: usd },
  hideControls: ["value", "defaultValue"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 380px)" }}><Slider {...props} /></div>,
  examples: [
    {
      title: "Range with marks",
      description: "Pass a pair for two thumbs. Labelled marks print under the track, and clicking one moves the nearest thumb there.",
      render: () => <div style={{ width: "min(100%, 380px)" }}>
        <Slider label="Escalate after" defaultValue={[4, 12] as [number, number]} min={0} max={24} format={hours} minStepsBetweenThumbs={1}
          thumbLabels={["Earliest escalation", "Latest escalation"]}
          marks={[{ value: 0, label: "Now" }, { value: 8, label: "8 h" }, { value: 16, label: "16 h" }, { value: 24, label: "1 day" }]} />
      </div>,
    },
    {
      title: "Adornments and disabled",
      render: () => <div style={{ display: "grid", gap: 28, width: "min(100%, 380px)" }}>
        <Slider label="Alert volume" defaultValue={60} showValue={false} start={<Volume1 {...icon} />} end={<Volume2 {...icon} />} />
        <Slider label="Concurrent tasks" defaultValue={8} min={1} max={20} disabled />
      </div>,
    },
  ],
  usage: `<Slider
  label="Monthly budget"
  defaultValue={2400}
  min={0}
  max={10000}
  step={100}
  format={value => \`$\${value.toLocaleString("en-US")}\`}
/>

{/* A pair makes a range */}
<Slider label="Escalate after" defaultValue={[4, 12]} min={0} max={24} />`,
});
