import { TimePicker, type TimePickerProps } from "@/registry/components/time-picker/time-picker";
import { defineDemo } from "../lib/demo";

/** The menu opens below the trigger; the box leaves it room inside the stage. */
const box = { width: "min(100%, 260px)", minHeight: 340 } as const;

export default defineDemo<TimePickerProps>({
  props: { label: "Daily digest", defaultValue: "08:30", description: "Sent in your workspace time zone." },
  hideControls: ["value"],
  Preview: ({ props }) => <div style={box}><TimePicker {...props} /></div>,
  examples: [
    {
      title: "24-hour, half-hour steps",
      render: () => <div style={box}><TimePicker label="Maintenance window" format="24h" minuteStep={30} defaultValue="02:00" /></div>,
    },
    {
      title: "Disabled",
      stage: { minHeight: 140 },
      render: () => <div style={{ width: "min(100%, 260px)" }}><TimePicker label="Payroll run" defaultValue="17:00" disabled /></div>,
    },
  ],
});
