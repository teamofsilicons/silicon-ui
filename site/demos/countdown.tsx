import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import { Countdown, type CountdownProps } from "@/registry/components/countdown/countdown";
import { defineDemo } from "../lib/demo";

const second = 1000;
const hour = 60 * 60 * second;

function ShortCountdown() {
  const [target, setTarget] = useState(() => Date.now() + 12 * second);
  return <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
    <Countdown target={target} units={["minutes", "seconds"]} completeLabel="Deploying now" label="Deploy starts in" />
    <Button variant="secondary" size="sm" onClick={() => setTarget(Date.now() + 12 * second)}>Restart</Button>
  </div>;
}

export default defineDemo<CountdownProps>({
  props: { label: "Launch starts in" },
  hideControls: ["completeLabel"],
  Preview: ({ props }) => {
    // Set on mount, so the preview always has about three days left.
    const [target] = useState(() => Date.now() + 3 * 24 * hour + 7 * hour + 42 * 60 * second);
    return <Countdown {...props} target={target} />;
  },
  examples: [
    {
      title: "Reaching zero",
      description: "The digits morph into completeLabel and onComplete fires once.",
      render: () => <ShortCountdown />,
    },
  ],
  usage: `<Countdown
  target="2026-10-14T17:00:00Z"
  label="Launch starts in"
  completeLabel="Live now"
/>`,
});
