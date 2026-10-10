import { Avatar } from "@/registry/components/avatar/avatar";
import { avatar, person } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const row = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" } as const;

export default defineDemo({
  component: Avatar,
  props: { name: person("sofia-ramirez").name, src: avatar("sofia-ramirez"), size: "lg", status: "online" },
  examples: [
    {
      title: "Initials fallback",
      description: "Without a photo, or when it fails to load, the first two initials show instead.",
      render: () => <div style={row}>
        <Avatar name="Priya Raman" size="lg" />
        <Avatar name="Finance Silicon" size="lg" status="online" />
      </div>,
    },
    {
      title: "Presence",
      render: () => <div style={row}>
        <Avatar name={person("daniel-kim").name} src={avatar("daniel-kim")} status="online" />
        <Avatar name={person("chloe-nguyen").name} src={avatar("chloe-nguyen")} status="offline" />
        <Avatar name={person("nathan-cole").name} src={avatar("nathan-cole")} />
      </div>,
    },
  ],
});
