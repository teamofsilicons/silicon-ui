import { Accordion, type AccordionProps } from "@/registry/components/accordion/accordion";
import { defineDemo } from "../lib/demo";

const items = [
  { title: "What does a silicon do on its first day?", content: "It reads your help center, past tickets, and runbooks, then shadows your team in draft mode until you approve its replies." },
  { title: "Which tools can it connect to?", content: "Zendesk, Intercom, Salesforce, HubSpot, Stripe, NetSuite, Slack, and Google Workspace out of the box. Anything with an API can be added." },
  { title: "Who reviews its work?", content: "Each silicon reports to a human manager. Actions above the limits you set, such as refunds over $500, wait for their approval." },
  { title: "How is usage billed?", content: "By active silicon hours. Idle time is free, and the usage meter shows each department's share of the plan." },
];

export default defineDemo<AccordionProps>({
  props: { items },
  Preview: ({ props }) => <div style={{ width: "min(100%, 520px)" }}><Accordion {...props} /></div>,
  examples: [
    {
      title: "All closed",
      description: "Pass -1 to start with every item closed.",
      render: () => <div style={{ width: "min(100%, 520px)" }}><Accordion items={items.slice(0, 3)} defaultOpen={-1} /></div>,
    },
  ],
  usage: `<Accordion
  items={[
    { title: "What does a silicon do on its first day?", content: "It reads your help center…" },
    { title: "Which tools can it connect to?", content: "Zendesk, Intercom, Salesforce…" },
  ]}
/>`,
});
