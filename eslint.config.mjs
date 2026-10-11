import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The registry itself has no pages; only the docs site in site/ does, and it routes with its own app directory.
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
  globalIgnores(["node_modules/**", "public/**", "site/.next/**", "site/out/**", "site/generated/**", "site/next-env.d.ts", "dist/**"]),
]);
