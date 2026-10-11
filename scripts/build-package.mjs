/**
 * Builds the silicon-ui npm package into dist/package.
 *
 * Components ship as compiled ESM with their CSS modules alongside, so the app's bundler (Next.js, Vite) scopes the
 * classes and only loads the CSS of components the app uses. foundation.css ships as silicon-ui/styles.css.
 *
 *   node scripts/build-package.mjs        build
 *   cd dist/package && npm publish        publish
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const stage = path.join(root, "dist", "stage");
const out = path.join(root, "dist", "package");

fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });

// 1. Stage the sources: components, the shared lib, and the motion tokens the lib re-exports.
fs.cpSync(path.join(root, "registry", "components"), path.join(stage, "components"), { recursive: true });
fs.mkdirSync(path.join(stage, "lib"));
for (const file of fs.readdirSync(path.join(root, "lib"))) {
  if (file === "motion-tokens.ts") continue;
  fs.copyFileSync(path.join(root, "lib", file), path.join(stage, "lib", file));
}
fs.copyFileSync(path.join(root, "registry", "motion-tokens.ts"), path.join(stage, "lib", "motion-tokens.ts"));

// 2. Rewrite the repo's @/ aliases to relative paths, and give relative imports a .js extension so the output is
//    valid ESM for Node and for bundlers that require fully specified paths in node_modules.
const aliasTargets = [
  [/^@\/lib\/(.+)$/, (m) => path.join(stage, "lib", m[1])],
  [/^@\/registry\/motion-tokens$/, () => path.join(stage, "lib", "motion-tokens")],
  [/^@\/registry\/components\/(.+)$/, (m) => path.join(stage, "components", m[1])],
];

function rewrite(file) {
  const source = fs.readFileSync(file, "utf8");
  // Only statements at the start of a line, so import paths quoted in comments are left alone.
  const next = source.replace(/^((?:import|export)\b[^;"']*?(?:from\s*)?)(["'])([^"']+)\2/gm, (whole, lead, quote, spec) => {
    let target = spec;
    for (const [pattern, resolve] of aliasTargets) {
      const match = spec.match(pattern);
      if (match) {
        target = path.relative(path.dirname(file), resolve(match)).split(path.sep).join("/");
        if (!target.startsWith(".")) target = `./${target}`;
        break;
      }
    }
    if (target.startsWith("@/")) throw new Error(`${path.relative(stage, file)}: unmapped alias ${spec}`);
    if (target.startsWith(".") && !/\.(css|js|json)$/.test(target)) target += ".js";
    return `${lead}${quote}${target}${quote}`;
  });
  fs.writeFileSync(file, next);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const sources = walk(stage).filter((file) => /\.tsx?$/.test(file));
sources.forEach(rewrite);

fs.writeFileSync(path.join(stage, "css-modules.d.ts"), 'declare module "*.module.css" {\n  const classes: { readonly [key: string]: string };\n  export default classes;\n}\n');
fs.writeFileSync(path.join(stage, "tsconfig.json"), JSON.stringify({
  compilerOptions: {
    target: "ES2020",
    lib: ["dom", "dom.iterable", "esnext"],
    module: "esnext",
    moduleResolution: "bundler",
    jsx: "react-jsx",
    strict: true,
    skipLibCheck: true,
    declaration: true,
    esModuleInterop: true,
    isolatedModules: true,
    verbatimModuleSyntax: true,
    outDir: out,
    rootDir: stage,
  },
  include: ["**/*.ts", "**/*.tsx"],
}, null, 2));

// 3. Compile. tsc keeps "use client" at the top of each module, which React Server Components need.
execFileSync(path.join(root, "node_modules", ".bin", "tsc"), ["-p", path.join(stage, "tsconfig.json")], { stdio: "inherit" });
fs.rmSync(path.join(out, "css-modules.d.ts"), { force: true });

// 4. CSS: each component's module next to its compiled file, and the foundation as styles.css. The empty
//    declaration lets TypeScript accept `import "silicon-ui/styles.css"` in apps without a CSS declaration.
for (const file of walk(path.join(stage, "components")).filter((f) => f.endsWith(".css"))) {
  fs.copyFileSync(file, path.join(out, path.relative(stage, file)));
}
fs.copyFileSync(path.join(root, "registry", "foundation.css"), path.join(out, "styles.css"));
fs.writeFileSync(path.join(out, "styles.css.d.ts"), "export {};\n");

// 5. A catalog of every component and what it exports, for people and for AI agents building screens.
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"));
const described = new Map(registry.items.map((item) => [item.name, item]));
const catalog = fs.readdirSync(path.join(root, "registry", "components")).sort().map((name) => {
  const source = fs.readFileSync(path.join(root, "registry", "components", name, `${name}.tsx`), "utf8");
  const exports = [...source.matchAll(/^export\s+(?:declare\s+)?(?:function|const|class|interface|type|enum)\s+(\w+)/gm)].map((m) => m[1]);
  for (const m of source.matchAll(/^export\s*\{([^}]+)\}/gm)) exports.push(...m[1].split(",").map((s) => s.trim().split(/\s+as\s+/).pop()).filter(Boolean));
  const item = described.get(name);
  return { name, import: `silicon-ui/${name}`, title: item?.title ?? name, description: item?.description ?? "", exports };
});
fs.writeFileSync(path.join(out, "components.json"), `${JSON.stringify(catalog, null, 2)}\n`);

// 6. Manifest, licence and readme.
const manifest = JSON.parse(fs.readFileSync(path.join(root, "packaging", "package.json"), "utf8"));
fs.writeFileSync(path.join(out, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.copyFileSync(path.join(root, "LICENSE"), path.join(out, "LICENSE"));
fs.copyFileSync(path.join(root, "packaging", "README.md"), path.join(out, "README.md"));

fs.rmSync(stage, { recursive: true, force: true });
console.log(`Built silicon-ui@${manifest.version}: ${catalog.length} components in ${path.relative(root, out)}`);
