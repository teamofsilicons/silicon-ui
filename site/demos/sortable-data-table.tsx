import { Avatar } from "@/registry/components/avatar/avatar";
import { Badge, type BadgeTone } from "@/registry/components/badge/badge";
import SortableDataTable, { type DataColumn, type SortableDataTableProps } from "@/registry/components/sortable-data-table/sortable-data-table";
import { person } from "@/lib/media";
import { defineDemo } from "../lib/demo";

type Deployment = {
  id: string;
  silicon: string;
  department: string;
  owner: string;
  ownerSrc: string;
  status: "Live" | "Training" | "Paused";
  tickets: number;
  cost: number;
};

const owner = (id: Parameters<typeof person>[0]) => ({ owner: person(id).name, ownerSrc: person(id).src });

const rows: Deployment[] = [
  { id: "dep-101", silicon: "Support desk", department: "Customer success", ...owner("hannah-walsh"), status: "Live", tickets: 1284, cost: 4120 },
  { id: "dep-102", silicon: "Invoice reconciler", department: "Finance", ...owner("andre-williams"), status: "Live", tickets: 312, cost: 2860 },
  { id: "dep-103", silicon: "Lead qualifier", department: "Sales", ...owner("tyler-hayes"), status: "Training", tickets: 96, cost: 940 },
  { id: "dep-104", silicon: "On-call triage", department: "Platform", ...owner("olivia-bennett"), status: "Live", tickets: 548, cost: 3310 },
  { id: "dep-105", silicon: "Campaign reporter", department: "Marketing", ...owner("ava-mitchell"), status: "Paused", tickets: 0, cost: 0 },
  { id: "dep-106", silicon: "Vendor onboarding", department: "Operations", ...owner("sofia-ramirez"), status: "Training", tickets: 41, cost: 610 },
];

const tones: Record<Deployment["status"], BadgeTone> = { Live: "success", Training: "info", Paused: "neutral" };
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const columns: DataColumn<Deployment>[] = [
  { key: "silicon", label: "Silicon" },
  { key: "department", label: "Department" },
  { key: "owner", label: "Owner", render: (value, row) => <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Avatar name={row.owner} src={row.ownerSrc} size="sm" />{String(value)}</span> },
  { key: "status", label: "Status", render: value => <Badge size="sm" tone={tones[value as Deployment["status"]]}>{String(value)}</Badge> },
  { key: "tickets", label: "Tickets" },
  { key: "cost", label: "Cost", render: value => usd.format(value as number) },
];

export default defineDemo<SortableDataTableProps<Deployment>>({
  props: {
    rows,
    columns,
    rowKey: "id",
    caption: "Deployments",
    defaultSort: { key: "tickets", direction: "desc" },
    selectable: true,
    itemName: { one: "deployment", other: "deployments" },
  },
  hideControls: ["rows", "columns", "selectedKeys", "defaultSelectedKeys"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 760px)" }}><SortableDataTable {...props} /></div>,
  stage: { layout: "fill" },
  examples: [
    {
      title: "Empty",
      render: () => <div style={{ width: "min(100%, 760px)" }}><SortableDataTable rows={[]} columns={columns} rowKey="id" caption="Paused deployments" emptyMessage="No deployments are paused." /></div>,
      stage: { layout: "fill" },
    },
  ],
  usage: `<SortableDataTable
  caption="Deployments"
  rows={deployments}
  rowKey="id"
  defaultSort={{ key: "tickets", direction: "desc" }}
  selectable
  itemName={{ one: "deployment", other: "deployments" }}
  columns={[
    { key: "silicon", label: "Silicon" },
    { key: "status", label: "Status", render: value => <Badge>{String(value)}</Badge> },
    { key: "tickets", label: "Tickets" },
  ]}
/>`,
});
