import { useState } from "react";

import MoneyInput, { type MoneyInputProps } from "@/registry/components/money-input/money-input";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;
const stack = { ...field, display: "grid", gap: 24 } as const;

export default defineDemo<MoneyInputProps>({
  props: {
    label: "Monthly spend cap",
    description: "Silicons pause when the workspace reaches this amount.",
    currencies: ["USD", "EUR", "GBP", "CAD", "INR"],
    quickAdd: [100, 500, 1000],
  },
  hideControls: ["value", "defaultValue", "currency", "defaultCurrency", "id", "name", "className", "locale"],
  Preview: ({ props }) => {
    const [value, setValue] = useState<number | null>(250000);
    const [currency, setCurrency] = useState("USD");
    return <div style={field}>
      <MoneyInput {...props} value={value} currency={currency}
        onValueChange={(next, details) => { setValue(next); props.onValueChange?.(next, details); }}
        onCurrencyChange={next => { setCurrency(next); props.onCurrencyChange?.(next); }} />
    </div>;
  },
  examples: [
    {
      title: "One currency with limits",
      description: "A single code hides the menu. Typing past the maximum is refused with a nudge; the minimum is checked on blur.",
      render: () => <div style={field}>
        <MoneyInput label="Refund amount" currencies={["EUR"]} defaultCurrency="EUR" defaultValue={4500} min={100} max={50000} quickAdd={[]} description="Between €1 and €500 without approval." />
      </div>,
    },
    {
      title: "Error and disabled",
      render: () => <div style={stack}>
        <MoneyInput label="Invoice total" defaultValue={482000} quickAdd={[]} error="This is more than the purchase order allows." />
        <MoneyInput label="Plan price" defaultValue={99900} quickAdd={[]} currencies={["USD"]} disabled description="Billed annually." />
      </div>,
    },
  ],
  usage: `// Amounts are in minor units: 250000 is $2,500.00.
const [amount, setAmount] = useState<number | null>(250000);
const [currency, setCurrency] = useState("USD");

<MoneyInput
  label="Monthly spend cap"
  value={amount}
  onValueChange={setAmount}
  currency={currency}
  onCurrencyChange={setCurrency}
/>`,
});
