import { people } from "@/lib/media";
import { NotificationCenter, type NotificationCenterProps, type NotificationItem } from "@/registry/components/notification-center/notification-center";
import { defineDemo } from "../lib/demo";

const [emma, marcus] = [people[0], people[1]];

const notifications: NotificationItem[] = [
  { id: "assign", title: "Emma Collins assigned you a ticket", description: "Refund request from Northwind needs a reply before 5 pm.", time: "2m", actor: { name: emma.name, photo: emma.src } },
  { id: "deploy", title: "Deployment finished", description: "Ledger, the finance silicon, is live in Accounts Payable.", time: "18m", tone: "success" },
  { id: "usage", title: "Usage at 85% of plan", description: "Support silicons have used 8,500 of 10,000 conversations this month.", time: "1h", tone: "warning" },
  { id: "comment", title: "Marcus Johnson commented on INV-2041", description: "Can the silicon split this across two cost centers?", time: "3h", read: true, actor: { name: marcus.name, photo: marcus.src } },
  { id: "report", title: "Weekly report is ready", description: "Silicons resolved 412 tickets and drafted 96 invoices.", time: "Mon", read: true, tone: "info" },
];

/** A slim app bar, so the bell sits where it would in a product and the panel opens into the stage. */
function AppBar(props: NotificationCenterProps) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
    <span style={{ fontWeight: 500 }}>Operations</span>
    <NotificationCenter {...props} />
  </div>;
}

export default defineDemo<NotificationCenterProps>({
  props: { notifications },
  hideControls: ["open"],
  Preview: ({ props }) => <AppBar {...props} />,
  stage: { layout: "fill", minHeight: 620 },
  examples: [
    {
      title: "All caught up",
      description: "With every update read, the badge leaves the bell.",
      render: () => <AppBar notifications={notifications.map(item => ({ ...item, read: true }))} />,
      stage: { layout: "fill", minHeight: 620 },
    },
  ],
  usage: `<NotificationCenter
  notifications={[
    { id: "deploy", title: "Deployment finished", description: "Ledger is live in Accounts Payable.", time: "18m", tone: "success" },
    { id: "usage", title: "Usage at 85% of plan", time: "1h", tone: "warning" },
  ]}
  onReadChange={(item, read) => markRead(item.id, read)}
  onDismiss={item => dismiss(item.id)}
/>`,
});
