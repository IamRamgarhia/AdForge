export interface QualityScoreInput {
  keyword: string;
  current_ad_copy: string;
  landing_page_summary: string;
  current_qs?: string;
}

export function buildQualityScorePrompt(input: QualityScoreInput): string {
  return `Diagnose and improve Google Ads Quality Score for this keyword + ad.

INPUT:
- Target keyword: ${input.keyword}
- Current ad copy:
"""
${input.current_ad_copy}
"""
- Landing page summary:
"""
${input.landing_page_summary}
"""
- Current QS (if known): ${input.current_qs || "not provided"}

CONTEXT (cite to user — direct from Google):
- Quality Score is 1-10 per keyword, computed from THREE factors:
  1. Expected CTR (low / average / above average)
  2. Ad relevance (low / average / above average)
  3. Landing page experience (low / average / above average)
- Moving from QS 5 to QS 7 typically reduces CPC 16–28% AND raises ad rank.
- QS is NOT affected by bid, budget, or device.

DIAGNOSE each factor:
- Expected CTR: rate low / avg / above_avg. Reason must NAME specific copy attributes (e.g. "headline does not include the exact keyword '${input.keyword}'").
- Ad relevance: same. Score how tightly the ad text mirrors keyword intent.
- Landing page experience: same. Score based on the summary provided. Note message-match issues.

For each factor, give 2 SPECIFIC fixes — not generic ("improve headline") but pointed ("Add a headline using exact keyword '${input.keyword}' as the first 2 words, e.g. '...'").

Also generate 3 IMPROVED HEADLINES that include the keyword naturally and target the weakest factor.

Add 8 NEGATIVE KEYWORDS likely siphoning irrelevant clicks for "${input.keyword}".

Add a LANDING PAGE checklist (Google's actual signals: page load, mobile usability, content match, transparency, navigation).

Return ONLY valid JSON:
{
  "current_factors": {
    "expected_ctr": { "rating": "low|average|above_average", "reason": "string (name names)" },
    "ad_relevance": { "rating": "low|average|above_average", "reason": "string" },
    "landing_page_experience": { "rating": "low|average|above_average", "reason": "string" }
  },
  "projected_qs": { "current": 0, "after_fixes": 0, "cpc_savings_estimate": "string (directional)" },
  "fixes": [
    { "factor": "expected_ctr|ad_relevance|landing_page_experience", "fix": "string (specific, actionable)" }
  ],
  "improved_headlines": [
    { "text": "string ≤ 30 chars", "chars": 0, "targets_factor": "string" }
  ],
  "negative_keywords": ["string"],
  "landing_page_checklist": [
    { "item": "string", "status_guess": "ok|issue|unknown", "fix_if_issue": "string" }
  ]
}`;
}
