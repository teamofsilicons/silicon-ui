import { ContactSection } from "@/registry/blocks/contact-section/contact-section";
import { defineDemo } from "../lib/demo";

/** Simulates a network round trip; nothing is sent. */
const send = () => new Promise<void>(resolve => setTimeout(resolve, 1100));

export default defineDemo({
  component: ContactSection,
  props: { onSubmit: send, topics: ["Sales", "Support", "Billing", "Security review"] },
  hideControls: ["channel"],
  stage: { minHeight: 560 },
  examples: [
    {
      title: "Channels",
      description: "Pick a way to reach the team; each channel shows its details in place.",
      render: () => <ContactSection variant="channels" />,
      stage: { layout: "fill", minHeight: 520 },
    },
    {
      title: "Offices",
      render: () => <ContactSection variant="offices" />,
      stage: { layout: "fill", minHeight: 520 },
    },
  ],
  usage: `<ContactSection
  variant="form"
  topics={["Sales", "Support", "Billing"]}
  onSubmit={async message => {
    await fetch("/api/contact", { method: "POST", body: JSON.stringify(message) });
  }}
/>`,
});
