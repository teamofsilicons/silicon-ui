import { useState, type ReactNode } from "react";

import { AnnouncementBar, type Announcement, type AnnouncementBarProps } from "@/registry/components/announcement-bar/announcement-bar";
import { Button } from "@/registry/components/button/button";
import { defineDemo } from "../lib/demo";

const hour = 60 * 60 * 1000;

const page = { display: "grid", gap: 10, justifyItems: "start", padding: "28px 24px 36px" } as const;

function Page({ children }: { children?: ReactNode }) {
  return <div style={page}>
    <strong style={{ fontSize: 18 }}>Dashboard</strong>
    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>7 silicons are live across 4 departments.</span>
    {children}
  </div>;
}

export default defineDemo<AnnouncementBarProps>({
  hideControls: ["open", "defaultOpen", "index", "id"],
  Preview: ({ props }) => {
    const [open, setOpen] = useState(true);
    // Built on mount so the countdown always has about two days left.
    const [messages] = useState<Announcement[]>(() => [
      { id: "legal", message: "New: a legal silicon that reviews contracts in minutes.", action: { label: "Meet it" } },
      { id: "webinar", message: "Live webinar: onboarding your first silicon", countdown: { to: Date.now() + 2 * 24 * hour + 5 * hour, label: "Starts in" } },
      { id: "pricing", message: "Annual plans now include 200 free silicon hours.", action: { label: "See pricing" } },
    ]);
    return <div>
      <AnnouncementBar {...props} messages={messages} open={open} onOpenChange={next => { setOpen(next); props.onOpenChange?.(next); }} />
      <Page>{!open && <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show the bar again</Button>}</Page>
    </div>;
  },
  stage: { layout: "fill" },
  examples: [
    {
      title: "With controls",
      description: "controls adds previous, next, and a pause ring when there are several messages.",
      stage: { layout: "fill" },
      render: () => <div>
        <AnnouncementBar controls dismissible={false} messages={[
          { id: "status", message: "Scheduled maintenance on Sunday, 02:00–03:00 UTC." },
          { id: "release", message: "Release 4.12: silicons can now hand off tickets to each other.", action: { label: "Read the notes" } },
        ]} />
        <Page />
      </div>,
    },
  ],
  usage: `<AnnouncementBar
  messages={[
    { id: "legal", message: "New: a legal silicon that reviews contracts in minutes.", action: { label: "Meet it", href: "/legal" } },
    { id: "webinar", message: "Live webinar: onboarding your first silicon", countdown: { to: "2026-10-14T17:00:00Z", label: "Starts in" } },
  ]}
/>`,
});
