import { Volume1, Volume2 } from "lucide-react";

import ElasticSlider, { type ElasticSliderProps } from "@/registry/components/elastic-slider/elastic-slider";
import { defineDemo } from "../lib/demo";

const icon = { size: 18, strokeWidth: 1.75, "aria-hidden": true } as const;
const percent = (value: number) => `${value}%`;

export default defineDemo<ElasticSliderProps>({
  props: { label: "Alert volume", defaultValue: 64, format: percent, startIcon: <Volume1 {...icon} />, endIcon: <Volume2 {...icon} /> },
  hideControls: ["value", "defaultValue"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 380px)" }}><ElasticSlider {...props} /></div>,
  examples: [
    {
      title: "Detents",
      description: "Marks act as detents: a dragged thumb clicks into each one and holds for a few pixels before letting go.",
      render: () => <div style={{ width: "min(100%, 380px)" }}>
        <ElasticSlider label="Autonomy" defaultValue={50} format={percent}
          marks={[{ value: 0, label: "Ask first" }, { value: 50, label: "Act, then report" }, { value: 100, label: "Act alone" }]} />
      </div>,
    },
    {
      title: "Stepped and disabled",
      render: () => <div style={{ display: "grid", gap: 28, width: "min(100%, 380px)" }}>
        <ElasticSlider label="Daily task cap" defaultValue={400} min={50} max={1000} step={50} format={value => `${value} tasks`} />
        <ElasticSlider label="Reply delay" defaultValue={30} format={value => `${value} s`} disabled />
      </div>,
    },
  ],
  usage: `<ElasticSlider
  label="Alert volume"
  defaultValue={64}
  format={value => \`\${value}%\`}
  startIcon={<Volume1 size={18} />}
  endIcon={<Volume2 size={18} />}
/>`,
});
