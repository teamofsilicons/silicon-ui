"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronDown, Component, LayoutTemplate, Menu, Moon, Palette, Search, Sun, X } from "lucide-react";

import type { NavCategory } from "../lib/catalog";
import { useAppearance, accents } from "../lib/appearance";

type Filter = "all" | "component" | "block";

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
      <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true" />Silicon UI</Link>
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
