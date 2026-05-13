"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { buildBidStrategyPrompt, type BidStrategyInput } from "@/lib/prompts/bid-strategy";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<BidStrategyInput & Record<string, unknown>> = {
  title: "Bid Strategy Advisor",
  subtitle: "Strategy matched to your actual conversion volume, not your aspirations.",
  platform: "google",
  campaign_type: "Bid Advisor",
  maxTokens: 2500,
  fields: [
    {
      name: "platform",
      label: "Platform",
      kind: "select",
      options: [
        { value: "Google Ads", label: "Google Ads" },
        { value: "Meta Ads", label: "Meta Ads" },
        { value: "TikTok Ads", label: "TikTok Ads" },
      ],
    },
    { name: "campaign_type", label: "Campaign type", kind: "text", required: true, placeholder: "Search / PMax / Sales" },
    { name: "goal", label: "Goal", kind: "text", required: true, placeholder: "leads / sales / app installs" },
    { name: "monthly_budget", label: "Budget / month ($)", kind: "text", required: true, placeholder: "5000" },
    { name: "conversions_per_month", label: "Conversions / month", kind: "text", required: true, placeholder: "e.g. 35" },
    { name: "current_cpa", label: "Current CPA", kind: "text", placeholder: "$45" },
    { name: "target_cpa", label: "Target CPA", kind: "text", placeholder: "$30" },
    { name: "target_roas", label: "Target ROAS", kind: "text", placeholder: "4.0" },
  ],
  initial: {
    platform: "Google Ads",
    campaign_type: "",
    goal: "",
    monthly_budget: "",
    conversions_per_month: "",
    current_cpa: "",
    target_cpa: "",
    target_roas: "",
  } as any,
  buildPrompt: (input) => buildBidStrategyPrompt(input as unknown as BidStrategyInput),
  buildTitle: (i: any) => `Bid · ${i.platform} · ${i.campaign_type}`,
  expectJson: true,
  renderJson: (json) => <BidOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/bid-strategy" />;
}

function BidOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title="Recommendation">
        <div className="font-display italic text-3xl text-live leading-tight">{json?.recommended_strategy}</div>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">{json?.reason}</p>
        {json?.fallback_strategy_if_data_insufficient ? (
          <div className="mt-3 border-t border-base-700 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">fallback: </span>
            <span className="text-sm text-ink">{json.fallback_strategy_if_data_insufficient}</span>
          </div>
        ) : null}
      </Section>

      {json?.learning_phase ? (
        <Section title="Learning phase">
          <Kv k="days to hold" v={`${json.learning_phase.days_to_hold} days`} />
          <div className="mt-3 grid md:grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-ui-mega text-neg mb-1">do not change</div>
              <ul className="list-disc list-inside text-sm text-ink space-y-0.5">{json.learning_phase.do_not_change?.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-ui-mega text-pos mb-1">ok to change</div>
              <ul className="list-disc list-inside text-sm text-ink space-y-0.5">{json.learning_phase.ok_to_change?.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
        </Section>
      ) : null}

      {json?.bid_adjustments?.length ? (
        <Section title="Bid adjustments">
          <ul className="space-y-1.5">
            {json.bid_adjustments.map((b: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5 text-xs">
                <Pill text={b.dimension} label="dim" />
                <span className="text-ink flex-1">{b.adjustment}</span>
                <span className="text-ink-muted">{b.reason}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.budget_pacing_recommendation ? (
        <Section title="Budget pacing">
          <p className="text-sm text-ink">{json.budget_pacing_recommendation}</p>
        </Section>
      ) : null}

      {json?.early_warning_signs?.length ? (
        <Section title="Early-warning signs">
          <ul className="list-disc list-inside text-sm text-ink-muted space-y-0.5">{json.early_warning_signs.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
        </Section>
      ) : null}

      {json?.graduation_path ? (
        <Section title="Graduation path">
          <div className="flex items-center gap-2 text-sm">
            <Pill text={json.graduation_path.current} />
            <span className="text-ink-faint">→</span>
            <Pill text={json.graduation_path.next_strategy} tone="live" />
            <span className="text-xs text-ink-muted ml-2">when: {json.graduation_path.trigger_threshold}</span>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
