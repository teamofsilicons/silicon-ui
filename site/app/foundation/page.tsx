import type { CSSProperties } from "react";

import { OnThisPage } from "../../components/on-this-page";
import { catalog } from "../../lib/catalog";

export const metadata = { title: "Foundation", description: "The design tokens every component reads, live in the current theme and accent." };

/** Token names declared in foundation.css's first :root block, in order. */
function tokens() {
  const rootBlock = catalog.foundation.slice(catalog.foundation.indexOf(":root {"), catalog.foundation.indexOf("}"));
  return [...rootBlock.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(match => match[1]!);
}

export default function Foundation() {
  const names = tokens();
  const colors = names.filter(name => !/^--(space|radius|control-height|font|text|tracking|leading|ease|duration|shadow|neutral|corner)-/.test(name) && !/thumb-shadow|gradient$|gradient-(soft|line|ink)$/.test(name) && !name.startsWith("--focus"));
  const neutrals = names.filter(name => name.startsWith("--neutral-"));
  const gradients = names.filter(name => /gradient(-soft|-line|-ink)?$/.test(name));
  const shadows = names.filter(name => name.startsWith("--shadow-"));
  const radii = names.filter(name => name.startsWith("--radius-"));
  const text = names.filter(name => name.startsWith("--text-") && !/secondary|muted/.test(name));
  const spaces = names.filter(name => name.startsWith("--space-"));
  const durations = names.filter(name => name.startsWith("--duration-") || name.startsWith("--ease-"));

  return <div className="page">
    <main className="content">
      <nav className="breadcrumb" aria-label="Breadcrumb"><span>Docs</span></nav>
      <h1 className="title">Foundation</h1>
      <p className="lede">Every component reads these tokens from <code>registry/foundation.css</code>. Swatches render live, so they follow the theme and accent you pick in the sidebar.</p>

      <section id="color" className="section">
        <h2>Color</h2>
        <div className="swatch-grid">{colors.map(name => <div key={name} className="swatch"><span style={{ background: `var(${name})` }} /><code>{name}</code></div>)}</div>
        <h3>Neutral scale</h3>
        <div className="scale">{neutrals.map(name => <div key={name} style={{ background: `var(${name})` } as CSSProperties} title={name}><code>{name.replace("--neutral-", "")}</code></div>)}</div>
        <h3>Gradients</h3>
        <div className="swatch-grid">{gradients.map(name => <div key={name} className="swatch wide"><span style={{ background: `var(${name})` }} /><code>{name}</code></div>)}</div>
        <h3>Chart series</h3>
        <div className="swatch-grid">{["--series-1", "--series-2", "--series-3", "--series-4"].map(name => <div key={name} className="swatch"><span style={{ background: `var(${name})` }} /><code>{name}</code></div>)}</div>
      </section>

      <section id="shape" className="section">
        <h2>Radius, corners and shadow</h2>
        <div className="token-row">{radii.map(name => <div key={name} className="radius-sample"><span style={{ borderRadius: `var(${name})` }} /><code>{name}</code></div>)}</div>
        <h3>Corner shape</h3>
        <p className="muted">Squircle is the default. Set <code>data-corners=&quot;round&quot;</code> on <code>&lt;html&gt;</code>, or on any element, for round corners. Browsers without <code>corner-shape</code> draw round corners either way.</p>
        <div className="token-row">{(["squircle", "round"] as const).map(shape => <div key={shape} className="radius-sample corner-sample" data-corners={shape}><span /><code>{shape}</code></div>)}</div>
        <h3>Shadow</h3>
        <div className="token-row">{shadows.map(name => <div key={name} className="shadow-sample"><span style={{ boxShadow: `var(${name})` }} /><code>{name}</code></div>)}</div>
      </section>

      <section id="type" className="section">
        <h2>Type</h2>
        <div className="type-scale">{text.slice().reverse().map(name => <div key={name}><code>{name}</code><span style={{ fontSize: `var(${name})`, fontFamily: /xl/.test(name) ? "var(--font-display)" : "var(--font-body)", letterSpacing: /xl/.test(name) ? "var(--tracking-display)" : "var(--tracking-body)", lineHeight: 1.15 }}>A team of AI employees</span></div>)}</div>
      </section>

      <section id="space" className="section">
        <h2>Space</h2>
        <div className="space-scale">{spaces.map(name => <div key={name}><code>{name}</code><span style={{ width: `var(${name})` }} /></div>)}</div>
      </section>

      <section id="motion" className="section">
        <h2>Motion</h2>
        <p className="muted">Durations and easings for CSS transitions. Springs for Motion live in <code>lib/motion-tokens.ts</code>.</p>
        <ul className="file-list">{durations.map(name => <li key={name}><code>{name}</code></li>)}</ul>
      </section>
    </main>
    <OnThisPage entries={[{ id: "color", title: "Color" }, { id: "shape", title: "Radius and corners" }, { id: "type", title: "Type" }, { id: "space", title: "Space" }, { id: "motion", title: "Motion" }]} />
  </div>;
}
