export interface BhcInput {
  brand: string;
  product_or_message: string;
  target_audience: string;
  budget_band: "100k_300k" | "300k_1m" | "gt_1m";
  desired_action: string;
  geo: string;
}

import { VIDEO_HOOK_RULE } from "./common-rules";

export function buildBhcPrompt(input: BhcInput): string {
  return `Generate a TikTok Branded Hashtag Challenge brief.

${VIDEO_HOOK_RULE}

CONTEXT — Branded Hashtag Challenges are TikTok's user-generated participation campaigns. They:
- Require minimum $100k typical spend (entry tier), $300k+ for proper amplification, $1M+ for cultural-moment scale
- Run 6 days featured on the Discover page (paid)
- Best outcomes: 1M+ video creations, billion-level impressions
- Worst outcomes: zero participation, full spend on featured-discover slot only — i.e. high-risk

DECISION GUARD: if user input suggests this won't work (niche B2B / no cultural angle / passive product), flag it.

INPUT:
- Brand: ${input.brand}
- Product / message: ${input.product_or_message}
- Audience: ${input.target_audience}
- Budget band: ${input.budget_band}
- Desired action: ${input.desired_action}
- Geo: ${input.geo}

GENERATE:

1. **Viability assessment** — should they actually do a BHC? Score 0-10 with reasoning. Below 6 = recommend Spark Ads instead.

2. **Hashtag concept** — the actual #BrandedHashtag. Rules:
   - Memorable in ≤ 3 syllables when spoken
   - Has to make sense without context
   - Not a verb that's already in common use (low-distinctiveness)
   - Pre-check: NOT already used at scale by another brand
   - Bilingual-friendly if relevant geo

3. **Participation mechanics** — what do users DO to participate?
   - The clear, simple instruction (one sentence)
   - The visual / audio / dance / transformation that defines the challenge
   - The story arc users can riff on (without prescribing it)
   - What rewards / featured-by-brand incentive

4. **Seed creator strategy** — which 3-5 creator archetypes should kick this off
   - Tier (mega, macro, mid, micro)
   - Why this archetype
   - Specific brief points for each
   - Required posting cadence in week 1

5. **Featured Discover page copy** — TikTok limits:
   - Challenge name display (≤ 24 chars)
   - Description (≤ 80 chars)
   - Featured creator brief

6. **Sound strategy** — original sound vs licensed track. With reasoning.

7. **Six-day timeline** — what happens each of the 6 featured days?

8. **Success metrics + kill criteria** — when to declare win vs cut losses early
   - Day 1 floor: minimum participations
   - Day 3 checkpoint
   - End-of-week win threshold

9. **Compliance** — disclosure language, age-gating if relevant, brand-safety constraints.

Return ONLY valid JSON:
{
  "viability": {
    "score": 0,
    "reasoning": "string",
    "recommend_proceed": true,
    "alternative_if_not": "string"
  },
  "hashtag": {
    "tag": "#string",
    "rationale": "string",
    "potential_conflicts": ["string — other brands or trends using similar"]
  },
  "participation_mechanic": {
    "instruction": "string ≤ 1 sentence",
    "defining_element": "string",
    "story_arc": "string",
    "incentive": "string"
  },
  "seed_creators": [
    { "tier": "mega|macro|mid|micro", "archetype": "string", "rationale": "string", "brief_points": ["string"], "post_cadence_week_1": "string" }
  ],
  "discover_page": {
    "challenge_name": "string ≤ 24 chars",
    "description": "string ≤ 80 chars",
    "featured_creator_brief": "string"
  },
  "sound_strategy": {
    "approach": "original | licensed | both",
    "rationale": "string"
  },
  "six_day_timeline": [
    { "day": 1, "actions": ["string"], "expected_outcome": "string" }
  ],
  "success_metrics": {
    "day_1_floor_participations": 0,
    "day_3_checkpoint": "string",
    "end_of_week_win_threshold": "string",
    "kill_signal": "string"
  },
  "compliance": {
    "disclosure_language": "string",
    "age_gating_needed": false,
    "brand_safety_constraints": ["string"]
  }
}`;
}
