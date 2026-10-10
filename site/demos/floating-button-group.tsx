import { useEffect, useState } from "react";
import { Archive, Check, Download, Link2, MessageSquare, Presentation, Redo2, Trash2, Undo2, UserPlus } from "lucide-react";

import { FloatingButtonGroup, type FloatingButtonGroupItem, type FloatingButtonGroupProps } from "@/registry/components/floating-button-group/floating-button-group";
import { defineDemo } from "../lib/demo";

const selectionItems: FloatingButtonGroupItem[] = [
  { id: "assign", label: "Assign", icon: <UserPlus size={16} /> },
  { id: "export", label: "Export", icon: <Download size={16} /> },
  { id: "archive", label: "Archive", icon: <Archive size={16} /> },
  { type: "separator" },
  { id: "delete", label: "Delete 3 tickets", icon: <Trash2 size={16} />, iconOnly: true },
];

function SelectionExample() {
  return <div style={{ display: "grid", gap: 14, justifyItems: "center" }}>
    <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>3 tickets selected</span>
    <FloatingButtonGroup label="Selected tickets" variant="floating" items={selectionItems} />
  </div>;
}

export default defineDemo<FloatingButtonGroupProps>({
  props: { label: "Board actions" },
  hideControls: ["items"],
  Preview: ({ props }) => {
    const [presenting, setPresenting] = useState(false);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
      if (!copied) return;
      const timer = setTimeout(() => setCopied(false), 1800);
      return () => clearTimeout(timer);
    }, [copied]);
    const items: FloatingButtonGroupItem[] = [
      { id: "undo", label: "Undo", icon: <Undo2 size={16} />, iconOnly: true, shortcut: "⌘Z" },
      { id: "redo", label: "Redo", icon: <Redo2 size={16} />, iconOnly: true, shortcut: "⇧⌘Z", disabled: true },
      { type: "separator" },
      { id: "comment", label: "Comment", icon: <MessageSquare size={16} />, shortcut: "C" },
      { id: "share", label: copied ? "Copied" : "Share", reserveLabels: ["Copied"], icon: copied ? <Check size={16} /> : <Link2 size={16} />, onSelect: () => setCopied(true) },
      { id: "present", label: "Present", icon: <Presentation size={16} />, pressed: presenting, onSelect: () => setPresenting(on => !on) },
    ];
    return <FloatingButtonGroup {...props} items={items} />;
  },
  examples: [
    {
      title: "Selection toolbar",
      description: "The floating variant raises the tray for overlays, such as actions for the rows a person has selected.",
      render: () => <SelectionExample />,
    },
  ],
  usage: `<FloatingButtonGroup
  label="Board actions"
  onAction={id => console.log(id)}
  items={[
    { id: "undo", label: "Undo", icon: <Undo2 />, iconOnly: true, shortcut: "⌘Z" },
    { type: "separator" },
    { id: "share", label: copied ? "Copied" : "Share", reserveLabels: ["Copied"], icon: <Link2 /> },
    { id: "present", label: "Present", icon: <Presentation />, pressed: presenting },
  ]}
/>`,
});
