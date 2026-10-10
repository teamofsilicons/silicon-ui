import { ScrollArea, type ScrollAreaProps } from "@/registry/components/scroll-area/scroll-area";
import { defineDemo } from "../lib/demo";

const activity = [
  ["Support silicon", "Closed ticket #4821: refund issued"],
  ["Finance silicon", "Reconciled 48 invoices from Stripe"],
  ["Sales silicon", "Booked a demo with Northwind Logistics"],
  ["Support silicon", "Escalated ticket #4817 to Jordan Reyes"],
  ["Ops silicon", "Rotated the staging API keys"],
  ["Finance silicon", "Flagged INV-2041 as overdue"],
  ["Support silicon", "Answered 32 chats in the last hour"],
  ["Sales silicon", "Updated 14 deals in the CRM"],
  ["Ops silicon", "Deployed release 4.12 to production"],
  ["Finance silicon", "Sent payroll summary to Andre Williams"],
  ["Support silicon", "Tagged 9 tickets as billing"],
  ["Sales silicon", "Drafted the Q4 renewal emails"],
];

const deployments = ["Support", "Finance", "Sales", "Operations", "Legal", "Recruiting", "Marketing", "IT"].map((team, index) => ({ team, tickets: 1284 - index * 137 }));

const row = { display: "grid", gap: 2, padding: "10px 14px", borderBottom: "1px solid var(--border)" } as const;

export default defineDemo<ScrollAreaProps>({
  props: { label: "Activity log" },
  Preview: ({ props }) => <div style={{ width: "min(100%, 380px)", border: "1px solid var(--border)", borderRadius: 14, background: "var(--surface)", overflow: "hidden" }}>
    <ScrollArea {...props} maxHeight={280}>
      {activity.map(([who, what], index) => <div key={index} style={row}>
        <strong style={{ fontSize: 13, fontWeight: 500 }}>{who}</strong>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{what}</span>
      </div>)}
    </ScrollArea>
  </div>,
  examples: [
    {
      title: "Horizontal with snap",
      description: "A sideways strip. The mouse wheel scrolls it while there is room, and cards snap into place.",
      render: () => <ScrollArea orientation="horizontal" snap="x mandatory" label="Departments" style={{ width: "min(100%, 520px)" }}>
        <div style={{ display: "flex", gap: 12, padding: "4px 2px 14px" }}>
          {deployments.map(item => <div key={item.team} style={{ flex: "0 0 160px", scrollSnapAlign: "start", padding: 16, border: "1px solid var(--border)", borderRadius: 14, background: "var(--surface)" }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.team}</div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{item.tickets.toLocaleString("en-US")}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>tasks this week</div>
          </div>)}
        </div>
      </ScrollArea>,
    },
  ],
  usage: `<ScrollArea label="Activity log" maxHeight={280}>
  {activity.map(item => <ActivityRow key={item.id} {...item} />)}
</ScrollArea>`,
});
