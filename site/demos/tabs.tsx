import { Clock3, Star, UserRound } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/components/tabs/tabs";
import { defineDemo } from "../lib/demo";

const panel = { padding: "16px 4px", color: "var(--text-secondary)", fontSize: 14 } as const;

export default defineDemo({
  Preview: () => <Tabs defaultValue="overview" style={{ width: "min(100%, 420px)" }}>
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview"><p style={panel}>Three silicons are live and handled 1,284 tickets this week.</p></TabsContent>
    <TabsContent value="activity"><p style={panel}>The finance silicon reconciled 312 invoices overnight.</p></TabsContent>
    <TabsContent value="settings"><p style={panel}>Notifications go to the operations channel.</p></TabsContent>
  </Tabs>,
  examples: [
    {
      title: "With icons",
      description: "Pass an icon to each trigger; it is sized, coloured with the label and hidden from screen readers.",
      render: () => <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent" icon={<Clock3 />}>Recently updated</TabsTrigger>
          <TabsTrigger value="favorites" icon={<Star />}>Favorites</TabsTrigger>
          <TabsTrigger value="created" icon={<UserRound />}>Created by me</TabsTrigger>
        </TabsList>
        <TabsContent value="recent"><p style={panel}>Pages changed in the last week.</p></TabsContent>
        <TabsContent value="favorites"><p style={panel}>Pages you starred.</p></TabsContent>
        <TabsContent value="created"><p style={panel}>Pages you wrote.</p></TabsContent>
      </Tabs>,
    },
  ],
  usage: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="activity">…</TabsContent>
</Tabs>`,
});
