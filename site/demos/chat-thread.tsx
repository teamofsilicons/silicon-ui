import { useState } from "react";

import ChatThread, { type ChatMessage, type ChatParticipant, type ChatThreadProps } from "@/registry/components/chat-thread/chat-thread";
import { photo, person } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const minute = 60_000;

const participants: ChatParticipant[] = [
  { id: "me", name: person("ryan-sullivan").name, avatar: person("ryan-sullivan").src },
  { id: "sofia", name: person("sofia-ramirez").name, avatar: person("sofia-ramirez").src },
  { id: "silicon", name: "Operations silicon" },
];

const office = photo("home-office");

function conversation(now: number): ChatMessage[] {
  return [
    { id: "m1", authorId: "sofia", text: "Morning! Did the vendor onboarding run finish overnight?", createdAt: now - 26 * 60 * minute },
    { id: "m2", authorId: "silicon", text: "Yes. 14 vendors onboarded, 2 are waiting on a W-9.", createdAt: now - 26 * 60 * minute + minute },
    { id: "m3", authorId: "me", text: "Can you chase the two missing forms today?", createdAt: now - 42 * minute, status: "read" },
    { id: "m4", authorId: "silicon", text: "On it. I'll email both contacts and follow up at 4pm if they haven't replied.", createdAt: now - 41 * minute, reactions: [{ emoji: "👍", count: 2, mine: true }] },
    { id: "m5", authorId: "sofia", text: "Also, here's the new desk setup for the Lisbon office 🙂", createdAt: now - 12 * minute, attachments: [{ id: "a1", name: "lisbon-office.jpg", kind: "image", url: office.src, width: office.width, height: office.height, alt: office.alt }] },
    { id: "m6", authorId: "sofia", text: "Furniture arrives Thursday.", createdAt: now - 11 * minute },
    { id: "m7", authorId: "me", text: "Looks great. Send me the invoice when it lands and I'll approve it.", createdAt: now - 3 * minute, status: "delivered" },
  ];
}

export default defineDemo<ChatThreadProps>({
  props: { participants, currentUserId: "me", label: "Operations channel", placeholder: "Message Sofia and the silicon", readBy: { sofia: "m7" }, typing: ["silicon"] },
  hideControls: ["messages", "defaultMessages", "currentUserId", "groupWindow", "locale", "accept"],
  Preview: ({ props }) => {
    const [messages] = useState(() => conversation(Date.now()));
    return <div style={{ width: "min(100%, 560px)", height: 560, border: "1px solid var(--border)", borderRadius: "var(--radius-control)", overflow: "hidden", background: "var(--surface)" }}>
      <ChatThread {...props} defaultMessages={messages} />
    </div>;
  },
  usage: `<div style={{ height: 560 }}>
  <ChatThread
    participants={participants}
    currentUserId="me"
    messages={messages}
    readBy={{ sofia: "m7" }}
    typing={["silicon"]}
    onSend={({ text, files }) => send(text, files)}
  />
</div>`,
});
