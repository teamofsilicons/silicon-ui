import { useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

import { ThemeSwitch, type Theme, type ThemeSwitchProps, type ThemeSwitchVariant } from "@/registry/components/theme-switch/theme-switch";
import { defineDemo, type Demo } from "../lib/demo";

/*
 * ThemeSwitch only reports the next theme; the page transition is the app's job. These demos keep the theme local and play each
 * variant's transition over a small app window instead of flipping the whole docs site.
 */

const palettes: Record<Theme, Record<"bg" | "surface" | "muted" | "fg" | "secondary" | "border" | "bar", string>> = {
  light: { bg: "oklch(100% 0 0)", surface: "oklch(98.5% 0 0)", muted: "oklch(96% 0 0)", fg: "oklch(15% 0 0)", secondary: "oklch(46% 0 0)", border: "oklch(93.5% 0 0)", bar: "oklch(33% 0 0)" },
  dark: { bg: "oklch(19% 0 0)", surface: "oklch(21.5% 0 0)", muted: "oklch(26% 0 0)", fg: "oklch(96% 0 0)", secondary: "oklch(77% 0 0)", border: "oklch(29% 0 0)", bar: "oklch(80% 0 0)" },
};

const usage = [
  { name: "Finance silicon", tickets: 412, share: .82 },
  { name: "Support silicon", tickets: 1284, share: 1 },
  { name: "Ops silicon", tickets: 236, share: .46 },
];

/** A tiny dashboard drawn in one theme. Two copies stack, and the incoming one is clipped in by the variant's transition. */
function Screen({ theme }: { theme: Theme }) {
  const c = palettes[theme];
  return <div style={{ position: "absolute", inset: 0, display: "grid", alignContent: "start", gap: 14, padding: 18, background: c.bg, color: c.fg, colorScheme: theme }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <strong style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>Usage this week</strong>
      <span style={{ color: c.secondary, fontSize: 12 }}>Oct 4 – Oct 10</span>
    </div>
    <div style={{ display: "grid", gap: 10, padding: 14, border: `1px solid ${c.border}`, borderRadius: 12, background: c.surface }}>
      {usage.map(row => <div key={row.name} style={{ display: "grid", gridTemplateColumns: "112px 1fr 44px", alignItems: "center", gap: 10, fontSize: 12 }}>
        <span style={{ color: c.secondary, whiteSpace: "nowrap" }}>{row.name}</span>
        <span style={{ height: 6, borderRadius: 3, background: c.muted }}><span style={{ display: "block", width: `${row.share * 100}%`, height: "100%", borderRadius: 3, background: c.bar }} /></span>
        <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{row.tickets.toLocaleString("en-US")}</span>
      </div>)}
    </div>
    <span style={{ color: c.secondary, fontSize: 12 }}>1,932 tickets handled · 94% resolved without a human</span>
  </div>;
}

type Clip = [from: string, to: string];

/** Start and end clip paths for the incoming theme, in the scene's own pixels. */
function clipFor(variant: ThemeSwitchVariant, next: Theme, box: DOMRect, trigger: DOMRect): Clip {
  const { width: w, height: h } = box;
  const radius = Math.hypot(w, h);
  if (variant === "reveal") {
    // A circle grows from the switch that was pressed, wherever it sits relative to the window.
    const x = trigger.left + trigger.width / 2 - box.left, y = trigger.top + trigger.height / 2 - box.top;
    const reach = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y));
    return [`circle(0px at ${x}px ${y}px)`, `circle(${reach}px at ${x}px ${y}px)`];
  }
  if (variant === "eclipse") {
    // A disc slides across like the moon over the sun: from the right into dark, from the left back to light.
    const from = next === "dark" ? w + radius : -radius;
    return [`circle(${radius}px at ${from}px ${h / 2}px)`, `circle(${radius}px at ${w / 2}px ${h / 2}px)`];
  }
  if (variant === "split") return ["inset(0px 50% 0px 50%)", "inset(0px 0% 0px 0%)"];
  // rise: the new theme comes up from the bottom edge.
  return ["inset(100% 0px 0px 0px)", "inset(0% 0px 0px 0px)"];
}

function ThemeScene({ props }: { props: ThemeSwitchProps }) {
  const reduced = useReducedMotion() ?? false;
  const [theme, setTheme] = useState<Theme>("light");
  const [base, setBase] = useState<Theme>("light");
  const [incoming, setIncoming] = useState<{ theme: Theme; key: number } | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const run = useRef(0);

  function change(next: Theme, variant: ThemeSwitchVariant, trigger: HTMLElement) {
    props.onThemeChange?.(next, variant, trigger);
    setTheme(next);
    const id = ++run.current;
    if (reduced || !scene.current) { setBase(next); setIncoming(null); return; }
    const [from, to] = clipFor(variant, next, scene.current.getBoundingClientRect(), trigger.getBoundingClientRect());
    setIncoming({ theme: next, key: id });
    requestAnimationFrame(() => {
      const node = layer.current;
      if (!node || id !== run.current) return;
      node.style.clipPath = from;
      animate(node, { clipPath: [from, to] }, { duration: .62, ease: [.22, 1, .36, 1] }).then(() => {
        if (id !== run.current) return;
        setBase(next);
        setIncoming(null);
      });
    });
  }

  return <div style={{ display: "grid", gap: 12, width: "min(100%, 440px)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>Window theme: {theme}</span>
      <ThemeSwitch {...props} theme={theme} onThemeChange={change} />
    </div>
    <div ref={scene} style={{ position: "relative", height: 210, overflow: "hidden", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "0 1px 2px oklch(0% 0 0 / .06)" }}>
      <Screen theme={base} />
      {incoming && <div key={incoming.key} ref={layer} style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 100% 0)" }}><Screen theme={incoming.theme} /></div>}
    </div>
  </div>;
}

function IconOnlyBar({ variant }: { variant: ThemeSwitchVariant }) {
  const [theme, setTheme] = useState<Theme>("light");
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "min(100%, 360px)", padding: "6px 6px 6px 16px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--surface)" }}>
    <strong style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Team of Silicons</strong>
    <ThemeSwitch theme={theme} variant={variant} iconOnly onThemeChange={setTheme} />
  </div>;
}

export function themeSwitchDemo(variant?: ThemeSwitchVariant): Demo<ThemeSwitchProps> {
  return defineDemo<ThemeSwitchProps>({
    props: variant ? { variant } : {},
    hideControls: variant ? ["theme", "variant"] : ["theme"],
    variants: [],
    Preview: ThemeScene,
    examples: [
      {
        title: "Icon only",
        description: "In a top bar the switch drops its label; its accessible name still says which theme it turns on.",
        render: () => <IconOnlyBar variant={variant ?? "reveal"} />,
      },
    ],
    usage: `const [theme, setTheme] = useState<Theme>("light");

<ThemeSwitch
  theme={theme}${variant ? `\n  variant="${variant}"` : ""}
  onThemeChange={(next, variant, trigger) => {
    // Run your page transition here (for example a view transition from trigger), then:
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }}
/>`,
  });
}

export default themeSwitchDemo();
