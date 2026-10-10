import { Settings2 } from "lucide-react";

import { Button } from "@/registry/components/button/button";
import { Input } from "@/registry/components/input/input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/registry/components/popover/popover";
import { Switch } from "@/registry/components/switch/switch";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  Preview: () => <Popover>
    <PopoverTrigger asChild><Button variant="secondary">Set refund limit</Button></PopoverTrigger>
    <PopoverContent style={{ width: 300 }}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 2 }}>
          <strong style={{ fontSize: 14, fontWeight: 600 }}>Refund limit</strong>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Refunds above this wait for a manager.</span>
        </div>
        <Input label="Amount (USD)" type="number" defaultValue={500} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <PopoverClose asChild><Button variant="ghost" size="sm">Cancel</Button></PopoverClose>
          <PopoverClose asChild><Button size="sm">Save</Button></PopoverClose>
        </div>
      </div>
    </PopoverContent>
  </Popover>,
  examples: [
    {
      title: "Aligned to the end",
      description: "An icon trigger at the right edge of a toolbar opens its panel aligned to the end.",
      render: () => <Popover>
        <PopoverTrigger asChild><Button variant="secondary" aria-label="Notification settings"><Settings2 size={16} aria-hidden="true" /></Button></PopoverTrigger>
        <PopoverContent align="end" style={{ width: 260 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <Switch label="Email me escalations" defaultChecked />
            <Switch label="Daily summary in Slack" defaultChecked />
            <Switch label="Weekly usage report" />
          </div>
        </PopoverContent>
      </Popover>,
    },
  ],
  usage: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Set refund limit</Button>
  </PopoverTrigger>
  <PopoverContent>
    <Input label="Amount (USD)" type="number" defaultValue={500} />
    <PopoverClose asChild><Button size="sm">Save</Button></PopoverClose>
  </PopoverContent>
</Popover>`,
});
