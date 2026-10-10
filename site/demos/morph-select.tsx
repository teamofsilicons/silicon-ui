/* eslint-disable @next/next/no-img-element -- 20px avatars inside the option rows */
import { useState } from "react";
import { Bot, CircleCheck, CircleDashed, CircleDot, CirclePause } from "lucide-react";

import { people } from "@/lib/media";
import MorphSelect, { type MorphSelectItem, type MorphSelectProps } from "@/registry/components/morph-select/morph-select";
import { defineDemo } from "../lib/demo";

/** Keeps the trigger near the top so the open list has room below it. */
const room = (minHeight: number) => ({ minHeight, display: "grid", alignContent: "start", justifyItems: "center" }) as const;

const avatar = (src: string) => <img src={src} alt="" />;

const assignees: MorphSelectItem[] = [
  { label: "Silicons", options: [
    { value: "ledger", label: "Ledger", icon: <Bot aria-hidden="true" />, meta: "Finance" },
    { value: "harbor", label: "Harbor", icon: <Bot aria-hidden="true" />, meta: "Support" },
  ] },
  { label: "People", options: people.slice(0, 6).map(person => ({ value: person.id, label: person.name, icon: avatar(person.src), keywords: person.role })) },
];

const statuses: MorphSelectItem[] = [
  { value: "backlog", label: "Backlog", icon: <CircleDashed aria-hidden="true" /> },
  { value: "in-progress", label: "In progress", icon: <CircleDot aria-hidden="true" /> },
  { value: "paused", label: "Paused", icon: <CirclePause aria-hidden="true" /> },
  { value: "done", label: "Done", icon: <CircleCheck aria-hidden="true" /> },
];

const timezones: MorphSelectItem[] = [
  { label: "Americas", options: [
    { value: "America/Los_Angeles", label: "Los Angeles", meta: "UTC−7" },
    { value: "America/Denver", label: "Denver", meta: "UTC−6" },
    { value: "America/Chicago", label: "Chicago", meta: "UTC−5" },
    { value: "America/New_York", label: "New York", meta: "UTC−4" },
    { value: "America/Sao_Paulo", label: "São Paulo", meta: "UTC−3" },
  ] },
  { label: "Europe and Africa", options: [
    { value: "Europe/London", label: "London", meta: "UTC+1" },
    { value: "Europe/Berlin", label: "Berlin", meta: "UTC+2" },
    { value: "Africa/Nairobi", label: "Nairobi", meta: "UTC+3" },
  ] },
  { label: "Asia Pacific", options: [
    { value: "Asia/Kolkata", label: "Kolkata", meta: "UTC+5:30", keywords: "india mumbai" },
    { value: "Asia/Singapore", label: "Singapore", meta: "UTC+8" },
    { value: "Asia/Tokyo", label: "Tokyo", meta: "UTC+9" },
    { value: "Australia/Sydney", label: "Sydney", meta: "UTC+11" },
  ] },
];

export default defineDemo<MorphSelectProps>({
  props: { label: "Assignee", items: assignees, placeholder: "Unassigned" },
  hideControls: ["value", "defaultValue", "name", "className", "searchable"],
    Preview: ({ props }) => {
    const [value, setValue] = useState<string | null>("harbor");
    return <div style={room(400)}><MorphSelect {...props} value={value} onValueChange={(next, option) => { setValue(next); props.onValueChange?.(next, option); }} /></div>;
  },
  examples: [
    {
      title: "Compact property picker",
      description: "A short list with icons; the label lifts out of the list into the trigger.",
      render: () => <div style={room(220)}><MorphSelect label="Status" hideLabel items={statuses} defaultValue="in-progress" /></div>,
    },
    {
      title: "Searchable with meta",
      description: "Above eight options a search field replaces the trigger while open. Meta uses tabular numerals.",
      render: () => <div style={room(380)}><MorphSelect label="Working hours timezone" items={timezones} defaultValue="Europe/London" searchPlaceholder="Search cities" panelWidth={300} /></div>,
    },
  ],
  usage: `const [assignee, setAssignee] = useState<string | null>("harbor");

<MorphSelect
  label="Assignee"
  value={assignee}
  onValueChange={setAssignee}
  items={[
    { label: "Silicons", options: [{ value: "harbor", label: "Harbor", meta: "Support" }] },
    { label: "People", options: [{ value: "emma", label: "Emma Collins" }] },
  ]}
/>`,
});
