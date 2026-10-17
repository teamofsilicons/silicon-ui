/**
 * ESLint rules that keep an app on Silicon UI: build with its components, never re-create or restyle them.
 *
 *   // eslint.config.mjs
 *   import siliconUi from "@teamofsilicons/silicon-ui/eslint";
 *   export default [...yourConfig, ...siliconUi()];
 *
 * Options:
 *   files     globs the rules apply to (default: every .tsx and .jsx file)
 *   allowExperimental   components whose experimental parts or prop values this app may use (a deliberate, reviewable opt-in)
 *   ignores   globs they skip (for example a vendored exception)
 *   elements  override the element → component table below
 *
 * This config sets `no-restricted-syntax` and `no-restricted-imports`. ESLint replaces, not merges, a rule's options, so
 * if your own config also sets either rule, put this one last and move your entries into `extraSyntax` / `extraImports`.
 */

import fs from "node:fs";

/** This release's catalog (components.json next to this file): which components, parts or prop values are experimental. */
function catalog() {
  try {
    return JSON.parse(fs.readFileSync(new URL("./components.json", import.meta.url), "utf8"));
  } catch {
    return [];
  }
}

/** Raw elements Silicon UI already has a component for. */
export const ELEMENTS = {
  button: "Use Button (actions) or ButtonLink (navigation) from @teamofsilicons/silicon-ui.",
  input: "Use Input, Checkbox, Switch, RadioGroup, Slider or another field from @teamofsilicons/silicon-ui.",
  select: "Use Select, Combobox or MorphSelect from @teamofsilicons/silicon-ui.",
  textarea: "Use Textarea from @teamofsilicons/silicon-ui.",
  dialog: "Use Dialog, Drawer or BottomSheet from @teamofsilicons/silicon-ui.",
};

const IMPORTS = [
  {
    regex: "^@teamofsilicons/silicon-ui/(?!styles\\.css$).*\\.css$",
    message: "Do not borrow a Silicon UI component's CSS. Render the component; if it lacks a variant, add it to the library.",
  },
  {
    regex: "(^|/)components/silicon-ui/(?!blocks/)",
    message: "Import components from @teamofsilicons/silicon-ui, not from a local copy. Never copy library code into the app.",
  },
];

export default function siliconUi({ files = ["**/*.{tsx,jsx}"], ignores = [], elements = ELEMENTS, extraSyntax = [], extraImports = [], allowExperimental = [] } = {}) {
  const entries = catalog().filter(entry => !allowExperimental.includes(entry.name));
  const optIn = name => `To try it, add "${name}" to siliconUi({ allowExperimental }) in your ESLint config.`;
  // A whole experimental component: any import of it.
  const gated = entries.filter(entry => entry.status === "experimental").map(entry => ({
    regex: `^@teamofsilicons/silicon-ui/${entry.name}$`,
    message: `${entry.name} is experimental: it may still change and is not for production. ${optIn(entry.name)}`,
  }));
  // Experimental parts of a stable component: only those named imports.
  const gatedParts = entries.filter(entry => entry.status !== "experimental" && entry.experimentalExports?.length).map(entry => ({
    name: `@teamofsilicons/silicon-ui/${entry.name}`,
    importNames: entry.experimentalExports,
    message: `These parts of ${entry.name} are experimental: they may still change and are not for production. ${optIn(entry.name)}`,
  }));
  // Experimental values of a stable component's prop, such as <Button size="xs">. The value "*" gates a new prop
  // whatever its value, such as <Breadcrumb maxItems={3}>.
  const gatedProps = entries.flatMap(entry => Object.entries(entry.experimentalProps ?? {}).flatMap(([component, props]) =>
    Object.entries(props).flatMap(([prop, values]) => values.map(value => ({
      selector: `JSXOpeningElement[name.name="${component}"] > JSXAttribute[name.name="${prop}"]${value === "*" ? "" : `[value.value="${value}"]`}`,
      message: `${component} ${value === "*" ? prop : `${prop}="${value}"`} is experimental: it may still change and is not for production. ${optIn(entry.name)}`,
    })))));
  const syntax = Object.entries(elements).map(([name, message]) => ({
    selector: `JSXOpeningElement[name.type="JSXIdentifier"][name.name="${name}"]`,
    message: `<${name}> is not allowed here. ${message}`,
  }));
  return [
    {
      name: "silicon-ui/components",
      files,
      ignores,
      rules: {
        "no-restricted-syntax": ["error", ...syntax, ...gatedProps, ...extraSyntax],
        "no-restricted-imports": ["error", { paths: gatedParts, patterns: [...IMPORTS, ...gated, ...extraImports] }],
      },
    },
  ];
}
