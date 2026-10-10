import { KeyRound, Trash2, UserMinus, Unplug } from "lucide-react";

import { ConfirmMorph, type ConfirmMorphProps } from "@/registry/components/confirm-morph/confirm-morph";
import { defineDemo } from "../lib/demo";

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export default defineDemo<ConfirmMorphProps>({
  component: ConfirmMorph,
  props: {
    label: "Delete project",
    icon: <Trash2 size={16} />,
    prompt: "Delete Q3 forecasting?",
    onConfirm: () => wait(1200),
    onUndo: () => wait(800),
  },
  hideControls: ["state"],
  examples: [
    {
      title: "Hold to confirm",
      description: "For actions where a stray click must not count, the confirm button fills while it is held.",
      render: () => <ConfirmMorph label="Revoke API key" icon={<KeyRound size={16} />} prompt="Revoke the billing key?" confirmMode="hold" confirmLabel="Hold to revoke" pendingLabel="Revoking" doneLabel="Revoked" onConfirm={() => wait(900)} />,
    },
    {
      title: "Countdown",
      description: "The action runs after a short countdown that Cancel or Escape can still stop.",
      render: () => <ConfirmMorph label="Remove 4 members" icon={<UserMinus size={16} />} prompt="Remove 4 members from Finance?" confirmLabel="Remove" pendingLabel="Removing" doneLabel="Removed" countdownLabel="Removing in" confirmMode="countdown" onConfirm={() => wait(700)} onUndo={() => wait(700)} />,
    },
    {
      title: "Failure and retry",
      description: "A rejected promise shows the error face with Retry.",
      render: () => <ConfirmMorph label="Disconnect Slack" icon={<Unplug size={16} />} tone="neutral" prompt="Disconnect Slack?" confirmLabel="Disconnect" pendingLabel="Disconnecting" doneLabel="Disconnected" errorLabel="Slack didn’t respond" onConfirm={() => wait(1000).then(() => Promise.reject(new Error("timeout")))} />,
    },
  ],
  usage: `<ConfirmMorph
  label="Delete project"
  icon={<Trash2 />}
  prompt="Delete Q3 forecasting?"
  onConfirm={() => deleteProject(id)}
  onUndo={() => restoreProject(id)}
/>`,
});
