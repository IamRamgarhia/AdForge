"use client";

import { BrandSwitcher } from "./BrandSwitcher";
import { LiveDot } from "./LiveDot";

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
