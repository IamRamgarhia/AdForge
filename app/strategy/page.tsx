"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { buildStrategyPrompt, type StrategyInput } from "@/lib/prompts/strategy-recommender";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<StrategyInput & Record<string, unknown>> = {
  title: "What ad should I run?",
  subtitle: "Platform recommendation based on your actual budget, business, and audience — with anti-recommendations.",
  platform: "google",
  campaign_type: "Strategy Plan",
  maxTokens: 2800,
  fields: [
    {
      name: "business_type",
      label: "Business type",
      kind: "select",
      options: [
        { value: "ecommerce", label: "E-commerce" },
        { value: "saas_b2b", label: "B2B SaaS" },
        { value: "saas_b2c", label: "B2C app / SaaS" },
        { value: "local_service", label: "Local service business" },
        { value: "agency", label: "Agency / consultancy" },
        { value: "publisher", label: "Publisher / media" },
        { value: "education", label: "Education / coaching" },
        { value: "marketplace", label: "Marketplace" },
      ],
    },
    { name: "product", label: "Product / service", kind: "text", required: true, placeholder: "e.g. AI photo editor", span: 2 },
    { name: "monthly_budget", label: "Budget / month (USD)", kind: "text", required: true, placeholder: "1500" },
    { name: "goal", label: "Primary goal", kind: "text", required: true, placeholder: "free trial signups" },
    { name: "timeline", label: "Timeline", kind: "text", placeholder: "3 weeks to first read" },
    { name: "audience_age", label: "Audience age band", kind: "text", placeholder: "25-44" },
    { name: "geo", label: "Geo", kind: "text", placeholder: "US + Canada" },
  ],
  initial: { business_type: "ecommerce", product: "", monthly_budget: "", goal: "", timeline: "", audience_age: "", geo: "" } as any,
  buildPrompt: (input) => buildStrategyPrompt(input as unknown as StrategyInput),
  buildTitle: (i: any) => `Strategy · ${i.product}`,
  expectJson: true,
  renderJson: (json) => <StrategyOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="strategy" />;
}

function StrategyOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title="Primary platform">
        <div className="flex items-baseline gap-3">
          <div className="font-display italic text-3xl text-live">{json?.primary_platform?.name}</div>
          <Pill label="min budget" text={`$${(json?.primary_platform?.min_budget_usd ?? 0).toLocaleString()}/mo`} />
        </div>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">{json?.primary_platform?.reason}</p>
      </Section>

      {json?.secondary_platform?.name ? (
        <Section title="Secondary platform">
          <div className="flex items-baseline gap-3">
            <div className="font-display italic text-2xl text-ink">{json.secondary_platform.name}</div>
            <Pill label="min" text={`$${(json.secondary_platform.min_budget_usd ?? 0).toLocaleString()}/mo`} />
          </div>
          <p className="text-sm text-ink-muted mt-2">{json.secondary_platform.reason}</p>
        </Section>
      ) : null}

      <Section title="Plan">
        <div className="grid md:grid-cols-3 gap-2">
          <Kv k="funnel stage" v={json?.funnel_stage ?? "—"} />
          <Kv k="timeline" v={`${json?.timeline_to_first_read_days ?? "—"} days`} />
          <Kv k="format priority" v={(json?.creative_format_priority ?? []).join(" · ")} />
        </div>
      </Section>

      {json?.kpi_targets?.length ? (
        <Section title="KPI targets">
          <ul className="space-y-1.5 text-xs">
            {json.kpi_targets.map((k: any, i: number) => (
              <li key={i} className="flex items-center gap-2 border border-base-700 px-2 py-1.5">
                <span className="font-mono text-ink-faint w-12">m{k.month}</span>
                <span className="flex-1 text-ink">{k.metric}</span>
                <span className="text-pos font-mono tabular">{k.target}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.month_one_budget_split?.length ? (
        <Section title="Month 1 budget split">
          <ul className="space-y-1.5 text-sm">
            {json.month_one_budget_split.map((b: any, i: number) => (
              <li key={i} className="flex items-center gap-2 border border-base-700 px-2 py-1.5">
                <span className="font-mono text-live w-12 tabular">{b.pct}%</span>
                <span className="w-32 text-ink">{b.platform}</span>
                <span className="text-ink-muted text-xs tabular">${(b.dollars ?? 0).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.anti_recommendations?.length ? (
        <Section title="Anti-recommendations">
          <ul className="list-disc list-inside text-sm text-neg space-y-0.5">{json.anti_recommendations.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
        </Section>
      ) : null}

      {json?.stop_conditions_to_resolve_first?.length ? (
        <Section title="Resolve before launch">
          <ul className="space-y-1 text-sm">{json.stop_conditions_to_resolve_first.map((s: string, i: number) => <li key={i} className="flex gap-2"><span className="text-live">○</span>{s}</li>)}</ul>
        </Section>
      ) : null}
    </div>
  );
}
