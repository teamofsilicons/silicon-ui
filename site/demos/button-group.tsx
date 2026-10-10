import { useEffect, useState } from "react";
import { Archive, Check, Copy, Download, FolderInput, Link2, Minus, Pencil, Plus, Trash2 } from "lucide-react";

import { ButtonGroup, type ButtonGroupMenu, type ButtonGroupProps } from "@/registry/components/button-group/button-group";
import { defineDemo } from "../lib/demo";

const menu: ButtonGroupMenu = {
  label: "More actions",
  items: [
    { id: "rename", label: "Rename", icon: <Pencil size={16} /> },
    { id: "move", label: "Move to folder", icon: <FolderInput size={16} /> },
    { id: "archive", label: "Archive", icon: <Archive size={16} /> },
    { id: "delete", label: "Delete report", icon: <Trash2 size={16} />, destructive: true },
  ],
};

function ZoomExample() {
  const [zoom, setZoom] = useState(100);
  return <ButtonGroup label="Zoom" size="sm" items={[
    { id: "out", label: "Zoom out", icon: <Minus size={16} />, iconOnly: true, disabled: zoom <= 50, onSelect: () => setZoom(value => Math.max(50, value - 25)) },
    { id: "level", label: "Reset zoom", content: <span style={{ minWidth: "4ch", fontVariantNumeric: "tabular-nums", textAlign: "center" }}>{zoom}%</span>, onSelect: () => setZoom(100) },
    { id: "in", label: "Zoom in", icon: <Plus size={16} />, iconOnly: true, disabled: zoom >= 200, onSelect: () => setZoom(value => Math.min(200, value + 25)) },
  ]} />;
}

export default defineDemo<ButtonGroupProps>({
  props: { label: "Report actions", menu },
  hideControls: ["items"],
  Preview: ({ props }) => {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
      if (!copied) return;
      const timer = setTimeout(() => setCopied(false), 1800);
      return () => clearTimeout(timer);
    }, [copied]);
    return <ButtonGroup {...props} items={[
      { id: "share", label: copied ? "Copied" : "Share", reserve: ["Copied"], icon: copied ? <Check size={16} /> : <Link2 size={16} />, onSelect: () => setCopied(true) },
      { id: "duplicate", label: "Duplicate", icon: <Copy size={16} /> },
      { id: "export", label: "Export", icon: <Download size={16} /> },
    ]} />;
  },
  examples: [
    {
      title: "Live value",
      description: "A segment can show content in place of its label, such as the current zoom, while the label stays its accessible name.",
      render: () => <ZoomExample />,
    },
    {
      title: "Collapsing labels",
      description: "When the row runs out of room, segments with an icon drop their labels and keep their icons.",
      render: () => <div style={{ width: 200, maxWidth: "100%", display: "flex", justifyContent: "center", padding: 8, border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-control)" }}>
        <ButtonGroup label="Report actions" menu={menu} items={[
          { id: "share", label: "Share", icon: <Link2 size={16} /> },
          { id: "duplicate", label: "Duplicate", icon: <Copy size={16} /> },
          { id: "export", label: "Export", icon: <Download size={16} /> },
        ]} />
      </div>,
    },
  ],
  usage: `<ButtonGroup
  label="Report actions"
  items={[
    { id: "share", label: "Share", reserve: ["Copied"], icon: <Link2 />, onSelect: share },
    { id: "duplicate", label: "Duplicate", icon: <Copy /> },
    { id: "export", label: "Export", icon: <Download /> },
  ]}
  menu={{
    label: "More actions",
    items: [{ id: "delete", label: "Delete report", icon: <Trash2 />, destructive: true }],
  }}
/>`,
});
