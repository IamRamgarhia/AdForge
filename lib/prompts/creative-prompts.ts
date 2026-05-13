export interface CreativePromptInput {
  asset_type: "static_image" | "video_short" | "video_long" | "ugc_video" | "product_photo" | "infographic" | "carousel_set";
  platform: string;
  aspect_ratio: string;
  brand_promise: string;
  product: string;
  audience: string;
  mood: string;
  must_include: string;
  must_avoid: string;
  duration_seconds?: string;
}

export interface CreativeToolLink {
  name: string;
  url: string;
  best_for: string;
  cost: string;
}

export const IMAGE_TOOLS: CreativeToolLink[] = [
  { name: "Midjourney", url: "https://www.midjourney.com/", best_for: "Photoreal + stylized brand imagery. Strongest at aesthetic cohesion.", cost: "Paid — from $10/mo" },
  { name: "DALL-E 3 (ChatGPT)", url: "https://chat.openai.com/", best_for: "Text-on-image rendering, infographics, layout fidelity.", cost: "ChatGPT Plus / Pro" },
  { name: "Ideogram", url: "https://ideogram.ai/", best_for: "Best-in-class text rendering inside images. Posters, ad mockups.", cost: "Free tier + paid" },
  { name: "Adobe Firefly", url: "https://firefly.adobe.com/", best_for: "Commercial-safe (trained on licensed Adobe Stock). Use for legally clean output.", cost: "Free trial · Adobe Creative Cloud" },
  { name: "Leonardo.ai", url: "https://leonardo.ai/", best_for: "Game-art, illustrative, and fine-grained style controls.", cost: "Free tier + paid" },
  { name: "Stable Diffusion (DreamStudio / local)", url: "https://stability.ai/", best_for: "Self-hosted, full control, ControlNet for layout pinning.", cost: "Free if self-hosted" },
  { name: "Recraft", url: "https://www.recraft.ai/", best_for: "Brand-consistent illustrations + vector + brand kit.", cost: "Free tier + paid" },
  { name: "Flux (FAL / Replicate)", url: "https://fal.ai/", best_for: "Open-source photoreal model — cheap API access at scale.", cost: "Per-image pricing" },
];

export const VIDEO_TOOLS: CreativeToolLink[] = [
  { name: "Runway Gen-3 / Gen-4", url: "https://runwayml.com/", best_for: "Cinematic short clips, motion control, image-to-video.", cost: "Free trial · from $15/mo" },
  { name: "Pika Labs", url: "https://pika.art/", best_for: "Quick consumer-friendly video gen + lip-sync + scene transitions.", cost: "Free tier + paid" },
  { name: "Luma Dream Machine", url: "https://lumalabs.ai/dream-machine", best_for: "Photoreal motion from a still image. Strongest at realistic physics.", cost: "Free tier + paid" },
  { name: "Sora (OpenAI)", url: "https://sora.com/", best_for: "Highest-fidelity AI video (when accessible). Cinematic + character consistency.", cost: "ChatGPT Pro" },
  { name: "Kling AI", url: "https://klingai.com/", best_for: "Long-form generation (up to 2 minutes). Strong at full scenes.", cost: "Free tier + paid" },
  { name: "HeyGen", url: "https://www.heygen.com/", best_for: "AI avatar / talking-head ads. Multi-language voice cloning.", cost: "Free tier + paid" },
  { name: "Synthesia", url: "https://www.synthesia.io/", best_for: "Corporate / explainer videos with stock AI avatars. Enterprise polish.", cost: "Paid · from $22/mo" },
  { name: "Captions / AI Edit", url: "https://www.captions.ai/", best_for: "Mobile-first short-form AI editing. Subtitles, b-roll, music.", cost: "Free + paid" },
  { name: "Descript", url: "https://www.descript.com/", best_for: "Text-based video editing for talking-head + podcast cuts.", cost: "Free tier + paid" },
  { name: "Canva Magic Video", url: "https://www.canva.com/magic-video/", best_for: "Template-driven brand-safe social videos. Easiest for non-editors.", cost: "Free + Canva Pro" },
];

import { VIDEO_HOOK_RULE } from "./common-rules";

export function buildCreativePromptPrompt(input: CreativePromptInput): string {
  const isVideo = input.asset_type.includes("video");
  return `You are an expert creative director writing AI-image / AI-video generation prompts for an ad creative.

${isVideo ? VIDEO_HOOK_RULE + "\n\n" : ""}

INPUT:
- Asset type: ${input.asset_type}
- Platform: ${input.platform}
- Aspect ratio: ${input.aspect_ratio}
- Product: ${input.product}
- Brand promise: ${input.brand_promise}
- Audience: ${input.audience}
- Mood / vibe: ${input.mood}
- Must include: ${input.must_include || "(nothing specific)"}
- Must avoid: ${input.must_avoid || "(nothing specific)"}
${isVideo ? `- Duration: ${input.duration_seconds || "(use platform default)"}` : ""}

PRINCIPLES OF AI CREATIVE PROMPTS (apply all):
- LEAD with subject + action. "A woman, mid-30s, sipping coffee in a sunlit kitchen" beats "in a sunlit kitchen, a woman is sipping coffee."
- Specify CAMERA / SHOT for photoreal: 35mm, shallow depth-of-field, eye-level, soft window light. Not "professional photo".
- Specify LIGHTING: golden hour, overcast, neon under-glow, etc.
- Specify STYLE / MEDIUM: 35mm film, editorial, illustration, claymation, 3D render.
- For text on images (banner / poster / overlay): use Ideogram or DALL-E 3 — quote the exact text in the prompt with quotes.
- NEGATIVE PROMPT — list what to exclude (no logos, no people facing camera, no busy background).
- ASPECT RATIO and dimensions explicit at the end.

GENERATE for each major AI tool (different syntaxes for different tools — write each in the tool's native style):

For static images:
- **Midjourney prompt** — uses --ar / --v / --s params; comma-separated descriptive style.
- **DALL-E 3 / ChatGPT prompt** — natural-language paragraph form, supports text rendering.
- **Ideogram prompt** — emphasis on text rendering, uses quotes around any text to render.
- **Stable Diffusion / Flux prompt** — supports prompt weighting (word:1.2) and explicit negative prompts.
- **Firefly prompt** — natural language, commercial-safe context cues.

For videos (if asset_type contains "video"):
- **Runway Gen-3 prompt** — camera move language ("dolly in slowly", "static wide shot"), 5-10s clips.
- **Pika prompt** — concise scene + motion + style descriptors.
- **Luma Dream Machine** — image-to-video prompt + motion description.
- **HeyGen / Synthesia** — talking-head script + avatar selection guidance (only if asset is UGC-style or talking-head).

For each prompt include:
- The prompt text (ready to copy-paste)
- 2-3 specific TWEAKS the user can try if first generation doesn't land
- An estimated # of generations to expect before a winner (be honest)

Also output:
- A SHOTLIST (only if video) — 3-5 individual shot prompts that compose the full video.
- Pre-flight checklist — what to make sure the brand-brain alignment looks like before generating.

Return ONLY valid JSON:
{
  "asset_intent_summary": "string — 1 sentence on what we want",
  "static_image_prompts": [
    {
      "tool": "Midjourney|DALL-E 3|Ideogram|Stable Diffusion|Firefly|Recraft|Flux",
      "best_for_this_brief": "string (why this tool for this brief)",
      "prompt": "string (full ready-to-paste)",
      "negative_prompt": "string or empty",
      "params": "string (e.g. '--ar 4:5 --v 6.1 --s 250' for Midjourney)",
      "tweaks_if_first_gen_misses": ["string"],
      "expected_iterations_to_winner": 0
    }
  ],
  "video_prompts": [
    {
      "tool": "Runway|Pika|Luma|Sora|Kling|HeyGen|Synthesia|Captions|Descript|Canva",
      "best_for_this_brief": "string",
      "prompt": "string",
      "shot_breakdown": [{ "shot_num": 1, "duration_s": 0, "shot_prompt": "string" }],
      "tweaks_if_first_gen_misses": ["string"],
      "expected_iterations_to_winner": 0
    }
  ],
  "preflight_checklist": ["string"],
  "policy_warnings": ["string — flag faces of real people, copyrighted characters, trademarked logos, or anything else risky for paid ads"]
}`;
}
