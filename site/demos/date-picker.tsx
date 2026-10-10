import { useState } from "react";

import { DatePicker, type DatePickerProps } from "@/registry/components/date-picker/date-picker";
import { defineDemo } from "../lib/demo";

const today = () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); };
const inDays = (days: number) => { const date = today(); date.setDate(date.getDate() + days); return date; };
/** The popover opens below the trigger; the box leaves it room inside the stage. */
const box = { width: "min(100%, 300px)", minHeight: 460 } as const;

function Empty() {
  const [date, setDate] = useState<Date>();
  return <div style={box}><DatePicker label="Contract renewal" placeholder="Pick a renewal date" value={date} onChange={setDate} minDate={today()} /></div>;
}

export default defineDemo<DatePickerProps>({
  props: { label: "Go-live date", description: "The silicon starts taking tickets at 9:00 on this day.", showToday: true },
  Preview: ({ props }) => {
    const [date, setDate] = useState<Date | undefined>(() => inDays(7));
    return <div style={box}>
      <DatePicker {...props} value={date} minDate={today()} onChange={next => { setDate(next); props.onChange?.(next); }} />
    </div>;
  },
  examples: [
    { title: "Empty", description: "The placeholder rolls away when a day is picked.", render: () => <Empty /> },
    {
      title: "Disabled",
      stage: { minHeight: 140 },
      render: () => <div style={{ width: "min(100%, 300px)" }}><DatePicker label="Invoice date" value={inDays(-3)} disabled /></div>,
    },
  ],
  usage: `const [date, setDate] = useState<Date>();

<DatePicker
  label="Go-live date"
  description="The silicon starts taking tickets at 9:00 on this day."
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>`,
});
