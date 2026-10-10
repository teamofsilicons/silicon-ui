import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import { Skeleton, type SkeletonProps } from "@/registry/components/skeleton/skeleton";
import { people } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const box = { width: "min(100%, 400px)", display: "grid", gap: 16, justifyItems: "center" } as const;
const card = { width: "100%", padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-control)", background: "var(--surface)", boxSizing: "border-box" } as const;
const hannah = people[6];

function Reveal() {
  const [loading, setLoading] = useState(true);
  return <div style={box}>
    <div style={card}>
      <Skeleton avatar lines={2} loading={loading} label="Loading teammate">
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- demo media is a plain static file */}
          <img src={hannah.src} alt="" width={40} height={40} style={{ borderRadius: "50%" }} />
          <div style={{ display: "grid", gap: 2 }}>
            <strong style={{ fontSize: 14, fontWeight: 500 }}>{hannah.name}</strong>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Customer success · manages 2 silicons</span>
          </div>
        </div>
      </Skeleton>
    </div>
    <Button variant="secondary" size="sm" onClick={() => setLoading(!loading)}>{loading ? "Finish loading" : "Load again"}</Button>
  </div>;
}

export default defineDemo<SkeletonProps>({
  props: { lines: 3, avatar: true, label: "Loading ticket" },
  hideControls: ["loading"],
  Preview: ({ props }) => <div style={box}><div style={card}><Skeleton {...props} /></div></div>,
  examples: [
    {
      title: "Crossfade into content",
      description: "Wrap the real content and flip loading. The placeholder fades out and the height springs to fit.",
      render: () => <Reveal />,
    },
  ],
  usage: `<Skeleton avatar lines={2} loading={isLoading}>
  <TeammateRow person={teammate} />
</Skeleton>`,
});
