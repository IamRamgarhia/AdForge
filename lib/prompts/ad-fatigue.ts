export interface FatigueInput {
  platform: string;
  ad_copy: string;
  days_running: string;
  current_frequency?: string;
  ctr_trend?: string;
  cpm_trend?: string;
}

import { RETIRE_THRESHOLD_RULE } from "./common-rules";

export function buildFatiguePrompt(input: FatigueInput): string {
  return `Diagnose ad fatigue and prescribe REFRESH actions (not "make a new one" — specific edits).

${RETIRE_THRESHOLD_RULE}


FATIGUE SIGNALS to check (give a score 0-10 of fatigue severity for each):
- frequency (Meta target ceiling: 3.0; TikTok: 2.5)
- ctr_decay (week-over-week CTR drop > 20% is a flag)
- cpm_increase (rising CPM with constant audience = saturation)
- creative_lifespan (TikTok: 7-10 days; Meta: 14-21 days; Google Display: 30+ days)

INPUT:
- Platform: ${input.platform}
- Days running: ${input.days_running}
- Current ad copy:
"""
${input.ad_copy}
"""
- Current frequency: ${input.current_frequency || "not provided"}
- CTR trend: ${input.ctr_trend || "not provided"}
- CPM trend: ${input.cpm_trend || "not provided"}

PRESCRIBE 3 REFRESH OPTIONS, ranked by effort:

LOW EFFORT (1-2 hours):
- Reorder hook
- Swap opening visual
- Adjust thumbnail
- Change CTA verb

MEDIUM EFFORT (half-day):
- Same offer, new angle (e.g. swap from pain → outcome)
- Native variant (e.g. UGC retread of polished ad)
- New B-roll cut

HIGH EFFORT (1-2 days):
- New offer
- New creator (TikTok / UGC)
- New positioning / new audience

Also flag 5 NEW ANGLES to test based on the existing ad's angle gaps.

Return ONLY valid JSON:
{
  "fatigue_severity_overall": "none|mild|moderate|severe",
  "signals": {
    "frequency": { "score": 0, "reading": "string", "threshold_breached": false },
    "ctr_decay": { "score": 0, "reading": "string", "threshold_breached": false },
    "cpm_increase": { "score": 0, "reading": "string", "threshold_breached": false },
    "creative_lifespan": { "score": 0, "reading": "string", "threshold_breached": false }
  },
  "refresh_options": {
    "low_effort": [{ "action": "string", "specific_change": "string", "expected_lift": "string" }],
    "medium_effort": [{ "action": "string", "specific_change": "string", "expected_lift": "string" }],
    "high_effort": [{ "action": "string", "specific_change": "string", "expected_lift": "string" }]
  },
  "new_angles_to_test": [
    { "angle": "string", "angle_label": "pain|outcome|social_proof|curiosity|comparison|urgency|identity|contrarian", "rationale": "string" }
  ],
  "kill_threshold": "string (e.g. 'if frequency > 4 and CTR < 0.5%, kill')"
}`;
}
