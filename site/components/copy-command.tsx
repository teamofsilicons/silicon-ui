"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCommand({ command, block = false, inline = false }: { command: string; block?: boolean; inline?: boolean }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = () => navigator.clipboard?.writeText(command).then(() => setCopied(true), () => {});
  return <span className="command" data-block={block || undefined} data-inline={inline || undefined}>
    <code><span className="command-prompt" aria-hidden="true">$</span>{command}</code>
    <button onClick={copy} aria-label={copied ? "Copied" : "Copy command"}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
  </span>;
}
