import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { useEffect, type ReactNode } from "react";
import "../registry/foundation.css";

/** Theme, accent and corner shape are attributes on <html>, as in an app; the toolbar switches them. */
function Appearance({ theme, accent, corners, children }: { theme: string; accent: string; corners: string; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.accent = accent;
    root.dataset.corners = corners;
  }, [theme, accent, corners]);
  return children;
}

const withAppearance: Decorator = (Story, context) => {
  const { theme, accent, corners } = context.globals as { theme: string; accent: string; corners: string };
  return <Appearance theme={theme} accent={accent} corners={corners}><Story /></Appearance>;
};

const preview: Preview = {
  decorators: [withAppearance],
  globalTypes: {
    theme: { description: "Theme", toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true } },
    accent: { description: "Accent", toolbar: { title: "Accent", icon: "paintbrush", items: ["neutral", "violet", "blue", "green", "amber", "orange", "coral", "rose"], dynamicTitle: true } },
    corners: { description: "Corners", toolbar: { title: "Corners", icon: "component", items: ["squircle", "round"], dynamicTitle: true } },
  },
  initialGlobals: { theme: "light", accent: "neutral", corners: "squircle" },
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    options: { storySort: { order: ["Introduction", "Components", "Blocks"] } },
  },
};

export default preview;
