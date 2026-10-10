import FileDropzone, { type FileDropzoneItem, type FileDropzoneProps, type FileDropzoneUpload } from "@/registry/components/file-dropzone/file-dropzone";
import { defineDemo } from "../lib/demo";

const MB = 1024 * 1024;

/** A pretend upload: progress in uneven steps, and any file with "fail" in its name is rejected. */
const fakeUpload: FileDropzoneUpload = (item, { onProgress, signal }) => new Promise<void>((resolve, reject) => {
  let percent = 0;
  const timer = window.setInterval(() => {
    percent = Math.min(100, percent + 6 + Math.random() * 16);
    onProgress(percent);
    if (percent < 100) return;
    window.clearInterval(timer);
    if (/fail/i.test(item.name)) reject(new Error("The server rejected this file"));
    else resolve();
  }, 160);
  signal.addEventListener("abort", () => { window.clearInterval(timer); reject(new Error("Upload cancelled")); });
});

const earlier: FileDropzoneItem[] = [
  { id: "contract", name: "silicon-service-agreement.pdf", size: 1.8 * MB, status: "uploaded", progress: 100 },
  { id: "export", name: "q3-ticket-export.csv", size: 640 * 1024, status: "uploaded", progress: 100 },
];

const mixed: FileDropzoneItem[] = [
  { id: "invoices", name: "october-invoices.zip", size: 14 * MB, status: "uploading", progress: 42 },
  { id: "receipt", name: "receipt-4471.png", size: 380 * 1024, status: "failed", error: "Connection lost", retryable: true },
];

export default defineDemo<FileDropzoneProps>({
  props: {
    label: "Upload training documents",
    description: "Drop files here or choose from your device",
    note: "PDF, CSV or DOCX, up to 10 MB each",
    accept: ".pdf,.csv,.docx,.md,.txt",
    maxSize: 10 * MB,
    defaultItems: earlier,
    onUpload: fakeUpload,
  },
  Preview: ({ props }) => <div style={{ width: "min(100%, 460px)" }}><FileDropzone {...props} /></div>,
  examples: [
    {
      title: "List inside the target",
      description: "Rows sit inside the drop target's edge. A failed row keeps a retry button when it has an onUpload to call.",
      render: () => <div style={{ width: "min(100%, 460px)" }}>
        <FileDropzone label="Attach receipts" listPlacement="inside" defaultItems={mixed} onUpload={fakeUpload} maxSize={25 * MB} note="Images or ZIP, up to 25 MB" />
      </div>,
    },
    {
      title: "Plain selection",
      description: "Without onUpload the list holds the chosen files and onFilesChange hands them to your form.",
      render: () => <div style={{ width: "min(100%, 460px)" }}>
        <FileDropzone label="Choose a logo" description="Drop an image or browse" accept="image/*" multiple={false} maxFiles={1} />
      </div>,
    },
  ],
  usage: `<FileDropzone
  label="Upload training documents"
  accept=".pdf,.csv,.docx"
  maxSize={10 * 1024 * 1024}
  onUpload={async (item, { onProgress, signal }) => {
    await uploadFile(item.file!, { onProgress, signal });
  }}
/>`,
});
