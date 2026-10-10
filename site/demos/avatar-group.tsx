import { useState } from "react";

import { AvatarGroup, type AvatarGroupProps } from "@/registry/components/avatar-group/avatar-group";
import { Button } from "@/registry/components/button/button";
import { people } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const team = people.slice(0, 9).map((entry, index) => ({ name: entry.name, src: entry.src, status: index % 3 === 0 ? "online" as const : undefined }));

export default defineDemo<AvatarGroupProps>({
  props: { members: team, max: 4, label: "Support team" },
  hideControls: ["members"],
  Preview: ({ props }) => {
    const [count, setCount] = useState(6);
    return <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
      <AvatarGroup {...props} members={team.slice(0, count)} />
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="secondary" size="sm" disabled={count <= 1} onClick={() => setCount(value => value - 1)}>Remove</Button>
        <Button variant="secondary" size="sm" disabled={count >= team.length} onClick={() => setCount(value => value + 1)}>Add person</Button>
      </div>
    </div>;
  },
  examples: [
    {
      title: "Small and without overflow",
      description: "When everyone fits under max, no count is shown.",
      render: () => <AvatarGroup size="sm" max={5} label="Reviewers" members={team.slice(3, 6)} />,
    },
  ],
  usage: `<AvatarGroup
  label="Support team"
  max={4}
  members={[
    { name: "Emma Collins", src: "/media/people/emma-collins.jpg", status: "online" },
    { name: "Marcus Johnson", src: "/media/people/marcus-johnson.jpg" },
    { name: "Jasmine Brooks" },
  ]}
/>`,
});
