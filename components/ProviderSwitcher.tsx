"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Zap, CheckCircle2, ExternalLink } from "lucide-react";
import { PROVIDERS, type Provider } from "@/lib/providers";
import { getActiveProviderId, setActiveProviderId, getProviderKey, getProvidersWithKeys } from "@/lib/settings";
import { getProviderLimits } from "@/lib/provider-limits";

/**
 * One-click provider switcher. Two surfaces:
 *   - "inline" → rendered inside rate-limit error panels with actionable buttons
 *   - "compact" → rendered in the StatusBar / page header as a dropdown
 *
 * Logic:
 *   - Providers with saved keys ≠ active: instant-switch buttons.
 *   - Providers without keys but with free tier: "Add free key" CTAs to /settings.
 *   - Free-tier providers are highlighted with green/pos coloring.
 */

interface Props {
  variant?: "inline" | "compact";
  /** Reason for the switcher to be visible — affects copy at top. */
  reason?: "rate-limit" | "default";
  onSwitch?: (providerId: string) => void;
}

export function ProviderSwitcher({ variant = "inline", reason = "default", onSwitch }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [configured, setConfigured] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => {
      setActiveId(getActiveProviderId() ?? "");
      setConfigured(getProvidersWithKeys());
    };
    refresh();
    window.addEventListener("ados:provider-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("ados:provider-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function switchTo(p: Provider) {
    setActiveProviderId(p.id);
    setActiveId(p.id);
    onSwitch?.(p.id);
  }

  // Partition providers
  const others = PROVIDERS.filter((p) => p.id !== activeId);
  const otherConfigured = others.filter((p) => configured.includes(p.id));
  const otherUnconfigured = others.filter((p) => !configured.includes(p.id));
  // Free-tier providers we recommend first when no key is set
  const freeRecommendations = otherUnconfigured.filter((p) => getProviderLimits(p.id)?.has_free_tier);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {otherConfigured.length > 0 ? (
          otherConfigured.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => switchTo(p)}
              className="text-[10px] font-mono uppercase tracking-ui-wide text-ink-muted hover:text-live transition border border-base-700 hover:border-live/40 px-1.5 py-0.5"
              title={`Switch active provider to ${p.name}`}
            >
              → {p.name}
            </button>
          ))
        ) : (
          <Link href="/settings" className="text-[10px] font-mono uppercase tracking-ui-wide text-info hover:underline">
            + add provider
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {otherConfigured.length > 0 ? (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-2">
            Switch to a configured provider · one click
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {otherConfigured.map((p) => {
              const lim = getProviderLimits(p.id);
              const isFree = lim?.has_free_tier;
              return (
                <button
                  key={p.id}
                  onClick={() => switchTo(p)}
                  className={`flex items-start gap-2 px-3 py-2.5 border text-left transition ${
                    isFree
                      ? "border-pos/40 bg-pos/5 hover:bg-pos/10 hover:border-pos"
                      : "border-base-600 bg-base-900/40 hover:bg-base-800/60 hover:border-base-500"
                  }`}
                >
                  <CheckCircle2 size={12} className={`shrink-0 mt-0.5 ${isFree ? "text-pos" : "text-live"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink">{p.name}</div>
                    {lim ? (
                      <div className={`text-[10px] font-mono uppercase tracking-ui-wide ${isFree ? "text-pos" : "text-ink-faint"} mt-0.5`}>
                        {isFree ? "FREE" : "PAID"} · {lim.summary.split("·").slice(0, 2).join("·").replace(/^FREE/, "").replace(/^Paid/, "").trim()}
                      </div>
                    ) : null}
                  </div>
                  <ArrowRight size={11} className="text-ink-faint shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {otherConfigured.length === 0 && freeRecommendations.length > 0 ? (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-pos mb-2 flex items-center gap-1.5">
            <Zap size={11} /> Add a free-tier provider in 30 seconds
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {freeRecommendations.slice(0, 4).map((p) => {
              const lim = getProviderLimits(p.id)!;
              return (
                <Link
                  key={p.id}
                  href={`/settings#provider-${p.id}`}
                  className="flex items-start gap-2 px-3 py-2.5 border border-pos/40 bg-pos/5 hover:bg-pos/10 hover:border-pos transition"
                >
                  <Plus size={12} className="text-pos shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink">{p.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-ui-wide text-pos mt-0.5">
                      FREE · {lim.summary.split("·").slice(0, 2).join("·").replace(/^FREE/, "").trim()}
                    </div>
                  </div>
                  <ExternalLink size={11} className="text-ink-faint shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
          <p className="text-[11px] text-ink-muted mt-2 leading-relaxed">
            Each one takes a free key (no credit card on Groq / Cerebras / Gemini / OpenRouter). You'll be in /settings to paste it and verify — back here in 30 seconds.
          </p>
        </div>
      ) : null}

      {otherConfigured.length > 0 && freeRecommendations.length > 0 ? (
        <div className="pt-2 border-t border-base-700">
          <Link href="/settings" className="text-[11px] font-mono uppercase tracking-ui-wide text-info hover:underline">
            + add more providers in settings
          </Link>
        </div>
      ) : null}

      {otherConfigured.length === 0 && freeRecommendations.length === 0 ? (
        <Link href="/settings" className="btn-primary inline-flex">
          <Plus size={11} /> Add another provider in Settings
        </Link>
      ) : null}
    </div>
  );
}
