import { Switch, type SwitchProps } from "@/registry/components/switch/switch";
import { defineDemo } from "../lib/demo";

const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, fontSize: 14 } as const;

export default defineDemo<SwitchProps>({
  component: Switch,
  props: { label: "Auto-approve refunds under $50", defaultChecked: true },
  examples: [
    {
      title: "Settings list",
      description: "Without a visible label, name the switch with aria-label and let the row text describe it.",
      render: () => <div style={{ display: "grid", gap: 14, width: "min(100%, 340px)" }}>
        <div style={row}><span>Weekly usage report</span><Switch aria-label="Weekly usage report" defaultChecked /></div>
        <div style={row}><span>Slack notifications</span><Switch aria-label="Slack notifications" /></div>
        <div style={row}><span style={{ color: "var(--text-muted)" }}>Single sign-on</span><Switch aria-label="Single sign-on" disabled /></div>
      </div>,
    },
    {
      title: "Disabled",
      render: () => <div style={{ display: "grid", gap: 12 }}>
        <Switch label="Locked on by your admin" defaultChecked disabled />
        <Switch label="Not available on Starter" disabled />
      </div>,
    },
  ],
});
