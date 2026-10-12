/** CI: runs the consistency check on every experimental component (docs/new-components.md). Fails if any fails. */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const registry = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8"));
const names = registry.items.filter(item => item.meta?.status === "experimental").map(item => item.name);
let failed = 0;
for (const name of names) {
  try { execFileSync(process.execPath, [new URL("./check-component.mjs", import.meta.url).pathname, name], { stdio: "inherit" }); }
  catch { failed++; }
}
console.log(names.length ? `${names.length - failed} of ${names.length} experimental components pass.` : "No experimental components.");
process.exitCode = failed ? 1 : 0;
