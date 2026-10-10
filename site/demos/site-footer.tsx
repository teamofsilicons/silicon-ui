import { SiteFooter } from "@/registry/blocks/site-footer/site-footer";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: SiteFooter,
  examples: [
    {
      title: "Minimal",
      description: "One quiet row of links, legal and status.",
      render: () => <SiteFooter variant="minimal" />,
      stage: { layout: "fill" },
    },
    {
      title: "Logo",
      description: "The footer ends in a large fading mark.",
      render: () => <SiteFooter variant="logo" />,
      stage: { layout: "fill" },
    },
  ],
  usage: `<SiteFooter
  variant="columns"
  brand={{ name: "Team of Silicons", href: "/" }}
  columns={columns}
  status={{ label: "All silicons online", tone: "success", href: "/status" }}
/>`,
});
