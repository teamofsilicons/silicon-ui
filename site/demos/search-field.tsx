import { useState } from "react";

import { SearchField, type SearchFieldProps } from "@/registry/components/search-field/search-field";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;
const tickets = ["Refund for invoice INV-2041", "Reset SSO for the Finance team", "Silicon paused after usage cap", "Add Slack channel to Support silicon", "Export March usage report"];

function FilteredList() {
  const [query, setQuery] = useState("");
  const shown = tickets.filter(ticket => ticket.toLowerCase().includes(query.trim().toLowerCase()));
  return <div style={{ ...field, display: "grid", gap: 12 }}>
    <SearchField label="Search tickets" placeholder="Search by title" value={query} onValueChange={setQuery} />
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}>
      {shown.length ? shown.map(ticket => <li key={ticket}>{ticket}</li>) : <li style={{ color: "var(--text-muted)" }}>No tickets match.</li>}
    </ul>
  </div>;
}

export default defineDemo<SearchFieldProps>({
  props: { label: "Search silicons", placeholder: "Name, team or skill" },
  hideControls: ["value"],
  Preview: ({ props }) => {
    const [value, setValue] = useState("");
    return <div style={field}><SearchField {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} /></div>;
  },
  examples: [
    { title: "Filtering a list", description: "The clear button appears once there is a query.", render: () => <FilteredList /> },
  ],
  usage: `const [query, setQuery] = useState("");

<SearchField label="Search silicons" value={query} onValueChange={setQuery} />`,
});
