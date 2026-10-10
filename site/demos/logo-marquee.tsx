import { LogoMarquee } from "@/registry/blocks/logo-marquee/logo-marquee";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: LogoMarquee,
  examples: [
    {
      title: "Monochrome",
      description: "`tone=\"mono\"` draws every mark in the text color.",
      render: () => <LogoMarquee tone="mono" />,
      stage: { layout: "fill" },
    },
  ],
  usage: `<LogoMarquee
  title="Silicons work where your team already works"
  tone="mono"
  brands={brands}
/>`,
});
