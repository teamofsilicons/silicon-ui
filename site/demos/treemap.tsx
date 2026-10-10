import { useState } from "react";

import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { Treemap, type TreemapNode, type TreemapProps } from "@/registry/components/treemap/treemap";
import { defineDemo } from "../lib/demo";

type Workflow = [id: string, label: string, hours: number, growth: number];

const branch = (id: string, label: string, workflows: Workflow[]): TreemapNode => ({ id, label, children: workflows.map(([key, name, value, color]) => ({ id: `${id}-${key}`, label: name, value, color })) });

/** Hours the silicons saved each department, by workflow, with growth on the previous quarter for shading. */
const quarters: Record<string, TreemapNode> = {
  q3: {
    id: "all",
    label: "All departments",
    children: [
      branch("support", "Support", [["triage", "Ticket triage", 1_840, 32], ["replies", "First replies", 1_420, 18], ["refunds", "Refunds", 610, 44], ["qa", "Quality reviews", 290, 6]]),
      branch("finance", "Finance", [["invoices", "Invoice matching", 1_260, 52], ["close", "Month-end close", 720, 21], ["expenses", "Expense audits", 430, 12]]),
      branch("sales", "Sales", [["research", "Lead research", 980, 64], ["crm", "CRM hygiene", 540, 9], ["proposals", "Proposal drafts", 310, 27]]),
      branch("ops", "Operations", [["onboarding", "Vendor onboarding", 460, 15], ["reports", "Weekly reports", 280, -4], ["access", "Access reviews", 190, 3]]),
    ],
  },
  q2: {
    id: "all",
    label: "All departments",
    children: [
      branch("support", "Support", [["triage", "Ticket triage", 1_390, 12], ["replies", "First replies", 1_200, 9], ["refunds", "Refunds", 420, 20], ["qa", "Quality reviews", 270, 2]]),
      branch("finance", "Finance", [["invoices", "Invoice matching", 830, 30], ["close", "Month-end close", 600, 14], ["expenses", "Expense audits", 380, 8]]),
      branch("sales", "Sales", [["research", "Lead research", 600, 41], ["crm", "CRM hygiene", 500, 6], ["proposals", "Proposal drafts", 240, 18]]),
      branch("ops", "Operations", [["onboarding", "Vendor onboarding", 400, 10], ["reports", "Weekly reports", 290, 2], ["access", "Access reviews", 185, 1]]),
    ],
  },
};

const hours = (value: number) => `${value.toLocaleString("en-US")} h`;
const growth = (value: number) => `${value > 0 ? "+" : ""}${Math.round(value)}%`;

function QuarterTreemap(props: TreemapProps) {
  const [quarter, setQuarter] = useState("q3");
  return <div style={{ display: "grid", gap: 16, width: "min(100%, 720px)" }}>
    <SegmentedControl label="Quarter" value={quarter} onValueChange={setQuarter} options={[{ value: "q2", label: "Q2" }, { value: "q3", label: "Q3" }]} />
    <Treemap {...props} data={quarters[quarter]!} />
  </div>;
}

export default defineDemo<TreemapProps>({
  props: { data: quarters.q3, label: "Hours saved", colorLabel: "Growth", formatValue: hours, formatColor: growth, colorDomain: [-10, 70], height: 380 },
  hideControls: ["data", "focus", "defaultFocus", "colorDomain"],
  Preview: ({ props }) => <QuarterTreemap {...props} />,
  examples: [
    {
      title: "One department, without shading",
      description: "Leave out colorLabel to draw every tile at one depth. defaultFocus opens on a branch; the breadcrumb leads back out.",
      render: () => <div style={{ width: "min(100%, 560px)" }}>
        <Treemap label="Hours saved" height={260} defaultFocus="finance" formatValue={hours} data={quarters.q3!} />
      </div>,
    },
    {
      title: "Empty",
      render: () => <div style={{ width: "min(100%, 560px)" }}><Treemap label="Hours saved" height={200} data={{ id: "all", label: "All departments", children: [] }} emptyLabel="No silicons deployed yet" /></div>,
    },
  ],
  usage: `<Treemap
  label="Hours saved"
  colorLabel="Growth"
  formatColor={value => \`\${value > 0 ? "+" : ""}\${value}%\`}
  data={{
    id: "all",
    label: "All departments",
    children: [
      { id: "support", label: "Support", children: [
        { id: "triage", label: "Ticket triage", value: 1840, color: 32 },
        { id: "replies", label: "First replies", value: 1420, color: 18 },
      ] },
      { id: "finance", label: "Finance", children: [
        { id: "invoices", label: "Invoice matching", value: 1260, color: 52 },
      ] },
    ],
  }}
/>`,
});
