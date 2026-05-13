export interface YouTubeInput {
  format: "in_stream" | "bumper" | "discovery";
  product: string;
  goal: string;
  landing_url?: string;
}

import { VIDEO_HOOK_RULE } from "./common-rules";

export function buildYouTubePrompt(input: YouTubeInput): string {
  if (input.format === "bumper") {
    return `Generate 5 YouTube Bumper ad scripts (6 seconds, non-skippable) for: ${input.product}
Goal: ${input.goal}

RULES:
- 6 seconds means ~15 words MAX of spoken VO.
- Must work with sound OFF — visual + on-screen text first.
- One memorable message per script.

Return ONLY valid JSON:
{
  "scripts": [
    {
      "label": "A | B | C | D | E",
      "angle": "string",
      "vo": "string (≤ 15 words)",
      "visual": "string",
      "on_screen_text": "string (≤ 6 words)",
      "frame_count": 6
    }
  ]
}`;
  }
  if (input.format === "discovery") {
    return `Generate YouTube Discovery ad copy for: ${input.product}
Goal: ${input.goal}

Return ONLY valid JSON:
{
  "headlines": ["3 headlines, each ≤ 100 chars"],
  "descriptions": ["2 descriptions, each ≤ 200 chars"],
  "thumbnail_concepts": [
    { "title": "string", "emotion": "curiosity | shock | desire", "visual": "string" }
  ]
}`;
  }
  return `Generate a YouTube In-Stream ad script for: ${input.product}

${VIDEO_HOOK_RULE}

Goal: ${input.goal}
Landing page: ${input.landing_url || "(not provided)"}

STRUCTURE (60 seconds max, skip after 5s):
- Hook (0–5s): MUST stop the skip. Question, pattern interrupt, or shocking visual.
- Problem (5–15s): Agitate the pain the audience already feels.
- Solution (15–30s): Introduce the product. Show, don't tell.
- Proof (30–45s): Specific number, real demo, or third-party validation.
- CTA (45–60s): One clear next step. Show the URL.

Generate 2 variants. For each:
- Full script with timestamps
- B-roll shot list
- Companion banner copy (300×60)

Return ONLY valid JSON:
{
  "variants": [
    {
      "label": "A | B",
      "hook": { "t": "0–5s", "vo": "string", "visual": "string" },
      "problem": { "t": "5–15s", "vo": "string", "visual": "string" },
      "solution": { "t": "15–30s", "vo": "string", "visual": "string" },
      "proof": { "t": "30–45s", "vo": "string", "visual": "string" },
      "cta": { "t": "45–60s", "vo": "string", "visual": "string", "on_screen_url": "string" },
      "b_roll": ["string"],
      "companion_banner": "string"
    }
  ],
  "view_rate_target": "≥ 30% (otherwise hook needs work)"
}`;
}
