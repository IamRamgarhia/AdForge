export interface SparkInput {
  product: string;
  audience: string;
  organic_post_context: string;
  brand_voice: string;
}

import { VIDEO_HOOK_RULE } from "./common-rules";

export function buildSparkAdsPrompt(input: SparkInput): string {
  return `Generate a TikTok Spark Ads creator brief PLUS the boost-decision rules for picking which organic post to spark.

${VIDEO_HOOK_RULE}


CONTEXT — Spark Ads boost an organic creator post into a paid placement. They typically deliver:
- 30% lower CPM than In-Feed ads (audience trusts native content)
- ~3% CTR (vs ~2% standard In-Feed)
- Comments + likes carry over (social proof compounding)

But ONLY if the original organic post earned attention organically — boosting a flop does not save it.

INPUT:
- Product: ${input.product}
- Target audience: ${input.audience}
- Organic post / creator context: ${input.organic_post_context}
- Brand voice: ${input.brand_voice || "(let Claude infer from creator's native style)"}

GENERATE:
1. BOOST-DECISION CRITERIA — which organic posts are worth sparking? Numeric thresholds (hook rate, completion rate, organic CTR equivalents).
2. CREATOR BRIEF — short, native-feeling brief the creator can actually follow:
   - "Show, don't tell" specifics
   - What NOT to do (no jump-cuts, no logo card, no scripted pitch)
   - The single performance goal for the post
3. ADAPTATION COPY — caption + on-screen text variants tuned for paid placement (still ≤ 100 chars).
4. SPONSORSHIP DISCLOSURE — TikTok-compliant disclosure language (FTC compliant, TikTok-policy compliant).
5. CTA OVERLAY — when and how to add the CTA without breaking native feel (last 2-3 seconds typically).
6. KILL/SCALE RULES — when to stop the Spark boost vs scale up.
7. AUDIENCE TARGETING — interest/behavior/lookalike recommendations for the boosted post.

Return ONLY valid JSON:
{
  "boost_decision_criteria": {
    "hook_rate_min_pct": 0,
    "completion_rate_min_pct": 0,
    "organic_engagement_rate_min_pct": 0,
    "post_age_max_days": 0,
    "do_not_spark_if": ["string"]
  },
  "creator_brief": {
    "show_dont_tell": ["string"],
    "do_not": ["string"],
    "single_goal": "string",
    "creator_personality_match_check": "string"
  },
  "adaptation_copy": {
    "caption_variants": ["string ≤ 100 chars"],
    "on_screen_text_variants": ["string"],
    "hashtag_strategy": ["#string"]
  },
  "disclosure": {
    "in_caption": "string",
    "in_video": "string",
    "duration_visible_seconds": 0
  },
  "cta_overlay": {
    "timing_seconds": "string e.g. '23-27 of 30s post'",
    "text": "string",
    "visual_treatment": "string"
  },
  "scale_rules": {
    "scale_when": "string with numeric trigger",
    "kill_when": "string with numeric trigger",
    "max_spend_per_post_usd": 0
  },
  "audience_targeting": {
    "interests": ["string"],
    "behaviors": ["string"],
    "lookalike_seed": "string",
    "exclusions": ["string"]
  }
}`;
}
