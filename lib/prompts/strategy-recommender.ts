export interface StrategyInput {
  business_type: string;
  product: string;
  monthly_budget: string;
  goal: string;
  timeline: string;
  audience_age: string;
  geo: string;
}

import { BOTTLENECK_RULE, DIAGNOSIS_TREES } from "./common-rules";

export function buildStrategyPrompt(input: StrategyInput): string {
  return `Decide what ad strategy this user should run, given their business and budget reality.

${BOTTLENECK_RULE}

${DIAGNOSIS_TREES}


DECISION RULES (apply, then justify with the actual numbers):

If budget < $500/mo:
→ Recommend Google Search (intent-based, efficient)
→ Avoid Awareness campaigns (need volume)

If B2B, budget > $2000/mo:
→ LinkedIn Sponsored + Google Search combo
→ Avoid TikTok (audience mismatch — unless self-serve SaaS targeting young decision-makers)

If eCommerce visual product:
→ Meta Carousel + TikTok UGC
→ Include Google Shopping
→ Add retargeting day-1

If local service business:
→ Google Local Search Ads (LSAs) + Google Search
→ Add Meta retargeting to website visitors

If app / SaaS B2C:
→ Google UAC + Meta Lead/Conversion ads
→ TikTok for awareness if audience 16-34

INPUT:
- Business type: ${input.business_type}
- Product / service: ${input.product}
- Monthly budget (USD): ${input.monthly_budget}
- Primary goal: ${input.goal}
- Timeline to first meaningful data: ${input.timeline}
- Audience age band: ${input.audience_age}
- Geo: ${input.geo}

PRODUCE:
1. Primary platform recommendation + WHY.
2. Secondary platform (if budget supports).
3. Funnel stage to focus on first (awareness / consideration / conversion).
4. Budget minimum to see results — per platform, with reasoning.
5. Realistic timeline to first read.
6. Creative format priority.
7. KPI targets month 1, month 2, month 3.
8. What NOT to do — anti-recommendations specific to this profile.
9. STOP-CONDITIONS — must-haves before launch (conversion tracking, landing page, exclusions).

Return ONLY valid JSON:
{
  "primary_platform": { "name": "string", "reason": "string (cite user's numbers)", "min_budget_usd": 0 },
  "secondary_platform": { "name": "string", "reason": "string", "min_budget_usd": 0 },
  "funnel_stage": "awareness|consideration|conversion|retention",
  "creative_format_priority": ["string"],
  "timeline_to_first_read_days": 0,
  "kpi_targets": [
    { "month": 1, "metric": "string", "target": "string" }
  ],
  "anti_recommendations": ["string"],
  "stop_conditions_to_resolve_first": ["string"],
  "month_one_budget_split": [
    { "platform": "string", "pct": 0, "dollars": 0 }
  ]
}`;
}
