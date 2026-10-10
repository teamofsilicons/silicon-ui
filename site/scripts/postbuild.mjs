/**
 * Runs after `next build site`. Adds what the static export does not produce on its own:
 *   - the shadcn registry: public/r/<item>.json at /r/, and registry.json at /registry.json and /r/registry.json
 *   - AI-readable docs: /llms.txt, and a Markdown page per item at /<item>.md
 */
import { cp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.join(root, "site/out");
const site = "https://ui.teamofsilicons.com";
const namespace = "@silicon-ui";

await cp(path.join(root, "public/r"), path.join(out, "r"), { recursive: true });
await cp(path.join(root, "registry.json"), path.join(out, "registry.json"));
await cp(path.join(root, "registry.json"), path.join(out, "r/registry.json"));

const catalog = JSON.parse(await readFile(path.join(root, "site/generated/catalog.json"), "utf8"));

/** The demo's hand-written usage snippet, when it has one. */
async function demoUsage(name) {
  try {
    const source = await readFile(path.join(root, "site/demos", `${name}.tsx`), "utf8");
    return source.match(/\busage:\s*`([\s\S]*?)`\s*,?\s*\n/)?.[1]?.replace(/\\`/g, "`").replace(/\\\$/g, "$") ?? null;
  } catch { return null; }
}

const cell = text => String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");

async function markdown(item) {
  const usage = await demoUsage(item.name) ?? `<${item.exportName} />`;
  const lines = [
    `# ${item.title}`, "", item.description, "",
    `Live preview: ${site}/${item.name}`, "",
    "## Installation", "",
    "```bash", `npx shadcn@latest add ${namespace}/${item.name}`, "```", "",
    `Or from the full URL: \`npx shadcn@latest add ${site}/r/${item.name}.json\`. Install the design tokens once per app with \`npx shadcn@latest add ${namespace}/silicon-foundation\` and import \`components/silicon-ui/foundation.css\` at the root.`, "",
    ...(item.dependencies.length ? [`npm dependencies: ${item.dependencies.map(d => `\`${d}\``).join(", ")}.`, ""] : []),
    "Files:", "", ...item.files.map(file => `- \`${file.target}\``), "",
    "## Usage", "",
    "```tsx", item.hasNamedExport ? `import { ${item.exportName} } from "${item.importPath}";` : `import ${item.exportName} from "${item.importPath}";`, "", usage.trim(), "```", "",
  ];
  const parts = item.parts.filter(part => part.props.length || part.extends);
  if (parts.length) {
    lines.push("## API reference", "");
    for (const part of parts) {
      if (item.parts.length > 1) lines.push(`### ${part.name}`, "");
      if (part.props.length) {
        lines.push("| Prop | Type | Default | Description |", "| --- | --- | --- | --- |");
        for (const prop of part.props) lines.push(`| \`${prop.name}\`${prop.required ? " (required)" : ""} | \`${cell(prop.type)}\` | ${prop.default ? `\`${cell(prop.default)}\`` : ""} | ${cell(prop.description)} |`);
        lines.push("");
      }
      if (part.extends) lines.push(`${part.props.length ? "Also accepts" : "Accepts"} the props of \`${part.extends}\`.`, "");
    }
  }
  if (item.registryDependencies.length) lines.push("## Registry dependencies", "", ...item.registryDependencies.map(name => `- [${name}](${site}/${name}.md)`), "");
  return lines.join("\n");
}

const items = Object.values(catalog.items);
for (const item of items) await writeFile(path.join(out, `${item.name}.md`), await markdown(item));

const llms = [
  "# Silicon UI", "",
  "> Free, open source React components and blocks with calm, physical motion, by Team of Silicons. Plain source installed with the shadcn CLI: CSS modules on design tokens, Motion for animation, keyboard support and reduced motion.", "",
  `Install: \`npx shadcn@latest add ${namespace}/<id>\` (registry: ${site}/r/{name}.json). Tokens: \`npx shadcn@latest add ${namespace}/silicon-foundation\`, then import \`components/silicon-ui/foundation.css\` once.`, "",
];
for (const category of catalog.nav) {
  llms.push(`## ${category.kind === "block" ? `Blocks: ${category.title}` : category.title}`, "");
  for (const group of category.groups) for (const entry of group.items) llms.push(`- [${entry.title}](${site}/${entry.name}.md): ${entry.description}`);
  llms.push("");
}
await writeFile(path.join(out, "llms.txt"), llms.join("\n"));

console.log(`Copied the registry into site/out and wrote llms.txt plus ${items.length} Markdown pages`);
