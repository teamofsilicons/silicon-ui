import { useState } from "react";

import SegmentedControl, { type SegmentedControlProps } from "@/registry/components/segmented-control/segmented-control";
import { defineDemo } from "../lib/demo";

const options = [{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "year", label: "Year" }];

export default defineDemo<SegmentedControlProps>({
  props: { label: "Range", options },
  hideControls: ["value"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("week");
    return <SegmentedControl {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} />;
  },
  usage: `const [range, setRange] = useState("week");

<SegmentedControl
  label="Range"
  value={range}
  onValueChange={setRange}
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]}
/>`,
});
