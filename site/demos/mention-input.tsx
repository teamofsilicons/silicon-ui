import { useState } from "react";

import { people as media } from "@/lib/media";
import MentionInput, { serializeMentions, type MentionChannel, type MentionInputProps, type MentionPerson, type MentionValue } from "@/registry/components/mention-input/mention-input";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 440px)" } as const;

const people: MentionPerson[] = [
  ...media.slice(0, 8).map(person => ({ id: person.id, name: person.name, role: person.role, avatar: person.src })),
  { id: "ledger", name: "Ledger", role: "Finance silicon" },
  { id: "harbor", name: "Harbor", role: "Support silicon" },
];
const channels: MentionChannel[] = [
  { id: "c-ops", name: "operations", description: "Deployments and incidents", members: 42 },
  { id: "c-finance", name: "finance", description: "Invoices, refunds and spend", members: 18 },
  { id: "c-support", name: "support-escalations", description: "Tickets a silicon handed off", members: 27 },
  { id: "c-launch", name: "q4-launch", description: "Rollout of the onboarding silicon", members: 11 },
];

const empty: MentionValue = { text: "", mentions: [] };
const prefilled: MentionValue = {
  text: "@Ledger can you reconcile INV-2041 and post the result in #finance?",
  mentions: [
    { kind: "person", id: "ledger", label: "Ledger", start: 0, end: 7 },
    { kind: "channel", id: "c-finance", label: "finance", start: 58, end: 66 },
  ],
};

function Composer() {
  const [value, setValue] = useState(empty);
  const [posted, setPosted] = useState<string[]>([]);
  return <div style={{ ...field, display: "grid", gap: 12 }}>
    {posted.length > 0 && <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
      {posted.map((line, index) => <li key={index}><code>{line}</code></li>)}
    </ol>}
    <MentionInput aria-label="Message #operations" placeholder="Message #operations" people={people} channels={channels} value={value} onChange={setValue} submitOnEnter
      onSubmit={next => { if (!next.text.trim()) return; setPosted(current => [...current, serializeMentions(next)].slice(-3)); setValue(empty); }} />
  </div>;
}

export default defineDemo<MentionInputProps>({
  props: { "aria-label": "Comment", placeholder: "Add a comment. Type @ for people or # for channels", people, channels, minRows: 2 },
  hideControls: ["value", "defaultValue", "id", "name", "className", "aria-describedby"],
  stage: { minHeight: 460 },
  Preview: ({ props }) => {
    const [value, setValue] = useState(empty);
    return <div style={field}><MentionInput {...props} value={value} onChange={next => { setValue(next); props.onChange?.(next); }} /></div>;
  },
  examples: [
    { title: "Prefilled", description: "Mentions are ranges in the text, so they survive edits around them.", stage: { minHeight: 360 }, render: () => <div style={field}><MentionInput aria-label="Comment" people={people} channels={channels} defaultValue={prefilled} minRows={2} /></div> },
    { title: "Chat composer", description: "With submitOnEnter, Enter sends and Shift+Enter adds a line. Sent text is serialized as <@id> and <#id>.", stage: { minHeight: 380 }, render: () => <Composer /> },
  ],
  usage: `const [value, setValue] = useState({ text: "", mentions: [] });

<MentionInput
  aria-label="Comment"
  value={value}
  onChange={setValue}
  people={[{ id: "ledger", name: "Ledger", role: "Finance silicon" }]}
  channels={[{ id: "c-finance", name: "finance", members: 18 }]}
/>`,
});
