/**
 * CI: runs the consistency check on every experimental component (docs/new-components.md). Fails if any fails.
 *
 * A whole experimental component is judged in full. A stable component with experimental parts (a variant) is judged
 * on its changes only, so its older code does not fail the change: against CHECK_BASE in CI (the pull request's base
 * commit, or the commit before a push), or --base <ref> locally. Without a base, it is judged in full.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const registry = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8"));
const args = process.argv.slice(2);
// A push that creates a branch has no "before" commit (all zeros): judge in full.
const fromEnv = process.env.CHECK_BASE && !/^0+$/.test(process.env.CHECK_BASE) ? process.env.CHECK_BASE : null;
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : fromEnv;
const items = registry.items.filter(item => item.meta?.status === "experimental" || item.meta?.experimental?.length || Object.keys(item.meta?.experimentalProps ?? {}).length);
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
