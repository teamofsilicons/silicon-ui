import RichTextEditor, { type RichTextEditorProps } from "@/registry/components/rich-text-editor/rich-text-editor";
import { defineDemo } from "../lib/demo";

const handoff = `## Handoff: billing silicon

The finance silicon now owns **invoice reconciliation** for the EU entity. Ask it in #finance-ops or mention it on a ticket.

- Reconciles Stripe payouts every night at 02:00
- Flags anything over _€5,000_ for a person to approve
- Writes a summary to the [ops log](https://example.com/ops)

> Select text to format it, or type / on an empty line for blocks.`;

const policy = `### Refund policy

Refunds under $50 are approved by the support silicon. Anything larger goes to the **billing team** within one business day.`;

const surface = { width: "min(100%, 600px)", padding: "18px 22px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" } as const;

export default defineDemo<RichTextEditorProps>({
  props: { defaultMarkdown: handoff, "aria-label": "Handoff notes" },
  hideControls: ["value", "defaultValue", "defaultMarkdown", "autoFocus", "aria-label"],
  Preview: ({ props }) => <div style={surface}><RichTextEditor {...props} /></div>,
  examples: [
    {
      title: "Empty",
      description: "The placeholder shows until the first keystroke; Markdown shortcuts like ## and - work as you type.",
      render: () => <div style={surface}><RichTextEditor aria-label="Ticket reply" placeholder="Write a reply to the customer" /></div>,
    },
    {
      title: "Read only",
      render: () => <div style={surface}><RichTextEditor aria-label="Refund policy" defaultMarkdown={policy} readOnly /></div>,
    },
  ],
  usage: `const [notes, setNotes] = useState("");

<RichTextEditor
  aria-label="Handoff notes"
  defaultMarkdown="## Handoff\\n\\nThe finance silicon now owns **reconciliation**."
  onChange={value => setNotes(value.markdown)}
/>`,
});
