"use client";

import { useState } from "react";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { PageHeader } from "@/components/PageHeader";
import { Pill } from "@/components/OutputBlocks";
import { COST_SAVERS } from "@/lib/cost-savers";

const PLATFORMS = COST_SAVERS;

export default function Page() {
  return (
    <ApiKeyGate>
      <Inner />
    </ApiKeyGate>
  );
}

function Inner() {
  const [active, setActive] = useState(PLATFORMS[0].platform);
  const current = PLATFORMS.find((p) => p.platform === active)!;

  const counts = {
    low: current.tips.filter((t) => t.effort === "low").length,
    medium: current.tips.filter((t) => t.effort === "medium").length,
    high: current.tips.filter((t) => t.effort === "high").length,
  };

  return (
    <div>
      <PageHeader
        scope="optimize/cost-savers"
        title="Cost-Saving Tactics"
        subtitle="Specific moves with named expected savings. Sorted by platform. Filter by effort level."
      />

      <div className="flex flex-wrap gap-1.5 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p.platform}
            onClick={() => setActive(p.platform)}
            className={`border px-3 py-1.5 text-[11px] font-mono uppercase tracking-ui-wide ${
              active === p.platform ? "border-live text-live bg-live/5" : "border-base-600 text-ink-muted hover:text-ink"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatCard label="low effort" value={`${counts.low} tactics`} tone="pos" />
        <StatCard label="medium effort" value={`${counts.medium} tactics`} tone="live" />
        <StatCard label="high effort" value={`${counts.high} tactics`} tone="info" />
      </div>

      <div className="border border-base-600 bg-base-900/40 stagger">
        {current.tips.map((t, i) => (
          <div key={i} className="border-b border-base-700 last:border-b-0 p-4 hover:bg-base-800/30 transition">
            <div className="flex items-start gap-3 mb-2">
              <span className="font-mono text-[10px] tabular text-ink-faint w-6 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-ink leading-snug">{t.tactic}</h3>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{t.why}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 ml-9">
              <Pill text={t.effort} tone={t.effort === "low" ? "pos" : t.effort === "medium" ? "live" : "info"} label="effort" />
              <span className="text-[10px] font-mono uppercase tracking-ui-mega text-pos">→ {t.expected_savings}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[10px] font-mono uppercase tracking-ui-wide text-ink-subtle">
        savings are directional · effort assumes you have access to your ad account dashboard
      </p>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "pos" | "live" | "info" }) {
  const map: Record<string, string> = { pos: "text-pos border-pos/40", live: "text-live border-live/40", info: "text-info border-info/40" };
  return (
    <div className={`border bg-base-900/30 p-3 ${map[tone]}`}>
      <div className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">{label}</div>
      <div className="font-display italic text-xl mt-1">{value}</div>
    </div>
  );
}
