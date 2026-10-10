import { ResizablePanel, ResizablePanels, type ResizablePanelsProps } from "@/registry/components/resizable-panels/resizable-panels";
import { defineDemo } from "../lib/demo";

const folders = ["Inbox", "Assigned to me", "Escalated", "Billing", "Closed"];
const tickets = [
  { id: "#4821", subject: "Refund for duplicate charge", from: "Acme Retail" },
  { id: "#4822", subject: "Contract change request", from: "Northwind Logistics" },
  { id: "#4823", subject: "SSO login loops on Safari", from: "Globex" },
  { id: "#4824", subject: "Invoice INV-2041 is overdue", from: "Initech" },
];

const pane = { padding: 14, display: "grid", alignContent: "start", gap: 4, fontSize: 13, minHeight: 0, overflowY: "auto" } as const;
const heading = { fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 } as const;

export default defineDemo<ResizablePanelsProps>({
  props: { label: "Support inbox" },
  Preview: ({ props }) => <div style={{ width: "min(100%, 760px)", height: 340, border: "1px solid var(--border)", borderRadius: 14, background: "var(--surface)", overflow: "hidden" }}>
    <ResizablePanels {...props}>
      <ResizablePanel id="folders" label="Folders" defaultSize={22} minSize={150} collapsible>
        <div style={pane}>
          <div style={heading}>Folders</div>
          {folders.map((folder, index) => <div key={folder} style={{ padding: "6px 8px", borderRadius: 8, background: index === 0 ? "var(--surface-muted)" : undefined }}>{folder}</div>)}
        </div>
      </ResizablePanel>
      <ResizablePanel id="tickets" label="Tickets" defaultSize={36} minSize={200}>
        <div style={pane}>
          <div style={heading}>Inbox · 4 open</div>
          {tickets.map(ticket => <div key={ticket.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 500 }}>{ticket.subject}</div>
            <div style={{ color: "var(--text-secondary)" }}>{ticket.id} · {ticket.from}</div>
          </div>)}
        </div>
      </ResizablePanel>
      <ResizablePanel id="detail" label="Ticket" defaultSize={42} minSize={240} collapsible>
        <div style={{ ...pane, gap: 10, fontSize: 14 }}>
          <div style={heading}>#4821 · Acme Retail</div>
          <strong style={{ fontSize: 16 }}>Refund for duplicate charge</strong>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.5 }}>The support silicon found two identical charges of $249.00 on March 3 and issued a refund for one. It is waiting for the customer to confirm.</p>
        </div>
      </ResizablePanel>
    </ResizablePanels>
  </div>,
  stage: { minHeight: 440 },
  usage: `<div style={{ height: 340 }}>
  <ResizablePanels label="Support inbox">
    <ResizablePanel id="folders" label="Folders" defaultSize={22} minSize={150} collapsible>…</ResizablePanel>
    <ResizablePanel id="tickets" label="Tickets" defaultSize={36} minSize={200}>…</ResizablePanel>
    <ResizablePanel id="detail" label="Ticket" defaultSize={42} minSize={240} collapsible>…</ResizablePanel>
  </ResizablePanels>
</div>`,
});
