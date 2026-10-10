import { HoverCard, HoverCardProfile, type HoverCardProps } from "@/registry/components/hover-card/hover-card";
import { people } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const sofia = people[4];
const jordan = people[10];
const mention = { padding: 0, border: 0, background: "none", color: "var(--foreground)", font: "inherit", fontWeight: 500, textDecoration: "underline", textDecorationColor: "var(--border-strong)", textUnderlineOffset: 3, cursor: "pointer" } as const;
const sentence = { margin: 0, maxWidth: 420, fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)", textAlign: "center" } as const;

export default defineDemo<HoverCardProps>({
  Preview: ({ props }) => <p style={sentence}>
    Ticket #4817 was escalated to{" "}
    <HoverCard {...props} content={<HoverCardProfile name={sofia.name} role="Operations lead, Support" avatar={sofia.src}
      bio="Manages the three support silicons and approves refunds over $500."
      stats={[{ label: "Silicons", value: 3 }, { label: "Approvals this week", value: 42 }]} meta="Austin · 9:14 AM local time" />}>
      <button type="button" style={mention}>@{sofia.name}</button>
    </HoverCard>{" "}
    for approval.
  </p>,
  examples: [
    {
      title: "Without a portrait",
      description: "Initials stand in when there is no avatar.",
      render: () => <p style={sentence}>
        Assigned to{" "}
        <HoverCard content={<HoverCardProfile name="Priya Desai" role="Finance partner" bio="Owns month-end close and vendor payments." />}>
          <button type="button" style={mention}>@Priya Desai</button>
        </HoverCard>
      </p>,
    },
    {
      title: "Any read-only content",
      render: () => <p style={sentence}>
        See{" "}
        <HoverCard side="top" content={<div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          <strong style={{ fontSize: 14 }}>#4821 Refund for duplicate charge</strong>
          <span style={{ color: "var(--text-secondary)" }}>Acme Retail · opened 2 hours ago</span>
          <span style={{ color: "var(--text-secondary)" }}>Handled by the support silicon, waiting on {jordan.name}.</span>
        </div>}>
          <a href="#ticket-4821" style={{ color: "var(--foreground)", fontWeight: 500 }}>#4821</a>
        </HoverCard>{" "}
        for the full thread.
      </p>,
    },
  ],
  usage: `<HoverCard
  content={
    <HoverCardProfile
      name="Sofia Ramirez"
      role="Operations lead, Support"
      avatar="/media/people/sofia-ramirez.jpg"
      stats={[{ label: "Silicons", value: 3 }]}
    />
  }
>
  <button type="button">@Sofia Ramirez</button>
</HoverCard>`,
});
