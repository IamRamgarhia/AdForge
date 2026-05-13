export const TWITTER_LIMITS = {
  tweet: 280,
  promoted_video_caption: 280,
  website_card_title: 70,
} as const;

export interface TwitterInput {
  format: "promoted_tweet" | "promoted_video" | "website_card" | "follower_ad" | "thread";
  product: string;
  objective: string;
  voice: string;
}

export function buildTwitterPrompt(input: TwitterInput): string {
  if (input.format === "thread") {
    return `Generate a 6-tweet promoted thread for: ${input.product}
Objective: ${input.objective}
Brand voice: ${input.voice || "(direct, witty, slightly contrarian)"}

RULES:
- Each tweet ≤ 280 chars. Count yourself.
- Hook tweet must work as a standalone — readers may never see tweet 2.
- Final tweet ends with the CTA + link placeholder.
- No emoji spam. One emoji max per tweet, only if it earns its place.
- No hashtags except in the final tweet (1 branded hashtag max).

Return ONLY valid JSON:
{
  "thread": [
    { "position": 1, "role": "hook", "text": "string", "chars": 0 },
    { "position": 2, "role": "problem", "text": "string", "chars": 0 },
    { "position": 3, "role": "context", "text": "string", "chars": 0 },
    { "position": 4, "role": "solution", "text": "string", "chars": 0 },
    { "position": 5, "role": "proof", "text": "string", "chars": 0 },
    { "position": 6, "role": "cta", "text": "string", "chars": 0 }
  ]
}`;
  }
  return `Generate 5 Twitter/X ${input.format.replace("_", " ")} variants for: ${input.product}
Objective: ${input.objective}
Voice: ${input.voice || "(direct, witty, scroll-stopping)"}

RULES:
- Each tweet ≤ 280 chars. Count and self-validate.
- 5 distinct angles — no near-duplicates.
- Make line 1 do the heaviest work (visible in feed previews).

Return ONLY valid JSON:
{
  "tweets": [
    {
      "label": "A | B | C | D | E",
      "angle": "pain | curiosity | contrarian | stat | confession",
      "text": "string",
      "chars": 0,
      "status": "ok | over",
      "trimmed_alt": "string or null"
    }
  ],
  "website_card_title": "string ≤ 70 chars",
  "best_time_window_utc": "string e.g. 14:00-17:00 weekdays"
}`;
}
