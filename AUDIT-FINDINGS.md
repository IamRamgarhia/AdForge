# AdForge Pre-Launch Audit — Consolidated Findings

Date: 2026-05-14
Method: 8 parallel scoped audits (brand extraction, LLM providers, storage+SW, sidecar, optimizer tools, UI/UX, security, build/SEO).
83 raw findings → 47 unique after dedup.

Confidence rubric: 100=reproducible bug, 80=will fire on realistic use, 60=real but rarer.

---

## BLOCKERS (≥90 confidence — fix before any release)

### Data integrity

**1. JSON-LD `Organization.address` written into `audience_demographics`** — wrong-field semantic bug I introduced in the brand extraction rewrite.
- `lib/deterministic-brand-fill.ts:61` writes the brand's *office address* into the field meant for the *customer demographic profile*. Every downstream generator reads "123 Main St…" as the audience.
- Fix: delete line 61. (97)

**2. Dangling `activeBrainId` after delete** — surfaced by both Storage and UI/UX audits.
- `app/brand/page.tsx:245` calls `softDeleteBrain(b.id)` but never clears `activeBrainId`. After the undo window, `getActiveBrainId()` returns the dead ID; every tool silently runs with `brain = null` and degrades to generic output with no UI signal.
- Fix: `if (b.id === getActiveBrainId()) setActiveBrainId(null)` immediately after soft-delete. (95)

**3. `importBrain` and `importAll` skip `normalizeBrandBrain`** — schema-drift loophole.
- `lib/storage.ts:260-308`. Imported / restored brains written to IndexedDB missing new fields (`favicon_url`, `website_url`, `pending_user_input`). Read path is safe via `normalizeBrandBrain`, but any caller using the return value directly gets a broken brain.
- Fix: pass through `normalizeBrandBrain` before `put`/`bulkPut`. (92)

**4. `applySnapshot` resurrects dangling active brain ID from stale sidecar file**
- `lib/local-sync.ts:111-118` unconditionally restores `ados.active_brain` from the sidecar's snapshot. Boots the app with a deleted brain as active.
- Fix: after writing prefs, verify `getBrain(activeId)` exists; if not, `removeItem`. (90)

### Brand extraction

**5. Gap-fill returns string for array fields → crashes downstream `.join()`**
- `lib/prompts/brand-gap-fill.ts:54-55` JSON-stringifies guidance text as schema values. Model often returns `"Instagram, LinkedIn"` instead of `["Instagram", "LinkedIn"]`. `isEmptyField` accepts it; `buildBrandSystemPrompt` then calls `.join()` and throws "join is not a function".
- Fix: embed literal example arrays in the prompt (same pattern as first-pass extraction) AND post-parse normalize: if `BrandBrain` field is `string[]` and AI returned `string`, wrap or split. (90)

**6. Concurrent extractions race; whichever LLM resolves last wins, silently**
- `app/brand/new/page.tsx:127-280`. `quickBusy` is React state (async). Synchronous double-Enter on URL+Google inputs bypasses the disabled gate.
- Fix: `const busyRef = useRef(false)` set/check synchronously at top of each async function. (90)

### LLM provider layer

**7. `stream_options: { include_usage: true }` causes Mistral streaming to 422**
- `lib/providers/openai-compat.ts:86` hardcodes this field for every OpenAI-compat provider. Mistral rejects it (`extra_forbidden`); every streaming call fails.
- Fix: add per-provider `bodyTransform` that strips `stream_options` for Mistral (and probably Cerebras and Together). (97)

**8. Legacy 2-arg `estimateCostUsd(modelId, usage)` records $0 for vision-fallback runs**
- `components/GeneratorShell.tsx:203`, `app/research/competitors/page.tsx:133`, `app/learn/[concept]/page.tsx:59`, `app/learn/frameworks/page.tsx:70`. When the vision fallback routes via a different provider than active, the legacy form looks up the model in the wrong provider's pricing table and returns $0.
- Fix: use 3-arg form `estimateCostUsd(res.providerId, res.modelId, res.usage)` at all four sites. (92)

### Optimizer tools

**9. Launch wizard date overflow on month-end** — produces invalid strings like `2026-05-35`.
- `app/launch/wizard/page.tsx:92` uses `now.getDate() + 7` then `padStart(2,"0")`.
- Fix: `const d = new Date(now); d.setDate(d.getDate()+7); setLaunchDate(d.toISOString().slice(0,10));` (90)

**10. Vision fallback error banner stays red even when generation succeeds**
- `components/GeneratorShell.tsx:137-142` calls `setError(...)` with a non-blocking warning then continues. Banner is never cleared.
- Fix: split `setWarning` from `setError`, or `setError(null)` after successful stream. (95)

### UI/UX

**11. `PerformanceDialog.save()` has no `finally` — Save button stuck forever on any throw**
- `components/PerformanceDialog.tsx:16-27`. No try/catch, no error surface.
- Fix: wrap in try/catch/finally with a `setError` UI surface. (92)

**12. `BrandSwitcher.pick` double-dispatches events; GeneratorShell merges old brand into new**
- `components/BrandSwitcher.tsx:39` fires `ados:brains-changed` after `setActiveBrainId` (which already fires `ados:active-brain-changed`). The no-reset handler fires right after the reset one, leaving the form in a partially merged state. Same bug in `components/CommandPalette.tsx:157`.
- Fix: remove the manual `dispatchEvent` from both call sites. (90)

### Security

**13. SSRF in sidecar `/ingest` — no private-IP block on initial URL or redirect targets**
- `scripts/local-sync.cjs:665-692`. Validates protocol only. Attacker-controlled redirect can hit `169.254.169.254` (AWS IMDS), `127.x:22`, intranet. On a cloud VM = full credential leak.
- Fix: `isPrivateHost()` helper called on both the initial URL *and* every redirect target. (95)

**14. CSRF on sidecar — `Access-Control-Allow-Origin` reflects any Origin**
- `scripts/local-sync.cjs:107-113`. Any browser tab can POST to `127.0.0.1:3006/update/apply` (runs `git pull` + `npm install`), `/snapshot` (writes user data), `/web/stop`, `/quit`.
- Fix: replace `setCors` with an explicit allowlist of `http://localhost:3005` / `127.0.0.1:3005` and the sidecar's own origin. Reject unknown origins. (92)

### Sidecar

**15. `/update/apply` async race — two concurrent POSTs both pass the guard**
- `scripts/local-sync.cjs:439-455`. Guard checks `updateState.status === "applying"` but the assignment is after the first `await`. Two simultaneous requests both run `git pull` + `npm install`.
- Fix: set `updateState.status = "applying"` synchronously as the first line of the function. (92)

**16. `/config` POST writes arbitrary strings to `.env.local` — no port validation**
- `scripts/local-sync.cjs:784-793` accepts `parsed.PORT` and writes it verbatim. `PORT=../../evil` is accepted. Next launch fails to bind.
- Fix: validate with the existing `envPort()` helper. (90)

### Build / SEO

**17. PWA installability broken — manifest has zero icons + no favicon files exist anywhere**
- `public/manifest.webmanifest` has no `icons` array. No `favicon.ico` / `icon.png` / `apple-touch-icon.png` in `public/` or `app/`. PWA install prompt never fires; every browser tab shows generic globe icon.
- Fix: add 192×192 + 512×512 PNGs, populate manifest `icons` array, add `app/favicon.ico`. (97)

**18. Dynamic routes have no `generateStaticParams` — direct navigation 404s**
- `app/platforms/[platform]/page.tsx`, `app/learn/[concept]/page.tsx`, `app/learn/courses/[course]/page.tsx`, `app/learn/courses/[course]/[lesson]/page.tsx`. All four are `"use client"` pages with no `generateStaticParams`. Direct URL refresh = 404 on Vercel; will hard-fail at build time if `output: 'export'` is added.
- Fix: add `generateStaticParams()` to each, enumerating slugs from the same source the page reads. (95)

---

## HIGH (75-89 — fix before next feature work)

### Brand extraction

**19. `extractOrganizations` unbounded recursion on nested `@graph`** — stack overflow on malformed schema. Add `depth` param, return at depth>10. `lib/deterministic-brand-fill.ts:143-179`. (78)

**20. Paste + Google flows: `tryParseJson` not null-coalesced; null `parsed` silently produces blank brain** — `app/brand/new/page.tsx:241, 273`. Add `?? {}` and an error guard. (85)

**21. `bucketSocialFromUrls` misses `youtu.be`** — `lib/deterministic-brand-fill.ts:203-213`. JSON-LD `sameAs` with short YouTube URLs silently dropped. (80)

### LLM providers

**22. `getModel()` returns hardcoded `"claude-sonnet-4-6"` as fallback** — `lib/settings.ts:234-235`. Non-Anthropic users get a Claude model ID sent to Groq → 404. (82)

**23. Provider key validation uses `length > 8` threshold** — `lib/settings.ts:90-95, 109-111`. Bogus 9-char keys appear valid to the vision-fallback picker. Use provider-specific prefix check. (77)

**24. Cerebras: `stream_options.include_usage` likely ignored → usage always null → $0 cost** — same root as finding 7. `lib/providers/openai-compat.ts:86`. (80)

### Optimizer tools

**25. Active-brain switch mid-generation captures stale brain in closure** — `components/GeneratorShell.tsx:53,157`. System prompt built from old brain but output shown under new brand. Add `if (running) return;` guard in the brain-load effect. (80)

**26. `app/research/competitors/page.tsx` uses stale `lib/claude` imports** — no `GeneratorShell`, no vision path, no stop button, wrong-arity cost. Full migration to `llmStream`. (82)

### Storage

**27. `getCampaign(id)` returns soft-deleted campaigns** — `lib/storage.ts:197-199`. No `deleted_at` filter. (82)

**28. Multi-tab snapshot race** — `lib/local-sync.ts:152-173`. No in-flight guard. Tab B can overwrite Tab A's just-saved brain. Use `navigator.locks.request`. (83)

**29. `addUsage` throws unhandled in Safari/Firefox private mode** — `lib/settings.ts:144-151`. `setItem` throws `QuotaExceededError` synchronously, propagates to every llmCall site. Wrap in try/catch. (80)

### UI/UX

**30. `settings/page.tsx saveProvider` no finally — verify button permanently disabled on network timeout** — `app/settings/page.tsx:76-94`. (88)

**31. `commitPendingExtraction` no try/catch + no busy guard** — `app/brand/new/page.tsx:106-113`. Double-click + IDB throw = silent failure. (85)

**32. `BrandSwitcher` missing `ados:active-brain-changed` listener** — `components/BrandSwitcher.tsx:24-33`. PageHeader chip stays stale after sidebar switch. (88)

**33. Sidebar quick-switcher dropdown has no Escape-to-close, no click-outside** — `components/Sidebar.tsx:141-239`. Keyboard trap, ARIA violation. (82)

**34. `PerformanceDialog` no Escape-to-close** — `components/PerformanceDialog.tsx:40-72`. (80)

### Sidecar

**35. Windows `stopWeb` doesn't wait for taskkill — restart sees child !== null and bails** — `scripts/local-sync.cjs:510-524`. Web app silently left stopped. Poll until `webChild === null`. (82)

**36. `/ingest` no remote-fetch size cap → ~10× HTML peak memory on regex passes** — `scripts/local-sync.cjs:697-699`. Reject at 500KB instead of silent-truncate to 1.5MB. (78)

### Build / SEO

**37. `app/layout.tsx` metadata has no `openGraph`, `twitter`, `metadataBase`** — social share cards blank everywhere. (88)

**38. Service worker `VERSION = "adforge-v2"` is static — stale caches never evicted** — `public/sw.js:4`. Inject build hash. (85)

**39. `about/page.tsx` "NOTICE.md" link points back at `/about`** — broken self-link. (82)

**40. Generator count mismatch: README "18" vs About page "17"** — 18 is correct. (80)

---

## MEDIUM (60-74 — quality bar)

41. **`stopWeb` `restart_stale` race on macOS** — `AdForge.command:111`. Sleep 1 may not be enough for old sidecar to release port. (76)
42. **`findFreePair` TOCTOU** — `scripts/resolve-ports.cjs:83-95`. Handle `EADDRINUSE` on `server.listen()` and retry. (76)
43. **Second delete loses first undo (UndoToast holds one event)** — `app/brand/page.tsx:247` + `components/UndoToast.tsx`. Queue toasts or disable Delete while one is active. (78)
44. **`CommandPalette` double-dispatch (same as finding 12)** — `components/CommandPalette.tsx:157`. (78)
45. **`audience-targeting` prompt instructs AI to read "IF AN IMAGE IS ATTACHED" even when stripped on non-vision provider** — `lib/prompts/audience-targeting.ts:46-50`. AI may hallucinate screenshot content. Conditionally include the block. (63)
46. **CharBadge over-limit copy is display-only — auto-save fires anyway** — `app/generate/google/page.tsx:82`, `app/generate/meta/page.tsx:97`. Add post-parse validation. (65)
47. **`Markdown.tsx escape()` doesn't escape `"`** — `components/Markdown.tsx:16-20`. Latent XSS one tag-with-attributes away. (78)
48. **`smart-fill.ts` reads `brain.products[0]` without normalizeBrandBrain guarantee** — `lib/smart-fill.ts:28`. Pre-schema brains. (62)
49. **`local-sync.ts:14` uses `http://localhost:3006`; `url-ingest.ts:60` uses `127.0.0.1` — IPv6 resolution may break one** — (63)
50. **No `robots.txt` and no `sitemap.ts`** — Googlebot will index gated pages. (68)
51. **`vercel.json` missing `X-Frame-Options: DENY` / CSP `frame-ancestors`** — clickjacking risk on key-entry page. (65)
52. **`url-ingest.ts` `dbg()` ships in production** — logs raw page content to user's DevTools. Gate with `NODE_ENV`. (72)
53. **`url-ingest.ts normalize()` doesn't block `javascript:` URIs** — `brain.website_url` could be saved with one; latent XSS if ever rendered as `<a href>`. (65)
54. **`app/page.tsx` returns `null` during load** — no skeleton, layout shift. (68)
55. **`ServiceWorkerRegister` swallows errors silently, no `controllerchange` reload** — `components/ServiceWorkerRegister.tsx:10`. (63)
56. **History delete has no confirm (relies on single-slot undo toast)** — `app/history/page.tsx:349-361`. (62)
57. **`addUsage` no upper bound + `writeEnvLocal` not atomic + `setCors` reflects any origin** — already covered by 14/29 but worth a unified hardening pass. (60-65)
58. **`package.json "private": false`** — risk of accidental `npm publish`. (78)
59. **`extractMetadata` doesn't handle unquoted HTML5 attribute values** — `scripts/local-sync.cjs:229-243`. Older CMS output missed. (62)
60. **DeepSeek-reasoner default `max_tokens: 2048` truncates reasoning chains silently** — `lib/providers/openai-compat.ts:54,83`. Bump to 16K for that model. (72)
61. **429 rate-limit has no `Retry-After` surfacing or retry** — `openai-compat.ts:18-25`, `anthropic.ts:34-41`. (68)
62. **`saveBrain` in industry-template path sets active brain to blank skeleton** — `app/brand/new/page.tsx:440-447`. Activate only on actual save. (68)
63. **Gap-fill `objections` and `objection_handling` not paired** — mismatched lengths possible. `app/brand/new/page.tsx:183`. (65)

---

## Recommended fix ordering

**Sprint 1 (blockers + structural):**
1. Findings 1, 2 (data integrity foundations — dangling active brain, wrong-field address)
2. Findings 13, 14 (security — SSRF + CSRF in sidecar)
3. Findings 7, 8 (LLM provider — Mistral streaming, cost accounting)
4. Findings 17, 18 (deploy — PWA + dynamic routes)

**Sprint 2 (rest of blockers):**
5. Findings 3, 4 (import + snapshot normalization)
6. Findings 5, 6 (brand extraction race + array typing)
7. Findings 9, 10, 11, 12 (tool stability)
8. Findings 15, 16 (sidecar update + config)

**Sprint 3 (HIGH issues, grouped by file proximity)**

**Sprint 4 (MEDIUM cleanup pass)**
