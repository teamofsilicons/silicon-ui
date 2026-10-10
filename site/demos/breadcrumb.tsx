import { useState } from "react";

import { Breadcrumb, type BreadcrumbProps } from "@/registry/components/breadcrumb/breadcrumb";
import { Button } from "@/registry/components/button/button";
import { defineDemo } from "../lib/demo";

const path = ["Workspace", "Finance", "Invoices", "Q3 2026", "INV-2041"];

function FolderPath(props: Partial<BreadcrumbProps>) {
  const [depth, setDepth] = useState(4);
  const next = path[depth];
  return <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
    <Breadcrumb {...props} items={path.slice(0, depth).map((label, index) => ({ label, onClick: () => setDepth(index + 1) }))} />
    <Button variant="secondary" size="sm" disabled={!next} onClick={() => setDepth(depth + 1)}>{next ? `Open ${next}` : "Deepest level"}</Button>
  </div>;
}

export default defineDemo<BreadcrumbProps>({
  Preview: ({ props }) => <FolderPath ariaLabel={props.ariaLabel} />,
  examples: [
    {
      title: "Links",
      description: "Crumbs with an href render as links. The last crumb is the current page.",
      render: () => <Breadcrumb items={[{ label: "Silicons", href: "#silicons" }, { label: "Support", href: "#support" }, { label: "Ticket routing" }]} />,
    },
  ],
  usage: `const [depth, setDepth] = useState(3);
const path = ["Workspace", "Finance", "Invoices", "Q3 2026"];

<Breadcrumb
  items={path.slice(0, depth).map((label, index) => ({
    label,
    onClick: () => setDepth(index + 1),
  }))}
/>`,
});
