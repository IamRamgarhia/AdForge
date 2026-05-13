"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  className,
  label = "copy",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className={cn(
        "inline-flex items-center gap-1.5 border border-base-600 bg-base-900/60 hover:bg-base-800 px-2 py-1 text-[10px] font-mono uppercase tracking-ui-wide text-ink-muted hover:text-ink",
        className
      )}
    >
      {copied ? <Check size={10} className="text-pos" /> : <Copy size={10} />}
      {copied ? "copied" : label}
    </button>
  );
}
