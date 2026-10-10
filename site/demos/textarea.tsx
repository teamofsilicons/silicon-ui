import { Textarea, type TextareaProps } from "@/registry/components/textarea/textarea";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 420px)" } as const;

export default defineDemo<TextareaProps>({
  props: {
    label: "Handoff notes",
    description: "The support silicon reads these before it picks up a ticket.",
    placeholder: "Escalate refunds over $500 to the finance team…",
    rows: 4,
  },
  Preview: ({ props }) => <div style={field}><Textarea {...props} /></div>,
  examples: [
    {
      title: "Prefilled",
      render: () => <div style={field}>
        <Textarea label="Deployment summary" rows={4} defaultValue={"Rolled the onboarding silicon out to the Sales and Success teams.\nIt handled 312 tickets in the first week with a 94% resolution rate."} />
      </div>,
    },
    {
      title: "Error",
      render: () => <div style={field}>
        <Textarea label="Reason for pausing" rows={3} defaultValue="Budget" error="Add a few more words so the team knows what changed." />
      </div>,
    },
  ],
  usage: `<Textarea
  label="Handoff notes"
  rows={4}
  description="The support silicon reads these before it picks up a ticket."
/>`,
});
