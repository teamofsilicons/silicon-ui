import { useRef, type CSSProperties } from "react";

import { SiteHeader, type SiteHeaderProps } from "@/registry/blocks/site-header/site-header";
import { defineDemo } from "../lib/demo";

/** A short page that scrolls under the header, so the sticky state and the menus have room. */
const frame = {
  position: "relative",
  height: 520,
  overflowY: "auto",
  overscrollBehavior: "contain",
  background: "var(--background)",
  containerType: "inline-size",
  "--site-header-sheet-max": "453px",
} as CSSProperties;
const hero: CSSProperties = { display: "grid", justifyItems: "center", gap: 12, padding: "72px 24px", background: "var(--surface-muted)", textAlign: "center" };
const rows: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, padding: 24 };

function ScrollFrame(props: SiteHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} style={frame}>
    <SiteHeader {...props} scrollContainer={ref} />
    <div style={hero}>
      <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 500 }}>Scroll this page</h2>
      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>The header picks up a surface once the page moves under it.</p>
    </div>
    <div style={rows} aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => <div key={index} style={{ height: 120, borderRadius: 16, background: "var(--surface-muted)" }} />)}
    </div>
  </div>;
}

export default defineDemo<SiteHeaderProps>({
  hideControls: ["current"],
  Preview: ({ props }) => <ScrollFrame {...props} />,
  examples: [
    {
      title: "Simple",
      description: "Links sit beside the brand.",
      render: () => <ScrollFrame variant="simple" />,
      stage: { layout: "fill", minHeight: 520 },
    },
    {
      title: "Centered",
      description: "Links centered in a quiet capsule.",
      render: () => <ScrollFrame variant="centered" />,
      stage: { layout: "fill", minHeight: 520 },
    },
  ],
  usage: `<SiteHeader
  variant="mega"
  brand={{ name: "Team of Silicons", href: "/" }}
  items={items}
  secondaryAction={{ label: "Sign in", href: "/login" }}
  primaryAction={{ label: "Deploy a silicon", href: "/signup" }}
/>`,
});
