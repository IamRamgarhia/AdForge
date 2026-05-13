export interface AudienceTargetingInput {
  platform: "meta" | "google" | "linkedin" | "tiktok";
  product: string;
  audience_who: string;
  budget_monthly: string;
  geo: string;
  goal: string;
}

import { RETARGETING_MATRIX, MANDATORY_EXCLUSIONS } from "./common-rules";

export function buildAudienceTargetingPrompt(input: AudienceTargetingInput): string {
  return `Design a layered audience targeting plan for ${input.platform}.

${RETARGETING_MATRIX}

${MANDATORY_EXCLUSIONS}


PRINCIPLE: stack OVERLAPPING signals (in-market + behavior + demographic) rather than narrow on a single dimension. Cold prospecting needs reach; retargeting needs reach × intent.

INPUT:
- Platform: ${input.platform}
- Product: ${input.product}
- Who buys this: ${input.audience_who}
- Monthly budget: ${input.budget_monthly}
- Geo: ${input.geo}
- Goal: ${input.goal}

GENERATE — three tiers, ordered by audience temperature:

TIER 1: COLD PROSPECTING (broadest, highest fill, lowest CVR)
- Recommended audience size range (Meta/TikTok: 2M-20M usually; LinkedIn: 100k-1M; Google: in-market segments)
- Interest stacks (groups of 3-5 interests OR'd together)
- Demographic constraints
- Lookalike seeds (which source list, what %)
- Geo refinement
- Budget % allocation

TIER 2: WARM RETARGETING (medium reach, medium-high intent)
- Website visitors (rules: time on site, pages visited, days back)
- Video viewers (% completion threshold)
- Engagers (likes, comments, shares)
- Email list (Customer Match / LinkedIn / Meta CRM upload)
- Budget % allocation

TIER 3: HOT REMARKETING (small reach, highest intent)
- Cart abandoners / form-starters
- Past purchasers for upsell/cross-sell
- Suppression rules — exclude recent converters, exclude do-not-contact
- Budget % allocation

For each tier add:
- KPI target appropriate to temperature
- Frequency cap recommendation
- Creative format that converts best at this stage

EXCLUSIONS (apply across all tiers):
- Current customers (unless tier 3)
- Recent converters (last 30 days for sales, last 7 for trial signups)
- Competitor employees (LinkedIn specifically)
- Anyone already in your CRM as not-a-fit

Return ONLY valid JSON:
{
  "cold_prospecting": {
    "audience_size_range": "string e.g. '5M-15M'",
    "interests_stacks": [{ "label": "string", "items": ["string"] }],
    "demographics": { "age_min": 0, "age_max": 0, "gender": "string", "income": "string", "education": "string" },
    "lookalike_seeds": [{ "source_list_name": "string", "match_pct": 0 }],
    "geo_refinement": "string",
    "budget_pct": 0,
    "kpi_target": "string",
    "frequency_cap": "string",
    "creative_format": "string"
  },
  "warm_retargeting": {
    "audiences": [
      { "name": "string", "rule": "string e.g. 'visited /pricing in last 14 days, time on site > 30s'", "expected_size": "string" }
    ],
    "budget_pct": 0,
    "kpi_target": "string",
    "frequency_cap": "string",
    "creative_format": "string"
  },
  "hot_remarketing": {
    "audiences": [
      { "name": "string", "rule": "string", "expected_size": "string" }
    ],
    "budget_pct": 0,
    "kpi_target": "string",
    "frequency_cap": "string",
    "creative_format": "string"
  },
  "exclusions": [
    { "name": "string", "rule": "string", "applies_to_tiers": ["cold", "warm", "hot"] }
  ],
  "platform_specific_features_to_enable": [
    { "feature": "string e.g. 'Meta Advantage+ Audience'", "use": true, "rationale": "string" }
  ]
}`;
}
