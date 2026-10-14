import Link from "next/link";

import { CodeBlock } from "@/registry/components/code-block/code-block";
import { CopyCommand } from "../components/copy-command";
import { catalog, registryNamespace } from "../lib/catalog";

const registryConfig = JSON.stringify(
  { registries: { [registryNamespace]: "https://ui.teamofsilicons.com/r/{name}.json" } },
  null,
  2,
);

const sections = [
  { id: "install", title: "Install" },
  { id: "ai", title: "AI tools" },
  { id: "components", title: "Components" },
  { id: "blocks", title: "Blocks" },
  { id: "credits", title: "Credits" },
];

export default function HomePage() {
  const all = Object.values(catalog.items);
  const components = all.filter(item => item.kind === "component").length;
  const blocks = all.filter(item => item.kind === "block").length;
  const categories = catalog.nav.filter(category => category.kind === "component");
  const blockCategories = catalog.nav.filter(category => category.kind === "block");
  const blockItems = blockCategories.flatMap(category => category.groups.flatMap(group => group.items));

  return (
    <div className="page home">
      <main className="home-doc">
        <h1>Silicon UI</h1>
        <p className="lede">
          React components and blocks with calm, physical motion. {components} components and {blocks} blocks, each plain source you own, free and MIT licensed, by <a href="https://teamofsilicons.com">Team of Silicons</a>.
        </p>

        <nav className="home-nav" aria-label="On this page">
          {sections.map(section => (
            <a key={section.id} href={`#${section.id}`}>{section.title}</a>
          ))}
        </nav>

        <h2 id="install">Install</h2>
        <p>
          Works in Next.js and Vite, with or without Tailwind. React 19 is required. Register the registry once, install the foundation once, then add anything by name.
        </p>
        <ol className="home-steps">
          <li>
            <p>If the project does not use shadcn yet, run <code>npx shadcn@latest init</code> once. Then register <code>{registryNamespace}</code> in <code>components.json</code>.</p>
            <CodeBlock code={registryConfig} filename="components.json" language="json" />
          </li>
          <li>
            <p>Install the foundation once per app. It brings the design tokens and motion presets every item reads.</p>
            <CopyCommand command={`npx shadcn@latest add ${registryNamespace}/silicon-foundation`} block />
          </li>
          <li>
            <p>Import <code>components/silicon-ui/foundation.css</code> once, in the root layout or entry file.</p>
          </li>
          <li>
            <p>Add any component or block by name. Local dependencies come along with it.</p>
            <CopyCommand command={`npx shadcn@latest add ${registryNamespace}/button`} block />
          </li>
        </ol>
        <p className="home-note">
          Set <code>data-theme</code>, <code>data-accent</code> and <code>data-corners</code> on <code>&lt;html&gt;</code> to change the appearance. The switches at the bottom of the sidebar do the same here. Corners are squircles by default.
        </p>

        <h2 id="ai">AI tools</h2>
        <p>
          Every item has a Markdown page at <code>/&lt;id&gt;.md</code> with install steps, usage and the full props reference. <a href="/llms.txt">llms.txt</a> lists them all. shadcn&apos;s MCP server (<code>npx shadcn@latest mcp init</code>) can search and install from <code>{registryNamespace}</code> directly. The source is <a href="https://github.com/teamofsilicons/silicon-ui">on GitHub</a>.
        </p>

        <h2 id="components">Components</h2>
        <p>{components} parts. Each page is the real component, with live props and docs generated from the source.</p>
        {categories.map(category => (
          <section key={category.title}>
            <h3>{category.title}</h3>
            <div className="home-index">
              {category.groups.flatMap(group => group.items).map(entry => (
                <Link className="home-entry" href={`/${entry.name}`} key={entry.name}>
                  <span className="home-entry-name">{entry.title}</span>
                  <span className="home-entry-about">{entry.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <h2 id="blocks">Blocks</h2>
        <p>{blocks} composed sections, built from the same components.</p>
        <div className="home-index">
          {blockItems.map(entry => (
            <Link className="home-entry" href={`/${entry.name}`} key={entry.name}>
              <span className="home-entry-name">{entry.title}</span>
              <span className="home-entry-about">{entry.description}</span>
            </Link>
          ))}
        </div>

        <h2 id="credits">Credits</h2>
        <p>
          Silicon UI started as a fork of <a href="https://github.com/kuratlielia/arc-library">Arc</a> by Elia Kuratli, released under the MIT License. Demo photographs are from <a href="https://unsplash.com">Unsplash</a>. Silicon UI is MIT licensed.
        </p>
      </main>
    </div>
  );
}
