## What does this PR do?

<!-- One paragraph. What changed and why. -->

## Type of change

- [ ] New generator (platform/format)
- [ ] New optimization tool
- [ ] Bug fix
- [ ] UI / UX
- [ ] Performance
- [ ] Docs
- [ ] OSS infra

## Verification

- [ ] `npm run typecheck` passes locally
- [ ] `npm run build` passes locally
- [ ] Tested in browser with a real Claude API key
- [ ] No new outbound network calls except `api.anthropic.com`
- [ ] No new environment variables (BYOK only)
- [ ] If a generator: prompts include char-limit self-validation
- [ ] If a generator: page uses `GeneratorShell` framework
- [ ] No external font CDNs added (use `next/font`)

## Screenshots / output (if UI or generator)

<!-- Drag in a screenshot or paste sample Claude output. Redact anything sensitive. -->

## Scope check

This PR only:

- [ ] Calls `api.anthropic.com` (no other runtime API)
- [ ] Uses BYOK (no server-side keys)
- [ ] Adds no telemetry / analytics

## Related issue

Closes #
