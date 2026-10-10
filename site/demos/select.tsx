import { useState } from "react";

import { Select, type SelectProps } from "@/registry/components/select/select";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 320px)" } as const;

const departments = [
  { value: "support", label: "Customer support" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "legal", label: "Legal", disabled: true },
];
const regions = [
  { value: "us-east", label: "US East (Virginia)" },
  { value: "eu-west", label: "EU West (Dublin)" },
  { value: "ap-south", label: "Asia Pacific (Mumbai)" },
];

export default defineDemo<SelectProps>({
  props: { label: "Department", description: "The silicon joins this department's queue.", options: departments },
  hideControls: ["id", "className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("finance");
    return <div style={field}><Select {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} /></div>;
  },
  examples: [
    {
      title: "Placeholder",
      description: "Nothing is chosen until someone picks; the placeholder stays muted.",
      render: () => <div style={field}><Select label="Data region" placeholder="Choose a region" options={regions} /></div>,
    },
    {
      title: "Disabled",
      render: () => <div style={field}><Select label="Data region" options={regions} defaultValue="eu-west" disabled description="Fixed once the workspace is created." /></div>,
    },
  ],
  usage: `const [department, setDepartment] = useState("finance");

<Select
  label="Department"
  value={department}
  onValueChange={setDepartment}
  options={[
    { value: "support", label: "Customer support" },
    { value: "finance", label: "Finance" },
    { value: "legal", label: "Legal", disabled: true },
  ]}
/>`,
});
