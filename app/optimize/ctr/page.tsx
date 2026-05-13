"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, ScoreBar, Pill } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { buildCtrPrompt, type CtrInput } from "@/lib/prompts/ctr-optimizer";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<CtrInput & Record<string, unknown>> = {
  title: "CTR Optimizer",
  subtitle: "Diagnose the levers killing your CTR. Specific rewrites with named fixes — no vague verdicts.",
  platform: "google",
  campaign_type: "CTR Optimize",
  maxTokens: 3000,
  fields: [
    {
      name: "platform",
      label: "Platform",
      kind: "select",
      options: [
        { value: "Google Search", label: "Google Search" },
        { value: "Google Display", label: "Google Display" },
        { value: "Meta Feed", label: "Meta Feed" },
        { value: "Meta Stories", label: "Meta Stories" },
        { value: "TikTok In-Feed", label: "TikTok In-Feed" },
        { value: "LinkedIn Sponsored", label: "LinkedIn Sponsored" },
      ],
    },
    { name: "industry", label: "Industry", kind: "text", required: true, placeholder: "e.g. b2b_saas" },
    { name: "current_copy", label: "Current ad copy", kind: "textarea", required: true, rows: 6, placeholder: "Paste the full ad copy here…", span: 2 },
    { name: "current_ctr", label: "Current CTR", kind: "text", placeholder: "e.g. 1.2%" },
    { name: "spend_period", label: "Spend / period", kind: "text", placeholder: "e.g. $800 / 30 days" },
  ],
  initial: { platform: "Google Search", industry: "", current_copy: "", current_ctr: "", spend_period: "" } as any,
  buildPrompt: (input) => buildCtrPrompt(input as unknown as CtrInput),
  buildTitle: (i: any) => `CTR · ${i.platform}`,
  expectJson: true,
  renderJson: (json) => <CtrOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="optimize/ctr" />;
}

const verdictTone: Record<string, "pos" | "live" | "neg" | "default"> = {
  above_avg: "pos",
  at_avg: "default",
  below_avg: "live",
  severely_below: "neg",
};

function CtrOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title="Verdict">
        <div className="flex items-center gap-3">
          <Pill text={json?.verdict?.replace(/_/g, " ") ?? "—"} tone={verdictTone[json?.verdict] ?? "default"} label="ctr" />
          <span className="text-xs text-ink-muted">{json?.industry_benchmark_cited}</span>
        </div>
      </Section>

      <Section title="Lever scores">
        <ul className="space-y-2">
          {Object.entries(json?.scores ?? {}).map(([k, v]: any) => (
            <li key={k} className="flex items-start gap-3 border border-base-700 px-2 py-1.5">
              <span className="font-mono text-[10px] uppercase tracking-ui-mega text-ink-faint w-32">{k.replace(/_/g, " ")}</span>
              <ScoreBar score={v.score} />
              <span className="flex-1 text-xs text-ink-muted">{v.reason}</span>
            </li>
          ))}
        </ul>
      </Section>

      {json?.rewrites?.length ? (
        <Section title="Rewrites">
          <ul className="space-y-2">
            {json.rewrites.map((r: any, i: number) => (
              <li key={i} className="border border-base-700 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Pill text={r.lever_targeted?.replace(/_/g, " ")} tone="live" label="lever" />
                  <span className="text-[10px] font-mono uppercase tracking-ui-mega text-pos">{r.expected_lift_directional}</span>
                </div>
                <div className="text-xs space-y-1">
                  <div><span className="text-ink-faint">before:</span> <span className="line-through text-ink-subtle">{r.before}</span></div>
                  <div><span className="text-pos">after:</span> <span className="text-ink">{r.after}</span></div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.full_rewritten_version ? (
        <Section title="Full rewrite" actions={<CopyButton text={json.full_rewritten_version} />}>
          <p className="text-sm text-ink whitespace-pre-line">{json.full_rewritten_version}</p>
        </Section>
      ) : null}

      {json?.kill_or_iterate ? (
        <Section title="Decision">
          <div className="flex items-center gap-2">
            <Pill text={json.kill_or_iterate} tone={json.kill_or_iterate === "kill" ? "neg" : json.kill_or_iterate === "iterate" ? "pos" : "live"} />
            <span className="text-xs text-ink-muted">{json.kill_or_iterate_reason}</span>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
