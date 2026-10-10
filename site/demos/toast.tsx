import { useState } from "react";

import { Button } from "@/registry/components/button/button";
import Toast, { type ToastProps } from "@/registry/components/toast/toast";
import { defineDemo } from "../lib/demo";

export default defineDemo<ToastProps>({
  props: { duration: 4500 },
  hideControls: ["open", "title", "description"],
  Preview: ({ props }) => {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    const approve = () => { setCount(open ? count + 1 : 1); setOpen(true); };
    return <div style={{ display: "grid", gap: 20, justifyItems: "center", width: "min(100%, 420px)" }}>
      <Button onClick={approve}>Approve invoice</Button>
      <div style={{ minHeight: 84, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <Toast {...props} open={open} title={count > 1 ? `${count} invoices approved` : "Invoice approved"}
          description={count > 1 ? `The finance silicon will pay all ${count} on Friday.` : "INV-2041 is scheduled for payment on Friday."}
          onOpenChange={next => { setOpen(next); props.onOpenChange?.(next); }} />
      </div>
    </div>;
  },
  usage: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Approve invoice</Button>
<Toast
  open={open}
  onOpenChange={setOpen}
  title="Invoice approved"
  description="INV-2041 is scheduled for payment on Friday."
/>`,
});
