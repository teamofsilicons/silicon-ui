import data from "../generated/catalog.json";

export type ControlKind =
  | { kind: "boolean" }
  | { kind: "number" }
  | { kind: "string" }
  | { kind: "function" }
  | { kind: "enum"; options: string[]; numeric?: boolean };

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
  control: ControlKind | null;
}

export interface ApiPart {
  name: string;
  props: PropDoc[];
  extends: string | null;
}

export interface ItemFile {
  path: string;
  target: string;
  own: boolean;
  content: string;
}

export interface Item {
  name: string;
  title: string;
  description: string;
  kind: "component" | "block";
  tier: string;
  tags: string[];
  category: string;
  group: string | null;
  mainFile: string;
  importPath: string;
  exportName: string;
  isDefault: boolean;
  /** False when the component is only a default export, so it must be imported without braces. */
  hasNamedExport: boolean;
  parts: ApiPart[];
  props: PropDoc[];
  dependencies: string[];
  registryDependencies: string[];
  files: ItemFile[];
}

export interface NavEntry { name: string; title: string; description: string }
export interface NavGroup { title: string | null; items: NavEntry[] }
export interface NavCategory { title: string; kind: "component" | "block"; groups: NavGroup[] }

export interface Catalog {
  nav: NavCategory[];
  items: Record<string, Item>;
  foundation: string;
}

export const catalog = data as unknown as Catalog;

/** The shadcn registry namespace the install commands use. */
export const registryNamespace = "@silicon-ui";

export function related(item: Item): NavEntry[] {
  for (const category of catalog.nav) for (const group of category.groups) {
    if (group.items.some(entry => entry.name === item.name)) return group.items.filter(entry => entry.name !== item.name);
  }
  return [];
}

/** `import { Button } from "…"`, or a default import when the component has no named export. */
export function importLine(item: Pick<Item, "exportName" | "hasNamedExport" | "importPath">, names: string[] = [item.exportName]) {
  if (item.hasNamedExport) return `import { ${names.join(", ")} } from "${item.importPath}";`;
  const rest = names.filter(name => name !== item.exportName);
  return `import ${item.exportName}${rest.length ? `, { ${rest.join(", ")} }` : ""} from "${item.importPath}";`;
}
