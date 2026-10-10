import Link from "next/link";

import { CopyCommand } from "../components/copy-command";
import { OnThisPage } from "../components/on-this-page";
import { catalog, registryNamespace } from "../lib/catalog";

export default function Introduction() {
  const all = Object.values(catalog.items);
  const components = all.filter(item => item.kind === "component").length;
  const blocks = all.filter(item => item.kind === "block").length;
  const categories = catalog.nav.filter(category => category.kind === "component");
  const blockCategories = catalog.nav.filter(category => category.kind === "block");

  return <div className="page">
    <main className="content">
      <nav className="breadcrumb" aria-label="Breadcrumb"><span>Docs</span></nav>
      <h1 className="title">Silicon UI</h1>
      <p className="lede">React components and blocks with calm, physical motion. Every item is plain source you own: CSS modules on a small set of design tokens, Motion for animation, keyboard support, and a reduced motion path. This site previews all {components} components and {blocks} blocks in the repository, with live props and docs generated from the source.</p>

      <section id="install" className="section">
        <h2>Install</h2>
        <ol className="steps">
          <li><p>Install the foundation once per app. It brings the design tokens and motion presets every item reads.</p><CopyCommand command={`npx shadcn@latest add ${registryNamespace}/arc-foundation`} block /></li>
          <li><p>Import <code>components/arc/foundation.css</code> once, in your root layout or entry file.</p></li>
          <li><p>Add any component or block by name.</p><CopyCommand command={`npx shadcn@latest add ${registryNamespace}/button`} block /></li>
        </ol>
        <p className="muted">Requires React 19. Works in Next.js and Vite, with or without Tailwind. Set <code>data-theme=&quot;dark&quot;</code> and <code>data-accent</code> on <code>&lt;html&gt;</code> to change the appearance; the switches at the bottom of the sidebar do the same here.</p>
      </section>

      <section id="components" className="section">
        <h2>Components</h2>
        {categories.map(category => <div key={category.title} className="overview-category">
          <h3>{category.title}</h3>
          <div className="related-grid">{category.groups.flatMap(group => group.items).map(entry => <Link key={entry.name} href={`/${entry.name}`} className="related-card"><strong>{entry.title}</strong><span>{entry.description}</span></Link>)}</div>
        </div>)}
      </section>

      <section id="blocks" className="section">
        <h2>Blocks</h2>
        <div className="related-grid">{blockCategories.flatMap(category => category.groups.flatMap(group => group.items)).map(entry => <Link key={entry.name} href={`/${entry.name}`} className="related-card"><strong>{entry.title}</strong><span>{entry.description}</span></Link>)}</div>
      </section>
    </main>
    <OnThisPage entries={[{ id: "install", title: "Install" }, { id: "components", title: "Components" }, { id: "blocks", title: "Blocks" }]} />
  </div>;
}
