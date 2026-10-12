import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Storybook for every Silicon UI component and block. The stories in stories/ are generated from the docs site's demos
 * (site/demos) by `npm run build:stories`, so Storybook and ui.teamofsilicons.com always show the same things.
 */
const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  staticDirs: ["../site/public"],
  core: { disableTelemetry: true },
  framework: "@storybook/nextjs-vite",
  typescript: { reactDocgen: "react-docgen-typescript" },
  viteFinal: async config => ({
    ...config,
    resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": root } },
  }),
};

export default config;
