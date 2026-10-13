/**
 * CI: runs the consistency check on every experimental component (docs/new-components.md). Fails if any fails.
 *
 * A whole experimental component is judged in full. A stable component with experimental parts (a variant) is judged
 * on its changes only, against the pull request's base branch (GITHUB_BASE_REF in CI, or --base <ref> locally), so
 * its older code does not fail the change. Without a base, it is judged in full.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const registry = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8"));
const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : null;
const items = registry.items.filter(item => item.meta?.status === "experimental" || item.meta?.experimental?.length);
const names = items.map(item => item.name);
let failed = 0;
for (const name of names) {
  const item = items.find(entry => entry.name === name);
  const variant = item.meta?.status !== "experimental" && base;
  try { execFileSync(process.execPath, [new URL("./check-component.mjs", import.meta.url).pathname, name, ...(variant ? ["--base", base] : [])], { stdio: "inherit" }); }
  catch { failed++; }
}
console.log(names.length ? `${names.length - failed} of ${names.length} experimental components pass.` : "No experimental components.");
process.exitCode = failed ? 1 : 0;
