import { useState } from "react";
import { CheckCircle2, Rocket, XCircle } from "lucide-react";

import { Button } from "@/registry/components/button/button";
import Timeline, { type TimelineEvent, type TimelineProps } from "@/registry/components/timeline/timeline";
import { avatar } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

function history(now: number): TimelineEvent[] {
  return [
    { id: "e1", at: now - 4 * minute, actor: "Support desk silicon", title: "resolved 38 tickets in the last hour", meta: "Customer success", icon: <CheckCircle2 size={14} />, tone: "success" },
    { id: "e2", at: now - 52 * minute, actor: "Hannah Walsh", avatar: avatar("hannah-walsh"), title: "raised the refund limit to $250", meta: "Escalation policy", detail: <p style={{ margin: 0 }}>Refunds under $250 are now approved by the silicon without a person. Anything above still goes to #support-escalations.</p> },
    { id: "e3", at: now - 3 * hour, title: "Deploy failed: Zendesk token expired", meta: "Build 412", icon: <XCircle size={14} />, tone: "danger", detail: <p style={{ margin: 0 }}>The integration returned 401. Reconnect Zendesk in Settings, then redeploy.</p> },
    { id: "e4", at: now - day - 2 * hour, actor: "Olivia Bennett", avatar: avatar("olivia-bennett"), title: "deployed On-call triage to production", meta: "Platform", icon: <Rocket size={14} /> },
    { id: "e5", at: now - day - 5 * hour, actor: "Andre Williams", avatar: avatar("andre-williams"), title: "approved the September invoice run", meta: "312 invoices, 2 flagged" },
    { id: "e6", at: now - 3 * day, actor: "Diane Foster", avatar: avatar("diane-foster"), title: "added Finance to the pilot", meta: "Rollout plan" },
  ];
}

const updates = [
  { actor: "Invoice reconciler", title: "matched 46 bank transactions", meta: "Finance" },
  { actor: "Lead qualifier", title: "booked 3 demos for the sales team", meta: "Sales" },
  { actor: "On-call triage", title: "closed a duplicate incident", meta: "Platform" },
];

export default defineDemo<TimelineProps>({
  props: { label: "Workspace activity", maxHeight: 440 },
  hideControls: ["events", "now", "maxHeight", "defaultExpanded", "timeZone", "locale"],
  Preview: ({ props }) => {
    const [now, setNow] = useState(() => Date.now());
    const [timeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [events, setEvents] = useState(() => history(now));
    const [added, setAdded] = useState(0);
    function add() {
      const update = updates[added % updates.length]!;
      const at = Date.now();
      setNow(at);
      setEvents(current => [{ id: `new-${added}`, at, ...update, icon: <CheckCircle2 size={14} />, tone: "success" }, ...current]);
      setAdded(count => count + 1);
    }
    return <div style={{ display: "grid", gap: 16, width: "min(100%, 560px)" }}>
      <Timeline {...props} events={events} now={now} timeZone={timeZone} defaultExpanded={["e2"]} />
      <div><Button variant="secondary" size="sm" onClick={add}>Simulate an update</Button></div>
    </div>;
  },
  usage: `<Timeline
  label="Workspace activity"
  now={now}
  maxHeight={440}
  events={[
    { id: "1", at: Date.now() - 4 * 60_000, actor: "Support desk silicon", title: "resolved 38 tickets", tone: "success" },
    { id: "2", at: "2026-10-09T14:20:00Z", actor: "Hannah Walsh", avatar: "/hannah.jpg", title: "raised the refund limit", detail: <p>…</p> },
  ]}
/>`,
});
