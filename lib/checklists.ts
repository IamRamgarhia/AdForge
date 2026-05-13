export type ChecklistScope = "daily" | "weekly" | "monthly";

export interface ChecklistItem {
  key: string;
  text: string;
  platform?: "google" | "meta" | "tiktok" | "youtube" | "linkedin" | "general";
}

export interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

export const CHECKLISTS: Record<ChecklistScope, { duration: string; sections: ChecklistSection[] }> = {
  daily: {
    duration: "15–20 min",
    sections: [
      {
        title: "Google Ads",
        items: [
          { key: "d-g-budget", text: "Check budget pacing — spending too fast or too slow?", platform: "google" },
          { key: "d-g-disapprovals", text: "Review disapproved ads / policy alerts", platform: "google" },
          { key: "d-g-anomalies", text: "Scan for anomalies — any CTR drops >20% overnight?", platform: "google" },
          { key: "d-g-qs", text: "Check Quality Score changes on key keywords", platform: "google" },
          { key: "d-g-invalid", text: "Review invalid click report", platform: "google" },
          { key: "d-g-pause", text: "Pause keywords with CPA >30% above target after 50+ clicks", platform: "google" },
          { key: "d-g-negs", text: "Add obvious negative keywords from yesterday's search terms", platform: "google" },
        ],
      },
      {
        title: "Meta Ads",
        items: [
          { key: "d-m-freq", text: "Check frequency — above 3.0 = ad fatigue risk", platform: "meta" },
          { key: "d-m-cpm", text: "Review CPM trends — spike = audience saturation", platform: "meta" },
          { key: "d-m-roas", text: "Check ROAS by ad set", platform: "meta" },
          { key: "d-m-learning", text: "Flag any ad sets in 'Learning Limited' status", platform: "meta" },
          { key: "d-m-comments", text: "Review comment section for sentiment signals", platform: "meta" },
        ],
      },
      {
        title: "TikTok Ads",
        items: [
          { key: "d-t-completion", text: "Check video completion rate — below 25% = hook problem", platform: "tiktok" },
          { key: "d-t-ctr", text: "Review CTR by hook variant", platform: "tiktok" },
          { key: "d-t-cpc", text: "Check cost-per-click trend", platform: "tiktok" },
        ],
      },
    ],
  },
  weekly: {
    duration: "45–60 min",
    sections: [
      {
        title: "Campaign Health",
        items: [
          { key: "w-h-wow", text: "Compare week-over-week CTR, CPC, CPA, ROAS" },
          { key: "w-h-search-terms", text: "Search terms report — add negatives, mine new keywords" },
          { key: "w-h-demo", text: "Check audience performance by demographics" },
          { key: "w-h-device", text: "Device performance — mobile vs desktop conversion rates" },
          { key: "w-h-schedule", text: "Ad scheduling data — time-of-day patterns?" },
          { key: "w-h-geo", text: "Review geographic performance" },
          { key: "w-h-impression-share", text: "Impression share — losing to budget or rank?" },
          { key: "w-h-excludes", text: "Audience exclusions — current customers excluded from prospecting?" },
        ],
      },
      {
        title: "Creative",
        items: [
          { key: "w-c-top", text: "Identify top performer — replicate its angle" },
          { key: "w-c-worst", text: "Identify worst performer — pause or rewrite" },
          { key: "w-c-fatigue", text: "Creative fatigue check — same ad running >3 weeks?" },
          { key: "w-c-test", text: "Plan next A/B test" },
        ],
      },
      {
        title: "Budget",
        items: [
          { key: "w-b-spent", text: "Was budget fully spent? If not, what limited delivery?" },
          { key: "w-b-reallocate", text: "Reallocate budget from underperformers to winners" },
          { key: "w-b-impression-share", text: "Any campaign impression-share-limited?" },
        ],
      },
    ],
  },
  monthly: {
    duration: "2–3 hours",
    sections: [
      {
        title: "Performance Analysis",
        items: [
          { key: "m-p-mom", text: "Month-over-month comparison of all KPIs" },
          { key: "m-p-best-worst", text: "Identify best and worst campaigns by ROAS" },
          { key: "m-p-competitors", text: "Competitor ad spy review (Meta Ads Library, Google Transparency Center)" },
          { key: "m-p-brand-search", text: "Brand search volume trends" },
          { key: "m-p-attribution", text: "Attribution review — first-click vs last-click" },
        ],
      },
      {
        title: "Account Health",
        items: [
          { key: "m-a-qs", text: "Overall account Quality Score" },
          { key: "m-a-structure", text: "Audit campaign structure — is it still logical?" },
          { key: "m-a-dupes", text: "Check for duplicate keywords across ad groups" },
          { key: "m-a-bid", text: "Review bidding strategy performance" },
          { key: "m-a-seasonal", text: "Update seasonal budget plan" },
        ],
      },
      {
        title: "Strategy",
        items: [
          { key: "m-s-brand-brain", text: "Review Brand Brain — is it still accurate?" },
          { key: "m-s-personas", text: "Update audience personas based on data" },
          { key: "m-s-tests", text: "Plan next month's creative tests" },
          { key: "m-s-new-audiences", text: "Identify new audiences to test" },
          { key: "m-s-kpi", text: "Set next month's KPI targets" },
        ],
      },
    ],
  },
};
