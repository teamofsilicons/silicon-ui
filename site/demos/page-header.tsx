import { PageHeader } from "@/registry/blocks/page-header/page-header";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: PageHeader,
  stage: { minHeight: 560 },
  usage: `<PageHeader />`,
});
