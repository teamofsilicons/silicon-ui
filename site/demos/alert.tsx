import { useState } from "react";

import { Alert, type AlertProps } from "@/registry/components/alert/alert";
import { Button } from "@/registry/components/button/button";
import { defineDemo } from "../lib/demo";

const box = { width: "min(100%, 460px)", display: "grid", gap: 12, justifyItems: "center" } as const;

const stages: Pick<AlertProps, "tone" | "title" | "children">[] = [
  { tone: "info", title: "Deploying the finance silicon", children: "Connecting to NetSuite and reading 18 months of invoices." },
  { tone: "warning", title: "Waiting for approval", children: "Andre Williams needs to grant access to the payroll ledger." },
  { tone: "success", title: "Finance silicon is live", children: "It will reconcile tonight's invoices at 2:00 AM." },
];

function DeploymentStatus() {
  const [stage, setStage] = useState(0);
  const current = stages[stage] ?? stages[0];
  return <div style={box}>
    <Alert tone={current?.tone} title={current?.title ?? ""} style={{ width: "100%" }}>{current?.children}</Alert>
    <Button variant="secondary" size="sm" onClick={() => setStage((stage + 1) % stages.length)}>{stage === stages.length - 1 ? "Start over" : "Next step"}</Button>
  </div>;
}

export default defineDemo<AlertProps>({
  props: { tone: "warning", title: "Invoice INV-2041 is overdue", children: "Initech's payment of $3,160.00 was due October 1. The finance silicon sent a reminder this morning." },
  hideControls: ["open"],
  Preview: ({ props }) => {
    const [open, setOpen] = useState(true);
    return <div style={box}>
      <div style={{ width: "100%" }}><Alert {...props} open={open} onDismiss={() => { setOpen(false); props.onDismiss?.(); }} /></div>
      {!open && <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show again</Button>}
    </div>;
  },
  examples: [
    {
      title: "Changing in place",
      description: "A new tone morphs the icon and the copy springs to its new height, so one alert can follow a process.",
      render: () => <DeploymentStatus />,
    },
    {
      title: "Title only",
      description: "Without onDismiss or open the alert is static and has no close button.",
      render: () => <div style={box}><Alert tone="success" title="All 312 invoices reconciled" style={{ width: "100%" }} /></div>,
    },
  ],
  usage: `const [open, setOpen] = useState(true);

<Alert tone="warning" title="Invoice INV-2041 is overdue" open={open} onDismiss={() => setOpen(false)}>
  Initech's payment of $3,160.00 was due October 1.
</Alert>`,
});
