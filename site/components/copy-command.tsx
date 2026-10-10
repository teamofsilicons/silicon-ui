"use client";

import { CopyButton } from "@/registry/components/copy-button/copy-button";

/** A shell command with Silicon UI's copy button beside it. */
export function CopyCommand({ command, block = false, inline = false }: { command: string; block?: boolean; inline?: boolean }) {
  return <span className="command" data-block={block || undefined} data-inline={inline || undefined}>
    <code><span className="command-prompt" aria-hidden="true">$</span>{command}</code>
    <CopyButton value={command} label="Copy command" iconOnly variant="plain" />
  </span>;
}
