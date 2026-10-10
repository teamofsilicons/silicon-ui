import { CtaSection } from "@/registry/blocks/cta-section/cta-section";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: CtaSection,
  examples: [
    {
      title: "Split",
      description: "Benefit lines beside a product visual.",
      render: () => <CtaSection variant="split" />,
      stage: { layout: "fill" },
    },
    {
      title: "Banner",
      description: "One dismissible line. `onDismiss` shows the close button.",
      render: () => <CtaSection variant="banner" onDismiss={() => {}} />,
      stage: { layout: "fill", minHeight: 200 },
    },
  ],
  usage: `<CtaSection
  variant="centered"
  title="Put a silicon on your support queue"
  description="Most teams answer real tickets within a week."
  primaryAction={{ label: "Deploy a silicon", href: "/signup" }}
  secondaryAction={{ label: "Talk to sales", href: "/contact" }}
  note="No credit card required"
/>`,
});
