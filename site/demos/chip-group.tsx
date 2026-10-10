import { useState } from "react";

import ChipGroup, { type ChipGroupProps, type ChipOption } from "@/registry/components/chip-group/chip-group";
import { defineDemo } from "../lib/demo";

const box = { width: "min(100%, 460px)" } as const;

const topics: ChipOption[] = [
  { value: "billing", label: "Billing" },
  { value: "refunds", label: "Refunds" },
  { value: "onboarding", label: "Onboarding" },
  { value: "integrations", label: "Integrations" },
  { value: "security", label: "Security" },
  { value: "usage", label: "Usage limits" },
  { value: "api", label: "API" },
  { value: "sso", label: "SSO" },
  { value: "exports", label: "Data exports" },
  { value: "outages", label: "Outages" },
];
const statuses: ChipOption[] = [
  { value: "live", label: "Live" },
  { value: "paused", label: "Paused" },
  { value: "training", label: "Training" },
  { value: "archived", label: "Archived" },
];

function SingleChoice() {
  const [value, setValue] = useState(["live"]);
  return <div style={box}><ChipGroup label="Silicon status" options={statuses} multiple={false} value={value} onValueChange={setValue} /></div>;
}

function Folded() {
  const [value, setValue] = useState(["billing", "api"]);
  return <div style={box}><ChipGroup label="Ticket topics" options={topics} maxVisible={5} value={value} onValueChange={setValue} /></div>;
}

export default defineDemo<ChipGroupProps>({
  props: { label: "Ticket topics", options: topics },
  hideControls: ["className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState(["refunds", "integrations"]);
    return <div style={box}><ChipGroup {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} /></div>;
  },
  examples: [
    { title: "Single choice", description: "With multiple off, picking a chip clears the others; the selected one can still be cleared.", render: () => <SingleChoice /> },
    { title: "Folded overflow", description: "Past maxVisible the rest fold behind a “+N more” chip. Selected chips stay in view.", render: () => <Folded /> },
  ],
  usage: `const [topics, setTopics] = useState(["refunds"]);

<ChipGroup
  label="Ticket topics"
  value={topics}
  onValueChange={setTopics}
  options={[
    { value: "billing", label: "Billing" },
    { value: "refunds", label: "Refunds" },
  ]}
/>`,
});
