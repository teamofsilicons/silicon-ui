/** Copies the prebuilt shadcn registry (public/r) into the static export, so the deployed site also serves /r/<item>.json. */
import { cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
await cp(path.join(root, "public/r"), path.join(root, "site/out/r"), { recursive: true });
await cp(path.join(root, "registry.json"), path.join(root, "site/out/registry.json"));
console.log("Copied public/r and registry.json into site/out");
