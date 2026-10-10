import { PasswordField, type PasswordFieldProps } from "@/registry/components/password-field/password-field";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;

export default defineDemo<PasswordFieldProps>({
  props: { label: "Password", autoComplete: "current-password", placeholder: "Enter your password" },
  Preview: ({ props }) => <div style={field}><PasswordField {...props} /></div>,
  examples: [
    {
      title: "With description",
      description: "The eye toggle reveals the value; its accessible name follows the state.",
      render: () => <div style={field}>
        <PasswordField label="API signing secret" defaultValue="silicon-webhooks-2026" description="Used to verify webhook calls from your silicons." autoComplete="off" />
      </div>,
    },
    {
      title: "Disabled",
      render: () => <div style={field}><PasswordField label="Password" defaultValue="managed-by-sso" description="Managed by your identity provider." disabled /></div>,
    },
  ],
  usage: `<PasswordField label="Password" autoComplete="current-password" />`,
});
