/**
 * The component inventory as a Storybook page: search it before asking for a new component or variant. Reads
 * stories/inventory.json (npm run build:inventory) and is built with Silicon UI's own components.
 */
import { useMemo, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/registry/components/badge/badge";
import { SearchField } from "@/registry/components/search-field/search-field";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import inventory from "../inventory.json";

interface Row {
  name: string; title: string; kind: "component" | "block"; category: string; status: string; experimentalParts: string[]; description: string;
  variants: Record<string, string[]>; composes: string[]; import: string; docs: string; storybook: string;
}
const rows = inventory as unknown as Row[];

const page: CSSProperties = { display: "grid", gap: "var(--space-section)", maxWidth: 1120, margin: "0 auto", padding: "var(--space-block) var(--space-section)" };
const head: CSSProperties = { display: "grid", gap: "var(--space-related)" };
const title: CSSProperties = { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-display)", color: "var(--foreground)" };
const lede: CSSProperties = { margin: 0, maxWidth: "70ch", color: "var(--text-secondary)", fontSize: "var(--text-base)" };
const bar: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "end", gap: "var(--space-inset)" };
const group: CSSProperties = { display: "grid", gap: "var(--space-related)" };
const groupTitle: CSSProperties = { margin: 0, color: "var(--foreground)", fontSize: "var(--text-lg)", fontWeight: 600 };
const table: CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" };
const cell: CSSProperties = { padding: "var(--space-group) var(--space-related)", borderTop: "1px solid var(--border)", verticalAlign: "top", textAlign: "left" };
const th: CSSProperties = { ...cell, color: "var(--text-muted)", fontSize: "var(--text-xs)", fontWeight: 500, borderTop: 0 };
const muted: CSSProperties = { color: "var(--text-secondary)" };
const code: CSSProperties = { fontFamily: "ui-monospace, monospace", fontSize: "var(--text-xs)", color: "var(--text-secondary)" };
const link: CSSProperties = { color: "var(--accent-strong)" };

function Inventory() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(row => (status === "all" || row.status === status || (status === "experimental" && row.experimentalParts.length > 0))
      && (!q || [row.name, row.title, row.description, row.category, ...Object.keys(row.variants), ...Object.values(row.variants).flat()].join(" ").toLowerCase().includes(q)));
  }, [query, status]);
  const groups = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const row of shown) {
      const key = row.kind === "block" ? "Blocks (copied into apps)" : row.category;
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return [...map];
  }, [shown]);
  const components = rows.filter(row => row.kind === "component");
  return (
    <div style={page}>
      <div style={head}>
        <h1 style={title}>Inventory</h1>
        <p style={lede}>
          {components.length} components and {rows.length - components.length} blocks. Search here before asking for something new: it may
          exist, or be a variant of something that does. How a new component or variant gets made is in docs/new-components.md.
        </p>
      </div>
      <div style={bar}>
        <div style={{ flex: "1 1 320px" }}><SearchField label="Search components, variants and descriptions" value={query} onValueChange={setQuery} placeholder="date, tone, upload…" /></div>
        <SegmentedControl label="Status" value={status} onValueChange={setStatus} options={[{ value: "all", label: "All" }, { value: "stable", label: "Stable" }, { value: "experimental", label: "Experimental" }]} />
      </div>
      {groups.length === 0 ? <p style={muted}>Nothing matches. If it really is missing, that is a request: see docs/new-components.md.</p> : null}
      {groups.map(([name, items]) => (
        <section key={name} style={group}>
          <h2 style={groupTitle}>{name} <span style={muted}>{items.length}</span></h2>
          <table style={table}>
            <thead><tr><th style={th}>Component</th><th style={th}>Status</th><th style={th}>Variants</th><th style={th}>Built from</th><th style={th}>Use</th></tr></thead>
            <tbody>
              {items.map(row => (
                <tr key={row.name}>
                  <td style={{ ...cell, width: "34%" }}>
                    <a style={{ ...link, fontWeight: 600 }} href={`/?path=/story/${row.storybook}`} target="_top">{row.title}</a>
                    <div style={muted}>{row.description}</div>
                  </td>
                  <td style={cell}>
                    <Badge size="sm" tone={row.status === "stable" ? "success" : "warning"}>{row.status}</Badge>
                    {row.experimentalParts.length ? <div style={{ marginTop: "var(--space-tight)" }}><Badge size="sm" tone="warning">new parts experimental</Badge></div> : null}
                  </td>
                  <td style={cell}>
                    {Object.keys(row.variants).length ? Object.entries(row.variants).map(([prop, values]) => (
                      <div key={prop}><span style={code}>{prop}</span> {values.join(" · ")}</div>
                    )) : <span style={muted}>—</span>}
                  </td>
                  <td style={cell}>{row.composes.length ? row.composes.join(", ") : <span style={muted}>—</span>}</td>
                  <td style={cell}><span style={code}>{row.import}</span><div><a style={link} href={row.docs} target="_blank" rel="noreferrer">Docs</a></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

const meta: Meta = { title: "Introduction/Inventory", parameters: { layout: "fullscreen", controls: { disable: true } } };
export default meta;

export const Inventory_: StoryObj = { name: "Inventory", render: () => <Inventory /> };
