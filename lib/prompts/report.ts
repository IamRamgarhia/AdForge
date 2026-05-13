export interface ReportInput {
  period: string;
  total_spend: string;
  total_revenue: string;
  campaigns: string;
  target_roas?: string;
  target_cpa?: string;
  audience: string;
  business_type: string;
}

import { DIAGNOSIS_TREES } from "./common-rules";

export function buildReportPrompt(input: ReportInput): string {
  return `Generate a campaign performance report — client-ready, agency-grade, terse.

${DIAGNOSIS_TREES}


INPUT:
- Period: ${input.period}
- Total spend: ${input.total_spend}
- Total revenue / value: ${input.total_revenue}
- Campaigns / platforms (raw notes from user):
"""
${input.campaigns}
"""
- Target ROAS: ${input.target_roas || "not provided"}
- Target CPA: ${input.target_cpa || "not provided"}
- Audience: ${input.audience}
- Business type: ${input.business_type}

REPORT STRUCTURE (Markdown — not JSON for this one):

# {Campaign name}, {period}
**Pulse**: ROAS {X}× · CPA ${input.target_cpa ? "$Y" : "Y"} · Spend $Z · Revenue $W

## What happened
- 3 bullet points. NAME specific campaigns + numbers. No "performance was strong."

## What worked
- Top 3 specific wins. Quote campaign/asset names. Tie each to a number.

## What didn't
- Top 3 honest losses. No softening. If a campaign tanked, say it.

## Recommended actions
- 5 prioritized actions. Each: action — owner — by when — expected impact.
- Order by impact-per-hour, not by category.

## Next period projection
- Numeric forecast: spend, ROAS, CPA. Anchor to last period as baseline.

## Budget recommendation
- Increase / hold / decrease — with the reason as a single number.

CONSTRAINTS:
- No business-school filler ("synergy", "leverage", "moving forward").
- Use only the numbers given. If a number isn't provided, write "(not tracked)" — don't invent.
- Markdown only. No JSON. No code blocks except for the pulse line.
- Length target: 300-450 words total.`;
}
