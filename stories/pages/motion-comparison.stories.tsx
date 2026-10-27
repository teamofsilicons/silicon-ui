/**
 * Preview only, removed before merging: the same story from main (left) and this branch (right), side by side, to judge
 * the Fluid Functionalism motion. Needs main's Storybook on :6007 and this branch's on :6008 (see the PR).
 */
import { useEffect, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "@/registry/components/select/select";

const OLD = "http://localhost:6007";
const NEW = "http://localhost:6008";
const START = "components-actions-dropdown-menu--default";

const page: CSSProperties = { display: "grid", gap: "var(--space-inset)", padding: "var(--space-section)", height: "100vh", boxSizing: "border-box", gridTemplateRows: "auto 1fr" };
const bar: CSSProperties = { display: "flex", alignItems: "end", gap: "var(--space-inset)", flexWrap: "wrap" };
const panes: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-inset)", minHeight: 0 };
const pane: CSSProperties = { display: "grid", gridTemplateRows: "auto 1fr", gap: "var(--space-related)", minHeight: 0 };
const heading: CSSProperties = { margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 };
const frame: CSSProperties = { width: "100%", height: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius-container)", background: "var(--background)" };

function Comparison() {
  const [stories, setStories] = useState<{ value: string; label: string }[]>([]);
  const [id, setId] = useState(START);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    fetch(`${NEW}/index.json`).then(response => response.json()).then((index: { entries: Record<string, { id: string; title: string; name: string; type: string }> }) => {
      setStories(Object.values(index.entries).filter(entry => entry.type === "story" && entry.title.startsWith("Components/"))
        .map(entry => ({ value: entry.id, label: `${entry.title.split("/").pop()} · ${entry.name}` })));
    }).catch(() => setStories([]));
  }, []);
  const src = (base: string) => `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;
  return (
    <div style={page}>
      <div style={bar}>
        <div style={{ flex: "1 1 360px" }}><Select label="Story" value={id} onValueChange={setId} options={stories.length ? stories : [{ value: START, label: "Dropdown menu · Default" }]} /></div>
        <div style={{ flex: "0 0 180px" }}><Select label="Theme" value={theme} onValueChange={setTheme} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} /></div>
      </div>
      <div style={panes}>
        <div style={pane}><p style={heading}>Before (main)</p><iframe title="Before" style={frame} src={src(OLD)} /></div>
        <div style={pane}><p style={heading}>After (fluid motion)</p><iframe title="After" style={frame} src={src(NEW)} /></div>
      </div>
    </div>
  );
}

const meta: Meta = { title: "Introduction/Motion comparison", parameters: { layout: "fullscreen", controls: { disable: true } } };
export default meta;

export const MotionComparison: StoryObj = { name: "Motion comparison", render: () => <Comparison /> };
