export interface BidStrategyInput {
  platform: string;
  campaign_type: string;
  goal: string;
  monthly_budget: string;
  conversions_per_month: string;
  current_cpa?: string;
  target_cpa?: string;
  target_roas?: string;
}

export function buildBidStrategyPrompt(input: BidStrategyInput): string {
  return `Recommend a bidding strategy for this campaign with clear DATA-MATURITY reasoning.

CORE RULE (Google + Meta + TikTok): Smart Bidding requires conversion volume to work. The strategy must MATCH the user's current conversion data, not their aspirations.

Conversion volume thresholds (cite to user, don't invent):
- Manual CPC / ECPC: works with any volume
- Maximize Conversions: needs ≥ 15 conversions / month
- Target CPA (tCPA): needs ≥ 30 conversions / 30 days
- Target ROAS (tROAS): needs ≥ 50 conversions / 30 days AND consistent value tracking
- Meta Advantage+ / TikTok ACO: needs ≥ 50 conversions / 7 days at ad-set level (post learning-phase exit)

INPUT:
- Platform: ${input.platform}
- Campaign type: ${input.campaign_type}
- Goal: ${input.goal}
- Monthly budget: ${input.monthly_budget}
- Conversions / month (current): ${input.conversions_per_month}
- Current CPA: ${input.current_cpa || "not provided"}
- Target CPA: ${input.target_cpa || "not provided"}
- Target ROAS: ${input.target_roas || "not provided"}

DECIDE:
1. Recommended primary strategy.
2. WHY — must reference the volume rule above with the user's actual numbers.
3. Learning phase guidance: how many days untouched, what NOT to change.
4. Bid adjustments to apply (device / location / schedule) if any — only when supported by the chosen strategy.
5. Budget pacing: should it be daily or campaign-level? Why?
6. Failure-mode early-warning signs (volume drop, CPA spike, frequency over 3, learning limited).
7. When to upgrade (e.g. "switch from Maximize Conversions to tCPA once you hit 50 conversions/30 days").

Return ONLY valid JSON:
{
  "recommended_strategy": "string",
  "reason": "string (must cite the user's conversion number)",
  "fallback_strategy_if_data_insufficient": "string",
  "learning_phase": {
    "days_to_hold": 0,
    "do_not_change": ["string"],
    "ok_to_change": ["string"]
  },
  "bid_adjustments": [
    { "dimension": "device|location|schedule|audience", "adjustment": "string", "reason": "string" }
  ],
  "budget_pacing_recommendation": "string",
  "early_warning_signs": ["string"],
  "graduation_path": {
    "current": "string",
    "next_strategy": "string",
    "trigger_threshold": "string (numeric)"
  }
}`;
}
