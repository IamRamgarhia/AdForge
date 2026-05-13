"use client";

import { BrandSwitcher } from "./BrandSwitcher";
import { LiveDot } from "./LiveDot";

interface Props {
  title: string;
  subtitle?: string;
  scope?: string;
  showLive?: boolean;
}

export function Topbar({ title, subtitle, scope, showLive }: Props) {
  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-center gap-3 mb-2">
        {scope ? <span className="scope-prefix">~/{scope}</span> : null}
        {showLive ? <LiveDot /> : null}
        <div className="flex-1" />
        <BrandSwitcher />
      </div>
      <h1 className="font-display italic text-[42px] leading-none text-ink tracking-ui-tight">{title}</h1>
      {subtitle ? <p className="mt-3 text-[13px] text-ink-muted max-w-2xl leading-relaxed">{subtitle}</p> : null}
      <div className="mt-5 hairline" />
    </div>
  );
}
