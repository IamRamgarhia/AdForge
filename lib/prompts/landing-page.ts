export interface LandingPageInput {
  ad_promise: string;
  landing_copy: string;
  audience: string;
}

import { PRICING_PSYCHOLOGY } from "./common-rules";

export function buildLandingPrompt(input: LandingPageInput): string {
  return `Grade this landing page from a paid-traffic perspective. The page must DELIVER on the ad's promise — message match is the #1 lever.

${PRICING_PSYCHOLOGY}


INPUT:
- Ad promise (what the visitor clicked thinking they'd find): ${input.ad_promise}
- Landing page copy:
"""
${input.landing_copy}
"""
- Audience: ${input.audience}

SCORE 1-10 each lever, with a NAMED reason (not "weak" — specific):
- message_match: does the H1 echo the ad promise within 5 words of the same idea?
- clarity: would a stranger know what's being sold in 5 seconds?
- cta_effectiveness: is there ONE primary CTA, visible above the fold, with action-led verb?
- social_proof: real numbers, named entities, dated reviews — not "trusted by thousands"?
- specificity: does the page give ONE concrete benefit with a number?
- objection_handling: does it acknowledge & rebut the top 2 objections?
- friction: is there anything that adds drag (long form, multiple competing CTAs, unclear pricing)?
- above_the_fold: H1 + subhead + visual + CTA all visible without scrolling on mobile?

For each lever scored ≤ 6, write a SPECIFIC fix — quote the exact phrase to change and write the replacement.

Identify the SINGLE BIGGEST PROBLEM and the SINGLE BIGGEST OPPORTUNITY.

Return ONLY valid JSON:
{
  "overall_grade_pulse": {
    "message_match_score": 0,
    "estimated_post_click_drop_off_pct": 0,
    "single_biggest_fix": "string"
  },
  "scores": {
    "message_match": { "score": 0, "reason": "string" },
    "clarity": { "score": 0, "reason": "string" },
    "cta_effectiveness": { "score": 0, "reason": "string" },
    "social_proof": { "score": 0, "reason": "string" },
    "specificity": { "score": 0, "reason": "string" },
    "objection_handling": { "score": 0, "reason": "string" },
    "friction": { "score": 0, "reason": "string" },
    "above_the_fold": { "score": 0, "reason": "string" }
  },
  "fixes": [
    {
      "lever": "string",
      "exact_phrase_to_change": "string (quote from input)",
      "replacement": "string",
      "expected_impact": "high|medium|low"
    }
  ],
  "biggest_opportunity": "string",
  "biggest_problem": "string",
  "rewrite_above_the_fold": {
    "h1": "string ≤ 60 chars",
    "subhead": "string ≤ 140 chars",
    "bullets": ["string"],
    "cta_button": "string ≤ 16 chars"
  }
}`;
}
