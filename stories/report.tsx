/** A component's consistency report (scripts/check-component.mjs) as its "Consistency" story in Storybook. */
import type { CSSProperties } from "react";
import { Badge } from "@/registry/components/badge/badge";

interface Check { id: string; title: string; required: boolean; ok: boolean; detail: string[] }
export interface Report { name: string; title: string; status: string; checkedAt: string; passed: boolean; checks: Check[] }

const wrap: CSSProperties = { display: "grid", gap: "var(--space-inset)", maxWidth: 720 };
const row: CSSProperties = { display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-group)", padding: "var(--space-group) 0", borderTop: "1px solid var(--border)" };
const detail: CSSProperties = { margin: "var(--space-tight) 0 0", paddingLeft: "var(--space-inset)", color: "var(--text-secondary)", fontSize: "var(--text-xs)" };

export function ConsistencyReport({ report }: { report: Report }) {
  return (
    <div style={wrap}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-related)" }}>
        <strong style={{ fontSize: "var(--text-lg)" }}>Design consistency: {report.title}</strong>
        <Badge size="sm" tone={report.passed ? "success" : "danger"}>{report.passed ? "Passed" : "Failed"}</Badge>
        <Badge size="sm" tone={report.status === "stable" ? "success" : "warning"}>{report.status}</Badge>
        <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>checked {report.checkedAt.slice(0, 10)} · npm run check:component -- {report.name}</span>
      </div>
      <div>
        {report.checks.map(check => (
          <div key={check.id} style={row}>
            <Badge size="sm" tone={check.ok ? "success" : check.required ? "danger" : "warning"}>{check.ok ? "Pass" : check.required ? "Fail" : "Check"}</Badge>
            <div>
              <div>{check.title}{check.required ? "" : " (warning)"}</div>
              {check.detail.length ? <ul style={detail}>{check.detail.map(line => <li key={line}>{line}</li>)}</ul> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
