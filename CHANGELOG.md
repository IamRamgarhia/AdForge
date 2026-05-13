# Changelog

All notable changes to AdForge are tracked here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added — generators
- Google Performance Max asset generator (`/generate/google-pmax`)
- Google Shopping listing optimizer (`/generate/google-shopping`)
- TikTok Spark Ads creator brief (`/generate/spark-ads`)
- Email subject-line generator (`/generate/email-subjects`)
- Native Lead Form generator for Meta / LinkedIn / Google / TikTok (`/generate/lead-form`)

### Added — optimization
- Audience Targeting planner (three-tier cold/warm/hot, `/optimize/audience`)
- Ad Budget Planner with daily-amount breakouts and break-even (`/optimize/budget-planner`)

### Added — learn
- Mini-course tracks with 28 pre-written lessons: Google (10), Meta (10), TikTok (8). Each lesson includes a "quick action" sidebar and an in-app practice prompt that links to a relevant generator (`/learn/courses`).

### Added — history
- Status tagging (draft / testing / live / paused / winner / loser)
- Star favorites
- Per-entry notes
- Status + starred filter chips
- Per-Brand-Brain JSON export/import via storage API

### Added — onboarding
- Multi-step setup wizard (5 steps): key + verify · model · experience level · primary platform · quick Brand Brain

### Added — mobile
- Mobile nav drawer (sidebar was desktop-only — now hamburger button on `<768px`)
- Top-padding adjustment to clear the mobile menu button

### Added — PWA
- Service worker for offline app shell (Claude API calls always run live; never cached)
- Service worker registers automatically in production builds only

### Added — open source infra
- GitHub Actions CI workflow (typecheck + build + lint on Node 18/20/22)
- Issue templates: bug report + feature request (no blank issues)
- PR template with scope/verification checklist
- `SECURITY.md` with threat model + responsible disclosure flow
- This `CHANGELOG.md`

## [0.1.0] — Initial public release

### Added — foundation
- BYOK Claude API direct from browser (`anthropic-dangerous-direct-browser-access`)
- Models: Claude Opus 4.7, Sonnet 4.6, Haiku 4.5
- Streaming with `requestAnimationFrame`-throttled rendering
- IndexedDB storage via Dexie + localStorage for settings
- Backup / restore / wipe in Settings

### Added — generators
- Google RSA (15 headlines + 4 descriptions + extensions + Quality Score tips)
- Meta Feed / Stories / Reels / Carousel
- TikTok Hooks (50/click) + UGC scripts
- YouTube In-stream / Bumper / Discovery
- LinkedIn Sponsored / Message / Dynamic / Text / Lead Gen
- Twitter / X — 5 variants or thread
- Display banners — every standard size + responsive assets
- Full Campaign Kit — one brief, every platform

### Added — optimize
- CTR Optimizer (5-lever scored diagnosis + rewrites)
- Quality Score Improver (3-factor diagnosis)
- Budget Waste Analyzer (3 pulse metrics + 20-question audit)
- A/B Test Planner (sample-sized, kill/winner rules)
- Keyword Strategy Builder
- Landing Page Grader (8 levers + exact-quote rewrites)
- Bid Strategy Advisor (matched to conversion volume)
- Ad Fatigue Detector

### Added — routines
- Daily / Weekly / Monthly checklists with persisted streaks and auto-reset per period

### Added — learn (initial)
- 25 concept entries with on-demand Claude explanations

### Added — strategy + report
- "What ad should I run?" strategy recommender
- Campaign report generator (markdown, client-ready)

### Added — UI
- Hand-rolled "Trading Terminal × Editorial" dark UI
- Persistent status bar (model / spend / tokens / live time)
- Scope-prefixed page headers
- Char-validation badges + animated saffron caret on live AI streaming
- Manrope + JetBrains Mono + Instrument Serif via `next/font/google`

### Added — open source
- MIT license
- README with 4 install paths (npm, Vercel, Docker, static export)
- CONTRIBUTING.md with prompt-engineering conventions

[Unreleased]: https://github.com/YOUR_GITHUB/adOS/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/YOUR_GITHUB/adOS/releases/tag/v0.1.0
