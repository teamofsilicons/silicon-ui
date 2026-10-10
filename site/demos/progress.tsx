import { useEffect, useState } from "react";

import { Button } from "@/registry/components/button/button";
import { Progress, type ProgressProps } from "@/registry/components/progress/progress";
import { defineDemo } from "../lib/demo";

const box = { width: "min(100%, 380px)", display: "grid", gap: 16, justifyItems: "center" } as const;

function Import() {
  const [value, setValue] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setValue(current => {
      if (current >= 100) { window.clearInterval(timer); return current; }
      return Math.min(100, current + 7 + Math.round(Math.random() * 9));
    }), 450);
    return () => window.clearInterval(timer);
  }, [run]);
  const done = value >= 100;
  return <div style={box}>
    <Progress value={value} label={done ? "4,820 tickets imported" : "Importing tickets from Zendesk"} showValue style={{ width: "100%" }} />
    <Button variant="secondary" size="sm" disabled={!done} onClick={() => { setValue(0); setRun(run + 1); }}>Import again</Button>
  </div>;
}

export default defineDemo<ProgressProps>({
  props: { value: 64, label: "Training the support silicon", showValue: true },
  Preview: ({ props }) => <div style={box}><Progress {...props} style={{ width: "100%" }} /></div>,
  examples: [
    {
      title: "Live progress",
      description: "The fill and the counted label ride one spring. A check settles in at 100%.",
      render: () => <Import />,
    },
    {
      title: "Bar only",
      description: "Without a visible label, still pass one for assistive tech.",
      render: () => <div style={box}><Progress value={38} aria-label="Storage used" style={{ width: "100%" }} /></div>,
    },
  ],
});
