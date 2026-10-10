import { useState } from "react";

import ShortcutRecorder, { type ShortcutBinding, type ShortcutRecorderProps } from "@/registry/components/shortcut-recorder/shortcut-recorder";
import { defineDemo } from "../lib/demo";

const field = { width: "min(100%, 360px)" } as const;

const taken: ShortcutBinding[] = [
  { shortcut: "mod+shift+p", label: "Open command palette" },
  { shortcut: "mod+j", label: "Toggle activity panel" },
  { shortcut: "mod+shift+d", label: "Deploy silicon" },
];

const actions = [
  { id: "palette", label: "Open command palette", initial: "mod+shift+p" },
  { id: "search", label: "Search tickets", initial: "mod+k" },
  { id: "handoff", label: "Hand off to a person", initial: "mod+shift+h" },
];

/** Each row's bindings are the others' shortcuts, so taking one asks first and then unbinds it. */
function SettingsPanel() {
  const [keys, setKeys] = useState<Record<string, string | null>>(() => Object.fromEntries(actions.map(action => [action.id, action.initial])));
  return <div style={{ ...field, display: "grid", gap: 18 }}>
    {actions.map(action => <ShortcutRecorder key={action.id} label={action.label} value={keys[action.id] ?? null} resetValue={action.initial}
      bindings={actions.filter(other => other.id !== action.id && keys[other.id]).map(other => ({ shortcut: keys[other.id]!, label: other.label }))}
      onValueChange={(next, { replaced }) => setKeys(current => {
        const updated = { ...current, [action.id]: next };
        if (replaced) for (const other of actions) if (other.id !== action.id && current[other.id] === replaced.shortcut) updated[other.id] = null;
        return updated;
      })} />)}
  </div>;
}

export default defineDemo<ShortcutRecorderProps>({
  props: {
    label: "Quick search",
    description: "Opens search from anywhere in the workspace.",
    bindings: taken,
    resetValue: "mod+k",
  },
  hideControls: ["value", "defaultValue", "resetValue", "id", "className"],
  Preview: ({ props }) => {
    const [value, setValue] = useState<string | null>("mod+k");
    return <div style={field}><ShortcutRecorder {...props} value={value} onValueChange={(next, details) => { setValue(next); props.onValueChange?.(next, details); }} /></div>;
  },
  examples: [
    {
      title: "Settings with conflicts",
      description: "Record one row's shortcut in another and it asks before taking it; Use anyway clears the old row.",
      render: () => <SettingsPanel />,
    },
    {
      title: "Empty and disabled",
      render: () => <div style={{ ...field, display: "grid", gap: 18 }}>
        <ShortcutRecorder label="Pause all silicons" placeholder="Record shortcut" />
        <ShortcutRecorder label="Sign out" defaultValue="mod+shift+q" disabled description="Set by your administrator." />
      </div>,
    },
  ],
  usage: `const [shortcut, setShortcut] = useState<string | null>("mod+k");

<ShortcutRecorder
  label="Quick search"
  value={shortcut}
  onValueChange={setShortcut}
  resetValue="mod+k"
  bindings={[{ shortcut: "mod+shift+p", label: "Open command palette" }]}
/>`,
});
