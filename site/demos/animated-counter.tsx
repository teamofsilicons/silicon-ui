import { useEffect, useState } from "react";

import { AnimatedCounter, type AnimatedCounterProps } from "@/registry/components/animated-counter/animated-counter";
import { Button } from "@/registry/components/button/button";
import { defineDemo } from "../lib/demo";

/** Tickets ticking up as the support silicons close them. */
function LiveTicker() {
  const [count, setCount] = useState(12_847);
  useEffect(() => {
    const steps = [3, 1, 4, 2, 6, 1, 2, 5];
    let index = 0;
    const timer = window.setInterval(() => setCount(current => current + steps[index++ % steps.length]!), 1_400);
    return () => window.clearInterval(timer);
  }, []);
  return <AnimatedCounter label="Tickets resolved today" value={count} />;
}

/** Invoice totals step up and down, so the wheels roll both ways. */
function InvoiceTotal() {
  const totals = [48_210.5, 51_904.25, 49_987, 103_420.75];
  const [index, setIndex] = useState(0);
  return <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
    <AnimatedCounter label="Invoices reconciled" prefix="$" decimals={2} value={totals[index]!} />
    <div style={{ display: "flex", gap: 8 }}>
      <Button variant="secondary" size="sm" onClick={() => setIndex(current => (current + totals.length - 1) % totals.length)}>Previous day</Button>
      <Button variant="secondary" size="sm" onClick={() => setIndex(current => (current + 1) % totals.length)}>Next day</Button>
    </div>
  </div>;
}

export default defineDemo<AnimatedCounterProps>({
  component: AnimatedCounter,
  props: { value: 1_284, label: "Hours saved this week" },
  examples: [
    { title: "Live updates", description: "Each new value rolls only the digits that changed.", render: () => <LiveTicker /> },
    { title: "Currency", description: "A prefix, two decimals, and a new digit column that slides in when the total passes $100,000.", render: () => <InvoiceTotal /> },
    { title: "Percent", render: () => <AnimatedCounter label="Auto-resolution rate" value={72.4} decimals={1} suffix="%" animateOnView /> },
  ],
});
