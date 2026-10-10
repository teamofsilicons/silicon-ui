import { useState } from "react";

import { TagInput, type TagInputProps } from "@/registry/components/tag-input/tag-input";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 400px)" } as const;

export default defineDemo<TagInputProps>({
  props: {
    label: "Skills",
    description: "Press Enter or comma to add. Backspace selects the last tag, then removes it.",
    placeholder: "Add a skill",
  },
  hideControls: ["id"],
  Preview: ({ props }) => {
    const [value, setValue] = useState(["Refunds", "Invoices", "Zendesk"]);
    return <div style={field}><TagInput {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} /></div>;
  },
  examples: [
    {
      title: "Many tags",
      description: "Rows wrap and the field follows on a spring.",
      render: () => <div style={field}>
        <TagInput label="Notify teams" defaultValue={["Finance", "Customer support", "Operations", "Sales", "Legal", "Platform engineering", "Success"]} placeholder="Add a team" />
      </div>,
    },
    {
      title: "Empty",
      render: () => <div style={field}><TagInput label="Keywords" placeholder="Words that route a ticket to this silicon" /></div>,
    },
  ],
  usage: `const [skills, setSkills] = useState(["Refunds", "Invoices"]);

<TagInput label="Skills" value={skills} onValueChange={setSkills} />`,
});
