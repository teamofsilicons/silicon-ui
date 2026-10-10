import { useRef, useState } from "react";

import DateRangePicker, { type DateRange, type DateRangePickerProps, type DateRangePreset } from "@/registry/components/date-range-picker/date-range-picker";
import { defineDemo } from "../lib/demo";

const shift = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const lastDays = (days: number): DateRange => { const now = new Date(); const end = new Date(now.getFullYear(), now.getMonth(), now.getDate()); return { start: shift(end, 1 - days), end }; };
/** The panel grows out of the trigger; this box gives it room and is passed as the boundary it stays inside. */
const box = { display: "flex", justifyContent: "center", alignItems: "flex-start", width: "min(100%, 760px)", minHeight: 440 } as const;

const billingPresets: DateRangePreset[] = [
  { label: "Current cycle", range: today => ({ start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) }) },
  { label: "Previous cycle", range: today => ({ start: new Date(today.getFullYear(), today.getMonth() - 1, 1), end: new Date(today.getFullYear(), today.getMonth(), 0) }) },
  { label: "Year to date", range: today => ({ start: new Date(today.getFullYear(), 0, 1), end: today }) },
];

function SingleMonth() {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} style={{ ...box, width: "min(100%, 440px)" }}>
    <DateRangePicker label="Billing period" placeholder="Choose a billing period" presets={billingPresets} months={1} weekStartsOn={1} boundary={() => ref.current} />
  </div>;
}

export default defineDemo<DateRangePickerProps>({
  props: { label: "Report range" },
  hideControls: ["value", "defaultValue"],
  Preview: ({ props }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [range, setRange] = useState<DateRange | null>(() => lastDays(7));
    return <div ref={ref} style={box}>
      <DateRangePicker {...props} value={range} boundary={() => ref.current} onChange={next => { setRange(next); props.onChange?.(next); }} />
    </div>;
  },
  examples: [
    {
      title: "Custom presets, one month",
      description: "Presets receive the viewer's today. With one month the presets scroll in a row above the grid.",
      render: () => <SingleMonth />,
    },
  ],
  usage: `const [range, setRange] = useState<DateRange | null>(null);

<DateRangePicker label="Report range" value={range} onChange={setRange} />`,
});
