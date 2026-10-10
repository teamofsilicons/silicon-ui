import { FaqSection, type FaqItem } from "@/registry/blocks/faq-section/faq-section";
import { defineDemo } from "../lib/demo";

const items: FaqItem[] = [
  { question: "What is a silicon?", answer: "A silicon is an AI employee that joins one of your teams. It works the same queues, tools and tickets as the people beside it, and hands off when a person should decide.", category: "General" },
  { question: "Which teams can a silicon join?", answer: "Support, finance, operations and sales are the most common. Each silicon is set up for one department with its own permissions and playbooks.", category: "General" },
  { question: "How long does a deployment take?", answer: "Most teams have a silicon answering real tickets within a week: two days to connect tools, three to review its first answers.", category: "General" },
  { question: "How is usage billed?", answer: "Each plan includes a monthly allowance of conversations and tasks. Usage past the allowance is billed at the end of the month on the same invoice.", category: "Billing" },
  { question: "Can I pause a silicon?", answer: "Yes. Paused silicons keep their memory and settings and are not billed for usage until you resume them.", category: "Billing" },
  { question: "Where is our data stored?", answer: "In the region you choose at setup, in the EU or the US. Data is encrypted at rest and in transit, and never used to train shared models.", category: "Security" },
  { question: "Who can see what a silicon did?", answer: "Every action is written to an audit log your admins can search and export, with the ticket, the tool used and the outcome.", category: "Security" },
];

const copy = { title: "Questions about silicons", description: "What teams ask before they deploy their first AI employee." };

export default defineDemo({
  component: FaqSection,
  props: { ...copy, items, contact: { label: "Still have a question?", description: "Our deployment team replies within a day.", href: "#contact" } },
  hideControls: ["value", "category", "query"],
  stage: { minHeight: 560 },
  examples: [
    {
      title: "Columns",
      description: "Questions grouped beside a category rail.",
      render: () => <FaqSection variant="columns" {...copy} items={items} />,
      stage: { layout: "fill", minHeight: 560 },
    },
    {
      title: "Search",
      description: "The list filters as you type, matching questions and answers.",
      render: () => <FaqSection variant="search" {...copy} items={items} />,
      stage: { layout: "fill", minHeight: 560 },
    },
  ],
  usage: `<FaqSection
  variant="accordion"
  title="Questions about silicons"
  items={[
    { question: "What is a silicon?", answer: "An AI employee that joins one of your teams.", category: "General" },
    { question: "How is usage billed?", answer: "Each plan includes a monthly allowance.", category: "Billing" },
  ]}
/>`,
});
