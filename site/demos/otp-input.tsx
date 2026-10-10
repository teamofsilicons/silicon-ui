import { useState } from "react";

import { OtpInput, type OtpInputProps } from "@/registry/components/otp-input/otp-input";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 400px)" } as const;

function Controlled(props: OtpInputProps) {
  const [value, setValue] = useState(props.value ?? "");
  return <div style={field}><OtpInput {...props} value={value} onChange={next => { setValue(next); props.onChange?.(next); }} /></div>;
}

export default defineDemo<OtpInputProps>({
  props: { label: "Verification code", description: "We sent a 6 digit code to finance@northwind.com." },
  hideControls: ["value"],
  Preview: ({ props }) => <Controlled {...props} />,
  stage: { layout: "center", minHeight: 380 },
  examples: [
    {
      title: "Error",
      render: () => <Controlled label="Verification code" value="482193" error="That code has expired. Request a new one." />,
      stage: { layout: "center" },
    },
    {
      title: "Letters and a shorter code",
      description: "`inputMode=\"text\"` accepts letters, here for a 4 character workspace invite.",
      render: () => <Controlled label="Invite code" length={4} inputMode="text" description="Find it in the invite email from your admin." />,
      stage: { layout: "center" },
    },
    {
      title: "Disabled",
      render: () => <Controlled label="Verification code" value="4821" disabled description="Waiting 30 seconds before you can try again." />,
      stage: { layout: "center" },
    },
  ],
  usage: `const [code, setCode] = useState("");

<OtpInput
  label="Verification code"
  description="We sent a 6 digit code to your email."
  value={code}
  onChange={setCode}
/>`,
});
