import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

import { HoldToConfirm, type HoldToConfirmProps } from "@/registry/components/hold-to-confirm/hold-to-confirm";
import { defineDemo } from "../lib/demo";

/** The button keeps its done state until `confirmed` turns false, so the demo resets it after a moment. */
function useAutoReset(delay = 2400) {
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    if (!confirmed) return;
    const timer = setTimeout(() => setConfirmed(false), delay);
    return () => clearTimeout(timer);
  }, [confirmed, delay]);
  return [confirmed, setConfirmed] as const;
}

function HintExample() {
  const [confirmed, setConfirmed] = useAutoReset();
  const [holding, setHolding] = useState(false);
  return <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
    <HoldToConfirm label="Hold to roll back deploy" confirmedLabel="Rolled back" icon={<RotateCcw strokeWidth={1.75} />} tone="neutral" duration={2000} confirmed={confirmed} onConfirm={() => setConfirmed(true)} onHoldChange={setHolding} />
    <span aria-live="polite" style={{ minHeight: 20, color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>{confirmed ? "Production is back on v2.3." : holding ? "Keep holding…" : "Restores v2.3 for every region."}</span>
  </div>;
}

export default defineDemo<HoldToConfirmProps>({
  props: { label: "Hold to delete workspace", confirmedLabel: "Deleted", tone: "danger" },
  hideControls: ["confirmed"],
  Preview: ({ props }) => {
    const [confirmed, setConfirmed] = useAutoReset();
    return <HoldToConfirm {...props} confirmed={confirmed} onConfirm={() => { setConfirmed(true); props.onConfirm?.(); }} />;
  },
  examples: [
    {
      title: "With a hint",
      description: "onHoldChange drives surrounding copy while the fill runs. This one holds for two seconds.",
      render: () => <HintExample />,
    },
  ],
  usage: `<HoldToConfirm
  label="Hold to delete workspace"
  confirmedLabel="Deleted"
  tone="danger"
  onConfirm={deleteWorkspace}
/>`,
});
