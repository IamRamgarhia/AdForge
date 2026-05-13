"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandSwitcher } from "./BrandSwitcher";
import { LiveDot } from "./LiveDot";
import { getLastGenerated, type LastGenerated } from "@/lib/next-steps";

interface Props {
  scope: string; // e.g. "google/rsa"
  title: string;
  subtitle?: string;
  showLive?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({ scope, title, subtitle, showLive, actions }: Props) {
  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-center gap-3 mb-2">
        <span className="scope-prefix">~/{scope}</span>
        {showLive ? <LiveDot /> : null}
        <div className="flex-1" />
        <LastGeneratedPill />
        {actions ?? <BrandSwitcher />}
      </div>
      <h1 className="font-display italic text-[42px] leading-none text-ink tracking-ui-tight">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-[15px] text-ink-muted max-w-2xl leading-relaxed">{subtitle}</p>
      ) : null}
      <div className="mt-5 hairline" />
    </div>
  );
}

/**
 * Shows the most recently saved asset across all tools, with a deep link to
 * History. Updates live via the `ados:last-generated-changed` event fired by
 * GeneratorShell on every successful save — so a user who generates an ad in
 * one tool sees it referenced as "Last: ..." in every other tool they open.
 */
function LastGeneratedPill() {
  const [last, setLast] = useState<LastGenerated | null>(null);
  useEffect(() => {
    setLast(getLastGenerated());
    const refresh = () => setLast(getLastGenerated());
    window.addEventListener("ados:last-generated-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("ados:last-generated-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  if (!last) return null;
  return (
    <Link
      href={`/history?focus=${encodeURIComponent(last.id)}`}
      className="hidden md:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-ui-wide text-ink-muted hover:text-live transition border border-base-700 hover:border-live/40 px-2 py-1 rounded-sm"
      title={last.title}
    >
      <span className="text-pos">●</span>
      <span className="text-ink-subtle">last:</span>
      <span className="truncate max-w-[160px]">{last.campaign_type}</span>
    </Link>
  );
}
