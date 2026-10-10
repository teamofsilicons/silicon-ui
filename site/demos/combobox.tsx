import { useState } from "react";

import { Combobox, type ComboboxOption, type ComboboxProps } from "@/registry/components/combobox/combobox";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 340px)" } as const;
/** Keeps the field near the top so the open list has room below it. */
const room = (minHeight: number) => ({ ...field, minHeight }) as const;

const integrations: ComboboxOption[] = [
  { value: "zendesk", label: "Zendesk", keywords: ["tickets", "support"] },
  { value: "intercom", label: "Intercom", keywords: ["chat", "support"] },
  { value: "salesforce", label: "Salesforce", keywords: ["crm", "sales"] },
  { value: "hubspot", label: "HubSpot", keywords: ["crm", "marketing"] },
  { value: "netsuite", label: "NetSuite", keywords: ["erp", "finance", "invoices"] },
  { value: "quickbooks", label: "QuickBooks", keywords: ["accounting", "finance"] },
  { value: "slack", label: "Slack", keywords: ["chat"] },
  { value: "jira", label: "Jira", keywords: ["issues", "engineering"] },
  { value: "workday", label: "Workday", keywords: ["hr", "people"], disabled: true },
];

export default defineDemo<ComboboxProps>({
  props: {
    label: "Connect an integration",
    description: "Search by name or by what it does, such as “crm”.",
    placeholder: "Search integrations…",
    options: integrations,
  },
  hideControls: ["value", "defaultValue", "className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("");
    return <div style={room(400)}><Combobox {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} /></div>;
  },
  examples: [
    {
      title: "Prefilled with a custom empty message",
      render: () => <div style={room(320)}>
        <Combobox label="Accounting system" options={integrations.filter(option => option.keywords?.includes("finance"))} defaultValue="netsuite" emptyMessage="No accounting tools match. Request one from your admin." />
      </div>,
    },
    {
      title: "Disabled",
      render: () => <div style={field}><Combobox label="Ticketing system" options={integrations} defaultValue="zendesk" disabled /></div>,
    },
  ],
  usage: `const [integration, setIntegration] = useState("");

<Combobox
  label="Connect an integration"
  value={integration}
  onValueChange={setIntegration}
  options={[
    { value: "zendesk", label: "Zendesk", keywords: ["tickets"] },
    { value: "salesforce", label: "Salesforce", keywords: ["crm"] },
  ]}
/>`,
});
