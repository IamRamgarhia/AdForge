"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill, Kv } from "@/components/OutputBlocks";
import { CharBadge } from "@/components/CharBadge";
import { buildQualityScorePrompt, type QualityScoreInput } from "@/lib/prompts/quality-score";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<QualityScoreInput & Record<string, unknown>> = {
  title: "Quality Score Improver",
  subtitle: "Google's 1-10 rating diagnosed by its three factors. Each fix names the exact change.",
  platform: "google",
  campaign_type: "QS Improve",
  maxTokens: 3000,
  fields: [
    { name: "keyword", label: "Target keyword", kind: "text", required: true, placeholder: "e.g. project management software", span: 2 },
    { name: "current_ad_copy", label: "Current ad copy", kind: "textarea", required: true, rows: 5, placeholder: "Paste all headlines + descriptions", span: 2 },
    { name: "landing_page_summary", label: "Landing page summary", kind: "textarea", required: true, rows: 4, placeholder: "Describe the LP: H1, hero copy, CTA, social proof, load speed.", span: 2 },
    { name: "current_qs", label: "Current QS (1-10)", kind: "text", placeholder: "e.g. 5" },
  ],
  initial: { keyword: "", current_ad_copy: "", landing_page_summary: "", current_qs: "" } as any,
  buildPrompt: (input) => buildQualityScorePrompt(input as unknown as QualityScoreInput),
  buildTitle: (i: any) => `QS · ${i.keyword}`,
  expectJson: true,
  renderJson: (json) => <QsOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/quality-score" />;
}

const ratingTone: Record<string, "neg" | "live" | "pos"> = {
  low: "neg",
  average: "live",
  above_average: "pos",
};

function QsOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      {json?.projected_qs ? (
        <Section title="Projection">
          <div className="grid grid-cols-3 gap-2">
            <Kv k="current qs" v={json.projected_qs.current ?? "—"} />
            <Kv k="after fixes" v={json.projected_qs.after_fixes ?? "—"} pos />
            <Kv k="cpc savings" v={json.projected_qs.cpc_savings_estimate ?? "—"} pos />
          </div>
        </Section>
      ) : null}

      {json?.current_factors ? (
        <Section title="Three factors">
          <ul className="space-y-2">
            {Object.entries(json.current_factors).map(([k, v]: any) => (
              <li key={k} className="flex items-start gap-3 border border-base-700 px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-ui-mega text-ink-faint w-36 mt-0.5">{k.replace(/_/g, " ")}</span>
                <Pill text={v.rating?.replace(/_/g, " ")} tone={ratingTone[v.rating] ?? "default"} />
                <span className="flex-1 text-xs text-ink-muted">{v.reason}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.fixes?.length ? (
        <Section title="Specific fixes">
          <ul className="space-y-2 text-sm">
            {json.fixes.map((f: any, i: number) => (
              <li key={i} className="flex gap-2 border border-base-700 px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-ui-mega text-live w-28 mt-0.5">{f.factor?.replace(/_/g, " ")}</span>
                <span className="text-ink">{f.fix}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.improved_headlines?.length ? (
        <Section title="Improved headlines">
          <ul className="space-y-1">
            {json.improved_headlines.map((h: any, i: number) => (
              <li key={i} className="flex items-center gap-2 border border-base-700 px-2 py-1.5">
                <CharBadge count={h.chars ?? h.text?.length ?? 0} max={30} />
                <span className="text-sm text-ink flex-1">{h.text}</span>
                <span className="text-[10px] font-mono uppercase tracking-ui-mega text-pos">{h.targets_factor?.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.negative_keywords?.length ? (
        <Section title="Negatives to add">
          <div className="flex flex-wrap gap-1.5">
            {json.negative_keywords.map((n: string, i: number) => (
              <span key={i} className="border border-base-700 bg-base-900/30 px-2 py-1 text-xs text-ink">−{n}</span>
            ))}
          </div>
        </Section>
      ) : null}

      {json?.landing_page_checklist?.length ? (
        <Section title="Landing page checklist">
          <ul className="space-y-1 text-sm">
            {json.landing_page_checklist.map((c: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5">
                <Pill text={c.status_guess} tone={c.status_guess === "ok" ? "pos" : c.status_guess === "issue" ? "neg" : "default"} />
                <div className="flex-1">
                  <div className="text-ink">{c.item}</div>
                  {c.fix_if_issue ? <div className="text-xs text-ink-muted mt-0.5">{c.fix_if_issue}</div> : null}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}
