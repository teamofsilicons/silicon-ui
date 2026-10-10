"use client";

import Link from "next/link";
import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";

import type { Demo } from "../../lib/demo";
import { demos } from "../../generated/demos";

type AnyDemo = Demo<Record<string, unknown>>;

class Catch extends Component<{ name: string; onError: (name: string, message: string) => void; children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  componentDidCatch(error: Error) { this.props.onError(this.props.name, error.message); }
  render() { return this.state.error ? <p className="preview-error">{this.state.error}</p> : this.props.children; }
}

function Live({ demo }: { demo: AnyDemo }) {
  if (demo.Preview) { const Preview = demo.Preview; return <Preview props={(demo.props ?? {}) as Record<string, unknown>} />; }
  const Target = demo.component as ComponentType<Record<string, unknown>> | undefined;
  return Target ? <Target {...(demo.props ?? {})} /> : <p>No component or Preview</p>;
}

function ExampleView({ render }: { render: () => ReactNode }) {
  return <>{render()}</>;
}

/** Renders every demo and its examples on one page and lists the ones that throw. Not linked from the site. */
export default function Check() {
  const [loaded, setLoaded] = useState<[string, AnyDemo][]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    Promise.all(Object.entries(demos).map(async ([name, load]) => {
      try { return [name, (await load()).default as AnyDemo] as [string, AnyDemo]; }
      catch (error) { setErrors(list => ({ ...list, [name]: `import failed: ${(error as Error).message}` })); return null; }
    })).then(list => setLoaded(list.filter((entry): entry is [string, AnyDemo] => entry !== null)));
  }, []);
  const onError = (name: string, message: string) => setErrors(list => ({ ...list, [name]: list[name] ? list[name] : message }));

  return <div className="page" style={{ gridTemplateColumns: "1fr" }}>
    <main className="content" style={{ maxWidth: "none" }}>
      <h1 className="title">Demo check</h1>
      <p className="lede" data-check-summary>{loaded.length} demos loaded, {Object.keys(errors).length} with errors.</p>
      {Object.entries(errors).length > 0 && <ul data-check-errors>{Object.entries(errors).map(([name, message]) => <li key={name}><Link href={`/${name}`}>{name}</Link>: <code>{message}</code></li>)}</ul>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 16 }}>
        {loaded.map(([name, demo]) => <section key={name} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 16, overflow: "hidden", maxHeight: 520 }}>
          <h3 style={{ margin: "0 0 12px" }}><Link href={`/${name}`}>{name}</Link></h3>
          <Catch name={name} onError={onError}><Live demo={demo} /></Catch>
          {demo.examples?.map(example => <Catch key={example.title} name={`${name} › ${example.title}`} onError={onError}><ExampleView render={example.render} /></Catch>)}
        </section>)}
      </div>
    </main>
  </div>;
}
