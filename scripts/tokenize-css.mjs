/**
 * Rewrites raw spacing, radius and font-size values in CSS modules to Silicon tokens, so the library passes its own
 * `silicon-ui-check`. Also the way to bring code from Arc (or anywhere) onto the scales.
 *
 *   node scripts/tokenize-css.mjs [--dry] file.css …     (default: every registry component and block)
 *
 * Rules (the same as the token rules in docs/rules.md):
 * - a value on a scale becomes its token (8px → var(--space-related)): no visual change;
 * - a value between steps snaps to the nearest step, a tie to the larger one (6px → var(--space-related));
 * - negative space becomes calc(var(--space-…) * -1); space above the scale is a sum of tokens;
 * - rem converts at 16px; 0, 1px hairlines, em, %, viewport units and anything inside var() are left alone;
 * - custom property definitions, @keyframes and the visually hidden block are left alone (the checker skips them too).
 * Colours are not touched: they need a role, so they are tokenised by hand.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const SPACE = [["hair", 2], ["tight", 4], ["related", 8], ["group", 12], ["inset", 16], ["comfort", 20], ["section", 24], ["block", 32], ["page", 48], ["stage", 64], ["screen", 80]];
const RADIUS = [["detail", 2], ["control", 6], ["container", 8], ["overlay", 12]];
const TEXT = [["xs", 12], ["sm", 14], ["base", 16], ["lg", 18], ["xl", 22], ["2xl", 28], ["3xl", 36], ["4xl", 52], ["5xl", 72]];

const SPACING = /^(?:padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left)(?:-[a-z-]+)?$|^scroll-(?:margin|padding)(?:-[a-z-]+)?$/;
const RADIUS_PROP = /^border(?:-[a-z]+(?:-[a-z]+)?)?-radius$/;
const HIDDEN = /\.(?:srOnly|visuallyHidden|sr-only|visually-hidden)\b/;

/** The nearest step; a tie goes to the larger step. */
function nearest(scale, px) {
  let best = scale[0];
  for (const step of scale) {
    const d = Math.abs(step[1] - px), bd = Math.abs(best[1] - px);
    if (d < bd || (d === bd && step[1] > best[1])) best = step;
  }
  return best;
}

function spaceToken(px) {
  if (px <= 80 + 8) return `var(--space-${nearest(SPACE, px)[0]})`;
  // Above the scale: screen-sized steps plus the nearest remainder.
  const parts = [];
  let left = px;
  while (left > 88) { parts.push("var(--space-screen)"); left -= 80; }
  if (left >= 2) parts.push(`var(--space-${nearest(SPACE, left)[0]})`);
  return parts.length === 1 ? parts[0] : `calc(${parts.join(" + ")})`;
}

function radiusToken(px) {
  if (px >= 100) return "var(--radius-full)";
  return `var(--radius-${nearest(RADIUS, px)[0]})`;
}

function textToken(px) {
  return `var(--text-${nearest(TEXT, px)[0]})`;
}

/** Hides var(...) groups (nested parentheses included) so their contents are never rewritten. */
function protectVars(value) {
  const kept = [];
  let out = "";
  for (let i = 0; i < value.length; i++) {
    if (value.startsWith("var(", i)) {
      let depth = 0, j = i;
      for (; j < value.length; j++) {
        if (value[j] === "(") depth++;
        else if (value[j] === ")" && --depth === 0) break;
      }
      kept.push(value.slice(i, j + 1));
      out += `\u0000${kept.length - 1}\u0000`;
      i = j;
    } else out += value[i];
  }
  return { out, restore: text => text.replace(/\u0000(\d+)\u0000/g, (_, n) => kept[Number(n)]) };
}

function rewriteValue(property, value) {
  const kind = SPACING.test(property) ? "space" : RADIUS_PROP.test(property) ? "radius" : property === "font-size" ? "text" : null;
  if (!kind) return value;
  const { out, restore } = protectVars(value);
  const rewritten = out.replace(/(^|[\s,(/*+])(-?)((?:\d*\.)?\d+)(px|rem)\b/g, (whole, lead, sign, number, unit, offset) => {
    const px = Number(number) * (unit === "rem" ? 16 : 1);
    if (px === 0) return whole;
    if (kind === "space" && unit === "px" && px === 1) return whole;
    // Inside calc() a radius minus a length is an inset (an inner corner): it reads the space scale.
    const insideCalcOperand = /[-+]\s*$/.test(out.slice(0, offset + lead.length));
    const token = kind === "space" || (kind === "radius" && insideCalcOperand) ? spaceToken(px) : kind === "radius" ? radiusToken(px) : textToken(px);
    if (!sign) return `${lead}${token}`;
    return `${lead}calc(${token} * -1)`;
  });
  return restore(rewritten);
}

export function tokenizeCss(css) {
  let changed = 0;
  // Walk rule blocks so selectors and @keyframes are known for each declaration.
  const stack = [];
  let result = "", start = 0;
  const flush = end => {
    const chunk = css.slice(start, end);
    const inKeyframes = stack.some(prelude => /^@(-\w+-)?keyframes\b/.test(prelude));
    const hidden = stack.length && HIDDEN.test(stack[stack.length - 1]);
    // A comment above a declaration is part of its chunk: blank it out (same length) to find the property.
    const plain = chunk.replace(/\/\*[\s\S]*?\*\//g, comment => " ".repeat(comment.length));
    const colon = plain.indexOf(":");
    if (stack.length && !inKeyframes && !hidden && colon > 0 && !/[{}]/.test(plain)) {
      const property = plain.slice(0, colon).trim().toLowerCase();
      if (/^[a-z-]+$/.test(property) && !property.startsWith("--")) {
        const value = chunk.slice(colon + 1);
        const next = rewriteValue(property, value);
        if (next !== value) { changed++; result += chunk.slice(0, colon + 1) + next; return; }
      }
    }
    result += chunk;
  };
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "/" && css[i + 1] === "*") { const end = css.indexOf("*/", i + 2); i = end < 0 ? css.length : end + 1; continue; }
    if (c === "{") { stack.push(css.slice(start, i).replace(/\/\*[\s\S]*?\*\//g, "").trim()); result += css.slice(start, i + 1); start = i + 1; }
    else if (c === ";" || c === "}") { flush(i); result += c; start = i + 1; if (c === "}") stack.pop(); }
  }
  result += css.slice(start);
  return { css: result, changed };
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const named = args.filter(arg => !arg.startsWith("--"));
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".module.css") ? [path.join(dir, e.name)] : []);
  const files = named.length ? named : [...walk(path.join(root, "registry", "components")), ...walk(path.join(root, "registry", "blocks"))];
  let total = 0, touched = 0;
  for (const file of files) {
    const { css, changed } = tokenizeCss(fs.readFileSync(file, "utf8"));
    if (!changed) continue;
    total += changed; touched++;
    if (!dry) fs.writeFileSync(file, css);
  }
  console.log(`${dry ? "Would rewrite" : "Rewrote"} ${total} declarations in ${touched} files.`);
}
