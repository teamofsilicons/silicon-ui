import { useState } from "react";
import { BarChart3, Bell, CreditCard, FileText, Home, Search, Settings, Users } from "lucide-react";

import { NavItem, NavList, NavSection, type NavListProps } from "@/registry/components/nav-list/nav-list";
import { defineDemo } from "../lib/demo";

const pages = [
  { id: "home", label: "Home", icon: <Home /> },
  { id: "docs", label: "Docs", icon: <FileText />, trailing: "12" },
  { id: "people", label: "People", icon: <Users /> },
];

function Sidebar({ label }: Partial<NavListProps>) {
  const [page, setPage] = useState("home");
  return <div style={{ width: 240, padding: "var(--space-related)", borderRadius: "var(--radius-container)", background: "var(--surface)", border: "1px solid var(--border)" }}>
    <NavList label={label ?? "Main"}>
      <NavItem icon={<Search />} onSelect={() => {}}>Search</NavItem>
      <NavSection label="Workspace">
        {pages.map(item => <NavItem key={item.id} icon={item.icon} trailing={item.trailing} active={page === item.id} onSelect={() => setPage(item.id)}>{item.label}</NavItem>)}
        <NavItem icon={<BarChart3 />} disabled reason="Pro" onSelect={() => {}}>Analytics</NavItem>
      </NavSection>
      <NavSection label="Account">
        <NavItem icon={<Bell />} active={page === "notifications"} onSelect={() => setPage("notifications")}>Notifications</NavItem>
        <NavItem icon={<Settings />} active={page === "settings"} onSelect={() => setPage("settings")}>Settings</NavItem>
      </NavSection>
    </NavList>
  </div>;
}

export default defineDemo<NavListProps>({
  Preview: ({ props }) => <Sidebar label={props.label} />,
  examples: [
    {
      title: "Links",
      description: "Rows with an href render through SiliconProvider's link (next/link in a Next app). Mark the current page with active.",
      render: () => <div style={{ width: 240 }}>
        <NavList label="Settings">
          <NavItem href="#profile" icon={<Users />} active>Profile</NavItem>
          <NavItem href="#billing" icon={<CreditCard />}>Billing</NavItem>
          <NavItem href="#notifications" icon={<Bell />} trailing="3">Notifications</NavItem>
        </NavList>
      </div>,
    },
  ],
  usage: `<NavList label="Main">
  <NavItem icon={<Search />} onSelect={openSearch}>Search</NavItem>
  <NavSection label="Workspace">
    <NavItem href="/" icon={<Home />} active={pathname === "/"}>Home</NavItem>
    <NavItem href="/docs" icon={<FileText />} trailing="12">Docs</NavItem>
    <NavItem href="/analytics" icon={<BarChart3 />} disabled reason="Pro">Analytics</NavItem>
  </NavSection>
</NavList>`,
});
