export const DISPLAY_SIZES = [
  { name: "Leaderboard", ratio: "728×90", h_max: 30, d_max: 50 },
  { name: "Medium Rectangle", ratio: "300×250", h_max: 30, d_max: 60 },
  { name: "Wide Skyscraper", ratio: "160×600", h_max: 25, d_max: 80 },
  { name: "Half Page", ratio: "300×600", h_max: 30, d_max: 90 },
  { name: "Mobile Banner", ratio: "320×50", h_max: 22, d_max: 28 },
  { name: "Large Mobile Banner", ratio: "320×100", h_max: 28, d_max: 40 },
];

export interface DisplayInput {
  product: string;
  goal: string;
  brand_promise: string;
  cta: string;
}

export function buildDisplayPrompt(input: DisplayInput): string {
  return `Generate Google Display banner copy for every standard size.

INPUT:
- Product: ${input.product}
- Campaign goal: ${input.goal}
- Brand promise: ${input.brand_promise}
- CTA: ${input.cta || "Learn more"}

SIZES + character limits (do not exceed):
${DISPLAY_SIZES.map(s => `- ${s.name} (${s.ratio}): short_headline ≤ ${s.h_max}, description ≤ ${s.d_max}`).join("\n")}

RULES:
- Display creative is ignored in feed. Lead with VISUAL clarity, not cleverness.
- Headlines must be readable at thumbnail scale (8-10 words max).
- For 320×50 and 320×100 mobile banners, write as if the reader is in another app — interrupt politely.

For each size, generate:
- short_headline (within size's limit)
- description
- cta_button_text (≤ 12 chars)
- image_concept (one sentence describing the suggested visual)

Return ONLY valid JSON:
{
  "creatives": [
    {
      "size": "728×90",
      "name": "Leaderboard",
      "short_headline": "string",
      "description": "string",
      "cta_button": "string",
      "image_concept": "string",
      "char_counts": { "headline": 0, "description": 0 }
    }
  ],
  "responsive_display_assets": {
    "short_headlines": ["5 strings ≤ 30 chars"],
    "long_headline": "string ≤ 90 chars",
    "descriptions": ["5 strings ≤ 90 chars"],
    "business_name": "string ≤ 25 chars",
    "image_prompts": ["3 image briefs for 1.91:1, 1:1, 4:5 ratios"]
  }
}`;
}
