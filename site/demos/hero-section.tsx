import { HeroCadence, HeroRelay, HeroSection } from "@/registry/blocks/hero-section/hero-section";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: HeroSection,
  stage: { minHeight: 720 },
  examples: [
    {
      title: "Workflow graph",
      description: "The split design: copy beside a live workflow graph that routes sample events node by node.",
      render: () => <HeroRelay />,
      stage: { layout: "fill", minHeight: 720 },
    },
    {
      title: "Mesh gradient",
      description: "The minimal design: large type over a drifting mesh gradient.",
      render: () => <HeroCadence primaryAction={{ label: "Deploy a silicon", doneLabel: "Deployment queued" }} secondaryAction={{ label: "Talk to sales", doneLabel: "Request sent" }} />,
      stage: { layout: "fill", minHeight: 720 },
    },
    {
      title: "Your own content",
      description: "Pass a title and the hero renders your copy, actions and install line in the chosen layout instead of the designed sample.",
      render: () => <HeroSection
        variant="centered"
        announcement={{ label: "Silicons now pick up Linear tickets" }}
        title="Put a silicon on every team"
        description="AI employees that join your support, finance and ops teams, work your queues and hand off to a person when it matters."
        primaryAction={{ label: "Deploy a silicon", doneLabel: "Deployment queued" }}
        secondaryAction={{ label: "Read the docs", href: "#docs" }}
        install={[{ label: "npm", command: "npx silicons deploy --team support" }]}
        meta={["v1.1.0", "SOC 2 Type II", "Cancel anytime"]}
      />,
      stage: { layout: "fill", minHeight: 560 },
    },
  ],
  usage: `<HeroSection variant="centered" />

<HeroSection
  variant="split"
  title="Put a silicon on every team"
  description="AI employees for support, finance and ops."
  primaryAction={{ label: "Deploy a silicon", href: "/signup" }}
  secondaryAction={{ label: "Read the docs", href: "/docs" }}
/>`,
});
