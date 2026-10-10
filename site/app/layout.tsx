import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Inter } from "next/font/google";

import "../../registry/foundation.css";
import "./site.css";
import { Sidebar } from "../components/sidebar";
import { catalog } from "../lib/catalog";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Silicon UI", template: "%s · Silicon UI" },
  description: "Preview and docs for every Silicon UI component and block.",
};

// Applies the saved appearance before first paint, so a dark reader never sees a light flash.
const appearance = `try{var s=JSON.parse(localStorage.getItem("site-appearance")||"{}");var d=document.documentElement;d.dataset.theme=s.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.dataset.accent=s.accent||"neutral"}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={`${geist.variable} ${inter.variable}`} data-theme="light" data-accent="neutral" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: appearance }} /></head>
    <body>
      <div className="shell">
        <Sidebar nav={catalog.nav} />
        <div className="shell-main">{children}</div>
      </div>
    </body>
  </html>;
}
