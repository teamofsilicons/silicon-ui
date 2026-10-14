/**
 * Renders a docs-site demo (site/demos) in Storybook: the live preview with Storybook's controls as its props, and the
 * demo's hand-picked examples. Every generated story file uses these two, so a demo is written once for both.
 */
import type { ComponentType, CSSProperties } from "react";
import type { Demo } from "../site/lib/demo";

type AnyDemo = Demo<Record<string, unknown>>;

export function DemoPreview({ demo, args }: { demo: AnyDemo; args: Record<string, unknown> }) {
  const props = { ...(demo.props ?? {}), ...args };
  if (demo.Preview) {
    const Preview = demo.Preview;
    return <Preview props={props} />;
  }
  if (demo.component) {
    const Component = demo.component as ComponentType<Record<string, unknown>>;
    return <Component {...props} />;
  }
  return null;
}

const list: CSSProperties = { display: "grid", gap: "var(--space-page)", width: "min(100vw - 64px, 960px)" };
const head: CSSProperties = { display: "grid", gap: "var(--space-tight)", marginBottom: "var(--space-inset)" };
const title: CSSProperties = { margin: 0, color: "var(--foreground)", fontSize: "var(--text-base)", fontWeight: 600 };
const text: CSSProperties = { margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)" };
const stage = (fill: boolean): CSSProperties => ({ display: "flex", justifyContent: fill ? "stretch" : "center", padding: "var(--space-block)", border: "1px solid var(--border)", borderRadius: "var(--radius-container)", background: "var(--surface-muted)" });

export function DemoExamples({ demo }: { demo: AnyDemo }) {
  return (
    <div style={list}>
      {(demo.examples ?? []).map(example => {
        const Example = () => <>{example.render()}</>;
        return (
          <section key={example.title}>
            <div style={head}>
              <h3 style={title}>{example.title}</h3>
              {example.description ? <p style={text}>{example.description}</p> : null}
            </div>
            <div style={stage((example.stage?.layout ?? demo.stage?.layout) === "fill")}>
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Example /></div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
