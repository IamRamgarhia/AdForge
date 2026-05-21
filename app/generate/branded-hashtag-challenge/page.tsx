"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { buildBhcPrompt, type BhcInput } from "@/lib/prompts/tiktok-bhc";
import type { GeneratorConfig } from "@/lib/generator-config";
import { BrandedHashtagChallengeSchema } from "@/lib/schemas/generators";

const config: GeneratorConfig<BhcInput & Record<string, unknown>> = {
  title: "TikTok Branded Hashtag Challenge",
  subtitle: "Viability check + tag concept + creator strategy + 6-day timeline. Refuses to greenlight if scale isn't there.",
  platform: "tiktok",
  campaign_type: "BHC",
  maxTokens: 4000,
  temperature: 0.8,
  fields: [
    { name: "brand", label: "Brand", kind: "text", required: true, placeholder: "e.g. Glossier" },
    {
      name: "budget_band",
      label: "Budget band",
      kind: "select",
      options: [
        { value: "100k_300k", label: "$100k – $300k (entry tier)" },
        { value: "300k_1m", label: "$300k – $1M (proper amplification)" },
        { value: "gt_1m", label: "$1M+ (cultural-moment scale)" },
      ],
    },
    { name: "product_or_message", label: "Product / message", kind: "textarea", required: true, rows: 2, placeholder: "What are we celebrating, launching, or activating?", span: 2 },
    { name: "target_audience", label: "Audience", kind: "text", required: true, placeholder: "Gen Z, beauty + makeup obsessed, US/UK", span: 2 },
    { name: "desired_action", label: "Desired action", kind: "text", required: true, placeholder: "Recreate the look + tag friends" },
    { name: "geo", label: "Geo", kind: "text", required: true, placeholder: "US, UK, AU" },
  ],
  initial: { brand: "", budget_band: "100k_300k", product_or_message: "", target_audience: "", desired_action: "", geo: "" } as any,
  buildPrompt: (input) => buildBhcPrompt(input as unknown as BhcInput),
  buildTitle: (i: any) => `BHC · ${i.brand}`,
  expectJson: true,
  schema: BrandedHashtagChallengeSchema,
  renderJson: (json) => <BhcOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/branded-hashtag-challenge" />;
}

function BhcOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      {json?.viability ? (
        <Section title="Viability check">
          <div className="flex items-baseline gap-3 mb-2">
            <div className={`font-display italic text-4xl tabular ${json.viability.score >= 7 ? "text-pos" : json.viability.score >= 5 ? "text-live" : "text-neg"}`}>
              {json.viability.score}/10
            </div>
            <Pill text={json.viability.recommend_proceed ? "proceed" : "do not proceed"} tone={json.viability.recommend_proceed ? "pos" : "neg"} />
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">{json.viability.reasoning}</p>
          {!json.viability.recommend_proceed && json.viability.alternative_if_not ? (
            <div className="mt-3 pt-2 border-t border-base-700 text-sm">
              <span className="text-ink-faint">alternative: </span><span className="text-pos">{json.viability.alternative_if_not}</span>
            </div>
          ) : null}
        </Section>
      ) : null}

      {json?.hashtag ? (
        <Section title="Hashtag" actions={<CopyButton text={json.hashtag.tag} />}>
          <div className="font-display italic text-3xl text-live">{json.hashtag.tag}</div>
          <p className="text-xs text-ink-muted mt-2 leading-relaxed">{json.hashtag.rationale}</p>
          {json.hashtag.potential_conflicts?.length ? (
            <div className="mt-3 pt-2 border-t border-base-700">
              <div className="text-[10px] font-mono uppercase tracking-ui-mega text-neg mb-1">potential conflicts</div>
              <ul className="text-xs text-ink-muted">{json.hashtag.potential_conflicts.map((c: string, i: number) => <li key={i}>⚠ {c}</li>)}</ul>
            </div>
          ) : null}
        </Section>
      ) : null}

      {json?.participation_mechanic ? (
        <Section title="Participation mechanic">
          <div className="space-y-2">
            <Kv k="instruction" v={json.participation_mechanic.instruction} />
            <Kv k="defining element" v={json.participation_mechanic.defining_element} />
            <Kv k="story arc" v={json.participation_mechanic.story_arc} />
            <Kv k="incentive" v={json.participation_mechanic.incentive} />
          </div>
        </Section>
      ) : null}

      {json?.seed_creators?.length ? (
        <Section title="Seed creators">
          <ul className="space-y-1.5">
            {json.seed_creators.map((c: any, i: number) => (
              <li key={i} className="border border-base-700 p-3 text-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Pill text={c.tier} tone={c.tier === "mega" ? "live" : c.tier === "macro" ? "info" : "default"} />
                  <span className="text-ink font-medium">{c.archetype}</span>
                  <span className="ml-auto text-[10px] font-mono uppercase tracking-ui-wide text-ink-faint">{c.post_cadence_week_1}</span>
                </div>
                <p className="text-ink-muted leading-relaxed mb-2">{c.rationale}</p>
                <ul className="text-[11px] space-y-0.5">{c.brief_points?.map((b: string, j: number) => <li key={j} className="text-ink">○ {b}</li>)}</ul>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.discover_page ? (
        <Section title="Discover page copy">
          <div className="border border-base-700 p-3 space-y-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">challenge name</div>
              <p className="font-display italic text-2xl text-live">{json.discover_page.challenge_name}</p>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">description</div>
              <p className="text-sm text-ink">{json.discover_page.description}</p>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">featured creator brief</div>
              <p className="text-xs text-ink-muted">{json.discover_page.featured_creator_brief}</p>
            </div>
          </div>
        </Section>
      ) : null}

      {json?.sound_strategy ? (
        <Section title="Sound strategy">
          <Pill text={json.sound_strategy.approach} tone="live" />
          <p className="text-xs text-ink-muted mt-2">{json.sound_strategy.rationale}</p>
        </Section>
      ) : null}

      {json?.six_day_timeline?.length ? (
        <Section title="6-day timeline">
          <ul className="space-y-1.5">
            {json.six_day_timeline.map((d: any, i: number) => (
              <li key={i} className="flex gap-3 border border-base-700 px-3 py-2 text-xs">
                <span className="font-mono text-live tabular w-12 mt-1">day {d.day}</span>
                <div className="flex-1">
                  <ul className="space-y-0.5 text-ink">{d.actions?.map((a: string, j: number) => <li key={j}>· {a}</li>)}</ul>
                  <div className="text-[11px] text-pos mt-1">→ {d.expected_outcome}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.success_metrics ? (
        <Section title="Success metrics">
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            <Kv k="day 1 floor" v={`${json.success_metrics.day_1_floor_participations} participations`} />
            <Kv k="day 3 checkpoint" v={json.success_metrics.day_3_checkpoint} />
            <Kv k="end of week" v={json.success_metrics.end_of_week_win_threshold} pos />
            <Kv k="kill signal" v={json.success_metrics.kill_signal} />
          </div>
        </Section>
      ) : null}

      {json?.compliance ? (
        <Section title="Compliance">
          <div className="space-y-1.5 text-xs">
            <Kv k="disclosure" v={json.compliance.disclosure_language} />
            <Kv k="age-gating" v={json.compliance.age_gating_needed ? "required" : "not required"} />
          </div>
          {json.compliance.brand_safety_constraints?.length ? (
            <ul className="mt-2 text-[11px] text-ink-muted">{json.compliance.brand_safety_constraints.map((c: string, i: number) => <li key={i}>⚠ {c}</li>)}</ul>
          ) : null}
        </Section>
      ) : null}
    </div>
  );
}
