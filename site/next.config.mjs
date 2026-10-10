import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Demo photos and logos are not part of this repository; uiarc.dev serves them. vercel.json proxies the same paths in production.
const media = [
  { source: "/media/:path*", destination: "https://uiarc.dev/media/:path*" },
  { source: "/block-logos/:path*", destination: "https://uiarc.dev/block-logos/:path*" },
];

/** A static export: every page is prerendered into site/out, so any static host can serve it. */
const config = {
  output: "export",
  turbopack: { root },
  outputFileTracingRoot: root,
  images: { unoptimized: true },
  devIndicators: false,
  ...(process.env.NODE_ENV === "development" ? { rewrites: async () => media } : {}),
};

export default config;
