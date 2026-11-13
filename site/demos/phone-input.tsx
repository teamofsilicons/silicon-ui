import { useState } from "react";
import type { CSSProperties } from "react";

import PhoneInput, { type PhoneInputProps } from "@/registry/components/phone-input/phone-input";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;
/** Keeps the field near the top so the open list has room below it. */
const room = (minHeight: number) => ({ ...field, minHeight }) as const;

export default defineDemo<PhoneInputProps>({
  props: {
    label: "On-call phone",
    description: "Your support silicon calls this number for urgent escalations.",
    preferredCountries: ["US", "GB", "IN"],
  },
  hideControls: ["value", "defaultValue", "country", "defaultCountry", "id", "name", "className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("");
    return <div style={room(440)}>
      <PhoneInput {...props} value={value} onValueChange={(next, details) => { setValue(next); props.onValueChange?.(next, details); }} />
    </div>;
  },
  examples: [
    {
      title: "Prefilled international number",
      description: "An E.164 value picks its own country and formats for it.",
      render: () => <div style={room(420)}><PhoneInput label="Billing contact" defaultValue="+442079460958" /></div>,
    },
    {
      title: "Limited countries and error",
      render: () => <div style={room(300)}>
        <PhoneInput label="Office line" countries={["US", "CA", "MX"]} defaultValue="+1415555" error="Enter all 10 digits of the number." />
      </div>,
    },
    {
      title: "Compact spacing",
      description: "The calling code keeps its room beside the chevron when a product tightens its spacing scale.",
      render: () => <div style={{ ...room(300), "--space-block": "24px" } as CSSProperties}>
        <PhoneInput label="Mobile number" defaultCountry="IN" />
      </div>,
    },
    {
      title: "Unsupported international number",
      description: "The typed number stays visible for correction; the field does not turn it into another country's number.",
      render: () => <div style={room(300)}><PhoneInput label="Another country" defaultValue="+40755345678" /></div>,
    },
    {
      title: "Number with extra digits",
      description: "Extra digits remain visible, with a message, instead of being silently removed.",
      render: () => <div style={room(300)}><PhoneInput label="Check this number" defaultValue="+1415555013211" /></div>,
    },
  ],
  usage: `const [phone, setPhone] = useState("");

<PhoneInput
  label="On-call phone"
  value={phone}
  onValueChange={(e164, details) => setPhone(e164)}
  preferredCountries={["US", "GB", "IN"]}
/>`,
});
