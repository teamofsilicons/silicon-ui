import { Bot, FileText, Receipt, Ticket, Users } from "lucide-react";

import ExpandingSearch, { type ExpandingSearchItem, type ExpandingSearchProps } from "@/registry/components/expanding-search/expanding-search";
import { defineDemo } from "../lib/demo";

const icon = { size: 16, "aria-hidden": true } as const;

const items: ExpandingSearchItem[] = [
  { id: "ledger", title: "Ledger", meta: "Finance silicon · Live", group: "Silicons", icon: <Bot {...icon} />, keywords: ["invoices", "accounting"] },
  { id: "harbor", title: "Harbor", meta: "Support silicon · Live", group: "Silicons", icon: <Bot {...icon} />, keywords: ["tickets", "helpdesk"] },
  { id: "scout", title: "Scout", meta: "Sales silicon · Paused", group: "Silicons", icon: <Bot {...icon} />, keywords: ["leads", "outreach"] },
  { id: "finance", title: "Finance team", meta: "8 people · 2 silicons", group: "Teams", icon: <Users {...icon} /> },
  { id: "support", title: "Customer support", meta: "14 people · 3 silicons", group: "Teams", icon: <Users {...icon} /> },
  { id: "inv-2041", title: "INV-2041", meta: "Northwind · $4,820.00 · Due Oct 31", group: "Invoices", icon: <Receipt {...icon} /> },
  { id: "inv-2038", title: "INV-2038", meta: "Acme Logistics · $1,250.00 · Paid", group: "Invoices", icon: <Receipt {...icon} /> },
  { id: "t-1184", title: "Refund request over limit", meta: "Ticket #1184 · Assigned to Harbor", group: "Tickets", icon: <Ticket {...icon} />, keywords: ["refund"] },
  { id: "runbook", title: "Escalation runbook", meta: "Doc · Edited 2 days ago", group: "Docs", icon: <FileText {...icon} />, keywords: ["handoff", "policy"] },
];
const suggestions = [items[0]!, items[5]!, items[8]!];

const bar = { display: "flex", alignItems: "center", gap: 16, padding: "10px 12px 10px 18px", border: "1px solid var(--border)", borderRadius: "var(--radius-control)", background: "var(--surface)" } as const;

export default defineDemo<ExpandingSearchProps>({
  props: { label: "Search silicons, teams and invoices", items, suggestions, placeholder: "Search workspace" },
  hideControls: ["className"],
  stage: { minHeight: 480 },
  Preview: ({ props }) => <div style={{ width: "min(100%, 560px)", minHeight: 400 }}>
    <div style={bar}>
      <strong style={{ fontSize: 15, whiteSpace: "nowrap" }}>Northwind</strong>
      <div style={{ flex: 1, minWidth: 0 }}><ExpandingSearch {...props} /></div>
    </div>
  </div>,
  usage: `<ExpandingSearch
  label="Search silicons, teams and invoices"
  items={[
    { id: "ledger", title: "Ledger", meta: "Finance silicon", group: "Silicons" },
    { id: "inv-2041", title: "INV-2041", meta: "Northwind · $4,820.00", group: "Invoices" },
  ]}
  suggestions={recent}
  onSelect={item => router.push(\`/\${item.id}\`)}
/>`,
});
