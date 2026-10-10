import { StatsBand } from "@/registry/blocks/stats-band/stats-band";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: StatsBand,
  props: {
    layout: "divided",
    title: "Fast, steady, and close to everyone",
    description: "Measured across every region from October 2025 to September 2026.",
  },
  examples: [
    {
      title: "Plain",
      description: "The stats float on whitespace without the hairline grid.",
      render: () => <StatsBand layout="plain" title="Fast, steady, and close to everyone" />,
      stage: { layout: "fill" },
    },
  ],
  usage: `<StatsBand
  layout="divided"
  title="Fast, steady, and close to everyone"
  stats={stats}
/>`,
});
