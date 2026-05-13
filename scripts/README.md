# scripts/ — dev-time tools (optional)

These run on the maintainer's machine. They are not part of the AdForge runtime.
The web app stays 100% browser-only.

## `refresh_knowledge.py`

Pulls current platform specs + benchmarks from public ad-platform docs using
[ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) and your
choice of LLM key. Writes a JSON delta + Markdown summary for review.

Run quarterly to keep `lib/benchmarks.ts` + the char-limit constants in
`lib/prompts/*-ads.ts` up to date.

### Quick start

```bash
python -m venv .venv
source .venv/bin/activate          # or .venv\Scripts\activate on Windows
pip install scrapegraphai playwright python-dotenv
playwright install --with-deps chromium

# Set one LLM key (cheapest first):
export GROQ_API_KEY=gsk_...        # free tier — recommended
# or GOOGLE_API_KEY / OPENAI_API_KEY / ANTHROPIC_API_KEY

python scripts/refresh_knowledge.py
```

Output lands in `scripts/output/`. Review the markdown summary before merging
any number changes into the codebase.

### Why this exists

The web app can scrape via [Jina Reader](https://r.jina.ai/) (browser-side,
zero-install) — that covers brand intake. But for periodic refreshes of
authoritative platform docs we want:

- Higher quality structured extraction (LLM-driven)
- Cross-page parsing (a doc may span several URLs)
- Ability to retry / batch / version-pin

That's what ScrapeGraphAI gives us. We accept the heavier install because it's
a maintainer tool, not a user dependency.
