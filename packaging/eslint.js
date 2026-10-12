/**
 * ESLint rules that keep an app on Silicon UI: build with its components, never re-create or restyle them.
 *
 *   // eslint.config.mjs
 *   import siliconUi from "@teamofsilicons/silicon-ui/eslint";
 *   export default [...yourConfig, ...siliconUi()];
 *
 * Options:
 *   files     globs the rules apply to (default: every .tsx and .jsx file)
 *   allowExperimental   experimental components this app may import (each one is a deliberate, reviewable opt-in)
 *   ignores   globs they skip (for example a vendored exception)
 *   elements  override the element → component table below
 *
 * This config sets `no-restricted-syntax` and `no-restricted-imports`. ESLint replaces, not merges, a rule's options, so
 * if your own config also sets either rule, put this one last and move your entries into `extraSyntax` / `extraImports`.
 */

import fs from "node:fs";

/** Components still experimental in this release (components.json next to this file). */
function experimental() {
  try {
    const catalog = JSON.parse(fs.readFileSync(new URL("./components.json", import.meta.url), "utf8"));
    return catalog.filter(entry => entry.status === "experimental").map(entry => entry.name);
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
  const gated = experimental().filter(name => !allowExperimental.includes(name)).map(name => ({
    regex: `^@teamofsilicons/silicon-ui/${name}$`,
    message: `${name} is experimental: it may still change and is not for production. To try it, add "${name}" to siliconUi({ allowExperimental }) in your ESLint config.`,
  }));
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
        "no-restricted-syntax": ["error", ...syntax, ...extraSyntax],
        "no-restricted-imports": ["error", { patterns: [...IMPORTS, ...gated, ...extraImports] }],
      },
    },
  ];
}
