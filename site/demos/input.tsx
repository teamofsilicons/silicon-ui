import { Input, type InputProps } from "@/registry/components/input/input";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;
const stack = { display: "grid", gap: 20, width: "min(100%, 360px)" } as const;

export default defineDemo<InputProps>({
  props: { label: "Work email", description: "Invoices and usage alerts go here.", placeholder: "name@company.com", type: "email" },
  Preview: ({ props }) => <div style={field}><Input {...props} /></div>,
  examples: [
    {
      title: "Error",
      description: "The error replaces the description and is tied to the field for screen readers.",
      render: () => <div style={field}><Input label="Billing contact" type="email" defaultValue="finance@northwind" error="Enter a full email address, such as finance@northwind.com." /></div>,
    },
    {
      title: "Prefilled and disabled",
      render: () => <div style={stack}>
        <Input label="Silicon name" defaultValue="Ledger, finance silicon" description="Shown in tickets and chat." />
        <Input label="Workspace ID" defaultValue="ws_7f3a91c2" disabled />
      </div>,
    },
  ],
  usage: `<Input
  label="Work email"
  type="email"
  placeholder="name@company.com"
  description="Invoices and usage alerts go here."
/>`,
});
