"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { buildKeywordPrompt, type KeywordInput } from "@/lib/prompts/keyword-strategy";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<KeywordInput & Record<string, unknown>> = {
  title: "Keyword Strategy Builder",
  subtitle: "Funnel-mapped keywords + match types + negatives + bid strategy. Single-theme ad groups.",
  platform: "google",
  campaign_type: "Keyword Plan",
  maxTokens: 4000,
  fields: [
    { name: "product", label: "Product / service", kind: "text", required: true, placeholder: "e.g. tax prep software", span: 2 },
    { name: "market", label: "Market / region", kind: "text", required: true, placeholder: "e.g. US small businesses" },
    { name: "competitors", label: "Competitors", kind: "text", placeholder: "TurboTax, FreshBooks, HR Block" },
    { name: "current_keywords", label: "Current keywords (if any)", kind: "textarea", rows: 3, placeholder: "Paste your current list, one per line", span: 2 },
  ],
  initial: { product: "", market: "", competitors: "", current_keywords: "" } as any,
  buildPrompt: (input) => buildKeywordPrompt(input as unknown as KeywordInput),
  buildTitle: (i: any) => `Keywords · ${i.product}`,
  expectJson: true,
  renderJson: (json) => <KwOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/keywords" />;
}

const intentTone: Record<string, "pos" | "live" | "info" | "default"> = {
  transactional: "pos",
  commercial_investigation: "live",
  informational: "info",
  branded: "default",
  navigational: "default",
};

function KwOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title={`Keywords · ${json?.keywords?.length ?? 0}`} actions={<CopyButton text={(json?.keywords ?? []).map((k: any) => `${k.term}\t${k.match_type}`).join("\n")} label="copy tsv" />}>
        <ul className="space-y-1">
          {(json?.keywords ?? []).map((k: any, i: number) => (
            <li key={i} className="flex items-center gap-2 border border-base-700 px-2 py-1.5 text-xs">
              <Pill text={k.intent?.replace(/_/g, " ")} tone={intentTone[k.intent] ?? "default"} />
              <span className="font-mono text-[10px] uppercase tracking-ui-mega text-ink-faint w-14">{k.match_type}</span>
              <span className="flex-1 text-ink">{k.term}</span>
              <span className="text-ink-subtle truncate w-32">{k.ad_group_suggestion}</span>
              <span className={`font-mono text-[10px] tabular ${k.competition_guess === "high" ? "text-neg" : k.competition_guess === "medium" ? "text-live" : "text-pos"}`}>{k.competition_guess}</span>
            </li>
          ))}
        </ul>
      </Section>

      {json?.negative_keywords?.length ? (
        <Section title="Negatives" actions={<CopyButton text={json.negative_keywords.join("\n")} label="copy" />}>
          <div className="flex flex-wrap gap-1.5">
            {json.negative_keywords.map((n: string, i: number) => (
              <span key={i} className="border border-base-700 bg-base-900/30 px-2 py-1 text-xs text-ink">−{n}</span>
            ))}
          </div>
        </Section>
      ) : null}

      {json?.ad_group_structure?.length ? (
        <Section title="Ad group structure">
          <ul className="space-y-1.5">
            {json.ad_group_structure.map((g: any, i: number) => (
              <li key={i} className="border border-base-700 p-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{g.name}</span>
                  <Pill text={`${g.keyword_count} kw`} />
                  <span className="text-ink-muted text-[11px]">{g.theme}</span>
                </div>
                <div className="text-[11px] text-ink-subtle mt-1">examples: {g.example_keywords?.join(", ")}</div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.long_tail_opportunities?.length ? (
        <Section title="Long-tail opportunities">
          <ul className="list-disc list-inside text-sm text-ink space-y-0.5">{json.long_tail_opportunities.map((l: string, i: number) => <li key={i}>{l}</li>)}</ul>
        </Section>
      ) : null}

      {json?.competitor_gaps?.length ? (
        <Section title="Competitor gaps">
          <ul className="list-disc list-inside text-sm text-ink space-y-0.5">{json.competitor_gaps.map((l: string, i: number) => <li key={i}>{l}</li>)}</ul>
        </Section>
      ) : null}

      {json?.bidding_recommendation ? (
        <Section title="Bidding">
          <div className="grid md:grid-cols-2 gap-2">
            <Kv k="strategy" v={json.bidding_recommendation.strategy} />
            <Kv k="learning days" v={json.bidding_recommendation.learning_phase_days} />
          </div>
          <p className="text-xs text-ink-muted mt-2">{json.bidding_recommendation.reason}</p>
          {json.bidding_recommendation.switch_to_smart_when ? (
            <p className="text-xs text-pos mt-1">→ upgrade when: {json.bidding_recommendation.switch_to_smart_when}</p>
          ) : null}
        </Section>
      ) : null}
    </div>
  );
}
