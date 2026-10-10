import { ArrowRight, Copy, Plus, Upload } from "lucide-react";

import { Button } from "@/registry/components/button/button";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: Button,
  props: { children: "Save changes" },
  examples: [
    {
      title: "With icons",
      description: "Icons sit before or after the label. An icon alone needs an aria-label.",
      render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Button variant="secondary"><Plus size={16} aria-hidden="true" /> Add item</Button>
        <Button>Continue <ArrowRight size={16} aria-hidden="true" /></Button>
        <Button variant="secondary" aria-label="Copy link"><Copy size={16} aria-hidden="true" /></Button>
      </div>,
    },
    {
      title: "States",
      render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Button loading>Saving</Button>
        <Button variant="secondary"><Upload size={16} aria-hidden="true" /> Upload file</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </div>,
    },
  ],
});
