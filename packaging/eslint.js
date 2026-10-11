/**
 * ESLint rules that keep an app on Silicon UI: build with its components, never re-create or restyle them.
 *
 *   // eslint.config.mjs
 *   import siliconUi from "@teamofsilicons/silicon-ui/eslint";
 *   export default [...yourConfig, ...siliconUi()];
 *
 * Options:
 *   files     globs the rules apply to (default: every .tsx and .jsx file)
 *   ignores   globs they skip (for example a vendored exception)
 *   elements  override the element → component table below
 *
 * This config sets `no-restricted-syntax` and `no-restricted-imports`. ESLint replaces, not merges, a rule's options, so
 * if your own config also sets either rule, put this one last and move your entries into `extraSyntax` / `extraImports`.
 */

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

export default function siliconUi({ files = ["**/*.{tsx,jsx}"], ignores = [], elements = ELEMENTS, extraSyntax = [], extraImports = [] } = {}) {
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
        "no-restricted-imports": ["error", { patterns: [...IMPORTS, ...extraImports] }],
      },
    },
  ];
}
