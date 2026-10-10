import { LoginCentered } from "@/registry/blocks/login-centered/login-centered";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: LoginCentered,
  props: { demoEmail: "finance@northwind.com" },
  stage: { minHeight: 640 },
  usage: `<LoginCentered
  termsHref="/terms"
  privacyHref="/privacy"
  onSignIn={(email, method, mode) => startSession(email, method, mode)}
/>`,
});
