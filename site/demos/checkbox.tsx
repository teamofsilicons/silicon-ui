import { useState } from "react";

import { Checkbox, type CheckboxProps } from "@/registry/components/checkbox/checkbox";
import { defineDemo } from "../lib/demo";

const silicons = [
  { id: "finance", label: "Finance silicon" },
  { id: "support", label: "Support silicon" },
  { id: "recruiting", label: "Recruiting silicon" },
];

function SelectAll() {
  const [picked, setPicked] = useState<string[]>(["finance"]);
  const all = picked.length === silicons.length ? true : picked.length ? "indeterminate" : false;
  return <div style={{ display: "grid", gap: 12 }}>
    <Checkbox label="Pause all silicons" checked={all} onCheckedChange={next => setPicked(next === true ? silicons.map(s => s.id) : [])} />
    <div style={{ display: "grid", gap: 10, paddingLeft: 28 }}>
      {silicons.map(s => <Checkbox key={s.id} label={s.label} checked={picked.includes(s.id)}
        onCheckedChange={next => setPicked(list => next === true ? [...list, s.id] : list.filter(id => id !== s.id))} />)}
    </div>
  </div>;
}

export default defineDemo<CheckboxProps>({
  props: { label: "Email me when a silicon finishes a task", description: "One summary per task, sent to your work address." },
  Preview: ({ props }) => <div style={{ width: "min(100%, 360px)" }}><Checkbox defaultChecked {...props} /></div>,
  examples: [
    {
      title: "Indeterminate",
      description: "A parent shows a dash when only some of its children are checked; the mark morphs between the two.",
      render: () => <SelectAll />,
    },
    {
      title: "Disabled",
      render: () => <div style={{ display: "grid", gap: 12 }}>
        <Checkbox label="Share usage with your admin" defaultChecked disabled />
        <Checkbox label="Allow silicons to send email" description="Your workspace policy turns this off." disabled />
      </div>,
    },
  ],
});
