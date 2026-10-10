import { useEffect, useState } from "react";

import { TextShimmer, type TextShimmerProps } from "@/registry/components/text-shimmer/text-shimmer";
import { defineDemo } from "../lib/demo";

const steps = ["Reading the ticket", "Checking order history", "Drafting a reply", "Reply ready for review"];

function AgentStatusExample() {
  const [index, setIndex] = useState(0);
  const done = index === steps.length - 1;
  useEffect(() => {
    const timer = setTimeout(() => setIndex(value => (value + 1) % steps.length), done ? 2600 : 2000);
    return () => clearTimeout(timer);
  }, [index, done]);
  return <div style={{ display: "flex", alignItems: "center", gap: 10, width: "min(100%, 360px)", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-control)", background: "var(--surface)", fontSize: "var(--text-sm)" }}>
    <span style={{ width: 8, height: 8, flex: "none", borderRadius: "50%", background: done ? "var(--success, var(--foreground))" : "var(--text-muted)" }} aria-hidden="true" />
    <span style={{ color: "var(--text-secondary)", flex: "none" }}>Support silicon</span>
    <TextShimmer active={!done}>{steps[index]!}</TextShimmer>
  </div>;
}

export default defineDemo<TextShimmerProps>({
  props: { children: "Reconciling 312 invoices" },
  Preview: ({ props }) => <div style={{ fontSize: "var(--text-lg)", fontWeight: 500 }}><TextShimmer {...props} /></div>,
  examples: [
    {
      title: "Live agent status",
      description: "Changed labels rise in place while the line springs to its new width. When work finishes, active turns false and the text settles to solid.",
      render: () => <AgentStatusExample />,
    },
  ],
});
