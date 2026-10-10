import { useEffect, useState } from "react";

import { MetricCard, type MetricCardProps } from "@/registry/components/metric-card/metric-card";
import { defineDemo } from "../lib/demo";

const weeks = [
  { value: 1284, change: "+12.4%", context: "Tickets resolved by silicons this week" },
  { value: 1412, change: "+10.0%", context: "Tickets resolved by silicons this week" },
  { value: 1196, change: "-15.3%", context: "Tickets resolved by silicons this week" },
];

function LiveMetric() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex(value => (value + 1) % weeks.length), 2600);
    return () => window.clearInterval(timer);
  }, []);
  const week = weeks[index]!;
  return <MetricCard label="Resolved tickets" value={week.value} change={week.change} context={week.context} />;
}

export default defineDemo<MetricCardProps>({
  props: { label: "Hours saved", value: 3240, suffix: "h", context: "Across 4 departments in September", change: "+18%" },
  Preview: ({ props }) => <div style={{ width: "min(100%, 320px)" }}><MetricCard {...props} /></div>,
  examples: [
    {
      title: "Changing values",
      description: "The number counts to its new value and the change and context swap in the direction it moved.",
      render: () => <div style={{ width: "min(100%, 320px)" }}><LiveMetric /></div>,
    },
    {
      title: "A row of metrics",
      render: () => <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, width: "min(100%, 680px)" }}>
        <MetricCard label="Active silicons" value={14} context="3 deploying" change="+2" />
        <MetricCard label="Spend, USD" value={18420} context="Of 25,000 budgeted" change="-4%" />
        <MetricCard label="Escalations" value={39} context="3.1% of tickets went to a person" />
      </div>,
      stage: { layout: "fill" },
    },
  ],
});
