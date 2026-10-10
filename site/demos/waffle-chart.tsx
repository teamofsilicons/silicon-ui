import { useState } from "react";

import { WaffleChart, type WaffleCategory, type WaffleChartProps } from "@/registry/components/waffle-chart/waffle-chart";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

/** Hours of silicon work, by the department it was done for. */
const datasets: Record<string, WaffleCategory[]> = {
  q3: [
    { key: "support", label: "Customer support", value: 4_120 },
    { key: "finance", label: "Finance", value: 2_030 },
    { key: "sales", label: "Sales", value: 1_310 },
    { key: "ops", label: "Operations", value: 940 },
    { key: "people", label: "People", value: 600 },
  ],
  q4: [
    { key: "support", label: "Customer support", value: 3_480 },
    { key: "finance", label: "Finance", value: 2_610 },
    { key: "sales", label: "Sales", value: 2_220 },
    { key: "ops", label: "Operations", value: 1_150 },
    { key: "people", label: "People", value: 540 },
  ],
};

function SwitchingWaffle(props: WaffleChartProps) {
  const [quarter, setQuarter] = useState("q3");
  return <div style={{ display: "grid", gap: 20, width: "min(100%, 560px)" }}>
    <SegmentedControl label="Quarter" value={quarter} onValueChange={setQuarter} options={[{ value: "q3", label: "Q3" }, { value: "q4", label: "Q4 to date" }]} />
    <WaffleChart {...props} data={datasets[quarter]!} />
  </div>;
}

export default defineDemo<WaffleChartProps>({
  props: { data: datasets.q3, label: "Silicon hours by department", unit: "h" },
  hideControls: ["data", "accentKey", "activeKey", "defaultActiveKey"],
  Preview: ({ props }) => <SwitchingWaffle {...props} />,
  examples: [
    {
      title: "One category in focus",
      description: "accentKey paints the category the story is about, here replies a silicon drafted for a person to send. A 20 × 5 grid suits a narrow column.",
      render: () => <div style={{ width: "min(100%, 360px)" }}>
        <WaffleChart label="How tickets were closed" rows={5} columns={20} accentKey="assisted" data={[
          { key: "auto", label: "Resolved by silicons", value: 7_412 },
          { key: "assisted", label: "Silicon drafted, human sent", value: 1_906 },
          { key: "human", label: "Handled by the team", value: 682 },
        ]} />
      </div>,
    },
    {
      title: "Empty",
      render: () => <div style={{ width: "min(100%, 360px)" }}><WaffleChart label="Silicon hours by department" data={[]} legend={false} emptyLabel="No hours logged yet" /></div>,
    },
  ],
  usage: `<WaffleChart
  label="Silicon hours by department"
  unit="h"
  data={[
    { key: "support", label: "Customer support", value: 4120 },
    { key: "finance", label: "Finance", value: 2030 },
    { key: "sales", label: "Sales", value: 1310 },
    { key: "ops", label: "Operations", value: 940 },
  ]}
/>`,
});
