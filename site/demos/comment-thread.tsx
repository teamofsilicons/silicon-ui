import CommentThread, { type CommentAuthor, type CommentThreadProps, type ThreadComment } from "@/registry/components/comment-thread/comment-thread";
import { person } from "@/lib/media";
import { defineDemo } from "../lib/demo";

const author = (id: Parameters<typeof person>[0]): CommentAuthor => ({ id, name: person(id).name, avatar: person(id).src });

const me = author("emma-collins");
const jasmine = author("jasmine-brooks");
const marcus = author("marcus-johnson");
const sofia = author("sofia-ramirez");
const daniel = author("daniel-kim");

const comments: ThreadComment[] = [
  {
    id: "c1",
    author: jasmine,
    body: "The headline says \"AI employees\" but the subhead says \"agents\". Can we pick one? @Emma Collins",
    createdAt: "3h",
    reactions: [{ emoji: "👍", users: [marcus.id, sofia.id] }],
    replies: [
      { id: "c1-r1", author: me, body: "Going with silicons everywhere, it's what customers call them on calls.", createdAt: "2h", edited: true, reactions: [{ emoji: "🎉", users: [jasmine.id] }] },
      { id: "c1-r2", author: sofia, body: "Agreed. Ops already uses it in the onboarding deck.", createdAt: "1h" },
    ],
  },
  {
    id: "c2",
    author: marcus,
    body: "The pricing link 404s on staging. @Daniel Kim is that the new route?",
    createdAt: "45m",
    replies: [{ id: "c2-r1", author: daniel, body: "Yes, deploying the redirect now.", createdAt: "20m", reactions: [{ emoji: "🙏", users: [marcus.id, me.id] }] }],
  },
];

export default defineDemo<CommentThreadProps>({
  props: { currentUser: me, defaultComments: comments, title: "Hero headline", people: [me, jasmine, marcus, sofia, daniel], placeholder: "Reply, or @mention someone" },
  hideControls: ["comments", "defaultComments", "resolved"],
  Preview: ({ props }) => <div style={{ width: "min(100%, 520px)" }}><CommentThread {...props} /></div>,
  examples: [
    {
      title: "Empty",
      render: () => <div style={{ width: "min(100%, 520px)" }}><CommentThread currentUser={me} people={[me, jasmine, marcus]} title="Pricing table" /></div>,
    },
    {
      title: "Resolved",
      description: "Resolving folds the thread into a chip that reopens it.",
      render: () => <div style={{ width: "min(100%, 520px)" }}><CommentThread currentUser={me} defaultComments={comments} defaultResolved title="Hero headline" /></div>,
    },
  ],
  usage: `<CommentThread
  title="Hero headline"
  currentUser={{ id: "emma", name: "Emma Collins", avatar: "/emma.jpg" }}
  comments={comments}
  onCommentsChange={(next, event) => {
    setComments(next);
    sync(event);
  }}
/>`,
});
