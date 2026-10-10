import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { SlotText, type SlotTextProps } from "@/registry/components/slot-text/slot-text";
import { defineDemo } from "../lib/demo";

const display = { fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 600, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" } as const;

const plans = { monthly: { starter: 49, team: 199 }, yearly: { starter: 39, team: 159 } };
const usd = (value: number) => `$${value.toLocaleString("en-US")}`;

function PricingExample() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  return <div style={{ display: "grid", gap: 18, justifyItems: "center" }}>
    <SegmentedControl label="Billing" value={billing} onValueChange={value => setBilling(value as "monthly" | "yearly")} options={[{ value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly" }]} />
    <div style={{ display: "flex", gap: 32 }}>
      {(["starter", "team"] as const).map(plan => <div key={plan} style={{ display: "grid", gap: 2, textAlign: "center" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", textTransform: "capitalize" }}>{plan}</span>
        <span style={{ ...display, fontSize: "var(--text-3xl)" }}><SlotText value={plans[billing][plan]} format={usd} /></span>
        <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>per silicon / month</span>
      </div>)}
    </div>
  </div>;
}

function WordExample() {
  const words = ["DEPLOY", "LAUNCH", "SHIPPED"];
  const [index, setIndex] = useState(0);
  return <div style={{ display: "grid", gap: 14, justifyItems: "center" }}>
    <span style={{ ...display, fontSize: "var(--text-3xl)", letterSpacing: ".04em" }}><SlotText value={words[index]!} align="start" /></span>
    <Button size="sm" variant="secondary" onClick={() => setIndex(value => (value + 1) % words.length)}>Next word</Button>
  </div>;
}

export default defineDemo<SlotTextProps>({
  props: { value: 12480 },
  hideControls: ["value"],
  Preview: ({ props }) => {
    const [tickets, setTickets] = useState(12480);
    return <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      <span style={display}><SlotText {...props} value={tickets} /></span>
      <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>tickets resolved by silicons this month</span>
      <div style={{ display: "flex", gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setTickets(value => value + 1 + Math.floor(Math.random() * 40))}>Add a few</Button>
        <Button size="sm" variant="secondary" onClick={() => setTickets(value => Math.max(0, value - 3000 - Math.floor(Math.random() * 2000)))}>Drop</Button>
        <Button size="sm" variant="ghost" onClick={() => setTickets(Math.floor(5000 + Math.random() * 95000))}>Shuffle</Button>
      </div>
    </div>;
  },
  examples: [
    {
      title: "Pricing toggle",
      description: "A format function adds the currency; every reel rolls in the direction the price moved.",
      render: () => <PricingExample />,
    },
    {
      title: "Words",
      description: "Strings render as they are, and letters shuffle through the alphabet before landing.",
      render: () => <WordExample />,
    },
  ],
  usage: `<SlotText value={ticketsResolved} />

<SlotText value={price} format={value => \`$\${value}\`} />`,
});
