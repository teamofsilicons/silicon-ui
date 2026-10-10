import { useState } from "react";

import { BillingPrice, BillingToggle, type BillingToggleOption, type BillingToggleProps } from "@/registry/components/billing-toggle/billing-toggle";
import { defineDemo } from "../lib/demo";

const options: BillingToggleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "Save 20%", activeBadge: "You save $480" },
];

const prices: Record<string, { amount: number; was?: number; period: string }> = {
  monthly: { amount: 199, period: "per month" },
  yearly: { amount: 159, was: 199, period: "per month, billed yearly" },
};

const threeWay: BillingToggleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly", badge: "Save 10%" },
  { value: "yearly", label: "Yearly", badge: "Save 20%" },
];

function ThreeWay() {
  const [period, setPeriod] = useState("quarterly");
  return <BillingToggle options={threeWay} value={period} onValueChange={setPeriod} />;
}

export default defineDemo<BillingToggleProps>({
  props: { options },
  hideControls: ["value", "options"],
  Preview: ({ props }) => {
    const [period, setPeriod] = useState("monthly");
    const price = prices[period] ?? prices.monthly!;
    return <div style={{ display: "grid", justifyItems: "center", gap: 20 }}>
      <BillingToggle {...props} value={period} onValueChange={next => { setPeriod(next); props.onValueChange?.(next); }} />
      <BillingPrice amount={price.amount} was={price.was} period={price.period} />
    </div>;
  },
  examples: [
    {
      title: "Three periods",
      description: "The thumb glides between any number of options.",
      render: () => <ThreeWay />,
    },
  ],
  usage: `const [period, setPeriod] = useState("monthly");

<BillingToggle
  value={period}
  onValueChange={setPeriod}
  options={[
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly", badge: "Save 20%", activeBadge: "You save $480" },
  ]}
/>
<BillingPrice
  amount={period === "yearly" ? 159 : 199}
  was={period === "yearly" ? 199 : undefined}
  period="per month"
/>`,
});
