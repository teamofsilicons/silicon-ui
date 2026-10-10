import { ExpandableCard } from "@/registry/components/expandable-card/expandable-card";
import { defineDemo } from "../lib/demo";

const lines = [["Invoices reconciled", "312"], ["Matched automatically", "298"], ["Sent for review", "14"], ["Total value", "$184,920.40"]];

const details = <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
  {lines.map(([label, value]) => <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
    <span style={{ color: "var(--text-secondary)" }}>{label}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
  </div>)}
</div>;

export default defineDemo({
  component: ExpandableCard,
  props: { title: "Overnight invoice run", description: "Finance silicon · finished 6:42 AM", width: 420, children: details },
  examples: [
    {
      title: "Grows sideways",
      description: "With expandedWidth the card widens as it opens, when the container has room.",
      render: () => <ExpandableCard title="Support handoff" description="3 tickets need a human" width={340} expandedWidth={520}>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}>
          <li>#4817 Chargeback dispute from Acme Retail</li>
          <li>#4822 Contract change request, needs legal</li>
          <li>#4830 VIP customer asked for a call back</li>
        </ul>
      </ExpandableCard>,
    },
  ],
  usage: `<ExpandableCard title="Overnight invoice run" description="Finance silicon · finished 6:42 AM" width={420}>
  <InvoiceSummary />
</ExpandableCard>`,
});
