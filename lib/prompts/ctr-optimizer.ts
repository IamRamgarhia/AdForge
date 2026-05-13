export const CTR_BENCHMARKS = {
  google_search_avg_2025: 4.99,
  google_by_industry: {
    ecommerce: 2.69,
    finance: 2.91,
    healthcare: 3.27,
    legal: 3.84,
    real_estate: 3.71,
    b2b_saas: 2.45,
  },
  meta: {
    feed: "0.9–1.5%",
    stories: "0.5–0.8%",
    carousel: "1.2–2.2%",
  },
  tiktok: {
    in_feed: "1.5–3.0%",
    spark_ads: "~3.0%",
  },
} as const;

export interface CtrInput {
  platform: string;
  industry: string;
  current_copy: string;
  current_ctr?: string;
  spend_period?: string;
}

import { CREATIVE_TESTING_HIERARCHY, DIAGNOSIS_TREES } from "./common-rules";

export function buildCtrPrompt(input: CtrInput): string {
  return `Diagnose this ad's CTR and produce specific, named rewrites.

${DIAGNOSIS_TREES}

${CREATIVE_TESTING_HIERARCHY}


INPUT:
- Platform: ${input.platform}
- Industry: ${input.industry}
- Current copy:
"""
${input.current_copy}
"""
- Current CTR: ${input.current_ctr || "not provided"}
- Spend period: ${input.spend_period || "not provided"}

ANTI-VAGUENESS RULE (toprank pattern):
Every observation must NAME the specific phrase / word / structural choice causing the problem. Forbidden: "the copy is weak", "headline could be stronger". Required: "Headline 1 ('Get Started Today') uses a generic CTA verb with no specificity, no benefit, and no urgency — 3 missing levers in 18 chars."

BENCHMARK CONTEXT (use to anchor "below/above average"):
- Google Search 2025 avg CTR: 4.99% (industry varies — ecommerce 2.69%, finance 2.91%, healthcare 3.27%, legal 3.84%, real estate 3.71%, B2B SaaS 2.45%)
- Meta Feed: 0.9–1.5% normal range
- TikTok In-Feed: 1.5–3.0% normal range

SCORE the input on a 0-10 scale for each lever, with a named reason:
- emotional_trigger: is there a feeling pulled (FOMO, pride, fear of loss, identity)?
- specificity: numbers, named entities, dated claims?
- urgency: time-bound or scarcity language?
- power_words: action verbs that move (vs filler verbs like "get", "find", "discover" alone)?
- relevance: does it address a clear audience pain or desire?

Then produce 5 RE-WRITES — each one targets ONE lever. Show before → after with the SAME goal in each case (don't change what the ad sells).

PREDICT CTR change in directional terms only (e.g. "+30–60%", "small", "marginal"). Never quote a fake exact %.

Return ONLY valid JSON:
{
  "verdict": "above_avg | at_avg | below_avg | severely_below",
  "industry_benchmark_cited": "string (e.g. 'B2B SaaS Google Search avg 2.45%')",
  "scores": {
    "emotional_trigger": { "score": 0, "reason": "string (name names)" },
    "specificity": { "score": 0, "reason": "string" },
    "urgency": { "score": 0, "reason": "string" },
    "power_words": { "score": 0, "reason": "string" },
    "relevance": { "score": 0, "reason": "string" }
  },
  "rewrites": [
    {
      "lever_targeted": "emotional_trigger | specificity | urgency | power_words | relevance",
      "before": "exact phrase from input",
      "after": "rewritten phrase",
      "expected_lift_directional": "string"
    }
  ],
  "full_rewritten_version": "string — best holistic rewrite combining the wins from above",
  "kill_or_iterate": "iterate | rewrite_from_scratch | kill",
  "kill_or_iterate_reason": "string"
}`;
}
