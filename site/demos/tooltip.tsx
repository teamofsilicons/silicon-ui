import { Archive, Copy, Download, Link2, Trash2 } from "lucide-react";

import { Button } from "@/registry/components/button/button";
import { Tooltip } from "@/registry/components/tooltip/tooltip";
import { defineDemo } from "../lib/demo";

const tools = [{ label: "Duplicate", Icon: Copy }, { label: "Download PDF", Icon: Download }, { label: "Archive", Icon: Archive }, { label: "Delete", Icon: Trash2 }];

export default defineDemo({
  component: Tooltip,
  props: { content: "Copy invoice link", children: <Button variant="secondary" aria-label="Copy invoice link"><Link2 size={16} aria-hidden="true" /></Button> },
  examples: [
    {
      title: "Toolbar",
      description: "Once one tooltip is open, moving to the next shows it at once.",
      render: () => <div style={{ display: "flex", gap: 6 }}>
        {tools.map(({ label, Icon }) => <Tooltip key={label} content={label}><Button variant="ghost" aria-label={label}><Icon size={16} aria-hidden="true" /></Button></Tooltip>)}
      </div>,
    },
    {
      title: "Rich content",
      render: () => <Tooltip side="bottom" content={<span>Billed at <strong>$2.40</strong> per silicon hour</span>}>
        <Button variant="secondary">Pricing</Button>
      </Tooltip>,
    },
  ],
  usage: `<Tooltip content="Copy invoice link">
  <Button variant="secondary" aria-label="Copy invoice link">
    <Link2 size={16} aria-hidden="true" />
  </Button>
</Tooltip>`,
});
