"use client";

import { ReactNode } from "react";

/**
 * Lightweight CSS-only tooltip. Hover or focus reveals body.
 * Wrap any inline element with: <Tooltip body="…">text or icon</Tooltip>
 */
export function Tooltip({ body, children, side = "bottom" }: { body: ReactNode; children: ReactNode; side?: "bottom" | "top" }) {
  const pos = side === "top" ? "bottom-full mb-2" : "top-full mt-2";
  return (
    <span className="relative inline-flex group/tt cursor-help" tabIndex={0}>
      <span className="underline decoration-dotted decoration-ink-faint underline-offset-4">{children}</span>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${pos} z-30 hidden group-hover/tt:block group-focus-within/tt:block w-64 border border-base-600 bg-base-950 text-ink text-[11px] leading-relaxed p-2 font-sans normal-case tracking-normal text-left`}
      >
        {body}
      </span>
    </span>
  );
}
