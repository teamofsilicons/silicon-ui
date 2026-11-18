import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";

import "../../registry/foundation.css";
import "./site.css";
import { Sidebar } from "../components/sidebar";
import { catalog } from "../lib/catalog";

// Allo, Silicon UI's face, self-hosted from the allo-font package; the tokens read it from --font-allo.
const allo = localFont({
  src: [{ path: "../../node_modules/allo-font/fonts/webfonts/AlloVariable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-allo",
});

export const metadata: Metadata = {
  title: { default: "Silicon UI", template: "%s · Silicon UI" },
  description: "Preview and docs for every Silicon UI component and block.",
};

// Applies the saved appearance before first paint, so a dark reader never sees a light flash.
const appearance = `try{var s=JSON.parse(localStorage.getItem("site-appearance")||"{}");var d=document.documentElement;d.dataset.theme=s.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.dataset.accent=s.accent||"neutral";d.dataset.corners=s.corners||"squircle"}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={allo.variable} data-theme="light" data-accent="neutral" data-corners="squircle" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: appearance }} /></head>
    <body>
      <div className="shell">
        <Sidebar nav={catalog.nav} />
        <div className="shell-main">{children}</div>
      </div>
    </body>
  </html>;
}
