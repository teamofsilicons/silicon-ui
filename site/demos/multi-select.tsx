import { useState } from "react";

import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from "@/registry/components/multi-select/multi-select";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;
/** Keeps the field near the top so the open list has room below it. */
const room = (minHeight: number) => ({ ...field, minHeight }) as const;

const channels: MultiSelectOption[] = [
  { value: "email", label: "Email" },
  { value: "chat", label: "Live chat" },
  { value: "slack", label: "Slack" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS", disabled: true },
];

export default defineDemo<MultiSelectProps>({
  props: {
    label: "Support channels",
    description: "Harbor answers on every channel you pick.",
    placeholder: "Pick channels",
    options: channels,
  },
  hideControls: ["className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState(["email", "chat"]);
    return <div style={room(380)}><MultiSelect {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} /></div>;
  },
  examples: [
    {
      title: "Overflow count",
      description: "Past maxVisible, the rest fold into a rolling +N chip.",
      render: () => <div style={room(340)}><MultiSelect label="Support channels" options={channels} defaultValue={["email", "chat", "slack", "phone"]} maxVisible={2} /></div>,
    },
    {
      title: "Disabled",
      render: () => <div style={field}><MultiSelect label="Support channels" options={channels} defaultValue={["email"]} disabled description="Upgrade to add more channels." /></div>,
    },
  ],
  usage: `const [selected, setSelected] = useState(["email", "chat"]);

<MultiSelect
  label="Support channels"
  value={selected}
  onValueChange={setSelected}
  options={[
    { value: "email", label: "Email" },
    { value: "chat", label: "Live chat" },
    { value: "slack", label: "Slack" },
  ]}
/>`,
});
