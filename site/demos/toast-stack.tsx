import { Button } from "@/registry/components/button/button";
import { ToastStack, ToastStackProvider, useToastStack, type ToastStackProps } from "@/registry/components/toast-stack/toast-stack";
import { defineDemo } from "../lib/demo";

function Actions() {
  const { toast, update } = useToastStack();
  const deploy = () => {
    const id = toast({ type: "loading", title: "Deploying support silicon", description: "Connecting to Zendesk" });
    window.setTimeout(() => update(id, { type: "success", title: "Support silicon is live", description: "It is answering tickets in draft mode." }), 1800);
  };
  const archive = () => toast({
    type: "success",
    title: "Ticket #4821 archived",
    action: { label: "Undo", onClick: id => update(id, { type: "info", title: "Ticket #4821 restored", description: undefined, action: undefined }) },
  });
  const fail = () => toast({ type: "error", title: "Stripe sync failed", description: "The API key was revoked. Reconnect Stripe in Settings." });
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
    <Button onClick={deploy}>Deploy silicon</Button>
    <Button variant="secondary" onClick={archive}>Archive ticket</Button>
    <Button variant="secondary" onClick={fail}>Sync Stripe</Button>
  </div>;
}

export default defineDemo<ToastStackProps>({
  props: { contained: true },
  hideControls: ["contained", "hotkey"],
  Preview: ({ props }) => <ToastStackProvider>
    <Actions />
    <ToastStack {...props} />
  </ToastStackProvider>,
  stage: { minHeight: 460 },
  usage: `// Once, near the root
<ToastStackProvider>
  <App />
  <ToastStack />
</ToastStackProvider>

// Anywhere below
const { toast, update } = useToastStack();

const id = toast({ type: "loading", title: "Deploying support silicon" });
update(id, { type: "success", title: "Support silicon is live" });`,
});
