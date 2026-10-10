import { useState } from "react";

import { FileUpload, type FileUploadItem, type FileUploadProps } from "@/registry/components/file-upload/file-upload";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 520px)", margin: "0 auto" } as const;

/** Simulates an upload with steady progress. Nothing leaves the browser. */
const simulateUpload: NonNullable<FileUploadProps["onUpload"]> = (file, { onProgress, signal }) => new Promise<void>((resolve, reject) => {
  let percent = 0;
  const timer = setInterval(() => {
    percent = Math.min(percent + 9 + (file.size % 7), 100);
    onProgress(percent);
    if (percent >= 100) { clearInterval(timer); resolve(); }
  }, 160);
  signal.addEventListener("abort", () => { clearInterval(timer); reject(new DOMException("Upload cancelled", "AbortError")); });
});

function WithFiles() {
  const [files, setFiles] = useState<FileUploadItem[]>(() => [
    { id: "inv-2041", file: new File(["x".repeat(184_000)], "INV-2041-northwind.pdf", { type: "application/pdf" }) },
    { id: "receipts", file: new File(["x".repeat(2_400_000)], "september-receipts.zip", { type: "application/zip" }) },
    { id: "scan", file: new File(["x".repeat(48_000)], "badge-photo.heic", { type: "image/heic" }), error: "This file type is not accepted." },
  ]);
  return <div style={field}><FileUpload label="Attach to expense report" accept=".pdf,.zip,image/png,image/jpeg" value={files} onChange={setFiles} /></div>;
}

export default defineDemo<FileUploadProps>({
  props: { label: "Upload invoices", description: "Drop PDFs here or browse. Ledger, the finance silicon, files them for review.", onUpload: simulateUpload },
  hideControls: ["value"],
  Preview: ({ props }) => <div style={field}><FileUpload {...props} /></div>,
  stage: { layout: "center", minHeight: 420 },
  examples: [
    {
      title: "With files and an error",
      description: "A controlled list, including a file the `accept` filter rejected.",
      render: () => <WithFiles />,
      stage: { layout: "center" },
    },
    {
      title: "Disabled",
      render: () => <div style={field}><FileUpload label="Upload invoices" description="Uploads are paused while the books close for September." disabled /></div>,
      stage: { layout: "center" },
    },
  ],
  usage: `<FileUpload
  label="Upload invoices"
  accept=".pdf"
  maxSize={10 * 1024 * 1024}
  onUpload={async (file, { onProgress, signal }) => {
    await uploadInvoice(file, { onProgress, signal });
  }}
/>`,
});
