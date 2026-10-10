"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronDown, Component, LayoutTemplate, Menu, Moon, Palette, Search, Sun, X } from "lucide-react";

import type { NavCategory } from "../lib/catalog";
import { useAppearance, accents } from "../lib/appearance";

type Filter = "all" | "component" | "block";

function GithubMark() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
}

export function Sidebar({ nav }: { nav: NavCategory[] }) {
  const pathname = usePathname();
  const active = pathname.replace(/^\/|\/$/g, "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const { theme, accent, setTheme, setAccent } = useAppearance();

  // Close the phone drawer after navigating.
  const [openedAt, setOpenedAt] = useState(pathname);
  if (openedAt !== pathname) { setOpenedAt(pathname); setOpen(false); }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); search.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // Keep the open item in view when navigating from elsewhere.
  useEffect(() => { document.querySelector(".sidebar a[aria-current='page']")?.scrollIntoView({ block: "nearest" }); }, [active]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nav
      .filter(category => filter === "all" || category.kind === filter)
      .map(category => ({ ...category, groups: category.groups.map(group => ({ ...group, items: group.items.filter(item => !q || item.title.toLowerCase().includes(q) || item.name.includes(q) || item.description.toLowerCase().includes(q)) })).filter(group => group.items.length) }))
      .filter(category => category.groups.length);
  }, [nav, query, filter]);

  const componentCategories = visible.filter(category => category.kind === "component");
  const blockCategories = visible.filter(category => category.kind === "block");
  const count = (categories: NavCategory[]) => categories.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0);
  const toggle = (key: string) => setCollapsed(state => ({ ...state, [key]: !state[key] }));
  const searching = query.trim() !== "";

  const renderCategories = (categories: NavCategory[], prefix: string) => categories.map(category => {
    const key = `${prefix}/${category.title}`;
    const isOpen = searching || !collapsed[key];
    const total = category.groups.reduce((n, g) => n + g.items.length, 0);
    return <div key={key} className="nav-category">
      <button className="nav-category-head" onClick={() => toggle(key)} aria-expanded={isOpen}>
        <span>{category.title}</span><span className="nav-count">{total}</span><ChevronDown size={14} className="nav-chevron" aria-hidden="true" />
      </button>
      {isOpen && category.groups.map(group => {
        const groupKey = `${key}/${group.title}`;
        const groupOpen = searching || !collapsed[groupKey];
        return <div key={groupKey} className="nav-group">
          {group.title && <button className="nav-group-head" onClick={() => toggle(groupKey)} aria-expanded={groupOpen}>
            <ChevronDown size={12} className="nav-chevron" aria-hidden="true" /><span>{group.title}</span><span className="nav-count">{group.items.length}</span>
          </button>}
          {groupOpen && <ul className="nav-items">
            {group.items.map(item => <li key={item.name}>
              <Link href={`/${item.name}`} aria-current={active === item.name ? "page" : undefined} title={item.description}>{item.title}</Link>
            </li>)}
          </ul>}
        </div>;
      })}
    </div>;
  });

  return <>
    <button className="sidebar-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={18} /> : <Menu size={18} />}</button>
    <aside className="sidebar" data-open={open || undefined}>
      <Link href="/" className="brand"><svg className="brand-mark" viewBox="40 40 204 204" fill="currentColor" aria-hidden="true"><rect x="49" y="117.9" width="47.7" height="47.7" /><rect x="70.2" y="70.2" width="47.7" height="47.7" /><rect x="70.2" y="165.6" width="47.7" height="47.7" /><rect x="90.06" y="141.75" width="72.78" height="72.78" transform="rotate(-45 90.06 141.75)" /><rect x="117.9" y="49" width="47.7" height="47.7" /><rect x="117.9" y="186.8" width="47.7" height="47.7" /><rect x="186.8" y="117.9" width="47.7" height="47.7" /><rect x="165.6" y="70.2" width="47.7" height="47.7" /><rect x="165.6" y="165.6" width="47.7" height="47.7" /></svg>Silicon UI</Link>
      <label className="sidebar-search">
        <Search size={15} aria-hidden="true" />
        <input ref={search} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search" aria-label="Search components" onKeyDown={event => { if (event.key === "Escape") setQuery(""); }} />
        <kbd>⌘K</kbd>
      </label>
      <div className="sidebar-filter" role="radiogroup" aria-label="Show">
        {(["all", "component", "block"] as const).map(value => <button key={value} role="radio" aria-checked={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "All" : value === "component" ? "Components" : "Blocks"}</button>)}
      </div>
      <nav className="sidebar-nav" aria-label="Components">
        {!searching && filter === "all" && <div className="nav-category">
          <div className="nav-section-title"><BookOpen size={14} aria-hidden="true" />Docs</div>
          <ul className="nav-items flat">
            <li><Link href="/" aria-current={active === "" ? "page" : undefined}>Introduction</Link></li>
            <li><Link href="/foundation" aria-current={active === "foundation" ? "page" : undefined}>Foundation</Link></li>
          </ul>
        </div>}
        {componentCategories.length > 0 && <div className="nav-section-title"><Component size={14} aria-hidden="true" />Components<span className="nav-count">{count(componentCategories)}</span></div>}
        {renderCategories(componentCategories, "c")}
        {blockCategories.length > 0 && <div className="nav-section-title"><LayoutTemplate size={14} aria-hidden="true" />Blocks<span className="nav-count">{count(blockCategories)}</span></div>}
        {renderCategories(blockCategories, "b")}
        {!visible.length && <p className="nav-empty">Nothing matches “{query}”.</p>}
      </nav>
      <div className="sidebar-footer">
        <button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
        <a className="icon-button" href="https://github.com/teamofsilicons/silicon-ui" target="_blank" rel="noreferrer" aria-label="Silicon UI on GitHub"><GithubMark /></a>
        <label className="accent-select">
          <Palette size={15} aria-hidden="true" />
          <select value={accent} onChange={event => setAccent(event.target.value)} aria-label="Accent">
            {accents.map(name => <option key={name} value={name}>{name[0]!.toUpperCase() + name.slice(1)}</option>)}
          </select>
          <span className="accent-dot" aria-hidden="true" />
        </label>
      </div>
    </aside>
    {open && <div className="sidebar-scrim" onClick={() => setOpen(false)} />}
  </>;
}
