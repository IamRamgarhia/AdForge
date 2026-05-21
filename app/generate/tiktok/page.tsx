"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { TikTokMockup } from "@/components/AdMockup";
import { buildTikTokPrompt, type TikTokInput } from "@/lib/prompts/tiktok-ads";
import type { GeneratorConfig } from "@/lib/generator-config";
import { TiktokSchema } from "@/lib/schemas/generators";

const config: GeneratorConfig<TikTokInput & Record<string, unknown>> = {
  title: "TikTok — Hooks & UGC",
  subtitle: "50 hooks per click. Native, not polished. UGC scripts with creator brief + B-roll.",
  platform: "tiktok",
  campaign_type: "Hooks/UGC",
  maxTokens: 4000,
  temperature: 0.95,
  fields: [
    {
      name: "format",
      label: "Output",
      kind: "select",
      options: [
        { value: "hooks", label: "50 hooks (variations)" },
        { value: "ugc_script", label: "3 UGC scripts" },
      ],
    },
    { name: "product", label: "Product", kind: "text", required: true, placeholder: "e.g. matcha latte powder" },
    { name: "audience", label: "Audience", kind: "text", required: true, placeholder: "millennial wellness people, NYC", span: 2 },
    { name: "vibe", label: "Brand vibe", kind: "text", placeholder: "native, raw, slightly chaotic", span: 2 },
  ],
  initial: { format: "hooks", product: "", audience: "", vibe: "" } as any,
  buildPrompt: (input) => buildTikTokPrompt(input as unknown as TikTokInput),
  buildTitle: (i: any) => `TikTok · ${i.format} · ${i.product}`,
  expectJson: true,
  schema: TiktokSchema,
  renderJson: (json) => <TikTokOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/tiktok" />;
}

function TikTokOutput({ json }: { json: any }) {
  if (json?.hooks) {
    const top = json.hooks.slice(0, 3);
    return (
      <div className="space-y-4 stagger">
        <Section title="Live preview · TikTok For You">
          <div className="grid md:grid-cols-3 gap-3">
            {top.map((h: any, i: number) => (
              <TikTokMockup
                key={i}
                brand="yourbrand"
                hook={h.hook}
                caption={h.continuation ?? ""}
                cta="Shop now"
              />
            ))}
          </div>
        </Section>
        <Section title={`Hooks · ${json.hooks.length}`} actions={<CopyButton text={json.hooks.map((h: any) => h.hook).join("\n")} label="copy hooks" />}>
          <ul className="space-y-1.5">
            {json.hooks.map((h: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 bg-base-900/30 px-2 py-2">
                <span className="font-mono text-[10px] text-ink-faint w-5 tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-live w-24 mt-0.5">{h.formula}</span>
                <div className="flex-1">
                  <div className="text-sm text-ink font-medium">{h.hook}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{h.continuation}</div>
                </div>
                <CopyButton text={h.hook} label="" />
              </li>
            ))}
          </ul>
        </Section>
        {json.production_notes?.length ? (
          <Section title="Production notes">
            <ul className="list-disc list-inside text-sm text-ink space-y-1">
              {json.production_notes.map((n: string, i: number) => <li key={i}>{n}</li>)}
            </ul>
          </Section>
        ) : null}
      </div>
    );
  }
  if (json?.scripts) {
    return (
      <div className="space-y-4 stagger">
        {json.scripts.map((s: any, i: number) => (
          <Section key={i} title={`Script · ${s.title}`} actions={<CopyButton text={s.script_beats?.map((b: any) => `${b.t} ${b.spoken}`).join("\n")} label="copy script" />}>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-muted mb-1">creator brief</div>
                <p className="text-ink">{s.creator_brief}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-muted mb-1">script</div>
                <div className="space-y-1">
                  {s.script_beats?.map((b: any, bi: number) => (
                    <div key={bi} className="flex gap-2 text-xs">
                      <span className="font-mono text-ink-faint w-12">{b.t}</span>
                      <div className="flex-1">
                        <div className="text-ink">{b.spoken}</div>
                        <div className="text-ink-subtle text-[11px]">visual: {b.visual}</div>
                        {b.overlay ? <div className="text-live text-[11px]">overlay: {b.overlay}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Pill label="caption" text={s.caption} tone="live" />
              </div>
              {s.hashtags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {s.hashtags.map((t: string, ti: number) => (
                    <span key={ti} className="text-[11px] text-info font-mono">{t}</span>
                  ))}
                </div>
              ) : null}
              {s.b_roll?.length ? (
                <div className="text-[12px] text-ink-muted">B-roll: {s.b_roll.join(" · ")}</div>
              ) : null}
            </div>
          </Section>
        ))}
      </div>
    );
  }
  return null;
}
