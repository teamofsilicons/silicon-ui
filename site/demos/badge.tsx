import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Loader2, Rocket } from "lucide-react";

import { Badge } from "@/registry/components/badge/badge";
import { defineDemo } from "../lib/demo";

const row = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", justifyContent: "center" } as const;

const stages = [
  { tone: "info", label: "Queued", icon: <CircleDot size={12} /> },
  { tone: "warning", label: "Deploying", icon: <Loader2 size={12} /> },
  { tone: "success", label: "Live", icon: <CheckCircle2 size={12} /> },
] as const;

function DeployStatus() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setStep(value => (value + 1) % stages.length), 1800);
    return () => window.clearInterval(timer);
  }, []);
  const stage = stages[step]!;
  return <Badge tone={stage.tone} icon={stage.icon}>{stage.label}</Badge>;
}

export default defineDemo({
  component: Badge,
  props: { children: "Live", tone: "success" },
  examples: [
    {
      title: "With icons",
      render: () => <div style={row}>
        <Badge tone="success" icon={<Rocket size={12} />}>Deployed</Badge>
        <Badge tone="warning" icon={<AlertTriangle size={12} />}>Usage at 92%</Badge>
        <Badge tone="danger" icon={<AlertTriangle size={12} />}>Invoice overdue</Badge>
      </div>,
    },
    {
      title: "Changing status",
      description: "A new label or icon swaps in place while the pill springs to its new width.",
      render: () => <DeployStatus />,
    },
  ],
});
