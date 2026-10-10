import { CopyButton, type CopyButtonProps } from "@/registry/components/copy-button/copy-button";
import { defineDemo } from "../lib/demo";

const field = { display: "flex", alignItems: "center", gap: 8, width: "min(100%, 420px)", padding: "6px 6px 6px 14px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)" } as const;
const code = { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" } as const;

export default defineDemo<CopyButtonProps>({
  component: CopyButton,
  props: { value: "https://app.teamofsilicons.com/invite/finance-ops-7f3a", label: "Copy invite link" },
  examples: [
    {
      title: "Inside a field",
      description: "The plain, icon-only button sits at the end of a read-only value. The label stays its accessible name.",
      render: () => <div style={field}>
        <span style={code}>silicon deploy finance-ops --region eu-west</span>
        <CopyButton value="silicon deploy finance-ops --region eu-west" label="Copy command" variant="plain" iconOnly />
      </div>,
    },
    {
      title: "Disabled",
      render: () => <CopyButton value="" label="Copy API reference" disabled />,
    },
  ],
});
