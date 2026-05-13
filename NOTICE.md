# NOTICE — Sources & Attribution

AdForge is MIT-licensed. The prompts shipped in `lib/prompts/` are informed by — and in some places quote verbatim from — these public, MIT-licensed open-source projects. We list them here both to give credit and so users can trace any rule back to its source.

## Primary sources

### [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT)
50+ marketing skills. Patterns borrowed:
- **Angles-first generation** + 8-category angle taxonomy (Pain / Outcome / Social proof / Curiosity / Comparison / Urgency / Identity / Contrarian) — from `skills/ad-creative/SKILL.md`
- **Wave-batched generation** (Wave 1: 3-5 angles × 5 variations; Wave 2: extend top 2; Wave 3: wildcards) — from `skills/ad-creative/SKILL.md`
- **RSA headline-mix recipe** (4 keyword / 4 benefit / 3 social-proof / 3 CTA / 1 brand) — from `skills/ad-creative/SKILL.md`
- **Char-count self-validation with inline overage flags** — from `skills/ad-creative/SKILL.md`
- **Retire-after-1000-impressions threshold** — from `skills/ad-creative/SKILL.md` Common Mistakes
- **Creative-testing hierarchy** (Concept > Hook > Visual > Body > CTA) — from `skills/paid-ads/SKILL.md`
- **Retargeting window + frequency matrix** (Hot 1-7d / Warm 7-30d / Cold 30-90d) — from `skills/paid-ads/SKILL.md`
- **Mandatory exclusions** (recent converters, bounced <10s, careers/support visitors) — from `skills/paid-ads/SKILL.md`
- **Video 3-second hook + 85%-no-sound rule** — from `skills/paid-ads/SKILL.md`
- **Bid-progression thresholds** (50+ conversions before automated bidding) — from `skills/paid-ads/SKILL.md`
- **Diagnosis trees** (CPA high / CTR low / CPM high — symptom-ordered checks) — from `skills/paid-ads/SKILL.md`
- **Banned-word lists** (vague verbs, hedge words, weak CTAs) — from `skills/copywriting/SKILL.md`
- **Honesty constraint** (legal liability framing) — from `skills/copywriting/SKILL.md`
- **CTA formula** (Action Verb + What They Get + Qualifier) — from `skills/copywriting/SKILL.md`
- **Pricing psychology** (Rule of 100, Charm vs Rounded, mental accounting reframes) — from `skills/marketing-psychology/SKILL.md`
- **Theory of Constraints bottleneck-first** — from `skills/marketing-psychology/SKILL.md`

### [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) (MIT)
250+ audit checks for paid ads. Patterns borrowed:
- **Severity tiers with fix-time SLAs** (Critical / High / Medium / Low) — from `ads/SKILL.md`
- **Industry benchmark numbers** (TikTok engagement 5-16%, Spark Ads ~3% CTR, Smart+ median ROAS 1.41-1.67) — from `ads/references/benchmarks.md`
- **Platform char-limit reference tables** — from `ads/references/platform-specs.md`
- **Per-platform copy framework table** (AIDA / PAS / BAB / 4P / FAB / Star-Story-Solution) — from `ads/references/copy-frameworks.md`
- **3x Kill Rule** (flag ad groups with CPA >3x target) — from `ads/SKILL.md`

### [google-marketing-solutions/copycat](https://github.com/google-marketing-solutions/copycat) (Apache-2.0)
Google's own RSA generator. Patterns borrowed:
- **Combinability clause** (verbatim): "Each variant must make sense standalone AND in any combination together. Google Ads will select different combinations of headlines and descriptions to display." — from `py/copycat/copycat.py`
- **Style transfer via exemplar retrieval** approach (conceptually adapted for browser context) — from `py/copycat/ad_copy_generator.py`
- **Programmatic "fill the gap"** (request only the missing assets, not all of them) — from `py/copycat/copycat.py`

### [nowork-studio/toprank](https://github.com/nowork-studio/toprank) (MIT)
SEO + paid audit skills. Patterns borrowed:
- **Pulse metrics** (return 3 numbers, not letter grades) — from audit-skill
- **"Name names" anti-vagueness rule** — from audit-skill
- **STOP conditions before optimization** (broken tracking → halt) — from audit-skill
- **Policy-freshness check** (timestamped claims) — adapted for our `lib/benchmarks.ts`

## License compatibility

All borrowed patterns come from MIT or Apache-2.0 licensed sources. AdForge itself is MIT. Verbatim quotes are limited to the **rules and structural patterns**, not the project's code — and we re-write everything in our own prompt voice except where a rule is quoted (like Copycat's combinability clause, which is short, factual, and not creative expression).

If you maintain one of these projects and want different attribution or wish for us to remove a pattern, open an issue at https://github.com/YOUR_GITHUB/adOS/issues — we'll respond within 7 days.

## Platform specs

Character limits, ratios, and image sizes referenced in our prompts are cross-confirmed across at least two of the four source repos above AND each platform's official help docs (last verified May 2026 — see `lib/benchmarks.ts` and individual prompt files in `lib/prompts/`).

## Industry benchmarks

Benchmark ranges in `lib/benchmarks.ts` are **directional 2025 industry data**, cross-confirmed across:
- claude-ads benchmark file
- marketingskills paid-ads platform-strengths table
- WordStream annual benchmark reports (publicly cited)
- Each platform's own published advertiser benchmarks

Treat all ranges as directional. Always verify against your own attribution before treating as truth.
