import { BottomSheet, BottomSheetClose, type BottomSheetProps } from "@/registry/components/bottom-sheet/bottom-sheet";
import { Button } from "@/registry/components/button/button";
import { Input } from "@/registry/components/input/input";
import { Switch } from "@/registry/components/switch/switch";
import { defineDemo } from "../lib/demo";

export default defineDemo<BottomSheetProps>({
  props: { title: "Share report", description: "Q3 support summary · 1,284 tickets" },
  hideControls: ["open", "defaultOpen"],
  Preview: ({ props }) => <BottomSheet {...props} trigger={<Button variant="secondary">Share report</Button>}>
    <div style={{ display: "grid", gap: 18 }}>
      <Input label="Link" readOnly defaultValue="https://example.com/r/q3-support" />
      <Switch label="Anyone with the link can view" defaultChecked />
      <Switch label="Allow comments" />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <BottomSheetClose asChild><Button variant="ghost">Cancel</Button></BottomSheetClose>
        <BottomSheetClose asChild><Button>Copy link</Button></BottomSheetClose>
      </div>
    </div>
  </BottomSheet>,
  examples: [
    {
      title: "Three detents",
      description: "The sheet rests at a peek, a half, and full height. Drag the handle or flick between them.",
      render: () => <BottomSheet title="Ticket #4821" description="Refund for duplicate charge" detents={[.3, .6, .92]} trigger={<Button variant="secondary">Open ticket</Button>}>
        <div style={{ display: "grid", gap: 12, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          <p style={{ margin: 0 }}>Acme Retail was charged $249.00 twice on March 3. The support silicon matched both charges in Stripe and refunded one.</p>
          <p style={{ margin: 0 }}>Status: waiting for the customer to confirm. Assigned to Jordan Reyes.</p>
        </div>
      </BottomSheet>,
    },
  ],
  usage: `<BottomSheet
  title="Share report"
  description="Q3 support summary"
  trigger={<Button variant="secondary">Share report</Button>}
>
  <Input label="Link" readOnly defaultValue="https://…" />
  <BottomSheetClose asChild><Button>Copy link</Button></BottomSheetClose>
</BottomSheet>`,
});
