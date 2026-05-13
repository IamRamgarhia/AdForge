"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { getUsage } from "@/lib/settings";
import { formatCost, formatTokens } from "@/lib/utils";

export function UsageBadge() {
  const [usage, setUsage] = useState({ cost: 0, input: 0, output: 0 });

  useEffect(() => {
    const update = () => setUsage(getUsage());
    update();
    window.addEventListener("ados:usage", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("ados:usage", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400"
      title={`Input ${formatTokens(usage.input)} · Output ${formatTokens(usage.output)} tokens`}
    >
      <Coins size={12} className="text-amber-400" />
      <span className="tabular-nums">{formatCost(usage.cost)}</span>
      <span className="text-zinc-600">session</span>
    </div>
  );
}
