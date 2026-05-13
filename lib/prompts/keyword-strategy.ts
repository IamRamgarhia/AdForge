export interface KeywordInput {
  product: string;
  market: string;
  competitors?: string;
  current_keywords?: string;
}

export function buildKeywordPrompt(input: KeywordInput): string {
  return `Build a Google Ads keyword strategy for: ${input.product}
Market / region: ${input.market}
Known competitors: ${input.competitors || "(not provided)"}
Current keyword list (if any): ${input.current_keywords || "(none)"}

WORKFLOW:
1. Map intent funnels — generate keywords across these stages, each labeled by intent:
   - informational (top of funnel, learning)
   - commercial_investigation (mid: comparing, evaluating)
   - transactional (bottom: ready to act)
   - branded (own brand + competitor brand)
   - navigational (specific products/SKUs)

2. For each keyword recommend MATCH TYPE based on Google's current best-practice:
   - Use PHRASE or EXACT for transactional terms (waste-control)
   - Use BROAD only if paired with Smart Bidding AND a strong negative list
   - Branded campaigns: exact match

3. Generate 20 NEGATIVE KEYWORDS based on common irrelevant variants for this product.

4. Suggest AD GROUP STRUCTURE — group keywords by tightly-themed intent clusters (single-theme ad groups).

5. Identify 5 LONG-TAIL OPPORTUNITIES (4+ word queries with clear intent, lower CPC).

6. Identify COMPETITOR KEYWORD GAPS — what they're likely bidding on that you're not.

7. Recommend BIDDING STRATEGY (Manual CPC vs ECPC vs Maximize Conversions vs Target CPA vs Target ROAS) based on conversion data maturity.

Return ONLY valid JSON:
{
  "keywords": [
    {
      "term": "string",
      "intent": "informational|commercial_investigation|transactional|branded|navigational",
      "match_type": "broad|phrase|exact",
      "ad_group_suggestion": "string",
      "long_tail": false,
      "competition_guess": "low|medium|high"
    }
  ],
  "negative_keywords": ["string"],
  "ad_group_structure": [
    { "name": "string", "theme": "string", "keyword_count": 0, "example_keywords": ["string"] }
  ],
  "long_tail_opportunities": ["string"],
  "competitor_gaps": ["string"],
  "bidding_recommendation": {
    "strategy": "string",
    "reason": "string",
    "learning_phase_days": 0,
    "switch_to_smart_when": "string (e.g. '50+ conversions/30 days')"
  }
}`;
}
