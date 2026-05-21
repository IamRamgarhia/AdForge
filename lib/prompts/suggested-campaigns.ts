import type { BrandBrain } from "../brand-brain";

export function buildSuggestedCampaignsPrompt(brain: BrandBrain): string {
  return `You are a senior media buyer reviewing a new client's brand profile and proactively designing their ad strategy.

You have full Brand Brain context already (passed via system prompt). Use it.

Generate a complete "what should this brand run as ads RIGHT NOW" recommendation that any non-technical owner can follow.

PRODUCE:

1. **Top-3 campaigns to launch this week**, each with:
   - Campaign name (action-oriented, dated)
   - Platform (specific, not "social media")
   - Objective (sales / leads / awareness / traffic / app installs)
   - Why this brand right now (cite brand's own USP, audience, or competitors)
   - Target audience description (who EXACTLY)
   - Budget recommendation (USD/month)
   - 3 hook ideas (the opening line)
   - Expected metric targets (CTR, CPA range)
   - "Launch this in /launch-guide" deeplink hint

2. **Content calendar starter** — 7 organic posts for week one to support the paid campaigns above:
   - Day · platform · pillar · hook · brief
   - Mix paid amplification + organic

3. **Quick wins** — 3 things this brand could do TODAY that take < 1 hour:
   - Specific, named tactic
   - Where (which platform / which page)
   - Expected impact

4. **Honest no-go list** — 2-3 platforms/campaigns this brand should NOT run, given their profile, and why.

5. **First 30 days plan** — week 1 / 2 / 3 / 4 with specific goals + spend each week.

RULES:
- Recommend with reasons that reference THIS BRAND specifically. No generic "you should run Facebook ads."
- If the brand is B2B, do not recommend TikTok unless their ICP genuinely skews young/cultural.
- If budget context is unclear, ask for it AS A POPUP NOTE inside the JSON (field: "open_questions").
- Tie every campaign to a specific generator in OpenAdKit (use these URLs: /generate/google, /generate/meta, /generate/tiktok, /generate/linkedin, /generate/content-calendar, /launch-guide, /optimize/keywords, /optimize/audience).

Return ONLY valid JSON:
{
  "campaigns": [
    {
      "name": "string",
      "platform": "string",
      "objective": "string",
      "why_this_brand": "string (cites USP/audience/competitor)",
      "target_audience": "string",
      "monthly_budget_usd": 0,
      "hooks": ["string"],
      "kpi_targets": { "ctr_pct": "string", "cpa_usd": "string" },
      "adOS_workflow": [
        { "step": "string", "url": "string" }
      ]
    }
  ],
  "content_calendar_starter": [
    { "day": 1, "platform": "string", "pillar": "string", "hook": "string", "brief": "string" }
  ],
  "quick_wins": [
    { "tactic": "string", "where": "string", "expected_impact": "string" }
  ],
  "no_go": [
    { "platform_or_tactic": "string", "reason": "string" }
  ],
  "thirty_day_plan": [
    { "week": 1, "focus": "string", "spend_usd": 0, "deliverables": ["string"] }
  ],
  "open_questions": ["string — things the brand brain doesn't tell us that would sharpen the plan"]
}`;
}
