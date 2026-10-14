#!/usr/bin/env node
/**
 * silicon-ui-check: keeps an app's CSS on Silicon UI's tokens.
 *
 * Fails a CSS file that sets spacing, a corner radius, a colour, a font size or a stacking layer with a raw value
 * instead of a token:
 *
 *   spacing    padding, margin, gap, inset, top/right/bottom/left, scroll-margin/padding → var(--space-*)
 *   radius     border-radius and its corners                                           → var(--radius-*)
 *   color      hex, rgb(), hsl(), oklch(), oklab(), lab(), lch(), color()              → var(--…)
 *   font-size  px or rem                                                                → var(--text-*)
 *   z-index    10 and above (or -10 and below)                                          → var(--layer-*)
 *
 * Allowed everywhere: 0, auto, inherit and other keywords, anything inside var() (including fallbacks), and
 * font-relative or layout-relative units (em, %, ch, vw, vh, cq*). 1px and -1px are allowed in spacing: they are
 * hairline alignments against a border, not space. z-index from -9 to 9 is a local order inside a component. Mask properties are not colours (only their alpha is used). Custom property definitions (--x: …) are not
 * checked: tokens are defined that way, in the files you list under `ignore`. The visually hidden block (.srOnly,
 * .visuallyHidden, .sr-only) and @keyframes are skipped.
 *
 * Configure it in package.json:
 *
 *   "siliconUi": {
 *     "css": ["components/**\/*.module.css", "app/**\/*.module.css"],
 *     "ignore": ["styles/tokens.css"],
 *     "baseline": "silicon-ui-baseline.json"
 *   }
 *
 * Usage:
 *   silicon-ui-check                    check every configured file (fails only above the baseline)
 *   silicon-ui-check a.css b.css        check these files
 *   silicon-ui-check --update-baseline  record today's counts, so only new drift fails from now on
 *   silicon-ui-check --hook             Claude Code PostToolUse hook: checks the edited file (CSS, and ESLint for
 *                                       .ts/.tsx/.js/.jsx), exit 2 with the problems so the agent fixes them
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RULES = {
  spacing: /^(?:padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left)(?:-[a-z-]+)?$|^scroll-(?:margin|padding)(?:-[a-z-]+)?$/,
  radius: /^border(?:-[a-z]+(?:-[a-z]+)?)?-radius$/,
  "font-size": /^font-size$/,
};
const LENGTH = /(?<![\w.#-])(-?(?:\d*\.)?\d+)(px|rem)\b/g;
const COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/i;
const HIDDEN = /\.(?:srOnly|visuallyHidden|sr-only|visually-hidden)\b/;
const FIX = {
  spacing: "use a spacing token: var(--space-hair|tight|related|group|inset|comfort|section|block|page|stage|screen)",
  radius: "use a radius token: var(--radius-detail|control|container|overlay|full)",
  color: "use a colour token: var(--foreground), var(--text-secondary), var(--border), var(--accent) …",
  "font-size": "use a type token: var(--text-xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)",
  layer: "use a layer token: var(--layer-raised|sticky|overlay|dialog|popover|dropdown|toast|tooltip); -9 to 9 is fine for order inside a component",
};

/** Removes every var(...) (with nested parentheses), so tokens and their fallbacks are never flagged. */
function withoutVars(value) {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    if (value.startsWith("var(", i)) {
      let depth = 0;
      for (; i < value.length; i++) {
        if (value[i] === "(") depth++;
        else if (value[i] === ")" && --depth === 0) break;
      }
      out += "var()";
    } else out += value[i];
  }
  return out;
}

/** Declarations with their line, selector and whether they sit inside @keyframes. */
function declarations(css) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, match => match.replace(/[^\n]/g, " "));
  const found = [];
  const stack = [];
  let start = 0;
  const lineAt = index => source.slice(0, index).split("\n").length;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === "{") {
      stack.push(source.slice(start, i).trim());
      start = i + 1;
    } else if (char === "}" || char === ";") {
      const text = source.slice(start, i);
      const colon = text.indexOf(":");
      if (colon > 0 && stack.length && !/[{}]/.test(text)) {
        const property = text.slice(0, colon).trim().toLowerCase();
        const value = text.slice(colon + 1).trim();
        const offset = start + text.length - text.trimStart().length;
        if (/^[a-z-]+$/.test(property)) {
          found.push({ property, value, line: lineAt(offset), selector: stack[stack.length - 1], keyframes: stack.some(p => /^@(-\w+-)?keyframes\b/.test(p)) });
        }
      }
      if (char === "}") stack.pop();
      start = i + 1;
    }
  }
  return found;
}

export function checkCss(css) {
  const problems = [];
  for (const { property, value, line, selector, keyframes } of declarations(css)) {
    if (keyframes || property.startsWith("--") || HIDDEN.test(selector)) continue;
    const bare = withoutVars(value);
    for (const [rule, pattern] of Object.entries(RULES)) {
      if (!pattern.test(property)) continue;
      const hairline = match => rule === "spacing" && match[2] === "px" && Math.abs(Number(match[1])) === 1;
      const raw = [...bare.matchAll(LENGTH)].filter(match => Number(match[1]) !== 0 && !hairline(match)).map(match => match[0]);
      if (raw.length) problems.push({ rule, line, property, value, raw: raw.join(", ") });
    }
    if (property === "z-index") {
      const raw = [...bare.matchAll(/(?<![\w.-])-?\d+(?![\w.])/g)].map(match => match[0]).filter(number => Math.abs(Number(number)) >= 10);
      if (raw.length) problems.push({ rule: "layer", line, property, value, raw: raw.join(", ") });
    }
    const color = /^(?:-webkit-)?mask/.test(property) ? null : bare.match(COLOR);
    if (color) problems.push({ rule: "color", line, property, value, raw: color[0] });
  }
  return problems;
}

/* ---------------------------------------------------------------- files and config ------------------------------------------------------------- */

function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") { re += glob[i + 2] === "/" ? "(?:.*/)?" : ".*"; i += glob[i + 2] === "/" ? 2 : 1; }
      else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else if (c === "{") { const end = glob.indexOf("}", i); re += `(?:${glob.slice(i + 1, end).split(",").map(s => s.replace(/[.+^$()|[\]\\]/g, "\\$&")).join("|")})`; i = end; }
    else re += c.replace(/[.+^$()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}$`);
}
const matches = (file, globs) => globs.some(glob => globToRegExp(glob).test(file));

function walk(dir, root) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, root));
    else out.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return out;
}

function findProject(from) {
  for (let dir = path.resolve(from); ; dir = path.dirname(dir)) {
    const manifest = path.join(dir, "package.json");
    if (fs.existsSync(manifest)) {
      const config = JSON.parse(fs.readFileSync(manifest, "utf8")).siliconUi;
      if (config) return { root: dir, config: { css: ["**/*.module.css"], ignore: [], baseline: "silicon-ui-baseline.json", ...config } };
    }
    if (path.dirname(dir) === dir) return { root: path.resolve(from), config: { css: ["**/*.module.css"], ignore: [], baseline: "silicon-ui-baseline.json" } };
  }
}

const count = problems => problems.reduce((totals, { rule }) => ({ ...totals, [rule]: (totals[rule] ?? 0) + 1 }), {});
const readBaseline = file => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")).files ?? {} : {});

/** Problems in a file beyond what the baseline allows for it (all of them for a file the baseline does not list). */
function overBaseline(problems, allowed = {}) {
  const totals = count(problems);
  return Object.keys(totals).filter(rule => totals[rule] > (allowed[rule] ?? 0)).flatMap(rule => problems.filter(problem => problem.rule === rule));
}

function report(file, problems, allowed = {}) {
  const lines = [`${file}`];
  for (const { rule, line, property, raw } of [...problems].sort((x, y) => x.line - y.line)) lines.push(`  ${line}  ${rule}: ${property} uses ${raw}; ${FIX[rule]}`);
  const counted = count(problems);
  const listed = Object.keys(counted).filter(rule => allowed[rule] && counted[rule] > allowed[rule]).map(rule => `${rule} ${counted[rule]}, baseline ${allowed[rule]}`);
  if (listed.length) lines.push(`  (over the baseline: ${listed.join("; ")}. Older raw values are listed too; fix at least the new ones)`);
  return lines.join("\n");
}

/* ---------------------------------------------------------------- modes ------------------------------------------------------------------------ */

function runCli(args) {
  const { root, config } = findProject(process.cwd());
  const update = args.includes("--update-baseline");
  const named = args.filter(arg => !arg.startsWith("--"));
  const files = (named.length ? named.map(file => path.relative(root, path.resolve(file)).split(path.sep).join("/")) : walk(root, root).filter(file => matches(file, config.css)))
    .filter(file => !matches(file, config.ignore));
  const baselinePath = path.join(root, config.baseline);
  const baseline = readBaseline(baselinePath);

  if (update) {
    const next = {};
    for (const file of files) { const totals = count(checkCss(fs.readFileSync(path.join(root, file), "utf8"))); if (Object.keys(totals).length) next[file] = totals; }
    fs.writeFileSync(baselinePath, `${JSON.stringify({ note: "Raw values that predate the Silicon UI checks. Counts may only go down: fix a file, then run silicon-ui-check --update-baseline.", files: next }, null, 2)}\n`);
    const total = Object.values(next).reduce((sum, totals) => sum + Object.values(totals).reduce((a, b) => a + b, 0), 0);
    console.log(`silicon-ui-check: baseline written to ${config.baseline}: ${total} raw values in ${Object.keys(next).length} files.`);
    return 0;
  }

  let failed = 0, legacy = 0;
  for (const file of files) {
    const problems = checkCss(fs.readFileSync(path.join(root, file), "utf8"));
    const over = overBaseline(problems, baseline[file]);
    legacy += problems.length - over.length;
    if (over.length) { failed++; console.error(report(file, problems.length > over.length ? problems : over, baseline[file])); }
  }
  if (failed) {
    console.error(`\nsilicon-ui-check: ${failed} file${failed === 1 ? " uses" : "s use"} raw values where Silicon UI has tokens.`);
    return 1;
  }
  console.log(`silicon-ui-check: ${files.length} files on tokens${legacy ? ` (${legacy} older raw values tolerated by the baseline; it only goes down)` : ""}.`);
  return 0;
}

function runHook() {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch { return 0; }
  const target = input.tool_input?.file_path ?? input.tool_input?.path;
  if (!target || !fs.existsSync(target)) return 0;
  const { root, config } = findProject(path.dirname(target));
  const file = path.relative(root, path.resolve(target)).split(path.sep).join("/");
  const messages = [];

  if (/\.css$/.test(file) && matches(file, config.css) && !matches(file, config.ignore)) {
    const problems = checkCss(fs.readFileSync(target, "utf8"));
    const allowed = readBaseline(path.join(root, config.baseline))[file];
    if (overBaseline(problems, allowed).length) messages.push(report(file, problems, allowed));
  }
  if (/\.(?:[cm]?[jt]sx?)$/.test(file)) {
    const eslint = path.join(root, "node_modules", ".bin", "eslint");
    if (fs.existsSync(eslint)) {
      const result = spawnSync(eslint, ["--no-warn-ignored", "--max-warnings=0", file], { cwd: root, encoding: "utf8" });
      if (result.status) messages.push((result.stdout || result.stderr).trim());
    }
  }
  if (!messages.length) return 0;
  console.error(`Silicon UI check failed for ${file}. Fix these before moving on (docs: https://github.com/teamofsilicons/silicon-ui/tree/main/docs):\n\n${messages.join("\n\n")}`);
  return 2;
}

// Run as a command (directly or through node_modules/.bin), not when imported.
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  process.exitCode = args.includes("--hook") ? runHook() : runCli(args);
}
