import { SignupForm } from "@/registry/blocks/signup-form/signup-form";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  component: SignupForm,
  stage: { minHeight: 640 },
  examples: [
    {
      title: "Server error",
      description: "An error from your API shows above the form, for example when the email is already registered.",
      render: () => <SignupForm serverError="An account with finance@northwind.com already exists. Sign in instead." />,
      stage: { layout: "fill", minHeight: 640 },
    },
  ],
  usage: `<SignupForm
  onSubmit={async details => {
    await createAccount(details);
  }}
  onProvider={provider => signInWith(provider)}
/>`,
});
