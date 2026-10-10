/**
 * Builds the prebuilt registry in public/r from registry.json and the source in this repository: one
 * public/r/<item>.json per item, with each file's content embedded and its imports rewritten for the install layout
 * in scripts/registry-install.mjs. scripts/check-registry.mjs verifies the result.
 *
 *   npm run build:registry
 */
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { importSpecifiers, withRelativeImports } from "./registry-install.mjs";

const registry = JSON.parse(await readFile("registry.json", "utf8"));
const exists = async file => { try { return (await stat(file)).isFile(); } catch { return false; } };

async function findFile(importPath) {
  for (const candidate of [importPath, `${importPath}.ts`, `${importPath}.tsx`, `${importPath}.css`, `${importPath}.module.css`, path.join(importPath, "index.ts"), path.join(importPath, "index.tsx")]) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}
const resolveFrom = file => specifier => {
  if (specifier.startsWith("./") || specifier.startsWith("../")) return findFile(path.normalize(path.join(path.dirname(file), specifier)));
  if (specifier.startsWith("@/")) return findFile(specifier.slice(2));
  return null;
};
async function content(file) {
  const source = await readFile(file, "utf8");
  return /\.(?:tsx?|css)$/.test(file) ? withRelativeImports(file, source, importSpecifiers(file, source), resolveFrom(file)) : source;
}

await mkdir("public/r", { recursive: true });
const names = new Set();
for (const item of registry.items) {
  names.add(item.name);
  const files = [];
  for (const file of item.files) files.push({ ...file, content: await content(file.path) });
  const built = { $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item, files };
  await writeFile(`public/r/${item.name}.json`, JSON.stringify(built));
}

// Items removed from registry.json leave no stale file behind.
for (const file of await readdir("public/r")) {
  if (file.endsWith(".json") && !names.has(file.slice(0, -".json".length))) await rm(path.join("public/r", file));
}

console.log(`Built ${registry.items.length} registry items into public/r`);
