import { ChangelogFeed } from "@/registry/blocks/changelog-feed/changelog-feed";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: ChangelogFeed,
  stage: { minHeight: 640 },
  usage: `<ChangelogFeed
  title="Changelog"
  subtitle="Silicons 1.1 shipped on October 2, 2026"
  entries={entries}
  months={months}
/>`,
});
