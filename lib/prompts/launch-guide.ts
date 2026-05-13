export interface LaunchGuideInput {
  platform: "meta" | "google" | "tiktok" | "linkedin" | "youtube" | "twitter";
  objective: string;
  product: string;
  audience: string;
  budget_monthly: string;
  geo: string;
  experience_level: "first_time" | "some" | "experienced";
}

export function buildLaunchGuidePrompt(input: LaunchGuideInput): string {
  const platformPaths: Record<string, string> = {
    meta: "Meta Ads Manager (business.facebook.com/adsmanager)",
    google: "Google Ads (ads.google.com)",
    tiktok: "TikTok Ads Manager (ads.tiktok.com)",
    linkedin: "LinkedIn Campaign Manager (campaign.linkedin.com)",
    youtube: "Google Ads → Campaigns → Video (ads.google.com)",
    twitter: "X Ads Manager (ads.x.com)",
  };
  return `You are walking a ${input.experience_level === "first_time" ? "first-time" : input.experience_level === "some" ? "intermediate" : "experienced"} advertiser through launching a real ad on ${platformPaths[input.platform]}.

INPUT:
- Platform: ${input.platform}
- Objective: ${input.objective}
- Product / service: ${input.product}
- Audience: ${input.audience}
- Monthly budget: $${input.budget_monthly}
- Geo: ${input.geo}
- User experience: ${input.experience_level.replace("_", " ")}

GENERATE a complete step-by-step launch guide tailored to THIS platform's actual UI. The user will follow your guide WHILE clicking through the platform — so every step must be:
- Concrete: name the exact button / menu item / field label
- Sequential: numbered, dependency-ordered (no "see step 12" in step 3)
- Decision-explicit: when the platform asks the user to pick from a dropdown, tell them which option to pick AND why
- Field-by-field: for every form field they'll encounter, give a recommended value based on their inputs above

EVERY STEP MUST INCLUDE:
- step number
- section name (e.g. "Campaign settings", "Ad set targeting", "Creative", "Review")
- exact action ("Click 'New Campaign'", "Type 'Q3-Trial-Launch' in the Campaign name field")
- recommended value if the step requires data input
- why_this_matters (one sentence explaining why this choice — for first-time users)
- common_mistake (one-sentence trap to avoid at this step)
- screenshot_anchor (the platform UI element name they should look for, e.g. "Conversion API" toggle, "Campaign budget optimization" switch)

STRUCTURE (use the platform's actual hierarchy):

For META (Campaign → Ad Set → Ad):
1. Pre-flight (tracking pixel + conversions defined + page + Business Manager ready)
2. Create Campaign (objective + name + special-ad-categories check + CBO decision + budget cap)
3. Create Ad Set (audience, placements, optimization event, budget, schedule, frequency cap)
4. Create Ad (format, identity, primary text, headline, description, CTA, media, destination)
5. Review + publish

For GOOGLE:
1. Pre-flight (conversion tracking, Google Tag, billing, sitelinks data)
2. Create Campaign (goal, type Search/PMax/Display/Shopping/Video, name, networks, locations, languages, audiences, budget, bidding strategy)
3. Create Ad Groups (themes, keywords + match types, ads)
4. Create Ads (RSA: 15 headlines + 4 descriptions + extensions)
5. Review + publish

For TIKTOK:
1. Pre-flight (TikTok pixel installed, conversion events defined, identity created)
2. Create Campaign (objective, name, CBO decision, budget)
3. Create Ad Group (placements, targeting, audience, dayparting, optimization event, bid strategy, budget)
4. Create Ad (Spark or upload, identity, video, text, CTA, destination)
5. Review + publish

For LINKEDIN:
1. Pre-flight (Insight Tag, conversion events, page admin access, Lead Gen Form template ready)
2. Create Campaign (group, objective, audience, locations, languages, demographics + skills + companies, ad format, schedule, budget, bid)
3. Create Ads (intro + headline + description + image OR Lead Gen Form questions)
4. Review + publish

For YOUTUBE:
1. Pre-flight (YouTube channel linked to Google Ads, video uploaded as unlisted, conversion tracking)
2. Create Campaign in Google Ads → Video → goal + type (In-stream / Bumper / In-feed)
3. Create Ad Group (audience: in-market, custom intent, lookalikes, exclusions)
4. Create Video Ad (companion banner, CTA overlay, headline, description)
5. Review + publish

For TWITTER/X:
1. Pre-flight (Twitter Pixel, conversion events, Business account)
2. Create Campaign (objective, dates, daily budget)
3. Create Ad Group (audience: keywords/follower-look-alike/interests, placements, bid)
4. Create Ads (tweet copy, media, website card)
5. Review + publish

ALSO INCLUDE:
- A pre-launch CHECKLIST (separate from the steps) — 10-15 must-confirm items before clicking publish
- Estimated time to complete (in minutes) for someone at their experience level
- Post-launch DAY 1 / DAY 3 / DAY 7 actions (what to watch + adjust)
- A list of 5 things they should NOT touch in the first 7 days (learning phase preservation)

Return ONLY valid JSON:
{
  "platform": "${input.platform}",
  "estimated_time_minutes": 0,
  "preflight_checklist": [
    { "item": "string", "why": "string", "blocker_if_missing": true }
  ],
  "sections": [
    {
      "section_name": "string",
      "steps": [
        {
          "step_number": 1,
          "action": "string (imperative — 'Click X')",
          "recommended_value": "string or null",
          "why_this_matters": "string",
          "common_mistake": "string",
          "screenshot_anchor": "string (UI element to look for)"
        }
      ]
    }
  ],
  "do_not_touch_during_learning_phase": ["string"],
  "post_launch": {
    "day_1": ["string"],
    "day_3": ["string"],
    "day_7": ["string"]
  },
  "estimated_launch_cost_first_week_usd": 0,
  "links": [
    { "label": "string", "url": "string" }
  ]
}`;
}
