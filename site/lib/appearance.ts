"use client";

import { useCallback, useSyncExternalStore } from "react";

export const accents = ["neutral", "violet", "blue", "green", "amber", "orange", "coral", "rose"] as const;

const key = "site-appearance";
const listeners = new Set<() => void>();

type Attribute = "theme" | "accent" | "corners";

function read(attribute: Attribute, fallback: string) {
  return typeof document === "undefined" ? fallback : document.documentElement.dataset[attribute] ?? fallback;
}

function write(attribute: Attribute, value: string) {
  document.documentElement.dataset[attribute] = value;
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, string>;
    localStorage.setItem(key, JSON.stringify({ ...saved, [attribute]: value }));
  } catch { /* storage can be unavailable; the attribute still applies for this visit */ }
  listeners.forEach(listener => listener());
}

const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

/** The site's theme, accent and corner shape, stored as data attributes on <html> (which foundation.css reads) and remembered per browser. */
export function useAppearance() {
  const theme = useSyncExternalStore(subscribe, () => read("theme", "light"), () => "light");
  const accent = useSyncExternalStore(subscribe, () => read("accent", "neutral"), () => "neutral");
  const setTheme = useCallback((value: string) => write("theme", value), []);
  const corners = useSyncExternalStore(subscribe, () => read("corners", "squircle"), () => "squircle");
  const setAccent = useCallback((value: string) => write("accent", value), []);
  const setCorners = useCallback((value: string) => write("corners", value), []);
  return { theme, accent, corners, setTheme, setAccent, setCorners };
}
