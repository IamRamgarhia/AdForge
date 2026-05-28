/**
 * Shared rule blocks reused across prompts.
 * Sourced from public open-source skills (MIT-licensed):
 *   - coreyhaines31/marketingskills (ad-creative, paid-ads, copywriting, marketing-psychology)
 *   - AgriciDaniel/claude-ads
 *   - google-marketing-solutions/copycat
 *   - nowork-studio/toprank
 * See NOTICE.md for full attribution.
 */

export const BANNED_WORDS = {
  // copywriting/SKILL.md core principles + weak-CTAs list
  vague_verbs: ["streamline", "optimize", "innovative", "utilize", "facilitate", "leverage", "synergy", "transform"],
  hedge_words: ["almost", "very", "really", "quite", "somewhat", "pretty", "fairly"],
  weak_ctas: ["Submit", "Sign Up", "Learn More", "Click Here", "Get Started", "Continue"],
  superlatives_without_proof: ["best", "#1", "leading", "world-class", "cutting-edge", "revolutionary"],
} as const;

export const HONESTY_CLAUSE = `
HONESTY CONSTRAINT (non-negotiable):
- Never fabricate statistics, testimonials, customer quotes, or named partnerships.
- Fabricated proof points create legal liability and erode trust on the first detection.
- If a benefit cannot be supported by the brand brain, frame it as a claim ("designed to…") rather than a result ("does…").
- Never invent industry awards, certifications, or third-party validations.
`.trim();

/**
 * Global anti-fabrication rule for numeric ranges + URLs + product feature
 * names. Imported by every generator that returns "predicted_*", "expected_*",
 * "estimated_*", or URL fields. Without this, models cheerfully invent
 * "1.2-1.8% CTR for Meta Feed in this audience" or runwayml.com/some/path
 * with no way for downstream code to distinguish real from fabricated.
 */
export const ANTI_FABRICATION_RULE = `
ANTI-FABRICATION (apply to every number, range, and URL you output):

1. NUMBERS / RANGES — any percentage, dollar amount, audience size, or rate range you state must be one of:
   (a) Derived from inputs the user provided. SHOW THE MATH in an adjacent field or inline parenthetical ("$120 AOV × 30% margin → CPA ceiling $36").
   (b) An industry benchmark. CITE THE BENCHMARK BAND, not a fake precision ("WordStream B2B SaaS reports 2-4%" — not "3.2%").
   (c) Marked directional: prefix with "directional:" or set "directional_estimate": true in the field. Example: "directional: 0.8-1.4% CTR band, anchor your actual to your provider's data".
   NEVER state a percentage or dollar figure as fact without (a), (b), or (c). Confident invented numbers are the #1 trust-eroder in AI marketing output.

2. URLs — never invent a URL. If you reference an external tool, brand, or article and you are not certain of the canonical URL:
   - Return the field as null, empty string, or omit it.
   - Or set it to the homepage you ARE certain of (e.g., "https://runwayml.com" not "https://runwayml.com/feature/specific-thing-you-guess-at").
   Broken/wrong links pasted into briefs damage the user's credibility with their team.

3. PRODUCT / PLATFORM FEATURE NAMES — when naming a specific ad-platform feature ("Meta Advantage+ Audience", "Google Performance Max signals"), only use names you are confident exist. If unsure, describe the capability ("audience-expansion targeting") instead of naming a feature.

4. UNKNOWN INPUTS — when the user provided no data for a section, do NOT fabricate filler. Return that section as null/empty, or include an "info_needed" note describing what the user should add to unlock it.
`.trim();

/**
 * Char-count self-validation pattern, lifted from google-ads.ts. Add to any
 * platform generator that emits text with hard character limits — without
 * this, the model silently overshoots Meta's 27-char mobile headlines or
 * TikTok's 100-char caption cap. Caller should reference this then list
 * the specific limits.
 */
export const CHAR_COUNT_SELF_VALIDATION = `
CHAR-COUNT SELF-VALIDATION (do NOT skip):
For every text field with a stated char limit, after writing the text:
1. Count the characters (including spaces, excluding leading/trailing whitespace).
2. Return the count in a "chars" field next to the text.
3. Set "status": "ok" if chars ≤ limit, "over" if chars > limit.
4. If "over": write a "trimmed_alt" version that fits the limit. Do NOT silently truncate the original — keep both so the user can choose.

This catches the most common AI ad-copy failure mode: confident output that gets rejected by the ad platform at submission time.
`.trim();

export const BANNED_WORDS_RULE = `
WORDS / PHRASES TO AVOID (will be flagged as low-quality output):
- Vague verbs: ${BANNED_WORDS.vague_verbs.join(", ")}
- Hedge words: ${BANNED_WORDS.hedge_words.join(", ")}
- Generic CTAs: ${BANNED_WORDS.weak_ctas.join(", ")} (use action verbs that name the outcome, e.g. "Start My Free Trial", "Get the Checklist")
- Superlatives without proof: ${BANNED_WORDS.superlatives_without_proof.join(", ")} — only use when the brand brain provides verifiable evidence.
`.trim();

export const VIDEO_HOOK_RULE = `
VIDEO RULES (apply to every video script — TikTok, Reels, YouTube In-Stream, Meta Video):
- First 3 seconds DECIDE distribution. Open with a pattern interrupt, question, contrarian claim, or shocking specific.
- Assume sound-OFF. 85% of social-video viewers watch without sound (Meta + TikTok data). Captions and on-screen text are mandatory.
- Text overlays cover < 20% of frame.
- For 15s+ scripts: Hook 0-3s · Problem 3-8s · Solution 8-20s · CTA 20-30s.
- No "Hi I'm X from Y" intros. The viewer will never get past it.
`.trim();

export const RETARGETING_MATRIX = `
RETARGETING WINDOW + FREQUENCY MATRIX (sourced from marketingskills/paid-ads):
- HOT  · 1-7 day window  · higher frequency OK (5-7x/wk) · purchase-intent CTAs · pricing pages / cart abandoners
- WARM · 7-30 day window · 3-5x/wk · educational + social-proof content · video-viewers, engagers
- COLD · 30-90 day window · 1-2x/wk · awareness + remarketing reminder · all site visitors except converters

Stick to these bands. Higher frequencies on cold audiences burn out the audience AND brand goodwill.
`.trim();

export const MANDATORY_EXCLUSIONS = `
MANDATORY EXCLUSIONS (from every prospecting campaign):
- Existing customers (Customer Match / Customer List upload)
- Recent converters · 7-14 day window after the conversion event
- Bounced visitors · time-on-site < 10 seconds (signals zero intent)
- Careers / support / press page visitors (not buyers)
- Internal IPs and employee accounts (Customer Match suppression)
`.trim();

export const RETIRE_THRESHOLD_RULE = `
RETIRE THRESHOLDS (avoid premature kill):
- Allow ≥ 1,000 impressions OR ≥ 50 clicks before judging a creative as "underperforming."
- Below these thresholds, statistical noise dominates. Pausing too early throws away winners.
- Exception: if frequency > 4 AND CTR < 0.5% within first 200 impressions → kill (this IS signal).
`.trim();

export const CREATIVE_TESTING_HIERARCHY = `
CREATIVE TESTING HIERARCHY (test highest-leverage layer first):
1. Concept / angle (biggest impact — different psychological frame)
2. Hook / headline (second biggest — algorithm distribution gate)
3. Visual style (third — affects scroll-stop)
4. Body copy (smaller — affects belief)
5. CTA (smallest — affects conversion only after the click decision is made)

Change ONE layer per test cycle. Testing layer #5 before #1 is a common mistake.
`.trim();

export const DIAGNOSIS_TREES = `
DIAGNOSIS TREES (when a symptom is reported, walk the checks in this priority order — do NOT brainstorm freely):

If CPA is high:
1. Landing page experience (mobile load, message match, above-the-fold clarity)
2. Audience (too cold? wrong segment? competitor audience leak?)
3. Creative (fatigued? wrong angle for cold stage?)
4. Quality Score / ad relevance (Google-specific)
5. Bid strategy (mis-matched to volume?)

If CTR is low:
1. Hooks / opening 3 chars / first 3 seconds
2. Targeting (showing to wrong audience entirely)
3. Creative fatigue (frequency > 3, CPM rising)
4. Ad format (Feed vs Stories vs Reels — wrong placement?)
5. Ad strength rating (Google/Meta in-platform indicators)

If CPM is high:
1. Audience narrowness (< 500k often inflates CPM)
2. Auction competition (seasonal / category surge)
3. Ad relevance / quality score
4. Frequency exhaustion within audience pool
`.trim();

export const PRICING_PSYCHOLOGY = `
PRICING PSYCHOLOGY (apply to offer / discount copy and landing-page hero rewrites):
- Rule of 100: under $100 → percentage discount sounds bigger ("20% off"). Over $100 → absolute dollar discount sounds bigger ("$50 off").
- Charm pricing: end in .99 / .95 for value/mass-market positioning. Round prices ($500/mo, $1,200/yr) for premium positioning.
- Mental accounting reframes: "$1/day" beats "$30/month." "Less than your morning coffee" beats "$3/day."
- Anchor before discount: show original price first, struck-through, before the discounted price.
`.trim();

export const WAVE_BATCH_RULE = `
WAVE-BATCHED GENERATION (volume that learns, not flat lists):
- Wave 1: 3-5 distinct angles, 5 variations each (15-25 variants).
- Wave 2: extend the TOP 2 angles with 3-5 more variants each.
- Wave 3: 2-3 contrarian / wildcard variants (counter-frame, emotional reversal, unexpected hook).

This produces winners that the algorithm can actually optimize between, rather than 15 near-duplicates.
`.trim();

export const BOTTLENECK_RULE = `
BOTTLENECK FIRST (Theory of Constraints applied to ad funnels):
- Identify the SINGLE biggest constraint before emitting recommendations.
- If conversion rate is 5%+ but traffic is low → traffic is the bottleneck. CRO recommendations are wasted effort.
- If traffic is fine but CVR < 1% → landing/offer is the bottleneck. More targeting won't help.
- If both look OK but CPA is bad → cost-per-click or audience cost is the bottleneck.
- Address only the bottleneck. Other improvements are local optima that don't move global revenue.
`.trim();
