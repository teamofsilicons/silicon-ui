import { NewsletterSignup } from "@/registry/blocks/newsletter-signup/newsletter-signup";
import { defineDemo } from "../lib/demo";

/** Simulates the request; nothing is sent. */
const subscribe = () => new Promise<void>(resolve => setTimeout(resolve, 1100));
const fail = () => new Promise<void>((_, reject) => setTimeout(() => reject(new Error("Simulated failure")), 1100));

export default defineDemo({
  component: NewsletterSignup,
  props: { onSubscribe: subscribe },
  examples: [
    {
      title: "Card",
      render: () => <NewsletterSignup variant="card" onSubscribe={subscribe} />,
      stage: { layout: "fill" },
    },
    {
      title: "Failed send",
      description: "When `onSubscribe` rejects, the form keeps the address and shows an error so the reader can try again.",
      render: () => <NewsletterSignup onSubscribe={fail} />,
      stage: { layout: "fill" },
    },
  ],
  usage: `<NewsletterSignup
  variant="inline"
  title="The Silicon Dispatch"
  onSubscribe={async email => {
    await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
  }}
/>`,
});
