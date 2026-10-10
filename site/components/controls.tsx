"use client";

import { RotateCcw } from "lucide-react";

import type { PropDoc } from "../lib/catalog";

export type ControlValues = Record<string, unknown>;

/** Turns a default written in source (`"md"`, `24`, `false`) into its value; anything else stays unknown. */
export function parseDefault(text: string | null): unknown {
  if (text == null) return undefined;
  if (/^(["'`]).*\1$/.test(text)) return text.slice(1, -1);
  if (text === "true" || text === "false") return text === "true";
  if (/^-?\d*\.?\d+$/.test(text)) return Number(text);
  return undefined;
}

interface ControlsProps {
  docs: PropDoc[];
  base: Record<string, unknown>;
  values: ControlValues;
  onChange: (values: ControlValues) => void;
  events: { id: number; name: string; detail: string }[];
  hasCallbacks: boolean;
  onClearEvents: () => void;
}

export function Controls({ docs, base, values, onChange, events, hasCallbacks, onClearEvents }: ControlsProps) {
  const current = (doc: PropDoc) => doc.name in values && values[doc.name] !== undefined ? values[doc.name] : base[doc.name] !== undefined ? base[doc.name] : parseDefault(doc.default);
  const set = (name: string, value: unknown) => onChange({ ...values, [name]: value });
  const changed = Object.values(values).some(value => value !== undefined);

  return <div className="controls">
    {docs.length > 0 && <div className="controls-head">
      <span>Props</span>
      {changed && <button className="text-button" onClick={() => onChange({})}><RotateCcw size={12} aria-hidden="true" />Reset</button>}
    </div>}
    {docs.length > 0 && <div className="controls-grid">
      {docs.map(doc => {
        const value = current(doc);
        const id = `control-${doc.name}`;
        const control = doc.control;
        let input = null;
        if (control?.kind === "boolean") {
          input = <button id={id} role="switch" aria-checked={value === true} className="mini-switch" onClick={() => set(doc.name, !(value === true))}><span /></button>;
        } else if (control?.kind === "enum") {
          const options = control.options;
          const asValue = (option: string) => control.numeric ? Number(option) : option;
          input = options.length <= 4 && options.join("").length <= 28
            ? <div className="segmented small" role="radiogroup" aria-labelledby={`${id}-label`}>
              {options.map(option => <button key={option} role="radio" aria-checked={String(value) === option} onClick={() => set(doc.name, asValue(option))}>{option}</button>)}
            </div>
            : <select id={id} className="field" value={value === undefined ? "" : String(value)} onChange={event => set(doc.name, event.target.value === "" ? undefined : asValue(event.target.value))}>
              {value === undefined && <option value="">—</option>}
              {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>;
        } else if (control?.kind === "number") {
          input = <input id={id} className="field" type="number" value={typeof value === "number" ? value : ""} placeholder="—" onChange={event => set(doc.name, event.target.value === "" ? undefined : Number(event.target.value))} />;
        } else if (control?.kind === "string") {
          input = <input id={id} className="field" type="text" value={typeof value === "string" ? value : ""} placeholder="—" onChange={event => set(doc.name, event.target.value === "" && base[doc.name] === undefined ? undefined : event.target.value)} />;
        }
        return <div key={doc.name} className="control" data-kind={control?.kind}>
          <label id={`${id}-label`} htmlFor={id} title={doc.description || undefined}><code>{doc.name}</code></label>
          {input}
        </div>;
      })}
    </div>}
    {hasCallbacks && <div className="events">
      <div className="controls-head"><span>Events</span>{events.length > 0 && <button className="text-button" onClick={onClearEvents}>Clear</button>}</div>
      {events.length ? <ol className="event-list">{events.map(event => <li key={event.id}><code>{event.name}</code><span>{event.detail}</span></li>)}</ol> : <p className="muted small">Interact with the preview to see its callbacks fire.</p>}
    </div>}
  </div>;
}
