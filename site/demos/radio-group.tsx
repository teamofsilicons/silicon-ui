import { useState } from "react";

import { RadioGroup, type RadioGroupProps } from "@/registry/components/radio-group/radio-group";
import { defineDemo } from "../lib/demo";

const options = [
  { value: "all", label: "All activity", description: "Every ticket, deployment and handoff." },
  { value: "approvals", label: "Approvals only", description: "When a silicon needs a person to sign off." },
  { value: "none", label: "Nothing", description: "Check the dashboard when you want to." },
];

const cadence = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function Cadence() {
  const [value, setValue] = useState("weekly");
  return <div style={{ width: "min(100%, 280px)" }}><RadioGroup label="Usage report" options={cadence} value={value} onValueChange={setValue} /></div>;
}

export default defineDemo<RadioGroupProps>({
  props: { label: "Notify me about", options },
  hideControls: ["value", "options"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("approvals");
    return <div style={{ width: "min(100%, 360px)" }}>
      <RadioGroup {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} />
    </div>;
  },
  examples: [
    { title: "Labels only", render: () => <Cadence /> },
  ],
  usage: `const [notify, setNotify] = useState("approvals");

<RadioGroup
  label="Notify me about"
  value={notify}
  onValueChange={setNotify}
  options={[
    { value: "all", label: "All activity" },
    { value: "approvals", label: "Approvals only", description: "When a silicon needs a person to sign off." },
    { value: "none", label: "Nothing" },
  ]}
/>`,
});
