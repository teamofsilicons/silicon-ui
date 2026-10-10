import { useState } from "react";

import { ActionButton, type ActionButtonProps } from "@/registry/components/action-button/action-button";
import { defineDemo } from "../lib/demo";

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function FailureExample() {
  const [error, setError] = useState<string | null>(null);
  return <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
    <ActionButton label="Sync invoices" pendingLabel="Syncing" successLabel="Synced" onAction={async () => { setError(null); await wait(1200); throw new Error("The ledger did not respond. Try again in a minute."); }} onActionError={reason => setError(reason instanceof Error ? reason.message : "Sync failed.")} />
    <p role="alert" style={{ margin: 0, minHeight: 20, color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>
  </div>;
}

export default defineDemo<ActionButtonProps>({
  component: ActionButton,
  props: { label: "Deploy silicon", pendingLabel: "Deploying", successLabel: "Deployed", onAction: () => wait(1400) },
  examples: [
    {
      title: "Instant and slow actions",
      description: "A synchronous action jumps straight to the success label; a promise holds the pending face until it settles.",
      render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <ActionButton label="Save changes" onAction={() => undefined} />
        <ActionButton label="Send invoice" pendingLabel="Sending" successLabel="Sent" onAction={() => wait(2200)} />
      </div>,
    },
    {
      title: "When the action fails",
      description: "A rejected promise returns the button to rest and hands the error to onActionError.",
      render: () => <FailureExample />,
    },
  ],
  usage: `<ActionButton
  label="Deploy silicon"
  pendingLabel="Deploying"
  successLabel="Deployed"
  onAction={() => deploySilicon("finance-ops")}
  onActionError={error => toast.error("Deploy failed")}
/>`,
});
