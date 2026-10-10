import { BlogGrid } from "@/registry/blocks/blog-grid/blog-grid";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: BlogGrid,
  hideControls: ["category", "page"],
  stage: { minHeight: 720 },
  examples: [
    {
      title: "Without the featured post",
      description: "Every post shares the grid, three to a page.",
      render: () => <BlogGrid showFeatured={false} pageSize={3} />,
      stage: { layout: "fill", minHeight: 560 },
    },
  ],
  usage: `<BlogGrid
  title="Journal"
  posts={posts}
  categories={["Product", "Engineering", "Company"]}
  getHref={post => \`/blog/\${post.id}\`}
/>`,
});
