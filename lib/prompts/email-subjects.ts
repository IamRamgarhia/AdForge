export const EMAIL_SUBJECT_LIMITS = {
  subject_mobile_cutoff: 35,
  subject_desktop_cutoff: 60,
  preheader_optimal: 100,
  preheader_max: 140,
} as const;

export interface EmailSubjectInput {
  campaign_type: "promotional" | "newsletter" | "cart_abandonment" | "welcome" | "winback" | "announcement";
  product_or_topic: string;
  audience: string;
  primary_outcome: string;
}

import { CHAR_COUNT_SELF_VALIDATION } from "./common-rules";

export function buildEmailSubjectsPrompt(input: EmailSubjectInput): string {
  return `Generate 12 email subject lines + paired preheaders for a ${input.campaign_type.replace("_", " ")} email.

INBOX MATH:
- Mobile inboxes show ~${EMAIL_SUBJECT_LIMITS.subject_mobile_cutoff} chars of subject before truncation. Critical info MUST be in the first ${EMAIL_SUBJECT_LIMITS.subject_mobile_cutoff} chars.
- Desktop shows ~${EMAIL_SUBJECT_LIMITS.subject_desktop_cutoff} chars.
- Preheader (preview text) shows ${EMAIL_SUBJECT_LIMITS.preheader_optimal}-${EMAIL_SUBJECT_LIMITS.preheader_max} chars on most clients.

INPUT:
- Campaign type: ${input.campaign_type}
- Product / topic: ${input.product_or_topic}
- Audience: ${input.audience}
- Primary outcome we want: ${input.primary_outcome}

GENERATE 12 subject lines distributed across angles:
- 2 curiosity (open loop, no spoiler)
- 2 specificity (number, date, named entity)
- 2 personal / segment-named ("for {role}")
- 2 urgency (real, not fake)
- 2 contrarian / pattern-interrupt
- 2 benefit-direct (the outcome stated plainly)

EVERY subject must:
- Front-load the hook (first ${EMAIL_SUBJECT_LIMITS.subject_mobile_cutoff} chars do the work)
- Avoid spam triggers: ALL CAPS, multiple "!", "$$$$", "FREE!!!", "Re: " fakes
- Have a complementary preheader that ADDS to the subject (not duplicates it)
- Be exactly 12 items in the array — no more, no less.

${CHAR_COUNT_SELF_VALIDATION}

CHAR-COUNT DEFINITIONS:
- subject_chars: total length of the subject string (every visible character).
- subject_chars_visible_mobile: how many of those chars fit in the mobile inbox preview = min(subject_chars, ${EMAIL_SUBJECT_LIMITS.subject_mobile_cutoff}). If subject_chars > ${EMAIL_SUBJECT_LIMITS.subject_mobile_cutoff}, this is exactly ${EMAIL_SUBJECT_LIMITS.subject_mobile_cutoff} and "subject_status" must be "over_mobile".
- preheader_chars: total length of the preheader string.

Return ONLY valid JSON:
{
  "subjects": [
    {
      "label": "A | B | C ... L",
      "angle": "curiosity | specificity | personal | urgency | contrarian | benefit",
      "subject": "string",
      "subject_chars": 0,
      "subject_chars_visible_mobile": 0,
      "subject_status": "ok|over_mobile|over_desktop",
      "subject_trimmed_alt": "string or null (only set if status is over_mobile or over_desktop)",
      "preheader": "string",
      "preheader_chars": 0,
      "preheader_status": "ok|over",
      "spam_risk": "low | medium | high",
      "spam_risk_reason": "string or empty"
    }
  ],
  "best_for_first_send": "A | B | ...",
  "best_for_resend_to_non_openers": "A | B | ...",
  "best_for_segments": [{ "segment": "string", "use": "A | B | ..." }]
}`;
}
