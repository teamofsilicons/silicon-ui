import { useState } from "react";

import PasswordStrength, { createPasswordRules, type PasswordRule, type PasswordStrengthProps } from "@/registry/components/password-strength/password-strength";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;

/** The built-in rules at 16 characters, plus a rule of your own. */
const adminRules: PasswordRule[] = [
  ...createPasswordRules({ minLength: 16 }),
  { id: "workspace", label: "Does not contain the workspace name", test: password => password.length > 0 && !/northwind/i.test(password) },
];

export default defineDemo<PasswordStrengthProps>({
  props: { label: "New password" },
  hideControls: ["value", "defaultValue", "revealed"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("");
    return <div style={field}>
      <PasswordStrength {...props} value={value} onValueChange={(next, strength) => { setValue(next); props.onValueChange?.(next, strength); }} />
    </div>;
  },
  examples: [
    {
      title: "Partly there",
      description: "Each unmet rule counts down what it still needs.",
      render: () => <div style={field}><PasswordStrength label="New password" defaultValue="Silicon2026" /></div>,
    },
    {
      title: "Custom rules",
      description: "createPasswordRules sets the length; add your own rules beside it.",
      render: () => <div style={field}><PasswordStrength label="Admin password" rules={adminRules} defaultValue="Northwind-ops" /></div>,
    },
    {
      title: "Error",
      render: () => <div style={field}><PasswordStrength label="New password" defaultValue="Ledger!2026" error="This matches one of your last five passwords." /></div>,
    },
  ],
  usage: `const [password, setPassword] = useState("");

<PasswordStrength
  label="New password"
  value={password}
  onValueChange={(next, strength) => setPassword(next)}
/>`,
});
