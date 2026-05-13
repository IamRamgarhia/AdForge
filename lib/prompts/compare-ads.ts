export interface CompareAdsInput {
  platform: string;
  audience: string;
  ad_a: string;
  ad_b: string;
  goal: string;
}

export function buildCompareAdsPrompt(input: CompareAdsInput): string {
  return `Compare two ad creatives head-to-head. Pick a winner. Be brutally specific — name phrases, not vibes.

PLATFORM: ${input.platform}
GOAL: ${input.goal}
AUDIENCE: ${input.audience}

AD A:
"""
${input.ad_a}
"""

AD B:
"""
${input.ad_b}
"""

SCORE each on 5 levers (0-10):
- hook_strength
- specificity
- urgency
- brand_fit
- conversion_potential

For each lever, identify which ad wins and why. Name the EXACT phrase or word in each ad that earned the score.

Then:
- DECLARE A WINNER with the overall reasoning
- Identify each ad's SINGLE BIGGEST STRENGTH (quote the line)
- Identify each ad's SINGLE BIGGEST WEAKNESS (quote the line)
- Propose a HYBRID ad that takes the best of both — quoted lines from each, restructured into one piece

Return ONLY valid JSON:
{
  "winner": "A|B|tie",
  "winner_reason": "string — 2 sentences",
  "scores": {
    "hook_strength":       { "a": 0, "b": 0, "winner": "A|B|tie", "reason": "string with quoted phrases" },
    "specificity":         { "a": 0, "b": 0, "winner": "A|B|tie", "reason": "string" },
    "urgency":             { "a": 0, "b": 0, "winner": "A|B|tie", "reason": "string" },
    "brand_fit":           { "a": 0, "b": 0, "winner": "A|B|tie", "reason": "string" },
    "conversion_potential":{ "a": 0, "b": 0, "winner": "A|B|tie", "reason": "string" }
  },
  "ad_a": {
    "biggest_strength": { "quote": "string", "why": "string" },
    "biggest_weakness": { "quote": "string", "why": "string" }
  },
  "ad_b": {
    "biggest_strength": { "quote": "string", "why": "string" },
    "biggest_weakness": { "quote": "string", "why": "string" }
  },
  "hybrid_proposal": {
    "headline_or_hook": "string — best from A or B, possibly stitched",
    "body": "string — best of both",
    "cta": "string",
    "explanation": "string — what was taken from A vs B"
  }
}`;
}
