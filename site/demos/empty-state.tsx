import { useState } from "react";
import { Inbox, Plus, SearchX } from "lucide-react";

import { Button } from "@/registry/components/button/button";
import { EmptyState, type EmptyStateProps } from "@/registry/components/empty-state/empty-state";
import { defineDemo } from "../lib/demo";

const frame = { width: "min(100%, 420px)", border: "1px dashed var(--border)", borderRadius: 16 } as const;

function FirstDeployment() {
  const [requested, setRequested] = useState(false);
  return <div style={frame}>
    <EmptyState
      icon={requested ? <Inbox size={24} strokeWidth={1.5} /> : undefined}
      title={requested ? "Request sent" : "No silicons yet"}
      description={requested ? "Your account team will reply within one business day with a deployment plan." : "Deploy your first silicon to start handing work off to it."}
      action={requested ? <Button variant="ghost" onClick={() => setRequested(false)}>Undo</Button> : <Button onClick={() => setRequested(true)}><Plus size={16} aria-hidden="true" /> Request a silicon</Button>}
    />
  </div>;
}

export default defineDemo<EmptyStateProps>({
  props: { title: "No tickets in this view", description: "When a silicon escalates a ticket to a person, it shows up here." },
  Preview: ({ props }) => <div style={frame}><EmptyState {...props} /></div>,
  examples: [
    {
      title: "With an action",
      description: "The result of the action morphs in place: the icon crossfades and the copy rises in.",
      render: () => <FirstDeployment />,
    },
    {
      title: "No search results",
      render: () => <div style={frame}><EmptyState icon={<SearchX size={24} strokeWidth={1.5} />} title="No invoices match “Q3 Acme”" description="Try a different customer name or clear the date filter." action={<Button variant="secondary">Clear filters</Button>} /></div>,
    },
  ],
});
