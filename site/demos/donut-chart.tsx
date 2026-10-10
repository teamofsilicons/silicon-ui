import { useState } from "react";

import { DonutChart, type DonutChartDatum, type DonutChartProps } from "@/registry/components/donut-chart/donut-chart";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

/** Tickets the support silicons handled, by the channel they came in on. SMS and fax fall below the "Other" cutoff. */
const datasets: Record<string, DonutChartDatum[]> = {
  week: [
    { key: "email", label: "Email", value: 1_284 },
    { key: "chat", label: "Live chat", value: 962 },
    { key: "slack", label: "Slack Connect", value: 418 },
    { key: "portal", label: "Help center", value: 297 },
    { key: "phone", label: "Phone", value: 186 },
    { key: "sms", label: "SMS", value: 64 },
    { key: "fax", label: "Fax", value: 9 },
  ],
  month: [
    { key: "email", label: "Email", value: 4_902 },
    { key: "chat", label: "Live chat", value: 4_310 },
    { key: "slack", label: "Slack Connect", value: 1_206 },
    { key: "portal", label: "Help center", value: 1_544 },
    { key: "phone", label: "Phone", value: 958 },
    { key: "sms", label: "SMS", value: 233 },
    { key: "fax", label: "Fax", value: 31 },
  ],
};

function SwitchingDonut(props: DonutChartProps) {
  const [range, setRange] = useState("week");
  return <div style={{ display: "grid", gap: 20, width: "min(100%, 520px)" }}>
    <SegmentedControl label="Range" value={range} onValueChange={setRange} options={[{ value: "week", label: "This week" }, { value: "month", label: "This month" }]} />
    <DonutChart {...props} data={datasets[range]!} />
  </div>;
}

const spend: DonutChartDatum[] = [
  { key: "inference", label: "Model inference", value: 18_420 },
  { key: "storage", label: "Storage", value: 3_160 },
  { key: "integrations", label: "Integrations", value: 2_740 },
  { key: "seats", label: "Human seats", value: 1_900 },
];

export default defineDemo<DonutChartProps>({
  props: { data: datasets.week, label: "Tickets by channel", unit: "tickets" },
  hideControls: ["data", "activeKey", "defaultActiveKey", "hiddenKeys", "defaultHiddenKeys"],
  Preview: ({ props }) => <SwitchingDonut {...props} />,
  examples: [
    {
      title: "Selecting from the legend",
      description: "With legendAction=\"select\", a legend row pins its segment in the centre instead of hiding it.",
      render: () => <div style={{ width: "min(100%, 520px)" }}>
        <DonutChart label="Monthly spend" totalLabel="This month" legendAction="select" defaultActiveKey="inference" size={180} thickness={18} data={spend} formatValue={value => `$${value.toLocaleString("en-US")}`} />
      </div>,
    },
    {
      title: "Empty",
      render: () => <DonutChart label="Escalations by reason" data={[]} legend={false} size={160} emptyLabel="No escalations yet" />,
    },
  ],
  usage: `<DonutChart
  label="Tickets by channel"
  unit="tickets"
  data={[
    { key: "email", label: "Email", value: 1284 },
    { key: "chat", label: "Live chat", value: 962 },
    { key: "slack", label: "Slack Connect", value: 418 },
    { key: "phone", label: "Phone", value: 186 },
  ]}
/>`,
});
