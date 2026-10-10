import { PlanComparison } from "@/registry/blocks/plan-comparison/plan-comparison";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: PlanComparison,
  stage: { minHeight: 640 },
  usage: `<PlanComparison />`,
});
