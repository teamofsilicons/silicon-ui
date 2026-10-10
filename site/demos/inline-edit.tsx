import { useState } from "react";

import InlineEdit, { type InlineEditProps } from "@/registry/components/inline-edit/inline-edit";
import { defineDemo } from "../lib/demo";

const card = { width: "min(100%, 420px)", display: "grid", gap: 6 } as const;
const meta = { margin: 0, fontSize: 13, color: "var(--text-muted)" } as const;

/** Stands in for a network call. */
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const validateName = (next: string) => next.trim() ? next.trim().length > 40 ? "Keep it under 40 characters." : null : "Give the silicon a name.";

function ProjectCard() {
  const [name, setName] = useState("Q4 invoice reconciliation");
  const [summary, setSummary] = useState("Ledger matches incoming payments to open invoices and flags anything over $5,000 for review.");
  return <div style={card}>
    <InlineEdit as="h3" label="Project name" value={name} validate={validateName} onSave={async next => { await wait(700); setName(next); }} />
    <InlineEdit variant="body" multiline as="p" label="Project summary" placeholder="Add a summary" value={summary} onSave={async next => { await wait(700); setSummary(next); }} />
  </div>;
}

function FailingSave() {
  return <div style={card}>
    <InlineEdit as="h3" label="Team name" value="Customer support" onSave={async () => { await wait(900); throw new Error("Offline"); }} />
    <p style={meta}>Saves here always fail, so the old name rolls back with a retry.</p>
  </div>;
}

export default defineDemo<InlineEditProps>({
  props: { label: "Silicon name", placeholder: "Name this silicon" },
  hideControls: ["value", "className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("Harbor, support silicon");
    return <div style={card}>
      <InlineEdit {...props} value={value} validate={validateName} onSave={async next => { props.onSave?.(next); await wait(700); setValue(next); }} />
      <p style={meta}>Click the name to rename it. Enter saves, Escape cancels.</p>
    </div>;
  },
  examples: [
    { title: "Title and description", description: "A heading and a multiline body; Shift+Enter adds a line break in the body.", render: () => <ProjectCard /> },
    { title: "Failed save", render: () => <FailingSave /> },
  ],
  usage: `const [name, setName] = useState("Harbor, support silicon");

<InlineEdit
  label="Silicon name"
  value={name}
  validate={next => next.trim() ? null : "Give the silicon a name."}
  onSave={async next => {
    await api.renameSilicon(id, next);
    setName(next);
  }}
/>`,
});
