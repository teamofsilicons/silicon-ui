"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/registry/components/button/button";
import { Input } from "@/registry/components/input/input";
import { NumberField } from "@/registry/components/number-field/number-field";
import SegmentedControl from "@/registry/components/segmented-control/segmented-control";
import { Select } from "@/registry/components/select/select";
import { Switch } from "@/registry/components/switch/switch";
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

/** The props panel, built from Silicon UI's own controls: one per simple prop the component declares. */
export function Controls({ docs, base, values, onChange, events, hasCallbacks, onClearEvents }: ControlsProps) {
  const current = (doc: PropDoc) => doc.name in values && values[doc.name] !== undefined ? values[doc.name] : base[doc.name] !== undefined ? base[doc.name] : parseDefault(doc.default);
  const set = (name: string, value: unknown) => onChange({ ...values, [name]: value });
  const changed = Object.values(values).some(value => value !== undefined);

  return <div className="controls">
    {docs.length > 0 && <div className="controls-head">
      <span>Props</span>
      {changed && <Button variant="ghost" size="sm" onClick={() => onChange({})}><RotateCcw size={13} aria-hidden="true" />Reset</Button>}
    </div>}
    {docs.length > 0 && <div className="controls-grid">
      {docs.map(doc => {
        const value = current(doc);
        const control = doc.control;
        let input = null;
        if (control?.kind === "boolean") {
          input = <Switch label={doc.name} checked={value === true} onCheckedChange={checked => set(doc.name, checked)} />;
        } else if (control?.kind === "enum") {
          const asValue = (option: string) => control.numeric ? Number(option) : option;
          input = control.options.length <= 4 && control.options.join("").length <= 28
            ? <div className="control-field"><span className="control-label">{doc.name}</span><SegmentedControl label={doc.name} value={value === undefined ? "" : String(value)} onValueChange={option => set(doc.name, asValue(option))} options={control.options.map(option => ({ value: option, label: option }))} /></div>
            : <Select label={doc.name} placeholder="Default" value={value === undefined ? undefined : String(value)} onValueChange={option => set(doc.name, asValue(option))} options={control.options.map(option => ({ value: option, label: option }))} />;
        } else if (control?.kind === "number") {
          input = typeof value === "number"
            ? <NumberField label={doc.name} size="sm" value={value} min={Number.MIN_SAFE_INTEGER} onValueChange={next => set(doc.name, next)} />
            : <Input label={doc.name} type="number" placeholder="Default" value="" onChange={event => set(doc.name, event.target.value === "" ? undefined : Number(event.target.value))} />;
        } else if (control?.kind === "string") {
          input = <Input label={doc.name} placeholder="Default" value={typeof value === "string" ? value : ""} onChange={event => set(doc.name, event.target.value === "" && base[doc.name] === undefined ? undefined : event.target.value)} />;
        }
        const wide = control?.kind === "enum" && control.options.length > 2 && control.options.join("").length > 14;
        return <div key={doc.name} className="control" data-kind={control?.kind} data-wide={wide || undefined} title={doc.description || undefined}>{input}</div>;
      })}
    </div>}
    {hasCallbacks && <div className="events">
      <div className="controls-head"><span>Events</span>{events.length > 0 && <Button variant="ghost" size="sm" onClick={onClearEvents}>Clear</Button>}</div>
      {events.length ? <ol className="event-list">{events.map(event => <li key={event.id}><code>{event.name}</code><span>{event.detail}</span></li>)}</ol> : <p className="muted small">Interact with the preview to see its callbacks fire.</p>}
    </div>}
  </div>;
}
