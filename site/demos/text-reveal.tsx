import { TextReveal, type TextRevealProps } from "@/registry/components/text-reveal/text-reveal";
import { defineDemo } from "../lib/demo";

const headline = { maxWidth: 560, margin: "0 auto", textAlign: "center", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.15 } as const;

export default defineDemo<TextRevealProps>({
  props: { text: "Your first silicon starts Monday.\nIt has already read the handbook." },
  Preview: ({ props }) => <div style={headline}><TextReveal {...props} /></div>,
  examples: [
    {
      title: "Headline and lede",
      description: "A delay on the paragraph lets it follow the heading. Paragraphs use a softer blur. Press replay above to run the main preview again.",
      render: () => <div style={{ ...headline, display: "grid", gap: 4 }}>
        <TextReveal text="Hire for the work, not the headcount." />
        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", fontWeight: 400, letterSpacing: 0, lineHeight: 1.5, color: "var(--text-secondary)" }}>
          <TextReveal as="p" delay={.35} text="Silicons join your teams, learn your tools, and take on tickets, invoices, and reports from day one." />
        </div>
      </div>,
    },
  ],
  usage: `<TextReveal text={"Your first silicon starts Monday.\\nIt has already read the handbook."} />`,
});
