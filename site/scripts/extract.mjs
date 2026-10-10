/**
 * Builds site/generated/catalog.json and site/generated/demos.ts from the repository:
 *   - navigation groups from the README component and block tables (category → group → items)
 *   - item metadata from registry.json
 *   - each item's props (type, default, JSDoc, control kind) from the TypeScript source
 *   - the list of demo files in site/demos
 *
 *   node site/scripts/extract.mjs
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.join(root, "site/generated");
const at = (...parts) => path.join(root, ...parts);

const registry = JSON.parse(await readFile(at("registry.json"), "utf8"));
const readme = await readFile(at("README.md"), "utf8");

// ─── Navigation from the README ─────────────────────────────────────────────

function navigation() {
  const lines = readme.split("\n");
  const sections = [];
  let section = null;
  let category = null;
  let group = null;
  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    if (h2) { section = h2[1].trim(); category = null; group = null; continue; }
    if (section !== "Components" && section !== "Blocks") continue;
    const h3 = line.match(/^### (.+)$/);
    if (h3) {
      category = { title: section === "Blocks" ? h3[1].trim() : h3[1].trim(), kind: section === "Blocks" ? "block" : "component", groups: [] };
      sections.push(category);
      group = null;
      continue;
    }
    const bold = line.match(/^\*\*(.+)\*\*$/);
    if (bold && category) { group = { title: bold[1].trim(), items: [] }; category.groups.push(group); continue; }
    const row = line.match(/^\| \[([^\]]+)\]\(https:\/\/uiarc\.dev\/components\/(?:blocks\/)?([a-z0-9-]+)\) \| (.*?) \|/);
    if (row && category) {
      if (!group) { group = { title: null, items: [] }; category.groups.push(group); }
      group.items.push({ name: row[2], title: row[1], description: row[3] });
    }
  }
  return sections;
}

// ─── Props from the TypeScript source ───────────────────────────────────────

const sourceFiles = registry.items.flatMap(item => item.files.map(file => at(file.path))).filter(file => /\.tsx?$/.test(file));
const program = ts.createProgram([...new Set(sourceFiles)], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  baseUrl: root,
  paths: { "@/*": ["./*"] },
  types: [],
  typeRoots: [at("node_modules/@types")],
});
const checker = program.getTypeChecker();

const pascal = name => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const typeText = type => checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType | ts.TypeFormatFlags.WriteArrayAsGenericType * 0);

/** The exported component a page documents: the default export, or the export named after the folder. */
function mainExport(file, name) {
  const source = program.getSourceFile(file);
  if (!source) return null;
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) return null;
  const exports = checker.getExportsOfModule(moduleSymbol);
  const folder = path.basename(path.dirname(file));
  const wanted = [pascal(name), pascal(folder), pascal(path.basename(file).replace(/\.tsx?$/, ""))];
  const byName = exports.find(symbol => wanted.includes(symbol.getName()));
  const fallback = exports.find(symbol => symbol.getName() === "default");
  const symbol = byName ?? fallback;
  if (!symbol) return null;
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  return { symbol: target, source, exportName: symbol.getName() === "default" ? (target.getName() !== "default" ? target.getName() : pascal(folder)) : symbol.getName(), isDefault: symbol.getName() === "default" || exports.some(other => other.getName() === "default" && (other.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(other) : other) === target) };
}

/** Default values from `function X({ a = 1, b = "x" })` and `forwardRef(function X({ ... }, ref))`. */
function defaultsOf(source, componentName) {
  const defaults = {};
  const visit = node => {
    const isNamedFunction = (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.name?.text === componentName;
    const isArrowConst = ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === componentName && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer));
    const fn = isNamedFunction ? node : isArrowConst ? node.initializer : null;
    const param = fn?.parameters?.[0];
    if (param && ts.isObjectBindingPattern(param.name)) {
      for (const element of param.name.elements) {
        const key = element.propertyName?.getText(source) ?? element.name.getText(source);
        if (element.initializer) defaults[key] = element.initializer.getText(source);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return defaults;
}

function controlFor(type) {
  const parts = (type.isUnion() ? type.types : [type]).filter(part => !(part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
  if (parts.length && parts.every(part => part.flags & ts.TypeFlags.BooleanLiteral || part.flags & ts.TypeFlags.Boolean)) return { kind: "boolean" };
  if (parts.length > 1 && parts.every(part => part.isStringLiteral())) return { kind: "enum", options: parts.map(part => part.value) };
  if (parts.length === 1 && parts[0].flags & ts.TypeFlags.Number) return { kind: "number" };
  if (parts.length === 1 && parts[0].flags & ts.TypeFlags.String) return { kind: "string" };
  if (parts.length > 1 && parts.every(part => part.isNumberLiteral())) return { kind: "enum", options: parts.map(part => String(part.value)), numeric: true };
  if (parts.some(part => part.getCallSignatures().length)) return { kind: "function" };
  return null;
}

/** Props of one exported component: own props (declared in this repository) plus the type it extends, if any. */
function partOf(symbol, exportName, source) {
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const declaration = target.valueDeclaration ?? target.declarations?.[0];
  if (!declaration) return null;
  const type = checker.getTypeOfSymbolAtLocation(target, declaration);
  const signature = type.getCallSignatures()[0];
  if (!signature) return null;
  const propsParam = signature.getParameters()[0];
  const name = target.getName() === "default" ? exportName : target.getName();
  if (!propsParam) return { name: exportName, props: [], extends: null };
  const paramDeclaration = propsParam.valueDeclaration;
  const propsType = checker.getTypeOfSymbolAtLocation(propsParam, paramDeclaration ?? declaration);
  const defaults = defaultsOf(source, name);
  const foreign = new Set();
  const props = [];
  for (const property of checker.getPropertiesOfType(propsType)) {
    const declarations = property.getDeclarations() ?? [];
    const own = declarations.some(d => !d.getSourceFile().fileName.includes("node_modules"));
    if (!own) {
      const parent = declarations[0]?.parent;
      if (parent && (ts.isInterfaceDeclaration(parent) || ts.isTypeAliasDeclaration(parent))) foreign.add(parent.name.text);
      continue;
    }
    const propertyType = checker.getTypeOfSymbolAtLocation(property, declarations[0]);
    const optional = (property.flags & ts.SymbolFlags.Optional) !== 0;
    const written = declarations.find(d => (ts.isPropertySignature(d) || ts.isPropertyDeclaration(d)) && d.type);
    props.push({
      name: property.getName(),
      type: written ? written.type.getText(written.getSourceFile()).replace(/\s+/g, " ") : typeText(optional ? checker.getNonNullableType(propertyType) : propertyType),
      required: !optional,
      default: defaults[property.getName()] ?? null,
      description: ts.displayPartsToString(property.getDocumentationComment(checker)).trim(),
      control: controlFor(propertyType),
    });
  }
  props.sort((a, b) => Number(b.required) - Number(a.required));
  // What the props extend: the heritage clause of `<Name>Props` as written, else the foreign interfaces minus React's generic bases.
  let extendsText = null;
  const propsInterface = source.statements.find(statement => ts.isInterfaceDeclaration(statement) && statement.name.text === `${exportName}Props`);
  if (propsInterface?.heritageClauses) extendsText = propsInterface.heritageClauses.flatMap(clause => clause.types.map(t => t.getText(source))).join(", ");
  else {
    const generic = new Set(["DOMAttributes", "HTMLAttributes", "AriaAttributes", "Attributes", "RefAttributes", "ClassAttributes"]);
    const specific = [...foreign].filter(name => !generic.has(name));
    if (specific.length) extendsText = specific.join(", ");
    else if (foreign.size) extendsText = "HTMLAttributes";
  }
  return { name: exportName, props, extends: extendsText };
}

function propsOf(file, name) {
  const main = mainExport(file, name);
  if (!main) return { exportName: pascal(name), isDefault: false, parts: [] };
  const moduleSymbol = checker.getSymbolAtLocation(main.source);
  const parts = [];
  const seen = new Set();
  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const exportName = symbol.getName();
    if (exportName === "default" || !/^[A-Z]/.test(exportName)) continue;
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    if (!(target.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) || seen.has(target)) continue;
    seen.add(target);
    const part = partOf(symbol, exportName, main.source);
    if (part) parts.push(part);
  }
  if (!parts.length) { const part = partOf(main.symbol, main.exportName, main.source); if (part) parts.push(part); }
  parts.sort((a, b) => Number(b.name === main.exportName) - Number(a.name === main.exportName));
  return { exportName: main.exportName, isDefault: main.isDefault, parts };
}

// ─── Catalog ────────────────────────────────────────────────────────────────

const nav = navigation();
const placement = new Map();
for (const category of nav) for (const group of category.groups) for (const item of group.items) placement.set(item.name, { category: category.title, group: group.title, kind: category.kind });

const byFile = new Map(registry.items.map(item => [item.name, item]));
const npmName = dependency => dependency.replace(/(?<=.)@[^/]*$/, "");
const registryName = url => url.match(/\/r\/([a-z0-9-]+)\.json$/)?.[1] ?? url;

const items = {};
for (const item of registry.items) {
  if (!item.meta?.kind) continue;
  const mainFile = item.files[0].path;
  const own = path.dirname(mainFile);
  const files = [];
  for (const file of item.files) files.push({ path: file.path, target: file.target.replace(/^@components\//, "components/"), own: file.path.startsWith(own + "/"), content: await readFile(at(file.path), "utf8") });
  const extracted = propsOf(at(mainFile), item.name);
  const place = placement.get(item.name) ?? { category: item.meta.kind === "block" ? "Blocks" : "Other", group: null, kind: item.meta.kind };
  items[item.name] = {
    name: item.name,
    title: item.title,
    description: item.description,
    kind: item.meta.kind,
    tier: item.meta.tier,
    tags: item.meta.tags ?? [],
    category: place.category,
    group: place.group,
    mainFile,
    importPath: "@/" + item.files[0].target.replace(/^@/, "").replace(/\.tsx?$/, ""),
    exportName: extracted.exportName,
    isDefault: extracted.isDefault,
    parts: extracted.parts,
    props: extracted.parts.find(part => part.name === extracted.exportName)?.props ?? [],
    dependencies: (item.dependencies ?? []).map(npmName),
    registryDependencies: (item.registryDependencies ?? []).map(registryName).filter(name => byFile.has(name)),
    files,
  };
}

// Anything registry.json has that the README does not list goes into an "Other" group, so nothing is unreachable.
const listed = new Set(placement.keys());
const missing = Object.keys(items).filter(name => !listed.has(name));
if (missing.length) nav.push({ title: "Other", kind: "component", groups: [{ title: null, items: missing.map(name => ({ name, title: items[name].title, description: items[name].description })) }] });
for (const category of nav) for (const group of category.groups) group.items = group.items.filter(entry => items[entry.name]);

const foundation = await readFile(at("registry/foundation.css"), "utf8");

await mkdir(out, { recursive: true });
await writeFile(path.join(out, "catalog.json"), JSON.stringify({ nav, items, foundation }, null, 0));

// ─── Demo index ─────────────────────────────────────────────────────────────

const demoFiles = (await readdir(at("site/demos"))).filter(file => /^[a-z0-9-]+\.tsx$/.test(file)).map(file => file.replace(/\.tsx$/, "")).sort();
await writeFile(path.join(out, "demos.ts"), `// Generated by site/scripts/extract.mjs. Do not edit.\nimport type { Demo } from "../lib/demo";\n\nexport const demos: Record<string, () => Promise<{ default: Demo<any> }>> = {\n${demoFiles.map(name => `  ${JSON.stringify(name)}: () => import("../demos/${name}"),`).join("\n")}\n};\n`);

const withoutDemo = Object.keys(items).filter(name => !demoFiles.includes(name));
console.log(`catalog: ${Object.keys(items).length} items, ${nav.reduce((n, c) => n + c.groups.length, 0)} groups; demos: ${demoFiles.length}${withoutDemo.length ? `; no demo yet: ${withoutDemo.length}` : ""}`);
