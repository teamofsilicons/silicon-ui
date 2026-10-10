"use client";

import Link from "next/link";
import { Component as ReactComponent, useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type ErrorInfo, type ReactNode } from "react";
import { ChevronRight, Code2, Eye, Maximize2, Minimize2, Monitor, RotateCcw, Smartphone } from "lucide-react";

import { CodeBlock } from "@/registry/components/code-block/code-block";
import type { Item, NavEntry, PropDoc } from "../lib/catalog";
import { importLine, registryNamespace } from "../lib/catalog";
import type { Demo } from "../lib/demo";
import { demos } from "../generated/demos";
import { Controls, type ControlValues, parseDefault } from "./controls";
import { CopyCommand } from "./copy-command";
import { OnThisPage, type TocEntry } from "./on-this-page";

type AnyProps = Record<string, unknown>;
type LoadedDemo = Demo<AnyProps>;

const alwaysHidden = new Set(["className", "style", "id", "name", "ref", "key"]);
const autoVariantNames = ["variant", "tone", "size", "appearance", "layout"];

class Boundary extends ReactComponent<{ children: ReactNode; resetKey: string }, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey };
  static getDerivedStateFromError(error: Error) { return { error }; }
  static getDerivedStateFromProps(props: { resetKey: string }, state: { key: string }) { return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info.componentStack); }
  render() { return this.state.error ? <div className="preview-error"><strong>This preview crashed</strong><code>{this.state.error.message}</code></div> : this.props.children; }
}

/** The item's demo module: null while it loads, "missing" when the item has none. The page is keyed by item, so this runs once per item. */
function useDemo(name: string) {
  const load = demos[name];
  const [demo, setDemo] = useState<LoadedDemo | null | "missing">(load ? null : "missing");
  useEffect(() => {
    if (!load) return;
    let live = true;
    load().then(module => { if (live) setDemo(module.default as LoadedDemo); }, () => { if (live) setDemo("missing"); });
    return () => { live = false; };
  }, [load]);
  return demo;
}

function Render({ demo, props }: { demo: LoadedDemo; props: AnyProps }) {
  if (demo.Preview) { const Preview = demo.Preview; return <Preview props={props} />; }
  if (demo.component) { const Component = demo.component as ComponentType<AnyProps>; return <Component {...props} />; }
  return null;
}

/** Renders an example's `render` as a component of its own, so hooks inside it keep a stable identity. */
function ExampleView({ render }: { render: () => ReactNode }) {
  return <>{render()}</>;
}

function Stage({ children, layout = "center", minHeight, toolbar, frame = "full", fullscreen = false }: { children: ReactNode; layout?: "center" | "fill"; minHeight?: number; toolbar?: ReactNode; frame?: "full" | "mobile"; fullscreen?: boolean }) {
  return <div className="stage" data-layout={layout} data-frame={frame} data-fullscreen={fullscreen || undefined} style={minHeight ? { minHeight } : undefined}>
    {toolbar}
    <div className="stage-canvas"><div className="stage-content">{children}</div></div>
  </div>;
}

/** `variant="secondary"`, `loading`, `max={10}`: one JSX attribute for a value. */
function attribute(name: string, value: unknown) {
  if (value === true) return name;
  if (typeof value === "string") return `${name}=${JSON.stringify(value)}`;
  if (typeof value === "number" || value === false) return `${name}={${String(value)}}`;
  return `${name}={${name}}`;
}

function usageFor(item: Item, demo: LoadedDemo, props: AnyProps, docs: PropDoc[]) {
  const parts = item.parts.map(part => part.name);
  const body = demo.usage ?? (() => {
    const defaults = new Map(docs.map(doc => [doc.name, parseDefault(doc.default)]));
    const attributes = Object.entries(props)
      .filter(([name, value]) => name !== "children" && value !== undefined && typeof value !== "function" && defaults.get(name) !== value)
      .map(([name, value]) => attribute(name, value));
    const children = typeof props.children === "string" ? props.children : null;
    const open = [item.exportName, ...attributes].join(" ");
    const line = children ? `<${open}>${children}</${item.exportName}>` : `<${open} />`;
    return line.length > 80 && attributes.length > 1 ? `<${item.exportName}\n${attributes.map(a => `  ${a}`).join("\n")}\n${children ? `>\n  ${children}\n</${item.exportName}>` : "/>"}` : line;
  })();
  const used = parts.filter(name => name === item.exportName || new RegExp(`<${name}[\\s>/]`).test(body));
  const names = used.length ? used : [item.exportName];
  return `${importLine(item, names)}\n\n${body}`;
}

/** `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag">` reads as the base type plus what it leaves out. */
function describeExtends(text: string) {
  const omit = text.match(/^Omit<(.+), ((?:"[^"]+"(?: \| )?)+)>$/);
  if (!omit) return <code>{text}</code>;
  return <><code>{omit[1]}</code>, except {omit[2]!.split(" | ").map((name, index) => <span key={name}>{index ? ", " : ""}<code>{name.replace(/"/g, "")}</code></span>)}</>;
}

export function ItemPage({ item, related }: { item: Item; related: NavEntry[] }) {
  const demo = useDemo(item.name);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [frame, setFrame] = useState<"full" | "mobile">("full");
  const [fullscreen, setFullscreen] = useState(false);
  const [replay, setReplay] = useState(0);
  const [values, setValues] = useState<ControlValues>({});
  const [events, setEvents] = useState<{ id: number; name: string; detail: string }[]>([]);
  const eventId = useRef(0);
  const ready = demo && demo !== "missing" ? demo : null;

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const baseProps = useMemo(() => (ready?.props ?? {}) as AnyProps, [ready]);

  // Controls: the simple props the source declares, plus any primitive base prop (such as string children) it does not.
  const controls = useMemo(() => {
    if (!ready) return [] as PropDoc[];
    const hidden = new Set([...alwaysHidden, ...(ready.hideControls ?? [])]);
    const declared = item.props.filter(doc => doc.control && doc.control.kind !== "function" && !(ready.hideControls ?? []).includes(doc.name) && (doc.required || !hidden.has(doc.name)));
    const extra: PropDoc[] = Object.entries(baseProps)
      .filter(([name, value]) => !hidden.has(name) && !declared.some(doc => doc.name === name) && ["string", "number", "boolean"].includes(typeof value))
      .map(([name, value]) => ({ name, type: typeof value, required: false, default: null, description: "", control: { kind: typeof value as "string" | "number" | "boolean" } }));
    return [...extra, ...declared];
  }, [ready, item.props, baseProps]);

  const log = useCallback((name: string, args: unknown[]) => {
    const detail = args.map(arg => {
      if (arg && typeof arg === "object" && "nativeEvent" in arg) return `${(arg as { type?: string }).type ?? "event"} event`;
      if (arg instanceof Element) return `<${arg.tagName.toLowerCase()}>`;
      try { const text = JSON.stringify(arg); return text && text.length > 60 ? text.slice(0, 57) + "…" : text ?? String(arg); } catch { return String(arg); }
    }).join(", ");
    setEvents(list => [{ id: ++eventId.current, name, detail }, ...list].slice(0, 6));
  }, []);

  // Callbacks report to the event log, then call the demo's own handler. Without a demo handler only notifications are wrapped:
  // some components change behaviour when a callback is present at all (an onUpload makes a dropzone upload).
  const callbacks = useMemo(() => {
    const wrapped: AnyProps = {};
    for (const doc of item.props) {
      if (doc.control?.kind !== "function" || !/^on[A-Z]/.test(doc.name)) continue;
      const own = baseProps[doc.name];
      if (typeof own !== "function" && !/(Change|Commit|Select|Click|Open|Close|Dismiss|Toggle|Intent|Focus|Blur)$/.test(doc.name)) continue;
      wrapped[doc.name] = (...args: unknown[]) => { log(doc.name, args); return typeof own === "function" ? own(...args) : undefined; };
    }
    return wrapped;
  }, [item.props, baseProps, log]);

  const merged = useMemo(() => {
    const result: AnyProps = { ...baseProps, ...callbacks };
    for (const [name, value] of Object.entries(values)) if (value !== undefined) result[name] = value;
    return result;
  }, [baseProps, callbacks, values]);

  // Props read only on mount (defaultValue, defaultOpen) need a fresh mount to show a change.
  const mountKey = `${item.name}:${replay}:${Object.entries(values).filter(([name]) => /^default[A-Z]/.test(name)).map(([, value]) => String(value)).join(",")}`;

  const variantProps = useMemo(() => {
    if (!ready) return [] as PropDoc[];
    const wanted = ready.variants ?? (item.kind === "block" ? [] : autoVariantNames);
    return controls.filter(doc => doc.control?.kind === "enum" && wanted.includes(doc.name));
  }, [ready, controls, item.kind]);

  const hasExamples = !!ready && (variantProps.length > 0 || (ready.examples?.length ?? 0) > 0);
  const hasApi = item.parts.some(part => part.props.length || part.extends);
  const install = `npx shadcn@latest add ${registryNamespace}/${item.name}`;
  const ownFiles = item.files.filter(file => file.own);
  const sharedFiles = item.files.filter(file => !file.own);
  const [activeFile, setActiveFile] = useState(0);
  const files = [...ownFiles, ...sharedFiles];
  const file = files[activeFile] ?? files[0];

  const toc: TocEntry[] = [
    { id: "preview", title: "Preview" },
    ...(hasExamples ? [{ id: "examples", title: "Examples" }] : []),
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    ...(hasApi ? [{ id: "api", title: "API reference" }] : []),
    { id: "dependencies", title: "Dependencies" },
    ...(related.length ? [{ id: "related", title: "Related" }] : []),
  ];

  const layout = ready?.stage?.layout ?? (item.kind === "block" ? "fill" : "center");
  const toolbar = <div className="stage-toolbar">
    <span className="stage-status">{demo === null ? "Loading…" : demo === "missing" ? "No demo yet" : "Live"}</span>
    <div className="segmented small" role="radiogroup" aria-label="Preview width">
      <button role="radio" aria-checked={frame === "full"} onClick={() => setFrame("full")} aria-label="Full width"><Monitor size={14} /></button>
      <button role="radio" aria-checked={frame === "mobile"} onClick={() => setFrame("mobile")} aria-label="Phone width"><Smartphone size={14} /></button>
    </div>
    <button className="icon-button small" onClick={() => setReplay(n => n + 1)} aria-label="Replay"><RotateCcw size={14} /></button>
    <button className="icon-button small" onClick={() => setFullscreen(!fullscreen)} aria-label={fullscreen ? "Exit full screen" : "Full screen"}>{fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
  </div>;

  return <div className="page">
    <main className="content">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <span>{item.kind === "block" ? "Blocks" : "Components"}</span><ChevronRight size={13} aria-hidden="true" />
        <span>{item.category}</span>
        {item.group && <><ChevronRight size={13} aria-hidden="true" /><span>{item.group}</span></>}
      </nav>
      <h1 className="title">{item.title}</h1>
      <p className="lede">{item.description}</p>
      <div className="title-row">
        <CopyCommand command={install} />
        {item.tags.length > 0 && <div className="tags">{item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>}
      </div>

      <section id="preview" className="section">
        <div className="view-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}><Eye size={15} aria-hidden="true" />Preview</button>
          <button role="tab" aria-selected={tab === "code"} onClick={() => setTab("code")}><Code2 size={15} aria-hidden="true" />Code</button>
        </div>
        {tab === "preview" ? <>
          <Stage layout={layout} minHeight={ready?.stage?.minHeight} toolbar={toolbar} frame={frame} fullscreen={fullscreen}>
            {demo === "missing" ? <p className="muted">There is no demo for {item.title} yet. Add one in <code>site/demos/{item.name}.tsx</code>.</p> : ready ? <Boundary resetKey={mountKey}><Render key={mountKey} demo={ready} props={merged} /></Boundary> : null}
          </Stage>
          {ready && (controls.length > 0 || Object.keys(callbacks).length > 0) && <Controls docs={controls} base={baseProps} values={values} onChange={setValues} events={events} hasCallbacks={Object.keys(callbacks).length > 0} onClearEvents={() => setEvents([])} />}
        </> : <div className="code-view">
          <div className="file-tabs" role="tablist" aria-label="Files">
            {files.map((entry, index) => <button key={entry.path} role="tab" aria-selected={index === activeFile} onClick={() => setActiveFile(index)} data-shared={!entry.own || undefined}>{entry.target.split("/").pop()}</button>)}
          </div>
          {file && <CodeBlock key={file.path} code={file.content} filename={file.target} language={file.path.split(".").pop() === "css" ? "css" : "tsx"} />}
        </div>}
      </section>

      {hasExamples && ready && <section id="examples" className="section">
        <h2>Examples</h2>
        {variantProps.map(doc => <div key={doc.name} className="example">
          <h3><code>{doc.name}</code></h3>
          <div className="variant-grid">
            {(doc.control?.kind === "enum" ? doc.control.options : []).map(option => {
              const value = doc.control?.kind === "enum" && doc.control.numeric ? Number(option) : option;
              return <figure key={option} className="variant">
                <Stage layout={layout}><Boundary resetKey={`${item.name}:${doc.name}:${option}`}><Render demo={ready} props={{ ...merged, [doc.name]: value }} /></Boundary></Stage>
                <figcaption><code>{option}</code></figcaption>
              </figure>;
            })}
          </div>
        </div>)}
        {ready.examples?.map(example => {
          return <div key={example.title} className="example">
            <h3>{example.title}</h3>
            {example.description && <p className="muted">{example.description}</p>}
            <Stage layout={example.stage?.layout ?? layout} minHeight={example.stage?.minHeight}><Boundary resetKey={`${item.name}:${example.title}`}><ExampleView render={example.render} /></Boundary></Stage>
          </div>;
        })}
      </section>}

      <section id="installation" className="section">
        <h2>Installation</h2>
        <h3>With the shadcn CLI</h3>
        <CopyCommand command={install} block />
        <h3>Manually</h3>
        <ol className="steps">
          {item.dependencies.length > 0 && <li><p>Install the dependencies.</p><CopyCommand command={`npm install ${item.dependencies.join(" ")}`} block /></li>}
          <li><p>Copy these files into your project. Shared files are skipped if you already have them.</p>
            <ul className="file-list">{item.files.map(entry => <li key={entry.path}><code>{entry.target}</code>{!entry.own && <span className="muted"> shared</span>}</li>)}</ul>
          </li>
          <li><p>Install the foundation once per app for the design and motion tokens: <CopyCommand command={`npx shadcn@latest add ${registryNamespace}/silicon-foundation`} inline /></p></li>
        </ol>
      </section>

      <section id="usage" className="section">
        <h2>Usage</h2>
        {ready ? <CodeBlock code={usageFor(item, ready, Object.fromEntries(Object.entries(merged).filter(([name]) => name in values || name === "children" || ["string", "number", "boolean"].includes(typeof baseProps[name]))), item.props)} language="tsx" /> : <CodeBlock code={importLine(item)} language="tsx" />}
      </section>

      {hasApi && <section id="api" className="section">
        <h2>API reference</h2>
        {item.parts.filter(part => part.props.length || part.extends).map(part => <div key={part.name} className="api-part">
          {item.parts.length > 1 && <h3><code>{part.name}</code></h3>}
          {part.props.length > 0 && <div className="table-wrap"><table className="api-table">
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>{part.props.map(doc => <tr key={doc.name}>
              <td><code className="prop-name">{doc.name}{doc.required && <span className="required" title="Required">*</span>}</code>{doc.description && <p>{doc.description}</p>}</td>
              <td><code className="prop-type">{doc.type}</code>{doc.control?.kind === "enum" && !doc.type.includes("\"") && !doc.type.includes("'") && <p className="enum-values">{doc.control.options.map(option => <code key={option}>{doc.control?.kind === "enum" && doc.control.numeric ? option : `"${option}"`}</code>)}</p>}</td>
              <td>{doc.default ? <code>{doc.default}</code> : <span className="muted">—</span>}</td>
            </tr>)}</tbody>
          </table></div>}
          {part.extends && <p className="muted extends">{part.props.length ? "Also accepts" : "Accepts"} the props of {describeExtends(part.extends)}.</p>}
        </div>)}
      </section>}

      <section id="dependencies" className="section">
        <h2>Dependencies</h2>
        <dl className="deps">
          <dt>npm</dt>
          <dd>{item.dependencies.length ? item.dependencies.map(name => <a key={name} className="chip" href={`https://www.npmjs.com/package/${name}`} target="_blank" rel="noreferrer">{name}</a>) : <span className="muted">None</span>}</dd>
          <dt>Registry</dt>
          <dd>{item.registryDependencies.length ? item.registryDependencies.map(name => <Link key={name} className="chip" href={`/${name}`}>{name}</Link>) : <span className="muted">None</span>}</dd>
        </dl>
      </section>

      {related.length > 0 && <section id="related" className="section">
        <h2>Related</h2>
        <div className="related-grid">{related.map(entry => <Link key={entry.name} href={`/${entry.name}`} className="related-card"><strong>{entry.title}</strong><span>{entry.description}</span></Link>)}</div>
      </section>}
    </main>
    <OnThisPage entries={toc} />
  </div>;
}
