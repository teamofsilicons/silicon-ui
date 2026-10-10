import JsonViewer, { type JsonViewerProps } from "@/registry/components/json-viewer/json-viewer";
import { defineDemo } from "../lib/demo";

const now = Date.now();
const iso = (minutesAgo: number) => new Date(now - minutesAgo * 60_000).toISOString();

const deployment = {
  id: "dep_8f3k21",
  silicon: "support-desk",
  status: "live",
  department: { id: "dept_cs", name: "Customer success", region: "eu-west-1" },
  owner: { name: "Hannah Walsh", email: "hannah@example.com" },
  createdAt: iso(60 * 24 * 12),
  lastActiveAt: iso(3),
  shadowMode: false,
  escalation: { refundLimitUsd: 250, channel: "#support-escalations", onCall: null },
  usage: {
    period: "2026-10",
    tickets: 1284,
    tokens: 18_420_311,
    costUsd: 4120.55,
    byDay: [182, 201, 176, 195, 210, 168, 152],
  },
  integrations: [
    { name: "zendesk", connected: true, scopes: ["tickets:read", "tickets:write"] },
    { name: "stripe", connected: true, scopes: ["refunds:write"] },
    { name: "slack", connected: false, scopes: [] },
  ],
  tags: ["billing", "onboarding", "tier-1"],
};

const logs = Array.from({ length: 140 }, (_, index) => ({ at: iso(index * 7), level: index % 11 === 0 ? "warn" : "info", message: index % 11 === 0 ? "Escalated: refund above limit" : `Resolved ticket #${48210 - index}` }));

export default defineDemo<JsonViewerProps>({
  props: { data: deployment, rootName: "deployment", label: "Deployment response", maxHeight: 360 },
  hideControls: ["data", "query", "expanded", "defaultExpanded", "maxHeight"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 600px)" }}><JsonViewer {...props} /></div>,
  examples: [
    {
      title: "Long arrays page",
      description: "Arrays and objects past pageSize load in pages, and search opens the branches that match.",
      render: () => <div style={{ width: "min(100%, 600px)" }}><JsonViewer data={{ logs }} rootName="response" defaultExpandDepth={2} pageSize={20} defaultQuery="Escalated" maxHeight={320} /></div>,
    },
  ],
  usage: `<JsonViewer
  data={response}
  rootName="deployment"
  defaultExpandDepth={2}
  onCopy={({ kind, path }) => toast(\`Copied \${kind} of \${path}\`)}
/>`,
});
