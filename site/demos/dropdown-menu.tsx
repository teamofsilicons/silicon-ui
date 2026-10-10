import { useState } from "react";
import { ArrowDownUp, Check, Copy, FileText, PauseCircle, Pencil, ScrollText, Trash2 } from "lucide-react";

import { DropdownMenu, type DropdownItem, type DropdownMenuProps } from "@/registry/components/dropdown-menu/dropdown-menu";
import { defineDemo } from "../lib/demo";

const items: DropdownItem[] = [
  { label: "Edit instructions", icon: <Pencil size={16} /> },
  { label: "Duplicate silicon", icon: <Copy size={16} /> },
  { label: "View activity log", icon: <ScrollText size={16} /> },
  { label: "Export handbook", icon: <FileText size={16} />, disabled: true },
  { label: "Pause silicon", icon: <PauseCircle size={16} />, separatorBefore: true },
  { label: "Retire silicon", icon: <Trash2 size={16} />, destructive: true },
];

const sorts = ["Newest first", "Oldest first", "Most urgent", "Assignee"];

function SortExample() {
  const [sort, setSort] = useState(sorts[0]!);
  return <DropdownMenu label={sort} icon={<ArrowDownUp size={15} />} items={sorts.map(option => ({ label: option, icon: option === sort ? <Check size={16} /> : <span />, onSelect: () => setSort(option) }))} />;
}

export default defineDemo<DropdownMenuProps>({
  component: DropdownMenu,
  props: { label: "Manage silicon", items },
  examples: [
    {
      title: "Label follows the choice",
      description: "When the trigger names the current choice, the new label rises in and the trigger springs to its width.",
      render: () => <SortExample />,
    },
  ],
  usage: `<DropdownMenu
  label="Manage silicon"
  items={[
    { label: "Edit instructions", icon: <Pencil />, onSelect: edit },
    { label: "Pause silicon", icon: <PauseCircle />, separatorBefore: true },
    { label: "Retire silicon", icon: <Trash2 />, destructive: true, onSelect: retire },
  ]}
/>`,
});
