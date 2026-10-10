import { EmptyStates } from "@/registry/blocks/empty-states/empty-states";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: EmptyStates,
  stage: { minHeight: 560 },
  usage: `<EmptyStates />`,
});
