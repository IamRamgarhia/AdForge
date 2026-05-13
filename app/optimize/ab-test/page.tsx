"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { buildAbTestPrompt, type AbTestInput } from "@/lib/prompts/ab-test";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<AbTestInput & Record<string, unknown>> = {
  title: "A/B Test Planner",
  subtitle: "Single-variable, sample-sized, with kill/winner rules. Refuses to greenlight 4-week marathons.",
  platform: "google",
  campaign_type: "A/B Plan",
  maxTokens: 2800,
  fields: [
    {
      name: "platform",
      label: "Platform",
      kind: "select",
      options: [
        { value: "Google Search", label: "Google Search" },
        { value: "Meta Feed", label: "Meta Feed" },
        { value: "TikTok In-Feed", label: "TikTok In-Feed" },
        { value: "LinkedIn", label: "LinkedIn" },
      ],
    },
    { name: "daily_clicks", label: "Daily clicks/variant", kind: "text", required: true, placeholder: "e.g. 200" },
    { name: "current_ad", label: "Current control ad", kind: "textarea", required: true, rows: 5, placeholder: "Paste the full ad…", span: 2 },
    { name: "hypothesis_to_test", label: "What you want to test", kind: "textarea", required: true, rows: 2, placeholder: "e.g. does urgency in the headline lift CTR?", span: 2 },
  ],
  initial: { platform: "Google Search", daily_clicks: "", current_ad: "", hypothesis_to_test: "" } as any,
  buildPrompt: (input) => buildAbTestPrompt(input as unknown as AbTestInput),
  buildTitle: (i: any) => `A/B · ${i.platform}`,
  expectJson: true,
  renderJson: (json) => <AbOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/ab-test" />;
}

function AbOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title="Hypothesis">
        <p className="text-sm text-ink leading-relaxed">{json?.hypothesis}</p>
        <div className="flex items-center gap-2 mt-3">
          <Pill text={json?.primary_metric} tone="live" label="primary" />
          {json?.secondary_metrics?.map((m: string, i: number) => (
            <Pill key={i} text={m} label="2nd" />
          ))}
        </div>
      </Section>

      <Section title="Variants">
        <ul className="space-y-2">
          {(json?.variants ?? []).map((v: any, i: number) => (
            <li key={i} className="border border-base-700 bg-base-900/30 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Pill text={v.label} tone={v.label === "Control" ? "default" : "live"} />
                <span className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">change: {v.single_change_from_control}</span>
              </div>
              <p className="text-sm text-ink whitespace-pre-line">{v.ad_copy}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Math">
        <div className="grid md:grid-cols-3 gap-2">
          <Kv k="sample / variant" v={`${json?.sample_size_per_variant_clicks?.toLocaleString() ?? "—"} clicks`} />
          <Kv k="days to signif" v={json?.expected_days_to_significance ?? "—"} />
          <Kv k="MDE" v={`${json?.minimum_detectable_lift_pct ?? 10}%`} />
        </div>
      </Section>

      {json?.decision_rules ? (
        <Section title="Decision rules">
          <ul className="space-y-1.5 text-sm">
            {Object.entries(json.decision_rules).map(([k, v]: any) => (
              <li key={k} className="flex gap-2 border border-base-700 px-2 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-ui-mega text-live w-32 mt-0.5">{k.replace(/_/g, " ")}</span>
                <span className="text-ink flex-1">{v}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.failure_modes_to_avoid?.length ? (
        <Section title="Failure modes">
          <ul className="list-disc list-inside text-sm text-ink-muted space-y-0.5">
            {json.failure_modes_to_avoid.map((f: string, i: number) => <li key={i}>{f}</li>)}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}
