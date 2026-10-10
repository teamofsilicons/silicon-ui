import { useState } from "react";
import { Copy, ExternalLink, FileSpreadsheet, Link2, Pencil, Pin, Trash2 } from "lucide-react";

import { ContextMenu, type ContextMenuItem, type ContextMenuProps } from "@/registry/components/context-menu/context-menu";
import { defineDemo } from "../lib/demo";

function FileCard({ name, meta, pinned }: { name: string; meta: string; pinned?: boolean }) {
  return <div style={{ display: "flex", gap: 12, alignItems: "center", width: "min(100%, 360px)", padding: 16, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)", cursor: "context-menu" }}>
    <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, flex: "none", borderRadius: 10, background: "var(--surface-muted)", color: "var(--text-secondary)" }}><FileSpreadsheet size={20} aria-hidden="true" /></span>
    <span style={{ display: "grid", minWidth: 0, flex: 1 }}>
      <strong style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</strong>
      <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{meta}</span>
    </span>
    {pinned && <Pin size={15} aria-label="Pinned" style={{ color: "var(--text-muted)", flex: "none" }} />}
  </div>;
}

export default defineDemo<ContextMenuProps>({
  props: { label: "Q3 invoice run actions" },
  Preview: ({ props }) => {
    const [pinned, setPinned] = useState(false);
    const items: ContextMenuItem[] = [
      { id: "open", label: "Open", icon: <ExternalLink size={15} /> },
      { id: "rename", label: "Rename", icon: <Pencil size={15} /> },
      { id: "duplicate", label: "Duplicate", icon: <Copy size={15} /> },
      { id: "link", label: "Copy link", icon: <Link2 size={15} /> },
      { id: "pin", label: pinned ? "Unpin" : "Pin to sidebar", icon: <Pin size={15} />, checked: pinned, onSelect: () => setPinned(on => !on) },
      { id: "delete", label: "Delete file", icon: <Trash2 size={15} />, destructive: true },
    ];
    return <div style={{ display: "grid", gap: 10, justifyItems: "center", width: "100%" }}>
      <ContextMenu {...props} items={items}>
        <FileCard name="Q3 invoice run.csv" meta="312 rows · Updated 2 hours ago by the finance silicon" pinned={pinned} />
      </ContextMenu>
      <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>Right-click or click the card. From the keyboard, focus it and press Shift F10.</span>
    </div>;
  },
  usage: `<ContextMenu
  label="Q3 invoice run actions"
  items={[
    { id: "rename", label: "Rename", icon: <Pencil />, onSelect: rename },
    { id: "pin", label: "Pin to sidebar", icon: <Pin />, checked: pinned, onSelect: togglePin },
    { id: "delete", label: "Delete file", icon: <Trash2 />, destructive: true, onSelect: remove },
  ]}
>
  <FileCard file={file} />
</ContextMenu>`,
});
