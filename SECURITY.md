# Security Policy

AdForge is a browser-only, BYOK tool. We have no backend, no database, and no user accounts — meaning the attack surface is significantly smaller than typical SaaS, but not zero.

## Threat model — what AdForge does and doesn't protect

**What AdForge protects against**:
- Server-side data breaches (there is no server)
- Account takeover (there are no accounts)
- Database exfiltration (there is no database)
- Token-stealing telemetry (there is no telemetry)

**What AdForge does NOT protect against**:
- Local browser compromise — if your machine is compromised, anything in `localStorage` and `IndexedDB` is reachable, including your Claude API key.
- Shared / public computer use — your API key is stored in cleartext in `localStorage`. Do not log in on machines you don't trust.
- Browser extension snooping — malicious extensions can read AdForge storage.
- A malicious AdForge deployment — only run from sources you trust (this repo, your own fork, your own Docker build).

## Reporting a vulnerability

**Do not file a public GitHub issue** for security problems. Instead:

- Open a [GitHub Security Advisory](https://github.com/YOUR_GITHUB/adOS/security/advisories/new) (private to maintainers), or
- Email the maintainer (replace placeholder in this repo's profile).

Include:
- A clear description of the vulnerability
- Steps to reproduce
- The impact (what an attacker can do)
- Suggested fix if you have one

We aim to acknowledge within **3 days** and patch within **14 days** for high-severity issues.

## Scope

In scope:
- The AdForge source code in this repo
- The default build output
- Documented install paths (npm, Docker, Vercel deploy)

Out of scope:
- The Claude API itself (report to Anthropic)
- Vulnerabilities in browsers, OSes, third-party extensions
- Social engineering against contributors
- Issues that require physical access to a user's device

## Disclosure

We follow coordinated disclosure. Once a fix is shipped:
1. We publish the GitHub Security Advisory describing the issue.
2. We credit the reporter (unless they prefer not).
3. We tag the release with a `security` label.

## Supported versions

The `main` branch is the only supported version. We do not backport security fixes to older tags.

## What's NOT a security issue

- Your API key being visible in browser DevTools → that's how `localStorage` works. AdForge is BYOK by design.
- The tool making generations that violate platform policy → the Claude API and the platforms (Google, Meta, etc.) enforce their own policies; AdForge does not pre-moderate.
- Cost overruns from Claude usage → set spend limits at console.anthropic.com.
