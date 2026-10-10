import { SignIn } from "@/registry/blocks/sign-in/sign-in";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: SignIn,
  stage: { minHeight: 640 },
  usage: `<SignIn
  onSignIn={(account, method) => startSession(account.email, method)}
/>`,
});
