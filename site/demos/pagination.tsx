import { useState } from "react";

import { Pagination, type PaginationProps } from "@/registry/components/pagination/pagination";
import { defineDemo } from "../lib/demo";

const perPage = 20;
const total = 472;

function Paged({ pageCount, label }: { pageCount: number; label?: string }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={pageCount} label={label} onPageChange={setPage} />;
}

export default defineDemo<PaginationProps>({
  props: { pageCount: Math.ceil(total / perPage), label: "Invoice pages" },
  hideControls: ["page"],
  Preview: ({ props }) => {
    const [page, setPage] = useState(3);
    const first = (page - 1) * perPage + 1;
    return <div style={{ display: "grid", gap: 14, justifyItems: "center" }}>
      <Pagination {...props} page={page} onPageChange={next => { setPage(next); props.onPageChange?.(next); }} />
      <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Showing invoices {first}–{Math.min(page * perPage, total)} of {total}</span>
    </div>;
  },
  examples: [
    {
      title: "Few pages",
      description: "With five pages or fewer every page shows and the window never moves.",
      render: () => <Paged pageCount={3} label="Ticket pages" />,
    },
  ],
  usage: `const [page, setPage] = useState(1);

<Pagination page={page} pageCount={24} onPageChange={setPage} />`,
});
