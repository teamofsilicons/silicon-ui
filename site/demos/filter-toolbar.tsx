import { useState } from "react";
import { Building2, CircleDot, User } from "lucide-react";

import FilterToolbar, { type FilterChip, type FilterField, type FilterToolbarProps } from "@/registry/components/filter-toolbar/filter-toolbar";
import { people } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const fields: FilterField[] = [
  { id: "status", label: "Status", icon: <CircleDot size={16} />, options: [{ value: "Open", hint: 42 }, { value: "Escalated", hint: 7 }, { value: "Resolved", hint: 318 }] },
  { id: "department", label: "Department", icon: <Building2 size={16} />, options: ["Customer success", "Finance", "Operations", "Sales"] },
  { id: "assignee", label: "Assignee", icon: <User size={16} />, options: ["Support desk silicon", ...people.slice(0, 4).map(entry => entry.name)] },
];

const initial: FilterChip[] = [
  { id: "status", label: "Status", value: "Escalated" },
  { id: "department", label: "Department", value: "Finance" },
];

function AppliedOnly() {
  const [filters, setFilters] = useState<FilterChip[]>([{ id: "range", label: "Last 30 days" }, { id: "plan", label: "Plan", value: "Enterprise" }, { id: "region", label: "Region", value: "EU" }]);
  return <div style={{ width: "min(100%, 640px)" }}>
    <FilterToolbar filters={filters} onRemove={id => setFilters(current => current.filter(filter => filter.id !== id))} onClearAll={() => setFilters([])} />
  </div>;
}

export default defineDemo<FilterToolbarProps>({
  props: { label: "Ticket filters" },
  hideControls: ["filters"],
  Preview: ({ props }) => {
    const [filters, setFilters] = useState(initial);
    return <div style={{ width: "min(100%, 640px)" }}>
      <FilterToolbar
        {...props}
        filters={filters}
        onRemove={id => { setFilters(current => current.filter(filter => filter.id !== id)); props.onRemove?.(id); }}
        onClearAll={() => { setFilters([]); props.onClearAll?.(); }}
        addFilter={{
          fields,
          onAdd: (filter, field) => {
            setFilters(current => current.some(entry => entry.id === filter.id) ? current.map(entry => entry.id === filter.id ? filter : entry) : [...current, filter]);
            props.addFilter?.onAdd(filter, field);
          },
        }}
      />
    </div>;
  },
  stage: { layout: "fill", minHeight: 340 },
  examples: [
    {
      title: "Without a menu",
      description: "Leave out addFilter to show only the applied chips, for filters set elsewhere on the page.",
      render: () => <AppliedOnly />,
      stage: { layout: "fill" },
    },
  ],
  usage: `const [filters, setFilters] = useState<FilterChip[]>([]);

<FilterToolbar
  filters={filters}
  onRemove={id => setFilters(f => f.filter(x => x.id !== id))}
  onClearAll={() => setFilters([])}
  addFilter={{
    fields: [{ id: "status", label: "Status", options: ["Open", "Escalated", "Resolved"] }],
    onAdd: filter => setFilters(f => [...f.filter(x => x.id !== filter.id), filter]),
  }}
/>`,
});
