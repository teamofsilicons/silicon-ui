import Link from "next/link";

import { CodeBlock } from "@/registry/components/code-block/code-block";
import { CopyCommand } from "../components/copy-command";
import { OnThisPage } from "../components/on-this-page";
import { catalog, registryNamespace } from "../lib/catalog";

const registryConfig = JSON.stringify({ registries: { [registryNamespace]: "https://ui.teamofsilicons.com/r/{name}.json" } }, null, 2);

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
      <p className="lede">Free, open source React components and blocks with calm, physical motion, by <a href="https://teamofsilicons.com">Team of Silicons</a>. Every item is plain source you own: CSS modules on a small set of design tokens, Motion for animation, keyboard support, and a reduced motion path. Preview all {components} components and {blocks} blocks here, with live props and docs generated from the source, or browse the code <a href="https://github.com/teamofsilicons/silicon-ui">on GitHub</a>.</p>

      <section id="install" className="section">
        <h2>Install</h2>
        <ol className="steps">
          <li><p>If your project doesn&apos;t use shadcn yet, run <code>npx shadcn@latest init</code> once. Then register the <code>{registryNamespace}</code> namespace in <code>components.json</code>:</p><CodeBlock code={registryConfig} filename="components.json" language="json" /></li>
          <li><p>Install the foundation once per app. It brings the design tokens and motion presets every item reads.</p><CopyCommand command={`npx shadcn@latest add ${registryNamespace}/silicon-foundation`} block /></li>
          <li><p>Import <code>components/silicon-ui/foundation.css</code> once, in your root layout or entry file.</p></li>
          <li><p>Add any component or block by name.</p><CopyCommand command={`npx shadcn@latest add ${registryNamespace}/button`} block /></li>
        </ol>
        <p className="muted">Requires React 19. Works in Next.js and Vite, with or without Tailwind. Set <code>data-theme=&quot;dark&quot;</code> and <code>data-accent</code> on <code>&lt;html&gt;</code> to change the appearance; the switches at the bottom of the sidebar do the same here.</p>
      </section>

      <section id="ai" className="section">
        <h2>AI tools</h2>
        <p>Every item has a Markdown page at <code>/&lt;id&gt;.md</code> with install steps, usage and the full props reference, and <a href="/llms.txt">llms.txt</a> lists them all. shadcn&apos;s MCP server (<code>npx shadcn@latest mcp init</code>) can search and install from <code>{registryNamespace}</code> directly.</p>
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

      <section id="credits" className="section">
        <h2>Credits</h2>
        <p>Silicon UI started as a fork of <a href="https://github.com/kuratlielia/arc-library">Arc</a> by Elia Kuratli, released under the MIT License. Demo photographs are from <a href="https://unsplash.com">Unsplash</a>. Silicon UI is MIT licensed.</p>
      </section>
    </main>
    <OnThisPage entries={[{ id: "install", title: "Install" }, { id: "ai", title: "AI tools" }, { id: "components", title: "Components" }, { id: "blocks", title: "Blocks" }, { id: "credits", title: "Credits" }]} />
  </div>;
}
