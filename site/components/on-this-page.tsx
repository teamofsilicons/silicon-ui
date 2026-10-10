"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export interface TocEntry { id: string; title: string }

/** The right rail: links to each section, with the one being read marked as you scroll. */
export function OnThisPage({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id);
  const ids = entries.map(entry => entry.id).join(",");

  useEffect(() => {
    const sections = ids.split(",").map(id => document.getElementById(id)).filter((node): node is HTMLElement => !!node);
    const update = () => {
      // The last section whose top has passed a line a third of the way down the viewport.
      const line = window.innerHeight / 3;
      let current = sections[0]?.id;
      for (const section of sections) if (section.getBoundingClientRect().top <= line) current = section.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections.at(-1)?.id;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [ids]);

  return <aside className="toc" aria-label="On this page">
    <p className="toc-title">On this page</p>
    <ul>
      {entries.map(entry => <li key={entry.id}><a href={`#${entry.id}`} aria-current={active === entry.id ? "true" : undefined}>{entry.title}</a></li>)}
    </ul>
    <a className="toc-top" href="#" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top <ArrowUp size={13} aria-hidden="true" /></a>
  </aside>;
}
