import { useState } from "react";
import { CreditCard, Settings, UserRound } from "lucide-react";

import { people } from "@/lib/media";
import { UserMenu, type ThemePreference, type UserMenuItem, type UserMenuProps, type UserStatus } from "@/registry/components/user-menu/user-menu";
import { defineDemo } from "../lib/demo";

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const sofia = people.find(person => person.id === "sofia-ramirez")!;
const user = { name: sofia.name, email: "sofia@northwind.co", plan: "Team plan", avatarSrc: sofia.src };

const items: UserMenuItem[] = [
  { label: "Profile", icon: <UserRound size={16} />, keys: ["⌘", "P"] },
  { label: "Workspace settings", icon: <Settings size={16} />, keys: ["⌘", ","] },
  { label: "Billing and usage", icon: <CreditCard size={16} /> },
];

function TopBarExample() {
  const [status, setStatus] = useState<UserStatus>("busy");
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "min(100%, 520px)", padding: "8px 8px 8px 16px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--surface)" }}>
    <strong style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Northwind</strong>
    <UserMenu user={user} items={items} status={status} onStatusChange={setStatus} showName showTheme={false} onSignOut={() => wait(900)} />
  </div>;
}

export default defineDemo<UserMenuProps>({
  props: { user, items, signOutKeys: ["⇧", "⌘", "Q"], onSignOut: () => wait(1200) },
  hideControls: ["status", "defaultStatus", "theme", "defaultTheme", "open"],
  Preview: ({ props }) => {
    const [status, setStatus] = useState<UserStatus>("available");
    const [theme, setTheme] = useState<ThemePreference>("system");
    return <UserMenu {...props} status={status} onStatusChange={next => { setStatus(next); props.onStatusChange?.(next); }} theme={theme} onThemeChange={next => { setTheme(next); props.onThemeChange?.(next); }} />;
  },
  examples: [
    {
      title: "In a top bar",
      description: "showName adds the name and a chevron from 640px up. Theme is left out here, so the menu keeps to status and account.",
      render: () => <TopBarExample />,
    },
  ],
  usage: `const [status, setStatus] = useState<UserStatus>("available");

<UserMenu
  user={{ name: "Sofia Ramirez", email: "sofia@northwind.co", plan: "Team plan", avatarSrc }}
  status={status}
  onStatusChange={setStatus}
  onThemeChange={applyTheme}
  items={[
    { label: "Profile", icon: <UserRound />, keys: ["⌘", "P"] },
    { label: "Workspace settings", icon: <Settings />, keys: ["⌘", ","] },
  ]}
  onSignOut={signOut}
/>`,
});
