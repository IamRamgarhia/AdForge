"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { CharBadge } from "@/components/CharBadge";
import { MetaFeedMockup, ReelsMockup } from "@/components/AdMockup";
import { buildMetaPrompt, META_LIMITS, type MetaInput } from "@/lib/prompts/meta-ads";
import type { GeneratorConfig } from "@/lib/generator-config";
import { MetaSchema } from "@/lib/schemas/generators";

const config: GeneratorConfig<MetaInput & Record<string, unknown>> = {
  title: "Meta — Facebook + Instagram",
  subtitle: "3 angle-distinct variants per request. Char limits enforced for every placement.",
  platform: "meta",
  campaign_type: "Feed",
  maxTokens: 3500,
  temperature: 0.85,
  fields: [
    {
      name: "objective",
      label: "Objective",
      kind: "select",
      options: [
        { value: "awareness", label: "Awareness" },
        { value: "traffic", label: "Traffic" },
        { value: "engagement", label: "Engagement" },
        { value: "leads", label: "Leads" },
        { value: "sales", label: "Sales" },
        { value: "app installs", label: "App installs" },
      ],
    },
    {
      name: "format",
      label: "Format",
      kind: "select",
      options: [
        { value: "single_image", label: "Single image" },
        { value: "video", label: "Video" },
        { value: "carousel", label: "Carousel" },
        { value: "reels", label: "Reels" },
        { value: "stories", label: "Stories" },
      ],
    },
    { name: "product", label: "Product / offer", kind: "text", required: true, placeholder: "e.g. AI workout coach app", span: 2 },
    { name: "offer", label: "Promotion", kind: "text", placeholder: "7-day free trial" },
    { name: "cta", label: "Preferred CTA", kind: "text", placeholder: "Sign Up" },
  ],
  initial: { objective: "sales", format: "single_image", product: "", offer: "", cta: "" } as any,
  buildPrompt: (input) => buildMetaPrompt(input as unknown as MetaInput),
  buildTitle: (i: any) => `Meta · ${i.format} · ${i.product}`,
  expectJson: true,
  schema: MetaSchema,
  renderJson: (json) => <MetaOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/meta/feed" />;
}

function MetaOutput({ json }: { json: any }) {
  const v0 = json?.variants?.[0];
  const isVertical = v0?.video_script || v0?.label === "A" && v0?.cta_button && v0?.primary_text;
  return (
    <div className="space-y-4 stagger">
      {v0 ? (
        <Section title="Live preview · Meta">
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-ink-muted mb-2">Feed</div>
              <MetaFeedMockup
                brand={v0?.label ? "Your Brand" : "Brand"}
                primary_text={v0?.primary_text ?? ""}
                headline={v0?.headline ?? ""}
                description={v0?.description}
                cta={v0?.cta_button}
              />
            </div>
            {v0?.video_script ? (
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-ink-muted mb-2">Reels</div>
                <ReelsMockup
                  brand="Your Brand"
                  primary_text={v0.primary_text}
                  overlay_text={v0.video_script?.hook_0_3s}
                  cta={v0.cta_button}
                />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}
      {(json?.variants ?? []).map((v: any, i: number) => (
        <Section key={i} title={`Variant ${v.label} · ${v.angle}`} actions={<CopyButton text={`${v.primary_text}\n\n${v.headline}\n${v.description}`} label="copy variant" />}>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">primary</span>
                <CharBadge count={v.char_counts?.primary ?? v.primary_text?.length ?? 0} max={META_LIMITS.primary_above_fold} />
              </div>
              <p className="text-sm text-ink whitespace-pre-line">{v.primary_text}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">headline</span>
                <CharBadge count={v.char_counts?.headline ?? v.headline?.length ?? 0} max={META_LIMITS.headline_desktop} />
              </div>
              <p className="text-sm text-ink font-medium">{v.headline}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">desc</span>
                <CharBadge count={v.char_counts?.description ?? v.description?.length ?? 0} max={META_LIMITS.description} />
              </div>
              <p className="text-sm text-ink-muted">{v.description}</p>
            </div>
            <Pill text={v.cta_button} tone="live" label="cta" />

            {v.video_script ? (
              <div className="border-t border-base-700 pt-3 mt-3 space-y-2 text-sm">
                <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-muted">video script</div>
                <Beat t="0-3s" label="hook" body={v.video_script.hook_0_3s} />
                <Beat t="3-15s" label="value" body={v.video_script.value_3_15s} />
                <Beat t="last 5s" label="cta" body={v.video_script.cta_final_5s} />
                {v.video_script.b_roll?.length ? (
                  <div className="text-xs text-ink-muted">B-roll: {v.video_script.b_roll.join(" · ")}</div>
                ) : null}
              </div>
            ) : null}

            {v.cards?.length ? (
              <div className="border-t border-base-700 pt-3 mt-3 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-muted mb-2">carousel cards</div>
                {v.cards.map((c: any, ci: number) => (
                  <div key={ci} className="border border-base-700 p-2 text-xs flex items-center gap-2">
                    <span className="font-mono text-ink-faint w-4">{c.position}</span>
                    <span className="text-[9px] font-mono uppercase tracking-ui-mega text-live w-16">{c.role}</span>
                    <div className="flex-1">
                      <div className="text-ink">{c.headline}</div>
                      <div className="text-ink-subtle">{c.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Section>
      ))}

      {json?.audience_hint ? (
        <Section title="Targeting hint">
          <p className="text-sm text-ink">{json.audience_hint}</p>
          {json.best_placement_recommendation ? (
            <p className="text-[12px] text-ink-muted mt-2">{json.best_placement_recommendation}</p>
          ) : null}
        </Section>
      ) : null}
    </div>
  );
}

function Beat({ t, label, body }: { t: string; label: string; body: any }) {
  if (!body) return null;
  return (
    <div className="flex gap-2 text-xs">
      <span className="font-mono text-ink-faint w-12">{t}</span>
      <span className="text-[9px] font-mono uppercase tracking-ui-mega text-live w-12">{label}</span>
      <span className="text-ink flex-1">
        {typeof body === "string" ? body : `${body.vo} · ${body.visual}`}
      </span>
    </div>
  );
}
