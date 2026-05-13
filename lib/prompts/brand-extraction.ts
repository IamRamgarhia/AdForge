export interface BrandExtractionInput {
  website_content?: string;
  description: string;
  audience_notes?: string;
  reviews?: string;
}

export function buildBrandExtractionPrompt(input: BrandExtractionInput): string {
  return `You are a senior brand strategist and direct-response copywriter with 20 years experience.
Analyze the provided business content and extract a complete brand intelligence profile.

Input:
WEBSITE / LANDING CONTENT:
${input.website_content?.trim() || "(not provided)"}

BUSINESS DESCRIPTION:
${input.description?.trim() || "(not provided)"}

AUDIENCE NOTES:
${input.audience_notes?.trim() || "(not provided)"}

CUSTOMER REVIEWS / TESTIMONIALS:
${input.reviews?.trim() || "(not provided)"}

Return ONLY valid JSON. No prose, no markdown fences. Use this exact schema:
{
  "business_name": "",
  "industry": "",
  "tone": "",
  "personality_traits": [],
  "writing_style": "",
  "words_to_use": [],
  "words_to_avoid": [],
  "audience_who": "",
  "audience_pain_points": [],
  "audience_desires": [],
  "audience_demographics": "",
  "usp": "",
  "key_benefits": [],
  "key_messages": [],
  "objections": [],
  "objection_handling": [],
  "competitors": [],
  "differentiators": [],
  "price_positioning": "",
  "voc_phrases": [],
  "voc_pain_quotes": [],
  "voc_success_quotes": [],
  "best_performing_angles": [],
  "failed_angles": []
}

Rules:
- Match every objection in "objections" with a same-index rebuttal in "objection_handling".
- "voc_phrases" must be REAL phrases from the reviews — exact wording, not paraphrased.
- If a field is truly unknown from the input, return an empty string or empty array — never invent details.`;
}
