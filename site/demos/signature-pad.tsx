import SignaturePad, { type SignaturePadProps } from "@/registry/components/signature-pad/signature-pad";
import { defineDemo } from "../lib/demo";

export default defineDemo<SignaturePadProps>({
  props: { signer: "Maya Okafor, Head of Operations", fileName: "silicon-service-agreement-signature" },
  Preview: ({ props }) => <div style={{ width: "min(100%, 560px)" }}><SignaturePad {...props} /></div>,
  examples: [
    {
      title: "Blue ink, bold nib",
      description: "Starting ink and width; the signer can still change both from the toolbar.",
      render: () => <div style={{ width: "min(100%, 560px)" }}>
        <SignaturePad signer="Daniel Reyes, Finance" hint="Sign to approve the Q3 invoice" defaultColor="blue" defaultWidth="bold" />
      </div>,
    },
  ],
});
