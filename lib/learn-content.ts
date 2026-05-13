export interface ConceptDef {
  slug: string;
  name: string;
  category: "metrics" | "campaign_types" | "frameworks" | "targeting" | "bidding";
  blurb: string;
}

export const CONCEPTS: ConceptDef[] = [
  { slug: "ctr", name: "CTR (Click-Through Rate)", category: "metrics", blurb: "Clicks ÷ impressions. The temperature gauge for whether your ad is being noticed and acted on." },
  { slug: "cpc", name: "CPC (Cost Per Click)", category: "metrics", blurb: "Dollars spent per click. Bid pressure, Quality Score, and competition shape it." },
  { slug: "cpm", name: "CPM (Cost Per Mille)", category: "metrics", blurb: "Cost per 1,000 impressions. Audience saturation and creative fatigue are the usual movers." },
  { slug: "cpa", name: "CPA (Cost Per Acquisition)", category: "metrics", blurb: "Spend ÷ conversions. The number every paid channel ultimately has to defend." },
  { slug: "roas", name: "ROAS (Return on Ad Spend)", category: "metrics", blurb: "Revenue ÷ spend. The ratio your CFO cares about. ROAS 4× means $4 back for every $1 in." },
  { slug: "cvr", name: "CVR (Conversion Rate)", category: "metrics", blurb: "Conversions ÷ clicks. Where ad relevance meets landing-page reality." },
  { slug: "quality-score", name: "Quality Score (Google)", category: "metrics", blurb: "Google's 1-10 rating of your ad+keyword+landing combo. Moves CPC up to 28%." },
  { slug: "ad-relevance", name: "Ad Relevance (Meta)", category: "metrics", blurb: "Meta's 3-tier quality signal. Below average = pay more per result." },
  { slug: "impression-share", name: "Impression Share", category: "metrics", blurb: "Eligible impressions you actually got. Lost-to-budget vs lost-to-rank tells you what to fix." },
  { slug: "frequency", name: "Frequency (Meta)", category: "metrics", blurb: "Times the same person sees an ad. Above 3.0 → diminishing returns and risk of audience burnout." },
  { slug: "video-view-rate", name: "Video View Rate", category: "metrics", blurb: "% of impressions that became a view. The skip-stop diagnostic for video creative." },
  { slug: "hook-rate", name: "Hook Rate (TikTok)", category: "metrics", blurb: "% of impressions that got past the first 3 seconds. Below 30% = the hook isn't earning attention." },
  { slug: "performance-max", name: "Performance Max", category: "campaign_types", blurb: "Google's AI-driven goal-based campaign across all inventories. Loves volume; hates thin signal." },
  { slug: "advantage-plus", name: "Advantage+ (Meta)", category: "campaign_types", blurb: "Meta's AI-driven sales/app campaign. Pair with broad audiences and let learning do its job." },
  { slug: "smart-bidding", name: "Smart Bidding", category: "bidding", blurb: "Google's auction-time bid setting (tCPA / tROAS / MaxConv). Conversion volume is its oxygen." },
  { slug: "learning-phase", name: "Learning Phase", category: "bidding", blurb: "Algorithm exploration window. Touch it and you reset it. Wait ≥7 days or 50 conversions." },
  { slug: "aida", name: "AIDA Framework", category: "frameworks", blurb: "Attention → Interest → Desire → Action. Old, durable. Works for both copy and storyboarding." },
  { slug: "pas", name: "PAS Framework", category: "frameworks", blurb: "Problem → Agitate → Solution. The most reliable hook structure for paid social." },
  { slug: "bab", name: "BAB Framework", category: "frameworks", blurb: "Before → After → Bridge. Best for transformation/outcome-led offers." },
  { slug: "fab", name: "FAB Framework", category: "frameworks", blurb: "Features → Advantages → Benefits. Useful when the feature is genuinely differentiated." },
  { slug: "the-4-us", name: "The 4 U's", category: "frameworks", blurb: "Useful · Urgent · Unique · Ultra-specific. Headline rubric for direct response." },
  { slug: "match-types", name: "Match Types", category: "targeting", blurb: "Broad vs Phrase vs Exact. Tighter match = less waste, less reach. Pair Broad with Smart Bidding only." },
  { slug: "lookalike", name: "Lookalike Audiences", category: "targeting", blurb: "Find people similar to your best seed list. Smaller seed × tighter % = sharper match." },
  { slug: "retargeting", name: "Retargeting", category: "targeting", blurb: "Ads to people who already met you. Highest ROAS, smallest pool — always run, never the whole strategy." },
  { slug: "customer-match", name: "Customer Match", category: "targeting", blurb: "Upload your customer list to suppress, retarget, or lookalike-seed. Privacy-rules apply." },
];

export const CATEGORY_LABEL: Record<ConceptDef["category"], string> = {
  metrics: "Metrics & KPIs",
  campaign_types: "Campaign Types",
  frameworks: "Copy Frameworks",
  targeting: "Targeting",
  bidding: "Bidding",
};
