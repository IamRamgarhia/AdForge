export interface AbTestInput {
  platform: string;
  current_ad: string;
  hypothesis_to_test: string;
  daily_clicks: string;
}

import { CREATIVE_TESTING_HIERARCHY, RETIRE_THRESHOLD_RULE } from "./common-rules";

export function buildAbTestPrompt(input: AbTestInput): string {
  return `Design a rigorous A/B test for this ad.

${CREATIVE_TESTING_HIERARCHY}

${RETIRE_THRESHOLD_RULE}


INPUT:
- Platform: ${input.platform}
- Current control:
"""
${input.current_ad}
"""
- What user wants to test: ${input.hypothesis_to_test}
- Average daily clicks per variant available: ${input.daily_clicks}

PRINCIPLES:
- TEST ONE VARIABLE at a time. If user wants to test 3 things, plan 3 sequential tests, not one mess.
- Each variant must be a CLEAN comparison — same offer, same audience, same placement; only ONE thing changes.
- Compute realistic sample-size requirement using daily_clicks input.
- Refuse to greenlight a test that needs > 4 weeks to be conclusive at the user's traffic level — recommend a different hypothesis instead.

GENERATE:
1. Test hypothesis (one sentence, formal: "If [change], then [metric] will [direction] because [why]").
2. Control = current_ad verbatim.
3. Variant A — single change to test the hypothesis. Name the change explicitly.
4. Variant B — different angle on the same hypothesis (defensive duplicate to reduce variance).
5. Variant C — wildcard alternative angle, only if traffic supports 4 variants.
6. Metric to watch + secondary metrics.
7. Sample-size estimate: clicks needed per variant for 95% confidence at 10% relative lift.
8. Test duration estimate at the given daily-clicks volume.
9. Decision framework: when to KILL (loser), DECLARE WINNER, EXTEND, RETEST.
10. Common failure modes to watch for (peeking, novelty effect, seasonality, sample pollution).

Return ONLY valid JSON:
{
  "hypothesis": "string",
  "primary_metric": "string",
  "secondary_metrics": ["string"],
  "variants": [
    { "label": "Control", "ad_copy": "string", "single_change_from_control": "n/a" },
    { "label": "A", "ad_copy": "string", "single_change_from_control": "string" },
    { "label": "B", "ad_copy": "string", "single_change_from_control": "string" }
  ],
  "sample_size_per_variant_clicks": 0,
  "expected_days_to_significance": 0,
  "minimum_detectable_lift_pct": 10,
  "decision_rules": {
    "kill_variant_when": "string",
    "declare_winner_when": "string",
    "extend_test_when": "string",
    "retest_when": "string"
  },
  "failure_modes_to_avoid": ["string"]
}`;
}
