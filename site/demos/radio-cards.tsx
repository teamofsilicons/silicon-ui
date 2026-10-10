import { useState } from "react";
import { Building2, Sparkles, Users } from "lucide-react";

import RadioCards, { type RadioCardOption, type RadioCardsProps } from "@/registry/components/radio-cards/radio-cards";
import { defineDemo } from "../lib/demo";

const icon = { size: 16, strokeWidth: 1.75, "aria-hidden": true } as const;

const plans: RadioCardOption[] = [
  { value: "starter", label: "Starter", description: "One silicon for a single team.", meta: "$49 / mo", icon: <Sparkles {...icon} /> },
  { value: "team", label: "Team", description: "Up to five silicons with shared memory.", meta: "$199 / mo", icon: <Users {...icon} /> },
  { value: "enterprise", label: "Enterprise", description: "Unlimited silicons, SSO and audit logs.", meta: "Custom", icon: <Building2 {...icon} /> },
];

const regions: RadioCardOption[] = [
  { value: "us-east", label: "US East", description: "Virginia. Closest to most of your users.", meta: "18 ms" },
  { value: "eu-west", label: "EU West", description: "Frankfurt. Data stays in the EU.", meta: "84 ms" },
  { value: "ap-south", label: "Asia Pacific", description: "Mumbai.", meta: "190 ms", disabled: true, disabledReason: "Available on the Enterprise plan." },
];

export default defineDemo<RadioCardsProps>({
  props: { options: plans, "aria-label": "Plan" },
  hideControls: ["value", "defaultValue", "options", "aria-label"],
  Preview: ({ props }) => {
    const [plan, setPlan] = useState<string | null>("team");
    return <div style={{ width: "min(100%, 640px)" }}>
      <RadioCards {...props} value={plan} onValueChange={next => { setPlan(next); props.onValueChange?.(next); }} />
    </div>;
  },
  examples: [
    {
      title: "List with a disabled option",
      description: "Rows stack full width, and a disabled option shows its reason in place of the description.",
      render: () => <div style={{ width: "min(100%, 420px)" }}>
        <RadioCards aria-label="Deployment region" layout="list" options={regions} defaultValue="us-east" />
      </div>,
    },
    {
      title: "Disabled group",
      render: () => <div style={{ width: "min(100%, 640px)" }}>
        <RadioCards aria-label="Plan" options={plans} defaultValue="starter" disabled />
      </div>,
    },
  ],
  usage: `const [plan, setPlan] = useState<string | null>("team");

<RadioCards
  aria-label="Plan"
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: "starter", label: "Starter", description: "One silicon for a single team.", meta: "$49 / mo" },
    { value: "team", label: "Team", description: "Up to five silicons with shared memory.", meta: "$199 / mo" },
  ]}
/>`,
});
