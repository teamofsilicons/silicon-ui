import { CodeBlock, type CodeBlockProps } from "@/registry/components/code-block/code-block";
import { defineDemo } from "../lib/demo";

const deploy = `import { silicons } from "@/lib/silicons";

export async function deploySupportDesk(teamId: string) {
  // Start in shadow mode: drafts replies, a person sends them.
  const silicon = await silicons.deploy({
    role: "support-desk",
    teamId,
    mode: "shadow",
    escalateAbove: { refundUsd: 250 },
  });
  return silicon.id;
}`;

const query = `SELECT department, COUNT(*) AS tickets, AVG(first_reply_seconds) AS median_reply
FROM tickets
WHERE resolved_by = 'silicon'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY department
ORDER BY tickets DESC;`;

const config = `{
  "silicon": "invoice-reconciler",
  "department": "finance",
  "schedule": "0 2 * * *",
  "sources": ["netsuite", "stripe", "bank-feed"],
  "notify": "#finance-ops",
  "approvals": {
    "required": true,
    "threshold": 5000,
    "approvers": ["andre.williams", "diane.foster"]
  },
  "retries": 3,
  "timeoutMinutes": 45
}`;

const frame = { width: "min(100%, 620px)" } as const;

export default defineDemo<CodeBlockProps>({
  props: { code: deploy, filename: "deploy-support-desk.ts", language: "ts" },
  hideControls: ["code"],
  Preview: ({ props }) => <div style={frame}><CodeBlock {...props} /></div>,
  examples: [
    {
      title: "Collapsed",
      description: "maxLines folds longer sources, with a toggle that expands the rest in place.",
      render: () => <div style={frame}><CodeBlock code={config} filename="silicon.config.json" language="json" maxLines={6} /></div>,
    },
    {
      title: "SQL",
      render: () => <div style={frame}><CodeBlock code={query} filename="weekly-tickets.sql" language="sql" /></div>,
    },
  ],
  usage: `<CodeBlock
  filename="deploy-support-desk.ts"
  language="ts"
  code={source}
  maxLines={12}
/>`,
});
