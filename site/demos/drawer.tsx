import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/registry/components/drawer/drawer";
import { defineDemo } from "../lib/demo";

const lines = [["Silicon hours, Support", "$1,840.00"], ["Silicon hours, Finance", "$920.00"], ["Onboarding", "$400.00"], ["Total due", "$3,160.00"]];

const invoice = <div style={{ display: "grid", gap: 20 }}>
  <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
    {lines.map(([label, value], index) => <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 16, paddingTop: index === lines.length - 1 ? 10 : 0, borderTop: index === lines.length - 1 ? "1px solid var(--border)" : undefined, fontWeight: index === lines.length - 1 ? 600 : undefined }}>
      <span>{label}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>)}
  </div>
  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
    <DrawerClose asChild><Button variant="ghost">Close</Button></DrawerClose>
    <DrawerClose asChild><Button>Approve invoice</Button></DrawerClose>
  </div>
</div>;

function ContainedDrawer() {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return <div ref={setHost} style={{ position: "relative", overflow: "hidden", width: "min(100%, 560px)", height: 320, display: "grid", placeItems: "center", border: "1px solid var(--border)", borderRadius: "var(--radius-control)", background: "var(--surface)" }}>
    <Drawer>
      <DrawerTrigger asChild><Button variant="secondary">Filter tickets</Button></DrawerTrigger>
      <DrawerContent container={host} title="Filters" description="Showing 128 open tickets.">
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>Status: open · Team: Support · Priority: high</p>
      </DrawerContent>
    </Drawer>
  </div>;
}

export default defineDemo({
  Preview: () => <Drawer>
    <DrawerTrigger asChild><Button variant="secondary">View invoice</Button></DrawerTrigger>
    <DrawerContent title="Invoice INV-2041" description="Due October 31, 2026 · Initech">{invoice}</DrawerContent>
  </Drawer>,
  examples: [
    {
      title: "From the left",
      description: "Use side for navigation or filters that belong to the start edge. Drag the header to dismiss.",
      render: () => <Drawer>
        <DrawerTrigger asChild><Button variant="secondary">Open departments</Button></DrawerTrigger>
        <DrawerContent side="left" title="Departments" description="Where your silicons work.">
          <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
            {["Support · 3 silicons", "Finance · 2 silicons", "Sales · 1 silicon", "Operations · 1 silicon"].map(team => <span key={team}>{team}</span>)}
          </div>
        </DrawerContent>
      </Drawer>,
    },
    {
      title: "Inside a panel",
      description: "Pass container to anchor the drawer to an element (position: relative, overflow: hidden) instead of the page.",
      render: () => <ContainedDrawer />,
    },
  ],
  usage: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="secondary">View invoice</Button>
  </DrawerTrigger>
  <DrawerContent title="Invoice INV-2041" description="Due October 31, 2026 · Initech">
    <InvoiceLines />
    <DrawerClose asChild><Button>Approve invoice</Button></DrawerClose>
  </DrawerContent>
</Drawer>`,
});
