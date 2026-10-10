import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** A static export: every page is prerendered into site/out, so any static host can serve it. */
const config = {
  output: "export",
  turbopack: { root },
  outputFileTracingRoot: root,
  images: { unoptimized: true },
  devIndicators: false,
};

export default config;
