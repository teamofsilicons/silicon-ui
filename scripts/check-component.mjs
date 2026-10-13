/**
 * The consistency check for a new component or variant (docs/new-components.md, section 3).
 *
 *   npm run check:component -- <name> [--storybook http://localhost:6006] [--base main]
 *
 * --base <git ref>: for a variant of an existing component, judge only the lines added since that ref (older code
 * keeps its debt; the change may not add to it). Without it, the whole component is judged, as for a new one.
 * Writes stories/reports/<name>.json (shown as the component's "Consistency" story in Storybook) and
 * stories/reports/<name>.md, and exits 1 when a required check fails. Warnings are listed for the reviewer.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { checkCss } from "../packaging/check.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const name = args.find(arg => !arg.startsWith("--"));
const storybookAt = args.includes("--storybook") ? args[args.indexOf("--storybook") + 1] : null;
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : null;
/** Line numbers added since `base` in a file (null when judging everything). */
function addedLines(file) {
  if (!base) return null;
  let diff = "";
  try { diff = execFileSync("git", ["diff", "-U0", base, "--", file], { cwd: root, encoding: "utf8" }); } catch { return new Set(); }
  const lines = new Set();
  for (const match of diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(match[1]), count = match[2] === undefined ? 1 : Number(match[2]);
    for (let i = 0; i < count; i++) lines.add(start + i);
  }
  return lines;
}
const onlyAdded = (file, text) => {
  const lines = addedLines(file);
  return lines ? text.split("\n").filter((_, index) => lines.has(index + 1)).join("\n") : text;
};
if (!name) { console.error("Usage: npm run check:component -- <name> [--storybook <url>]"); process.exit(2); }

const registry = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"));
const item = registry.items.find(entry => entry.name === name);
const dir = ["components", "blocks"].map(kind => path.join(root, "registry", kind, name)).find(candidate => fs.existsSync(candidate));
const read = file => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const tsxFiles = dir ? fs.readdirSync(dir).filter(file => file.endsWith(".tsx")).map(file => path.join(dir, file)) : [];
const cssFiles = dir ? fs.readdirSync(dir).filter(file => file.endsWith(".module.css")).map(file => path.join(dir, file)) : [];
const tsx = tsxFiles.map(file => onlyAdded(file, read(file))).join("\n");
const css = cssFiles.map(file => onlyAdded(file, read(file))).join("\n");
const fullTsx = tsxFiles.map(read).join("\n");
const fullCss = cssFiles.map(read).join("\n");

const checks = [];
const add = (id, title, required, ok, detail = []) => checks.push({ id, title, required, ok, detail });

// Tokens only.
const tokenProblems = cssFiles.flatMap(file => {
  const lines = addedLines(file);
  return checkCss(read(file)).filter(p => !lines || lines.has(p.line)).map(p => `${path.basename(file)}:${p.line} ${p.property} uses ${p.raw}`);
});
add("tokens", "Spacing, radius, colour and type use tokens", true, tokenProblems.length === 0, tokenProblems);

// Motion from tokens: CSS durations and easings, and Motion values in TSX.
const cssMotion = [...css.matchAll(/(?:transition|animation)(?:-duration|-timing-function)?\s*:\s*([^;}]+)/g)]
  .map(match => match[1])
  .filter(value => !/^\s*none\s*$/.test(value))
  .flatMap(value => [...value.replace(/var\([^)]*\)/g, "").matchAll(/(?<![\w.-])((?:\d*\.)?\d+m?s)\b|cubic-bezier\([^)]*\)|\b(?:ease|ease-in|ease-out|ease-in-out)\b/g)].map(m => m[0]))
  .filter(token => !/^0m?s$/.test(token) && !/^\.01ms$/.test(token));
const tsMotion = [...tsx.matchAll(/\b(duration|delay)\s*:\s*((?:\d*\.)?\d+)\b|\bease\s*:\s*\[\s*[\d.]/g)]
  .map(match => match[0]).filter(text => !/:\s*0\b/.test(text));
add("motion", "Motion uses --duration-*, --ease-* and motionTokens", true, cssMotion.length + tsMotion.length === 0, [...new Set([...cssMotion, ...tsMotion])].map(value => `raw value: ${value}`));

// Reduced motion, when anything moves.
const moves = /\b(transition|animation)\s*:/.test(fullCss) || /from "motion\/react"/.test(fullTsx);
const reduced = /prefers-reduced-motion/.test(fullCss) || /useReducedMotion/.test(fullTsx);
add("reduced-motion", "Respects reduced motion", true, !moves || reduced, moves && !reduced ? ["It animates but has no prefers-reduced-motion rule or useReducedMotion()."] : []);

// Built from the library (a warning: some primitives legitimately need raw elements).
const raw = [...tsx.matchAll(/<(button|input|select|textarea|dialog)\b/g)].map(match => `<${match[1]}>`);
add("composition", "Built from Silicon UI components where they exist", false, raw.length === 0, raw.length ? [`Raw ${[...new Set(raw)].join(", ")} (${raw.length}). Reviewer: is a Silicon UI component the better choice here?`] : []);

// Registered, demoed, in the changelog.
const registered = !!item && !!item.title && !!item.description && !!item.categories?.length && !!item.meta?.status;
add("registry", "Registered with title, description, category and status", true, registered, item ? (item.meta?.status ? [] : ['Add "status": "experimental" under meta.']) : ["No registry.json entry."]);
add("demo", "Has a demo (and so a Storybook story)", true, fs.existsSync(path.join(root, "site", "demos", `${name}.tsx`)), []);
const changelog = read(path.join(root, "CHANGELOG.md"));
const mentioned = item ? changelog.includes(item.title) || changelog.includes(`/${name})`) || changelog.includes(`\`${name}\``) : false;
add("changelog", "Named in CHANGELOG.md", true, mentioned, mentioned ? [] : [`Add a line naming ${item?.title ?? name}.`]);

// Props documented (exported Props interfaces in the main file).
const undocumented = [];
for (const file of tsxFiles) {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  source.forEachChild(node => {
    if (!ts.isInterfaceDeclaration(node) || !/Props$/.test(node.name.text) || !node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) return;
    for (const member of node.members) if (ts.isPropertySignature(member) && !ts.getJSDocCommentsAndTags(member).length) undocumented.push(`${node.name.text}.${member.name.getText(source)}`);
  });
}
add("docs", "Every prop has a doc comment", false, undocumented.length === 0, undocumented.length ? [`Undocumented: ${undocumented.join(", ")}`] : []);

// Renders, through Storybook.
if (storybookAt) {
  let playwright;
  try { playwright = await import("@playwright/test"); } catch { playwright = null; }
  if (!playwright) add("renders", "Its stories render without errors", true, false, ["Install @playwright/test (npm i -D @playwright/test && npx playwright install chromium)."]);
  else {
    const index = await (await fetch(`${storybookAt}/index.json`)).json();
    const ids = Object.values(index.entries).filter(entry => entry.type === "story" && entry.importPath.endsWith(`/${name}.stories.tsx`)).map(entry => entry.id);
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    const problems = [];
    for (const id of ids) {
      const errors = [];
      const onError = error => errors.push(error.message.split("\n")[0]);
      const onConsole = message => { if (message.type() === "error" && !/Failed to load resource/.test(message.text())) errors.push(message.text().split("\n")[0]); };
      page.on("pageerror", onError); page.on("console", onConsole);
      await page.goto(`${storybookAt}/iframe.html?id=${id}&viewMode=story`, { waitUntil: "load" });
      await page.waitForTimeout(800);
      page.off("pageerror", onError); page.off("console", onConsole);
      if (errors.length) problems.push(`${id}: ${[...new Set(errors)].join(" | ")}`);
    }
    await browser.close();
    add("renders", `Its ${ids.length} stories render without errors`, true, ids.length > 0 && problems.length === 0, ids.length ? problems : ["No stories found: run npm run build:stories."]);
  }
}

const failed = checks.filter(check => check.required && !check.ok);
const report = { name, title: item?.title ?? name, status: item?.meta?.status ?? "unregistered", checkedAt: new Date().toISOString(), scope: base ? `changes since ${base}` : "whole component", passed: failed.length === 0, checks };
const reports = path.join(root, "stories", "reports");
fs.mkdirSync(reports, { recursive: true });
fs.writeFileSync(path.join(reports, `${name}.json`), `${JSON.stringify(report, null, 2)}\n`);
const md = [
  `# Consistency report: ${report.title}`,
  "",
  `${report.passed ? "Passed" : "Failed"} · status ${report.status} · ${report.scope} · ${report.checkedAt.slice(0, 10)}`,
  "",
  ...checks.map(check => `- ${check.ok ? "✓" : check.required ? "✗" : "!"} ${check.title}${check.required ? "" : " (warning)"}${check.detail.length ? `\n${check.detail.map(line => `  - ${line}`).join("\n")}` : ""}`),
  "",
];
fs.writeFileSync(path.join(reports, `${name}.md`), md.join("\n"));
console.log(md.join("\n"));
process.exitCode = failed.length ? 1 : 0;
