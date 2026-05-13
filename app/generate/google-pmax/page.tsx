"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill } from "@/components/OutputBlocks";
import { CharBadge } from "@/components/CharBadge";
import { CopyButton } from "@/components/CopyButton";
import { buildPmaxPrompt, PMAX_LIMITS, type PmaxInput } from "@/lib/prompts/google-pmax";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<PmaxInput & Record<string, unknown>> = {
  title: "Google Performance Max",
  subtitle: "Full asset group: 15 headlines, 5 long headlines, 5 descriptions, image prompts, video script, audience signals.",
  platform: "google",
  campaign_type: "PMax",
  maxTokens: 4500,
  temperature: 0.8,
  fields: [
    {
      name: "goal",
      label: "Goal",
      kind: "select",
      options: [
        { value: "sales", label: "Sales" },
        { value: "leads", label: "Leads" },
        { value: "store visits", label: "Store visits" },
        { value: "brand awareness", label: "Brand awareness" },
      ],
    },
    { name: "business_name", label: "Business name", kind: "text", required: true, placeholder: "e.g. Acme Co" },
    { name: "product", label: "Product / service", kind: "text", required: true, placeholder: "e.g. cold-press juice subscription", span: 2 },
    { name: "audience", label: "Audience signal", kind: "textarea", required: true, rows: 2, placeholder: "Who's the in-market buyer? Behaviors? Custom intent terms?", span: 2 },
    { name: "landing_url", label: "Landing URL", kind: "text", placeholder: "https://…" },
  ],
  initial: { goal: "sales", business_name: "", product: "", audience: "", landing_url: "" } as any,
  buildPrompt: (input) => buildPmaxPrompt(input as unknown as PmaxInput),
  buildTitle: (i: any) => `PMax · ${i.product}`,
  expectJson: true,
  renderJson: (json) => <PmaxOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/google/pmax" />;
}

function PmaxOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      <Section title={`Headlines · ${json?.headlines?.length ?? 0} / 15`} actions={<CopyButton text={(json?.headlines ?? []).map((h: any) => h.trimmed_alt || h.text).join("\n")} />}>
        <ul className="divide-y divide-base-700">
          {(json?.headlines ?? []).map((h: any, i: number) => (
            <li key={i} className="flex items-center gap-2 py-1.5">
              <CharBadge count={h.chars || h.text?.length || 0} max={PMAX_LIMITS.headline} />
              <span className="w-20 text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">{h.angle}</span>
              <span className={`text-sm flex-1 ${h.status === "over" ? "line-through text-ink-subtle" : "text-ink"}`}>{h.text}</span>
              <CopyButton text={h.trimmed_alt || h.text} label="" />
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Long headlines · ${json?.long_headlines?.length ?? 0} / 5`}>
        <ul className="space-y-1.5">
          {(json?.long_headlines ?? []).map((h: any, i: number) => (
            <li key={i} className="flex items-start gap-2 border border-base-700 bg-base-900/30 px-2 py-1.5">
              <CharBadge count={h.chars || h.text?.length || 0} max={PMAX_LIMITS.long_headline} />
              <span className="w-24 text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint mt-0.5">{h.angle?.replace(/_/g, " ")}</span>
              <span className={`text-sm flex-1 ${h.status === "over" ? "line-through text-ink-subtle" : "text-ink"}`}>{h.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Descriptions · ${json?.descriptions?.length ?? 0} / 5`}>
        <ul className="space-y-1.5">
          {(json?.descriptions ?? []).map((d: any, i: number) => (
            <li key={i} className="flex items-start gap-2 border border-base-700 bg-base-900/30 px-2 py-1.5">
              <CharBadge count={d.chars || d.text?.length || 0} max={PMAX_LIMITS.description} />
              <span className={`text-sm flex-1 ${d.status === "over" ? "line-through text-ink-subtle" : "text-ink"}`}>{d.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {json?.business_name ? (
        <Section title="Business name">
          <div className="flex items-center gap-2">
            <CharBadge count={json.business_name?.length || 0} max={PMAX_LIMITS.business_name} />
            <span className="text-ink">{json.business_name}</span>
          </div>
        </Section>
      ) : null}

      {json?.image_prompts?.length ? (
        <Section title="Image prompts">
          <ul className="grid md:grid-cols-3 gap-2">
            {json.image_prompts.map((p: any, i: number) => (
              <li key={i} className="border border-base-700 p-3 text-xs">
                <Pill label="ratio" text={p.ratio} tone="live" />
                <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mt-2">{p.size}</div>
                <p className="text-ink mt-2 leading-relaxed">{p.prompt}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.video_script ? (
        <Section title="Video script (15s)">
          {Object.entries(json.video_script).map(([k, v]: any) => (
            <div key={k} className="flex gap-2 text-xs mb-1.5">
              <span className="font-mono text-ink-faint w-20">{k.replace(/_/g, " ")}</span>
              <div className="flex-1 text-ink">{v?.vo}<div className="text-ink-subtle text-[11px]">visual: {v?.visual}</div></div>
            </div>
          ))}
        </Section>
      ) : null}

      {json?.audience_signals?.length ? (
        <Section title="Audience signals">
          <ul className="space-y-1.5">
            {json.audience_signals.map((s: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5 text-xs">
                <Pill text={s.type?.replace(/_/g, " ")} tone="live" />
                <div className="flex-1">
                  <div className="text-ink font-medium">{s.value}</div>
                  <div className="text-ink-muted text-[11px] mt-0.5">{s.rationale}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}
