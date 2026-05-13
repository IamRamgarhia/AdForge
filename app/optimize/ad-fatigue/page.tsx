"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, ScoreBar } from "@/components/OutputBlocks";
import { buildFatiguePrompt, type FatigueInput } from "@/lib/prompts/ad-fatigue";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<FatigueInput & Record<string, unknown>> = {
  title: "Ad Fatigue Detector",
  subtitle: "Frequency, CTR decay, CPM creep, creative lifespan. Refresh options ranked by effort.",
  platform: "meta",
  campaign_type: "Fatigue",
  maxTokens: 2800,
  fields: [
    {
      name: "platform",
      label: "Platform",
      kind: "select",
      options: [
        { value: "Meta Feed", label: "Meta Feed" },
        { value: "Meta Stories/Reels", label: "Meta Stories/Reels" },
        { value: "TikTok In-Feed", label: "TikTok In-Feed" },
        { value: "Google Display", label: "Google Display" },
      ],
    },
    { name: "days_running", label: "Days running", kind: "number", required: true, placeholder: "21" },
    { name: "ad_copy", label: "Current ad copy", kind: "textarea", required: true, rows: 4, placeholder: "Paste the ad…", span: 2 },
    { name: "current_frequency", label: "Current frequency", kind: "text", placeholder: "3.4" },
    { name: "ctr_trend", label: "CTR trend (WoW)", kind: "text", placeholder: "down 35% week over week" },
    { name: "cpm_trend", label: "CPM trend", kind: "text", placeholder: "up 22% over 14 days" },
  ],
  initial: { platform: "Meta Feed", days_running: 7, ad_copy: "", current_frequency: "", ctr_trend: "", cpm_trend: "" } as any,
  buildPrompt: (input) => buildFatiguePrompt(input as unknown as FatigueInput),
  buildTitle: (i: any) => `Fatigue · ${i.platform}`,
  expectJson: true,
  renderJson: (json) => <FatigueOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/ad-fatigue" />;
}

const sevTone: Record<string, "pos" | "live" | "neg" | "default"> = {
  none: "pos",
  mild: "default",
  moderate: "live",
  severe: "neg",
};

function FatigueOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title="Severity">
        <Pill text={json?.fatigue_severity_overall ?? "—"} tone={sevTone[json?.fatigue_severity_overall] ?? "default"} />
      </Section>

      {json?.signals ? (
        <Section title="Signals">
          <ul className="space-y-2">
            {Object.entries(json.signals).map(([k, v]: any) => (
              <li key={k} className="flex items-start gap-3 border border-base-700 px-2 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-ui-mega text-ink-faint w-32 mt-1">{k.replace(/_/g, " ")}</span>
                <ScoreBar score={v.score} />
                <span className="flex-1 text-xs text-ink-muted">{v.reading}</span>
                {v.threshold_breached ? <Pill text="breached" tone="neg" /> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.refresh_options ? (
        <Section title="Refresh options">
          {(["low_effort", "medium_effort", "high_effort"] as const).map((tier) => {
            const items = json.refresh_options?.[tier] ?? [];
            if (!items.length) return null;
            return (
              <div key={tier} className="border-t border-base-700 pt-3 first:border-t-0 first:pt-0 mt-3 first:mt-0">
                <div className="text-[10px] font-mono uppercase tracking-ui-mega text-live mb-2">{tier.replace(/_/g, " ")}</div>
                <ul className="space-y-1.5">
                  {items.map((it: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5 text-xs">
                      <span className="font-medium text-ink w-32">{it.action}</span>
                      <span className="flex-1 text-ink-muted">{it.specific_change}</span>
                      <span className="text-pos font-mono uppercase tracking-ui-wide text-[10px]">{it.expected_lift}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Section>
      ) : null}

      {json?.new_angles_to_test?.length ? (
        <Section title="New angles to test">
          <ul className="space-y-1.5">
            {json.new_angles_to_test.map((a: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5 text-xs">
                <Pill text={a.angle_label} tone="live" />
                <div className="flex-1">
                  <div className="text-ink font-medium">{a.angle}</div>
                  <div className="text-ink-muted">{a.rationale}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.kill_threshold ? (
        <Section title="Kill threshold">
          <p className="text-sm text-neg font-mono">{json.kill_threshold}</p>
        </Section>
      ) : null}
    </div>
  );
}
