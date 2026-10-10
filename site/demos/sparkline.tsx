import { Sparkline, type SparklineProps } from "@/registry/components/sparkline/sparkline";
import { defineDemo } from "../lib/demo";

const DAY = 86_400_000;
const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
/** The last fourteen days, oldest first, one label per point. */
const labels = Array.from({ length: 14 }, (_, index) => short.format(today - (13 - index) * DAY));

const resolved = [742, 701, 812, 846, 798, 903, 951, 620, 588, 984, 1_022, 1_007, 1_096, 1_143];
const handleTime = [6.4, 6.1, 6.3, 5.8, 5.6, 5.9, 5.7, 5.2, 5.0, 4.9, 4.7, 4.8, 4.5, 4.3];
const spend = [212, 218, 225, 231, 246, 251, 268, 274, 289, 301, 318, 326, 341, 358];

const row = { display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", width: "min(100%, 640px)" } as const;

export default defineDemo<SparklineProps>({
  props: { data: resolved, labels, label: "Tickets resolved", value: "1,143", change: "+18%", tone: "success", formatValue: value => value.toLocaleString("en-US"), width: 240 },
  hideControls: ["data", "labels"],
  Preview: ({ props }) => <div style={{ width: `min(100%, ${props.width ?? 160}px)` }}><Sparkline {...props} /></div>,
  examples: [
    {
      title: "A row of metrics",
      description: "Each sparkline carries its own headline and change. Scrub one to read a single day.",
      render: () => <div style={row}>
        <Sparkline label="Tickets resolved" value="1,143" change="+18%" tone="success" data={resolved} labels={labels} formatValue={value => value.toLocaleString("en-US")} />
        <Sparkline label="Handle time" value="4.3 min" change="−33%" tone="success" data={handleTime} labels={labels} formatValue={value => `${value.toFixed(1)} min`} />
        <Sparkline label="Compute spend" value="$358" change="+69%" tone="warning" data={spend} labels={labels} formatValue={value => `$${value}`} />
      </div>,
    },
    {
      title: "Static, without the area",
      render: () => <Sparkline label="Escalations" value="14" change="−6" tone="accent" area={false} interactive={false} data={[31, 28, 26, 27, 22, 19, 21, 18, 17, 15, 16, 14]} />,
    },
  ],
  usage: `<Sparkline
  label="Tickets resolved"
  value="1,143"
  change="+18%"
  tone="success"
  data={[812, 846, 798, 903, 951, 984, 1022, 1143]}
/>`,
});
