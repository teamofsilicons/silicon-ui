import { Archive, BellOff, CheckCircle2, Clock, Forward, Pin, Reply, Trash2, UserPlus } from "lucide-react";

import { ExpandingButtonGroup, type ExpandingButtonGroupItem, type ExpandingButtonGroupProps } from "@/registry/components/expanding-button-group/expanding-button-group";
import { defineDemo } from "../lib/demo";

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const ticketActions: ExpandingButtonGroupItem[] = [
  { id: "resolve", label: "Resolve", icon: <CheckCircle2 />, doneLabel: "Resolved" },
  { id: "assign", label: "Assign", icon: <UserPlus /> },
  { id: "snooze", label: "Snooze", icon: <Clock />, doneLabel: "Snoozed" },
  { id: "archive", label: "Archive", icon: <Archive />, doneLabel: "Archived" },
  { id: "delete", label: "Delete", icon: <Trash2 />, doneLabel: "Deleted", tone: "danger", onSelect: () => wait(900) },
];

const messageActions: ExpandingButtonGroupItem[] = [
  { id: "reply", label: "Reply", icon: <Reply /> },
  { id: "forward", label: "Forward", icon: <Forward /> },
  { id: "pin", label: "Pin", icon: <Pin />, doneLabel: "Pinned" },
  { id: "mute", label: "Mute thread", icon: <BellOff />, disabled: true },
];

export default defineDemo<ExpandingButtonGroupProps>({
  component: ExpandingButtonGroup,
  props: { label: "Ticket actions", items: ticketActions, defaultExpanded: "resolve" },
  hideControls: ["items"],
  examples: [
    {
      title: "Compact message actions",
      description: "Actions without a doneLabel, like Reply, open something instead of confirming. A disabled action still reveals its label.",
      render: () => <ExpandingButtonGroup label="Message actions" size="sm" items={messageActions} />,
    },
  ],
  usage: `<ExpandingButtonGroup
  label="Ticket actions"
  defaultExpanded="resolve"
  items={[
    { id: "resolve", label: "Resolve", icon: <CheckCircle2 />, doneLabel: "Resolved", onSelect: resolve },
    { id: "assign", label: "Assign", icon: <UserPlus />, onSelect: openAssignee },
    { id: "delete", label: "Delete", icon: <Trash2 />, doneLabel: "Deleted", tone: "danger", onSelect: remove },
  ]}
/>`,
});
