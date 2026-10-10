import { useEffect, useState } from "react";
import { CalendarClock, Check, Copy, Download, FileText, Rocket, RotateCcw, Share2, Trash2 } from "lucide-react";

import { SplitButton, type SplitButtonAction, type SplitButtonProps } from "@/registry/components/split-button/split-button";
import { defineDemo } from "../lib/demo";

const actions: SplitButtonAction[] = [
  { label: "Copy as Markdown", icon: <FileText size={16} /> },
  { label: "Download PDF", icon: <Download size={16} /> },
  { label: "Share with team", icon: <Share2 size={16} /> },
  { label: "Delete report", icon: <Trash2 size={16} />, destructive: true },
];

const deployActions: SplitButtonAction[] = [
  { label: "Deploy to staging", icon: <Rocket size={16} /> },
  { label: "Schedule deploy", icon: <CalendarClock size={16} /> },
  { label: "Deploy to all regions", icon: <Rocket size={16} />, disabled: true },
  { label: "Roll back to v2.3", icon: <RotateCcw size={16} />, destructive: true },
];

export default defineDemo<SplitButtonProps>({
  props: { label: "Copy report", actions },
  Preview: ({ props }) => {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
      if (!copied) return;
      const timer = setTimeout(() => setCopied(false), 1800);
      return () => clearTimeout(timer);
    }, [copied]);
    return <SplitButton {...props} label={copied ? "Copied" : props.label} icon={copied ? <Check size={16} /> : <Copy size={16} />} onClick={() => { setCopied(true); props.onClick?.(); }} />;
  },
  examples: [
    {
      title: "Deploy with alternatives",
      description: "The main half runs the common case; the menu holds the variations, a disabled option and a destructive one.",
      render: () => <SplitButton label="Deploy" icon={<Rocket size={16} />} actions={deployActions} />,
    },
    {
      title: "Disabled",
      render: () => <SplitButton label="Copy report" icon={<Copy size={16} />} actions={actions} disabled />,
    },
  ],
  usage: `const [copied, setCopied] = useState(false);

<SplitButton
  label={copied ? "Copied" : "Copy report"}
  icon={copied ? <Check /> : <Copy />}
  onClick={() => setCopied(true)}
  actions={[
    { label: "Download PDF", icon: <Download />, onSelect: downloadPdf },
    { label: "Delete report", icon: <Trash2 />, destructive: true, onSelect: remove },
  ]}
/>`,
});
