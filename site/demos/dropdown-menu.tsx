import { useState } from "react";
import { ArrowDownUp, Check, ChevronsUpDown, Copy, Ellipsis, FileText, FolderInput, Link2, PauseCircle, Pencil, Plus, ScrollText, Settings, Star, Trash2 } from "lucide-react";

import { Avatar } from "@/registry/components/avatar/avatar";
import { Button } from "@/registry/components/button/button";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger, type DropdownItem, type DropdownMenuProps,
} from "@/registry/components/dropdown-menu/dropdown-menu";
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

const spaces = ["Team of Silicons", "Design", "Personal"];

/** A space switcher: the trigger is the space itself, the current one is checked, actions follow. */
function SpaceMenu() {
  const [space, setSpace] = useState(spaces[0]!);
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"><Avatar name={space} size="sm" />{space}<ChevronsUpDown size={15} aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Spaces</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={space} onValueChange={setSpace}>
          {spaces.map(name => <DropdownMenuRadioItem key={name} value={name} icon={<Avatar name={name} size="sm" />}>{name}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Plus size={16} />}>New space</DropdownMenuItem>
        <DropdownMenuItem icon={<Settings size={16} />}>Space settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

/** A page tree row's "⋯" menu, with a submenu to move the page. */
function PageTreeMenu() {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Options for Roadmap"><Ellipsis size={16} aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right">
        <DropdownMenuItem icon={<Pencil size={16} />}>Rename</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy size={16} />}>Duplicate</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<FolderInput size={16} />}>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {spaces.map(name => <DropdownMenuItem key={name} icon={<Avatar name={name} size="sm" />}>{name}</DropdownMenuItem>)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive icon={<Trash2 size={16} />}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

/** A page header's "⋯" menu: actions with shortcut hints, and an on/off setting. */
function PageHeaderMenu() {
  const [wide, setWide] = useState(false);
  const [favorite, setFavorite] = useState(true);
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" aria-label="Page options"><Ellipsis size={16} aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Page</DropdownMenuLabel>
        <DropdownMenuItem icon={<Link2 size={16} />} shortcut="⌘L">Copy link</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy size={16} />} shortcut="⌘D">Duplicate</DropdownMenuItem>
        <DropdownMenuItem icon={<Star size={16} />} onSelect={() => setFavorite(value => !value)}>{favorite ? "Remove from favorites" : "Add to favorites"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={wide} onCheckedChange={setWide}>Full width</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive icon={<Trash2 size={16} />} shortcut="⌫">Delete page</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
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
    {
      title: "Space switcher (composable, experimental)",
      description: "Any trigger with asChild, a section label, and a radio group whose current choice is checked.",
      render: () => <SpaceMenu />,
    },
    {
      title: "Row options with a submenu (composable, experimental)",
      description: "An icon-only trigger with an aria-label, opening to the side, with a Move to submenu.",
      render: () => <PageTreeMenu />,
    },
    {
      title: "Header options with shortcuts (composable, experimental)",
      description: "Shortcut hints, an on/off setting with a check, and a destructive action.",
      render: () => <PageHeaderMenu />,
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
