import { Avatar } from "@/registry/components/avatar/avatar";
import { Badge } from "@/registry/components/badge/badge";
import { Button } from "@/registry/components/button/button";
import { Card, type CardProps } from "@/registry/components/card/card";
import { SiliconImage } from "@/lib/silicon-provider";
import { avatar, person, photo } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const office = photo("home-office");
const owner = person("olivia-bennett");

const details = <div style={{ display: "grid", gap: 12, fontSize: 14, color: "var(--text-secondary)" }}>
  <p style={{ margin: 0 }}>The operations silicon triages inbound tickets, drafts replies, and hands anything over a refund limit to a person.</p>
  <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", margin: 0 }}>
    <dt>Tickets this week</dt><dd style={{ margin: 0, color: "var(--foreground)" }}>1,284</dd>
    <dt>Median first reply</dt><dd style={{ margin: 0, color: "var(--foreground)" }}>42 seconds</dd>
    <dt>Escalated</dt><dd style={{ margin: 0, color: "var(--foreground)" }}>3.1%</dd>
  </dl>
</div>;

export default defineDemo<CardProps>({
  props: {
    title: "Support desk silicon",
    description: "Answers billing and onboarding questions for the EU team, around the clock.",
    meta: owner.name,
    status: "Updated 2 hours ago",
  },
  hideControls: ["open", "defaultOpen"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 340px)" }}>
    <Card
      {...props}
      media={<div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10" }}><SiliconImage src={office.src} alt={office.alt} fill sizes="340px" style={{ objectFit: "cover" }} /></div>}
      avatar={<Avatar name={owner.name} src={avatar("olivia-bennett")} size="sm" />}
      action={<Badge tone="success" size="sm">Live</Badge>}
      details={details}
    />
  </div>,
  examples: [
    {
      title: "Text only",
      description: "Without media or details the card is a plain, static surface.",
      render: () => <div style={{ width: "min(100%, 340px)" }}>
        <Card title="March invoice run" description="312 invoices reconciled overnight. Two need a person to confirm the tax code." action={<Button size="sm" variant="secondary">Review</Button>} meta="Finance silicon" status="Finished at 06:12" />
      </div>,
    },
  ],
  usage: `<Card
  title="Support desk silicon"
  description="Answers billing and onboarding questions for the EU team."
  media={<img src="/office.jpg" alt="" />}
  avatar={<Avatar name="Olivia Bennett" src="/olivia.jpg" size="sm" />}
  meta="Olivia Bennett"
  status="Updated 2 hours ago"
  action={<Badge tone="success" size="sm">Live</Badge>}
  details={<p>Opens in a quick look when the card is clicked.</p>}
/>`,
});
