import TreeView, { type TreeNode, type TreeViewProps } from "@/registry/components/tree-view/tree-view";
import { defineDemo } from "../lib/demo";

const nodes: TreeNode[] = [
  {
    id: "app",
    label: "app",
    children: [
      { id: "app/layout", label: "layout.tsx" },
      { id: "app/page", label: "page.tsx" },
      {
        id: "app/silicons",
        label: "silicons",
        children: [
          { id: "app/silicons/page", label: "page.tsx" },
          { id: "app/silicons/deploy", label: "deploy-form.tsx" },
          { id: "app/silicons/styles", label: "silicons.module.css" },
        ],
      },
    ],
  },
  {
    id: "lib",
    label: "lib",
    children: [
      { id: "lib/billing", label: "billing.ts" },
      { id: "lib/usage", label: "usage.ts" },
    ],
  },
  { id: "config", label: "silicon.config.json" },
  { id: "readme", label: "README.md" },
];

export default defineDemo<TreeViewProps>({
  props: { nodes, defaultExpandedIds: ["app", "app/silicons"], "aria-label": "Project files" },
  hideControls: ["nodes", "expandedIds", "defaultExpandedIds"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 320px)" }}><TreeView {...props} /></div>,
  stage: { minHeight: 440 },
  examples: [
    {
      title: "Org chart",
      description: "Any hierarchy works; pass your own icon per node.",
      render: () => <div style={{ width: "min(100%, 320px)" }}>
        <TreeView
          aria-label="Departments"
          defaultExpandedIds={["ops"]}
          nodes={[
            { id: "ops", label: "Operations", children: [{ id: "ops-1", label: "Vendor onboarding" }, { id: "ops-2", label: "Procurement" }] },
            { id: "fin", label: "Finance", children: [{ id: "fin-1", label: "Invoice reconciler" }, { id: "fin-2", label: "Expense review" }] },
            { id: "cs", label: "Customer success", children: [{ id: "cs-1", label: "Support desk" }] },
          ]}
        />
      </div>,
    },
  ],
  usage: `<TreeView
  aria-label="Project files"
  defaultExpandedIds={["app"]}
  onSelect={node => openFile(node.id)}
  nodes={[
    { id: "app", label: "app", children: [
      { id: "app/page", label: "page.tsx" },
    ] },
    { id: "readme", label: "README.md" },
  ]}
/>`,
});
