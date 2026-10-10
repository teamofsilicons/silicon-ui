import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import { Stepper, type StepperProps, type StepperStep } from "@/registry/components/stepper/stepper";
import { defineDemo } from "../lib/demo";

const steps: StepperStep[] = [
  { id: "connect", label: "Connect tools", description: "Zendesk and Slack" },
  { id: "department", label: "Choose a team", description: "Where it will work" },
  { id: "train", label: "Train", description: "Reads 18 months of tickets" },
  { id: "live", label: "Go live", description: "Starts in draft mode" },
];

const errored: StepperStep[] = [
  { id: "contract", label: "Contract signed", description: "October 2" },
  { id: "access", label: "Grant access", error: "NetSuite rejected the API token. Ask an admin to reissue it." },
  { id: "shadow", label: "Shadow week", description: "Drafts only, reviewed daily" },
  { id: "handoff", label: "Hand off", description: "Takes over invoice runs" },
];

export default defineDemo<StepperProps>({
  props: { steps, label: "Silicon setup" },
  hideControls: ["current"],
  Preview: ({ props }) => {
    const [current, setCurrent] = useState(1);
    const done = current >= steps.length;
    return <div style={{ width: "min(100%, 640px)", display: "grid", gap: 28 }}>
      <Stepper {...props} current={current} onStepSelect={index => { setCurrent(index); props.onStepSelect?.(index); }} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="ghost" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
        <Button onClick={() => setCurrent(done ? 0 : current + 1)}>{done ? "Start over" : current === steps.length - 1 ? "Finish" : "Continue"}</Button>
      </div>
    </div>;
  },
  examples: [
    {
      title: "Vertical with an error",
      description: "A step with an error shows an alert marker and its message in place of the description.",
      render: () => <div style={{ width: "min(100%, 360px)" }}><Stepper steps={errored} current={1} orientation="vertical" label="Finance silicon onboarding" /></div>,
    },
    {
      title: "Compact",
      description: "Markers only, with a caption for the current step. Horizontal steppers switch to this on narrow screens.",
      render: () => <div style={{ width: "min(100%, 360px)" }}><Stepper steps={steps} current={2} compact label="Silicon setup" /></div>,
    },
  ],
  usage: `const [current, setCurrent] = useState(0);

<Stepper
  current={current}
  onStepSelect={setCurrent}
  steps={[
    { id: "connect", label: "Connect tools", description: "Zendesk and Slack" },
    { id: "department", label: "Choose a team" },
    { id: "live", label: "Go live" },
  ]}
/>`,
});
