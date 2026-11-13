import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Copy, Ellipsis, FileText, Plus, Search, Upload } from "lucide-react";
import type { CSSProperties } from "react";

import { Button } from "@/registry/components/button/button";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: Button,
  props: { children: "Save changes" },
  examples: [
    {
      title: "Soft, for controls in a bar (experimental)",
      description: "variant=\"soft\" is filled and borderless: a search trigger, toolbar buttons, a switcher. Use it on the page or a surface, not on a muted panel.",
      render: () => <div style={{ display: "flex", alignItems: "center", gap: "var(--space-related)", flexWrap: "wrap", justifyContent: "center", padding: "var(--space-related)", borderRadius: "var(--radius-container)", background: "var(--surface)", border: "1px solid var(--border)" }}>
        <Button variant="soft" size="sm">Team of Silicons <ChevronDown size={14} aria-hidden="true" /></Button>
        <Button variant="soft" size="sm"><Search size={16} aria-hidden="true" /> Search</Button>
        <Button variant="soft" size="sm" aria-label="Previous"><ChevronLeft size={16} aria-hidden="true" /></Button>
        <Button variant="soft" size="sm" aria-label="Next"><ChevronRight size={16} aria-hidden="true" /></Button>
        <Button variant="soft" size="xs" aria-label="Add a page"><Plus aria-hidden="true" /></Button>
        <Button variant="soft" size="sm" disabled>Disabled</Button>
      </div>,
    },
    {
      title: "Link, for an action among words (experimental)",
      description: "variant=\"link\" is underlined text with no box, at its size's font size: a switch under a field. Set --button-link-underline to transparent to show the line on hover only.",
      render: () => <div style={{ display: "grid", gap: "var(--space-related)", justifyItems: "start", width: "min(100%, 320px)" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>We sent a code to +44 7400 123456.</span>
        <div style={{ display: "flex", gap: "var(--space-group)", flexWrap: "wrap" }}>
          <Button variant="link" size="sm">Use a different number</Button>
          <Button variant="link" size="sm" style={{ "--button-link-underline": "transparent" } as CSSProperties}>Resend code</Button>
          <Button variant="link" size="sm" disabled>Call me instead</Button>
        </div>
      </div>,
    },
    {
      title: "Compact, for dense rows (experimental)",
      description: "size=\"xs\" is 24px: the smallest target WCAG allows. Icon-only compact buttons are square and need an aria-label.",
      render: () => <div style={{ display: "flex", alignItems: "center", gap: "var(--space-tight)", width: 280, padding: "var(--space-tight)", borderRadius: "var(--radius-control)", background: "var(--surface)", border: "1px solid var(--border)" }}>
        <Button variant="ghost" size="xs" aria-label="Expand Roadmap"><ChevronRight aria-hidden="true" /></Button>
        <FileText size={16} aria-hidden="true" style={{ color: "var(--text-secondary)" }} />
        <span style={{ flex: 1, fontSize: "var(--text-sm)" }}>Roadmap</span>
        <Button variant="ghost" size="xs" aria-label="Options for Roadmap"><Ellipsis aria-hidden="true" /></Button>
        <Button variant="ghost" size="xs" aria-label="Add a page inside Roadmap"><Plus aria-hidden="true" /></Button>
      </div>,
    },
    {
      title: "With icons",
      description: "Icons sit before or after the label. An icon alone needs an aria-label.",
      render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Button variant="secondary"><Plus size={16} aria-hidden="true" /> Add item</Button>
        <Button>Continue <ArrowRight size={16} aria-hidden="true" /></Button>
        <Button variant="secondary" aria-label="Copy link"><Copy size={16} aria-hidden="true" /></Button>
      </div>,
    },
    {
      title: "States",
      render: () => <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Button loading>Saving</Button>
        <Button variant="secondary"><Upload size={16} aria-hidden="true" /> Upload file</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </div>,
    },
  ],
});
