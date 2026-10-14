import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/registry/components/button-link/button-link";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: ButtonLink,
  props: { href: "#", children: "Create your account" },
  examples: [
    {
      title: "Variants",
      description: "The same variants and sizes as Button. Use it whenever pressing goes somewhere.",
      render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <ButtonLink href="#">Get started <ArrowRight size={16} aria-hidden="true" /></ButtonLink>
        <ButtonLink href="#" variant="secondary">Read the docs</ButtonLink>
        <ButtonLink href="#" variant="ghost">Sign in</ButtonLink>
      </div>,
    },
  ],
});
