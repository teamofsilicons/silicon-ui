import { useEffect, useState } from "react";

import { Button } from "@/registry/components/button/button";
import { TextMorph, type TextMorphProps } from "@/registry/components/text-morph/text-morph";
import { defineDemo } from "../lib/demo";

const steps = ["Deploy", "Deploying", "Deployed"];
const display = { fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-.02em" } as const;

function FollowExample() {
  const [following, setFollowing] = useState(false);
  return <Button variant={following ? "secondary" : "primary"} aria-pressed={following} onClick={() => setFollowing(on => !on)}>
    <TextMorph>{following ? "Following" : "Follow"}</TextMorph>
  </Button>;
}

function StatusExample() {
  const [index, setIndex] = useState(0);
  const states = ["Draft", "In review", "Approved", "Paid"];
  return <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "var(--text-sm)" }}>
    <span style={{ color: "var(--text-secondary)" }}>Invoice INV-2041</span>
    <span style={{ padding: "2px 10px", borderRadius: 999, background: "var(--surface-muted)", fontWeight: 500 }}><TextMorph>{states[index]!}</TextMorph></span>
    <Button size="sm" variant="ghost" onClick={() => setIndex(value => (value + 1) % states.length)}>Advance</Button>
  </div>;
}

export default defineDemo<TextMorphProps>({
  props: { children: "Deploy" },
  hideControls: ["children"],
  Preview: ({ props }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
      const timer = setTimeout(() => setIndex(value => (value + 1) % steps.length), index === 1 ? 1400 : 2200);
      return () => clearTimeout(timer);
    }, [index]);
    return <div style={display}><TextMorph {...props}>{steps[index]!}</TextMorph></div>;
  },
  examples: [
    {
      title: "Inside a button",
      description: "Shared letters glide, so Follow to Following only adds the ending.",
      render: () => <FollowExample />,
    },
    {
      title: "Status pill",
      render: () => <StatusExample />,
    },
  ],
  usage: `<Button onClick={deploy}>
  <TextMorph>{state === "pending" ? "Deploying" : state === "done" ? "Deployed" : "Deploy"}</TextMorph>
</Button>`,
});
