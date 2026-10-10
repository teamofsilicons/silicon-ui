import { useState } from "react";

import { NumberField, type NumberFieldProps } from "@/registry/components/number-field/number-field";
import { defineDemo } from "../lib/demo";

const row = { display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" } as const;

export default defineDemo<NumberFieldProps>({
  props: {
    label: "Seats",
    description: "Each seat runs one silicon around the clock.",
    min: 1,
    max: 50,
    suffix: value => value === 1 ? " seat" : " seats",
  },
  hideControls: ["value", "defaultValue", "id", "locale"],
  Preview: ({ props }) => {
    const [value, setValue] = useState(4);
    return <NumberField {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} />;
  },
  examples: [
    {
      title: "Prefix, decimals and scrubbing",
      description: "Fraction digits follow the step. With scrub, drag the label sideways to change the value.",
      render: () => <div style={row}>
        <NumberField label="Daily budget" prefix="$" defaultValue={120} min={0} max={2000} step={0.5} largeStep={50} scrub />
        <NumberField label="Escalation threshold" suffix="%" defaultValue={85} min={50} max={100} step={5} scrub />
      </div>,
    },
    {
      title: "At a limit and disabled",
      description: "Press plus on the first field: it is already at its maximum, so a short note explains why nothing changes.",
      render: () => <div style={row}>
        <NumberField label="Concurrent tickets" defaultValue={10} min={1} max={10} />
        <NumberField label="Retention (days)" defaultValue={30} disabled description="Set by your plan." />
      </div>,
    },
  ],
  usage: `const [seats, setSeats] = useState(4);

<NumberField
  label="Seats"
  value={seats}
  onValueChange={setSeats}
  min={1}
  max={50}
  suffix={n => n === 1 ? " seat" : " seats"}
/>`,
});
