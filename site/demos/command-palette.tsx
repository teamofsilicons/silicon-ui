import { Bot, CreditCard, LayoutDashboard, LifeBuoy, Moon, Receipt, Rocket, Ticket, UserPlus } from "lucide-react";

import { CommandPalette, type CommandItem, type CommandPaletteProps } from "@/registry/components/command-palette/command-palette";
import { defineDemo } from "../lib/demo";

const icon = { size: 16, strokeWidth: 1.75, "aria-hidden": true } as const;

const items: CommandItem[] = [
  { id: "dashboard", label: "Go to dashboard", group: "Navigate", icon: <LayoutDashboard {...icon} />, shortcut: "G D" },
  { id: "tickets", label: "Open tickets", description: "38 waiting in Support", group: "Navigate", icon: <Ticket {...icon} />, shortcut: "G T", keywords: ["queue", "support"] },
  { id: "invoices", label: "Invoices", description: "INV-2041 due Friday", group: "Navigate", icon: <Receipt {...icon} />, keywords: ["billing"] },
  { id: "deploy", label: "Deploy a silicon", description: "Add an AI employee to a team", group: "Silicons", icon: <Rocket {...icon} />, shortcut: "N", keywords: ["new", "create"] },
  { id: "ledger", label: "Ledger, finance silicon", description: "Accounts Payable", group: "Silicons", icon: <Bot {...icon} /> },
  { id: "invite", label: "Invite a teammate", group: "Silicons", icon: <UserPlus {...icon} />, keywords: ["member", "people"] },
  { id: "usage", label: "Usage and billing", description: "8,500 of 10,000 conversations", group: "Settings", icon: <CreditCard {...icon} /> },
  { id: "theme", label: "Switch to dark theme", group: "Settings", icon: <Moon {...icon} />, keywords: ["appearance"] },
  { id: "help", label: "Contact support", group: "Settings", icon: <LifeBuoy {...icon} />, keywords: ["help"] },
];

export default defineDemo<CommandPaletteProps>({
  props: { items, placeholder: "Search tickets, silicons and settings" },
  Preview: ({ props }) => <div style={{ width: "min(100%, 560px)", margin: "0 auto", padding: "16px 16px 40px" }}><CommandPalette {...props} /></div>,
  stage: { minHeight: 520 },
  usage: `const [open, setOpen] = useState(false);

{open && <CommandPalette
  autoFocus
  items={[
    { id: "deploy", label: "Deploy a silicon", group: "Silicons", shortcut: "N" },
    { id: "tickets", label: "Open tickets", group: "Navigate" },
  ]}
  onSelect={item => run(item.id)}
  onClose={() => setOpen(false)}
/>}`,
});
