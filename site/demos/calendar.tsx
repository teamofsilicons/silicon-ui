import { useState } from "react";

import { addDays, Calendar, type CalendarProps } from "@/registry/components/calendar/calendar";
import { defineDemo } from "../lib/demo";

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
const today = () => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); };
/** The next weekday at least `days` out, so the selection never lands on a disabled weekend. */
const nextWeekday = (days: number) => { let date = addDays(today(), days); while (isWeekend(date)) date = addDays(date, 1); return date; };

function Weekdays() {
  const [date, setDate] = useState<Date | undefined>(() => nextWeekday(3));
  return <Calendar value={date} onChange={setDate} minDate={today()} disabledDates={isWeekend} />;
}

export default defineDemo<CalendarProps>({
  props: { showToday: true },
  Preview: ({ props }) => {
    const [date, setDate] = useState<Date | undefined>(() => addDays(today(), 2));
    return <Calendar {...props} value={date} onChange={next => { setDate(next); props.onChange?.(next); }} />;
  },
  examples: [
    {
      title: "Weekdays from today",
      description: "minDate blocks the past and disabledDates blocks any other day, here weekends.",
      render: () => <Weekdays />,
    },
  ],
  usage: `const [date, setDate] = useState<Date>();

<Calendar value={date} onChange={setDate} showToday />`,
});
