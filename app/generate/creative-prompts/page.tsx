"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { ExternalLink } from "lucide-react";
import {
  buildCreativePromptPrompt,
  IMAGE_TOOLS,
  VIDEO_TOOLS,
  type CreativePromptInput,
  type CreativeToolLink,
} from "@/lib/prompts/creative-prompts";
import type { GeneratorConfig } from "@/lib/generator-config";
import { CreativePromptsSchema } from "@/lib/schemas/generators";

const config: GeneratorConfig<CreativePromptInput & Record<string, unknown>> = {
  title: "AI Creative Prompt Generator",
  subtitle: "Ready-to-paste prompts for Midjourney / DALL-E / Ideogram / Runway / Pika / Luma / HeyGen and more. Tool-specific syntax + tweaks + iteration estimate.",
  platform: "meta",
  campaign_type: "Creative Prompts",
  maxTokens: 4500,
  temperature: 0.85,
  fields: [
    {
      name: "asset_type",
      label: "Asset type",
      kind: "select",
      options: [
        { value: "static_image", label: "Static image (ad creative)" },
        { value: "product_photo", label: "Product photo / shot" },
        { value: "infographic", label: "Infographic / text-heavy image" },
        { value: "carousel_set", label: "Carousel set (multi-image)" },
        { value: "video_short", label: "Short video (≤ 15s)" },
        { value: "video_long", label: "Long video (15-60s)" },
        { value: "ugc_video", label: "UGC-style video / talking head" },
      ],
    },
    {
      name: "platform",
      label: "Destination platform",
      kind: "select",
      options: [
        { value: "Meta Feed", label: "Meta Feed" },
        { value: "Meta Reels / Stories", label: "Meta Reels / Stories" },
        { value: "TikTok In-Feed", label: "TikTok In-Feed" },
        { value: "Instagram Reels", label: "Instagram Reels" },
        { value: "YouTube In-Stream", label: "YouTube In-Stream" },
        { value: "YouTube Shorts", label: "YouTube Shorts" },
        { value: "Google Display", label: "Google Display" },
        { value: "Google Performance Max", label: "Google Performance Max" },
        { value: "LinkedIn Sponsored", label: "LinkedIn Sponsored" },
        { value: "Pinterest", label: "Pinterest" },
        { value: "Twitter / X", label: "Twitter / X" },
      ],
    },
    {
      name: "aspect_ratio",
      label: "Aspect ratio",
      kind: "select",
      options: [
        { value: "1:1", label: "1:1 square" },
        { value: "4:5", label: "4:5 portrait (feed)" },
        { value: "9:16", label: "9:16 vertical (Reels/Stories/TikTok)" },
        { value: "16:9", label: "16:9 landscape" },
        { value: "1.91:1", label: "1.91:1 (PMax landscape)" },
        { value: "2:3", label: "2:3 (Pinterest)" },
      ],
    },
    { name: "product", label: "Product", kind: "text", required: true, placeholder: "e.g. matcha latte powder" },
    { name: "brand_promise", label: "Brand promise · 1 sentence", kind: "textarea", required: true, rows: 2, placeholder: "What's the one visual idea you want the asset to deliver?", span: 2 },
    { name: "audience", label: "Audience", kind: "text", required: true, placeholder: "millennials, wellness-leaning, urban" },
    { name: "mood", label: "Mood / vibe", kind: "text", required: true, placeholder: "warm morning light, minimalist, slightly nostalgic" },
    { name: "must_include", label: "Must include", kind: "text", placeholder: "product visible, soft window light, ceramic mug" },
    { name: "must_avoid", label: "Must avoid", kind: "text", placeholder: "no faces of identifiable people, no logos other than ours" },
    { name: "duration_seconds", label: "Duration (video only)", kind: "text", placeholder: "e.g. 8 / 15 / 30" },
  ],
  initial: {
    asset_type: "static_image",
    platform: "Meta Feed",
    aspect_ratio: "4:5",
    product: "",
    brand_promise: "",
    audience: "",
    mood: "",
    must_include: "",
    must_avoid: "",
    duration_seconds: "",
  } as any,
  buildPrompt: (input) => buildCreativePromptPrompt(input as unknown as CreativePromptInput),
  buildTitle: (i: any) => `Creative · ${i.asset_type} · ${i.product?.slice(0, 24)}`,
  expectJson: true,
  schema: CreativePromptsSchema,
  renderJson: (json) => <CreativePromptOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/creative-prompts" />;
}

function CreativePromptOutput({ json }: { json: any }) {
  const wantedVideo = (json?.video_prompts?.length ?? 0) > 0;
  const wantedImage = (json?.static_image_prompts?.length ?? 0) > 0;
  return (
    <div className="space-y-4 stagger">
      {json?.asset_intent_summary ? (
        <Section title="Intent">
          <p className="font-display italic text-lg text-ink leading-relaxed">{json.asset_intent_summary}</p>
        </Section>
      ) : null}

      {json?.policy_warnings?.length ? (
        <Section title="Policy / safety warnings">
          <ul className="space-y-1">{json.policy_warnings.map((w: string, i: number) => (
            <li key={i} className="border border-neg/40 bg-neg/5 text-neg text-xs px-2 py-1.5">⚠ {w}</li>
          ))}</ul>
        </Section>
      ) : null}

      {wantedImage ? (
        <Section title={`Image prompts · ${json.static_image_prompts.length}`}>
          <ul className="space-y-3">
            {json.static_image_prompts.map((p: any, i: number) => (
              <PromptCard key={i} prompt={p} kind="image" />
            ))}
          </ul>
        </Section>
      ) : null}

      {wantedVideo ? (
        <Section title={`Video prompts · ${json.video_prompts.length}`}>
          <ul className="space-y-3">
            {json.video_prompts.map((p: any, i: number) => (
              <PromptCard key={i} prompt={p} kind="video" />
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.preflight_checklist?.length ? (
        <Section title="Preflight checklist">
          <ul className="space-y-1 text-sm text-ink">{json.preflight_checklist.map((c: string, i: number) => (
            <li key={i} className="flex gap-2"><span className="text-live">○</span>{c}</li>
          ))}</ul>
        </Section>
      ) : null}

      <Section title="Tool directory">
        <div className="grid md:grid-cols-2 gap-4">
          <ToolList title="Image generators" tools={IMAGE_TOOLS} />
          <ToolList title="Video generators" tools={VIDEO_TOOLS} />
        </div>
      </Section>
    </div>
  );
}

function PromptCard({ prompt, kind }: { prompt: any; kind: "image" | "video" }) {
  const tools = kind === "image" ? IMAGE_TOOLS : VIDEO_TOOLS;
  const link = tools.find((t) => t.name.toLowerCase().includes((prompt.tool || "").toLowerCase().split(" ")[0]));
  return (
    <li className="border border-base-700 bg-base-900/30 p-3 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Pill text={prompt.tool} tone="live" />
        {prompt.expected_iterations_to_winner ? (
          <span className="text-[10px] font-mono uppercase tracking-ui-wide text-ink-faint">
            ~{prompt.expected_iterations_to_winner} gens to winner
          </span>
        ) : null}
        {link ? (
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-ui-wide text-info hover:underline"
          >
            open {prompt.tool} <ExternalLink size={10} />
          </a>
        ) : null}
      </div>
      <p className="text-[11px] text-ink-muted">{prompt.best_for_this_brief}</p>

      <div className="border-t border-base-700 pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono uppercase tracking-ui-mega text-pos">prompt</span>
          <CopyButton text={prompt.prompt + (prompt.params ? "\n" + prompt.params : "") + (prompt.negative_prompt ? "\nNegative: " + prompt.negative_prompt : "")} label="copy" />
        </div>
        <pre className="font-mono text-xs whitespace-pre-wrap text-ink bg-base-950/60 border border-base-700 p-2 leading-relaxed">{prompt.prompt}</pre>
      </div>

      {prompt.params ? (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">params</div>
          <code className="text-[11px] text-live font-mono">{prompt.params}</code>
        </div>
      ) : null}

      {prompt.negative_prompt ? (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-neg mb-1">negative prompt</div>
          <pre className="font-mono text-[11px] text-neg whitespace-pre-wrap">{prompt.negative_prompt}</pre>
        </div>
      ) : null}

      {prompt.shot_breakdown?.length ? (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">shotlist</div>
          <ul className="space-y-1 text-[11px]">{prompt.shot_breakdown.map((s: any, i: number) => (
            <li key={i} className="flex gap-2 border border-base-700 px-2 py-1">
              <span className="font-mono text-ink-faint w-8 tabular">#{s.shot_num}</span>
              <span className="font-mono text-live w-12 tabular">{s.duration_s}s</span>
              <span className="text-ink flex-1">{s.shot_prompt}</span>
            </li>
          ))}</ul>
        </div>
      ) : null}

      {prompt.tweaks_if_first_gen_misses?.length ? (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">if first gen misses</div>
          <ul className="space-y-0.5 text-[11px] text-ink-muted">{prompt.tweaks_if_first_gen_misses.map((t: string, i: number) => <li key={i}>→ {t}</li>)}</ul>
        </div>
      ) : null}
    </li>
  );
}

function ToolList({ title, tools }: { title: string; tools: CreativeToolLink[] }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-2">{title}</div>
      <ul className="space-y-1 text-xs">
        {tools.map((t) => (
          <li key={t.name} className="border border-base-700 px-2 py-1.5">
            <div className="flex items-center gap-2 mb-0.5">
              <a href={t.url} target="_blank" rel="noreferrer" className="text-info hover:underline font-medium inline-flex items-center gap-1">
                {t.name} <ExternalLink size={9} />
              </a>
              <span className="ml-auto text-[10px] font-mono uppercase tracking-ui-wide text-ink-faint">{t.cost}</span>
            </div>
            <p className="text-ink-muted text-[11px] leading-relaxed">{t.best_for}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
