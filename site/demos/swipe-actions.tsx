import { useState } from "react";
import { Archive, Clock, MailOpen, Trash2 } from "lucide-react";

import { people } from "@/lib/media";
import { SwipeActions, SwipeActionsRow, type SwipeActionsProps } from "@/registry/components/swipe-actions/swipe-actions";
import { defineDemo } from "../lib/demo";

const inbox = [
  { id: "t-4821", from: people[4], subject: "Refund over policy limit", preview: "The support silicon needs approval for a $1,240 refund.", time: "9:42" },
  { id: "t-4817", from: people[13], subject: "Invoice batch ready", preview: "312 invoices reconciled overnight, 4 need a second look.", time: "8:15" },
  { id: "t-4809", from: people[9], subject: "Deploy paused in eu-west", preview: "Latency crossed the threshold during rollout of v2.4.", time: "Yesterday" },
  { id: "t-4796", from: people[6], subject: "New onboarding request", preview: "Northwind wants a silicon for their claims team by Friday.", time: "Mon" },
];

type Ticket = (typeof inbox)[number];

function Row({ ticket, unread }: { ticket: Ticket; unread: boolean }) {
  return <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
    {/* eslint-disable-next-line @next/next/no-img-element -- demo portrait served by the site */}
    <img src={ticket.from.src} alt="" width={36} height={36} style={{ borderRadius: "50%", flex: "none", objectFit: "cover" }} />
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
        <strong style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: unread ? 600 : 500 }}>{ticket.subject}</strong>
        <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", flex: "none" }}>{ticket.time}</span>
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.from.name} · {ticket.preview}</div>
    </div>
  </div>;
}

export default defineDemo<SwipeActionsProps>({
  props: { label: "Escalations" },
  Preview: ({ props }) => {
    const [tickets, setTickets] = useState(inbox);
    const [read, setRead] = useState<string[]>([]);
    const remove = (id: string) => setTickets(list => list.filter(ticket => ticket.id !== id));
    return <div style={{ display: "grid", gap: 12, width: "min(100%, 440px)" }}>
      <SwipeActions {...props}>
        {tickets.map(ticket => <SwipeActionsRow key={ticket.id} label={ticket.subject}
          leading={[{ label: read.includes(ticket.id) ? "Unread" : "Read", icon: <MailOpen />, tone: "accent", keepRow: true, onSelect: () => setRead(list => list.includes(ticket.id) ? list.filter(id => id !== ticket.id) : [...list, ticket.id]) }]}
          trailing={[
            { label: "Snooze", icon: <Clock />, onSelect: () => remove(ticket.id) },
            { label: "Archive", icon: <Archive />, onSelect: () => remove(ticket.id) },
            { label: "Delete", icon: <Trash2 />, tone: "danger", onSelect: () => remove(ticket.id) },
          ]}>
          <Row ticket={ticket} unread={!read.includes(ticket.id)} />
        </SwipeActionsRow>)}
      </SwipeActions>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
        <span>{tickets.length ? "Swipe a row, or use its More actions menu." : "Inbox zero."}</span>
        {tickets.length < inbox.length && <button type="button" onClick={() => setTickets(inbox)} style={{ border: 0, background: "none", padding: 0, color: "var(--foreground)", font: "inherit", textDecoration: "underline", cursor: "pointer" }}>Restore all</button>}
      </div>
    </div>;
  },
  usage: `<SwipeActions label="Escalations">
  {tickets.map(ticket => (
    <SwipeActionsRow
      key={ticket.id}
      label={ticket.subject}
      leading={[{ label: "Read", icon: <MailOpen />, tone: "accent", keepRow: true, onSelect: () => markRead(ticket.id) }]}
      trailing={[
        { label: "Archive", icon: <Archive />, onSelect: () => archive(ticket.id) },
        { label: "Delete", icon: <Trash2 />, tone: "danger", onSelect: () => remove(ticket.id) },
      ]}
    >
      <TicketSummary ticket={ticket} />
    </SwipeActionsRow>
  ))}
</SwipeActions>`,
});
