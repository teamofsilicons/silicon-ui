import { InViewTitle, type InViewTitleProps, type InViewTitleVariant } from "@/registry/components/in-view-title/in-view-title";
import { defineDemo } from "../lib/demo";

const title = { maxWidth: 560, margin: "0 auto", textAlign: "center", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.15 } as const;
const body = { margin: "0 0 8px", color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6 } as const;

const sections: { variant: InViewTitleVariant; text: string; copy: string; lines?: string[] }[] = [
  { variant: "blur", text: "Onboarding in an afternoon", copy: "Connect your helpdesk and drive, and the silicon reads every runbook before its first ticket." },
  { variant: "word", text: "Every ticket gets an owner", copy: "Silicons triage the queue overnight and hand the hard cases to a person with a summary attached." },
  { variant: "line", text: "Invoices reconcile themselves", lines: ["Invoices", "reconcile themselves"], copy: "The finance silicon matches payments to purchase orders and flags only what does not add up." },
  { variant: "tracking", text: "Reports before standup", copy: "Usage, spend and open escalations land in the operations channel at 8:45 every morning." },
  { variant: "wipe", text: "You stay in charge", copy: "Approvals, budgets and permissions stay with your team. Silicons ask before they spend." },
];

export default defineDemo<InViewTitleProps>({
  props: { text: "Silicons that learn your company", variant: "blur" },
  variants: [],
  Preview: ({ props }) => <div style={title}><InViewTitle {...props} /></div>,
  examples: [
    {
      title: "Scroll to reveal",
      description: "Each title reveals as it scrolls into the box, one per variant. once={false} replays them on every entry.",
      render: () => <div style={{ width: "min(100%, 520px)", height: 320, overflowY: "auto", padding: "0 20px", border: "1px solid var(--border)", borderRadius: "var(--radius-control)", background: "var(--background)" }}>
        <p style={{ ...body, padding: "120px 0 160px", textAlign: "center", color: "var(--text-muted)" }}>Scroll down</p>
        {sections.map(section => <section key={section.variant} style={{ paddingBottom: 140 }}>
          <code style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{section.variant}</code>
          <div style={{ ...title, margin: 0, textAlign: "left", fontSize: "var(--text-lg)" }}><InViewTitle text={section.text} variant={section.variant} lines={section.lines} once={false} /></div>
          <p style={body}>{section.copy}</p>
        </section>)}
      </div>,
    },
  ],
  usage: `<InViewTitle variant="blur" text="Silicons that learn your company" />

<InViewTitle variant="line" text="Invoices reconcile themselves" lines={["Invoices", "reconcile themselves"]} />`,
});
