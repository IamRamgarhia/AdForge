"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { buildAudienceTargetingPrompt, type AudienceTargetingInput } from "@/lib/prompts/audience-targeting";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<AudienceTargetingInput & Record<string, unknown>> = {
  title: "Audience Targeting Plan",
  subtitle: "Three-tier layered targeting (cold / warm / hot) with budget allocation + suppressions.",
  platform: "meta",
  campaign_type: "Audience Plan",
  maxTokens: 3500,
  fields: [
    {
      name: "platform",
      label: "Platform",
      kind: "select",
      options: [
        { value: "meta", label: "Meta" },
        { value: "google", label: "Google" },
        { value: "linkedin", label: "LinkedIn" },
        { value: "tiktok", label: "TikTok" },
      ],
    },
    { name: "product", label: "Product", kind: "text", required: true, placeholder: "e.g. accounting SaaS for solopreneurs", span: 2 },
    { name: "audience_who", label: "Who buys this", kind: "textarea", required: true, rows: 2, placeholder: "Solo freelancers + 1-3 person agencies, US/CA, $1k-10k MRR", span: 2 },
    { name: "budget_monthly", label: "Budget / mo (USD)", kind: "text", required: true, placeholder: "3000" },
    { name: "geo", label: "Geo", kind: "text", required: true, placeholder: "US + Canada" },
    { name: "goal", label: "Goal", kind: "text", required: true, placeholder: "trial signups" },
  ],
  initial: { platform: "meta", product: "", audience_who: "", budget_monthly: "", geo: "", goal: "" } as any,
  buildPrompt: (input) => buildAudienceTargetingPrompt(input as unknown as AudienceTargetingInput),
  buildTitle: (i: any) => `Audience · ${i.platform} · ${i.product?.slice(0, 24)}`,
  expectJson: true,
  renderJson: (json) => <AudienceOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/audience" />;
}

function Tier({ title, data, tone }: { title: string; data: any; tone: "info" | "live" | "pos" }) {
  if (!data) return null;
  return (
    <div className="border border-base-600 bg-base-900/40">
      <div className="flex items-center justify-between border-b border-base-700 px-4 py-2">
        <h3 className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-muted">{title}</h3>
        <Pill text={`${data.budget_pct ?? 0}% budget`} tone={tone} />
      </div>
      <div className="p-4 space-y-3 text-sm">
        {data.audience_size_range ? <Kv k="size range" v={data.audience_size_range} /> : null}
        {data.interests_stacks?.length ? (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">interest stacks</div>
            <ul className="space-y-1">
              {data.interests_stacks.map((s: any, i: number) => (
                <li key={i} className="border border-base-700 px-2 py-1 text-xs">
                  <span className="text-live">{s.label}: </span><span className="text-ink">{s.items?.join(" · ")}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {data.audiences?.length ? (
          <ul className="space-y-1.5">
            {data.audiences.map((a: any, i: number) => (
              <li key={i} className="border border-base-700 px-2 py-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-ink font-medium">{a.name}</span>
                  <Pill text={a.expected_size ?? "?"} label="size" />
                </div>
                <div className="text-ink-muted mt-0.5">{a.rule}</div>
              </li>
            ))}
          </ul>
        ) : null}
        {data.lookalike_seeds?.length ? (
          <div className="text-xs">
            <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">lookalike seeds</div>
            {data.lookalike_seeds.map((l: any, i: number) => (
              <div key={i} className="text-ink">{l.match_pct}% from <span className="font-mono text-info">{l.source_list_name}</span></div>
            ))}
          </div>
        ) : null}
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {data.kpi_target ? <Kv k="kpi" v={data.kpi_target} /> : null}
          {data.frequency_cap ? <Kv k="freq cap" v={data.frequency_cap} /> : null}
          {data.creative_format ? <Kv k="format" v={data.creative_format} /> : null}
        </div>
      </div>
    </div>
  );
}

function AudienceOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Tier title="Cold prospecting" data={json?.cold_prospecting} tone="info" />
      <Tier title="Warm retargeting" data={json?.warm_retargeting} tone="live" />
      <Tier title="Hot remarketing" data={json?.hot_remarketing} tone="pos" />

      {json?.exclusions?.length ? (
        <Section title="Exclusions (apply across tiers)">
          <ul className="space-y-1">
            {json.exclusions.map((e: any, i: number) => (
              <li key={i} className="flex gap-2 border border-base-700 px-2 py-1.5 text-xs">
                <span className="text-ink font-medium w-32">{e.name}</span>
                <span className="flex-1 text-ink-muted">{e.rule}</span>
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">{e.applies_to_tiers?.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.platform_specific_features_to_enable?.length ? (
        <Section title="Platform features to enable">
          <ul className="space-y-1.5">
            {json.platform_specific_features_to_enable.map((f: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5 text-xs">
                <Pill text={f.use ? "on" : "off"} tone={f.use ? "pos" : "default"} />
                <div className="flex-1">
                  <div className="text-ink">{f.feature}</div>
                  <div className="text-ink-muted text-[11px]">{f.rationale}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}
