#!/usr/bin/env python3
"""
OpenAdKit knowledge-refresh script (OPTIONAL — maintainer / power-user tool).

Pulls current platform specs, benchmarks, and best-practice updates from public
ad-platform documentation using ScrapeGraphAI + an LLM, then emits a JSON delta
the maintainer can review before merging into `lib/benchmarks.ts` and the prompt
constants in `lib/prompts/*-ads.ts`.

This script does NOT run at runtime. It is offline. It is opt-in. The OpenAdKit web
app never calls it. The browser-only architecture stays intact.

USAGE
-----
1. Create a venv:
       python -m venv .venv && source .venv/bin/activate   # or .venv\\Scripts\\activate on Windows
2. Install:
       pip install scrapegraphai playwright python-dotenv
       playwright install --with-deps chromium
3. Provide an LLM key (any provider ScrapeGraphAI supports):
       export OPENAI_API_KEY=sk-...           # or
       export ANTHROPIC_API_KEY=sk-ant-...    # or
       export GROQ_API_KEY=gsk_...            # or
       export GOOGLE_API_KEY=AIza...          # for Gemini
4. Run:
       python scripts/refresh_knowledge.py

The script writes:
   - scripts/output/benchmarks_<date>.json        (delta vs lib/benchmarks.ts)
   - scripts/output/platform_specs_<date>.json    (char limits, ratios)
   - scripts/output/changes_<date>.md             (human-readable diff)

REVIEW EVERY OUTPUT before merging. Models hallucinate. Cross-check against the
source URL listed in each entry.

WHY ScrapeGraphAI not a simple `requests` script?
- Ad-platform docs change layout constantly. Selector-based scraping breaks weekly.
- LLM-driven extraction tolerates layout changes — you describe the data you want,
  the agent reads the page, parses it, returns structured JSON.
- Compared to manual maintenance: ~6 minutes/run vs hours of selector spelunking.
"""

from __future__ import annotations
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    from scrapegraphai.graphs import SmartScraperGraph
except ImportError:
    print(
        "scrapegraphai is not installed. Run:\n"
        "    pip install scrapegraphai playwright python-dotenv\n"
        "    playwright install --with-deps chromium",
        file=sys.stderr,
    )
    sys.exit(2)


# -- Sources we want to refresh --------------------------------------------------
SOURCES = {
    "google_rsa_specs": {
        "url": "https://support.google.com/google-ads/answer/7684791?hl=en",
        "prompt": (
            "Extract Google Responsive Search Ad specifications: number of headlines "
            "allowed, headline character limit, number of descriptions, description "
            "character limit, display path character limit. Return JSON with fields: "
            "headlines_min, headlines_max, headline_chars, descriptions_min, "
            "descriptions_max, description_chars, display_path_chars, source_url, "
            "verified_at_iso."
        ),
    },
    "google_pmax_specs": {
        "url": "https://support.google.com/google-ads/answer/10724817?hl=en",
        "prompt": (
            "Extract Performance Max asset specifications: number of headlines, long "
            "headlines, descriptions, business name char limit, required image "
            "ratios + sizes, video specs. Return as JSON."
        ),
    },
    "meta_ad_specs": {
        "url": "https://www.facebook.com/business/ads-guide",
        "prompt": (
            "Extract Meta (Facebook + Instagram) ad spec ranges for Feed, Stories, "
            "Reels, Carousel: primary text char limits, headline char limits, "
            "description char limits, video durations, aspect ratios. Return as JSON."
        ),
    },
    "tiktok_in_feed_specs": {
        "url": "https://ads.tiktok.com/help/article/in-feed-ads-format-specifications",
        "prompt": (
            "Extract TikTok In-Feed ad format specs: video duration min/max, aspect "
            "ratio, ad text char limit, safe zone pixels, file size, format. Return JSON."
        ),
    },
    "linkedin_specs": {
        "url": "https://www.linkedin.com/help/lms/answer/a418056",
        "prompt": (
            "Extract LinkedIn Sponsored Content + Lead Gen Form specs: intro char "
            "limits (recommended + max), headline limits, description limits, image "
            "ratios, video duration. Return as JSON."
        ),
    },
}

# -- LLM config: pick the cheapest available -----------------------------------
def pick_llm():
    """Return ScrapeGraphAI config for whichever provider has a key in env."""
    if os.getenv("GROQ_API_KEY"):
        return {
            "llm": {
                "api_key": os.environ["GROQ_API_KEY"],
                "model": "groq/llama-3.3-70b-versatile",
                "temperature": 0.1,
            },
            "verbose": False,
            "headless": True,
        }
    if os.getenv("GOOGLE_API_KEY"):
        return {
            "llm": {
                "api_key": os.environ["GOOGLE_API_KEY"],
                "model": "google_genai/gemini-2.5-flash",
                "temperature": 0.1,
            },
            "verbose": False,
            "headless": True,
        }
    if os.getenv("OPENAI_API_KEY"):
        return {
            "llm": {
                "api_key": os.environ["OPENAI_API_KEY"],
                "model": "openai/gpt-4.1-mini",
                "temperature": 0.1,
            },
            "verbose": False,
            "headless": True,
        }
    if os.getenv("ANTHROPIC_API_KEY"):
        return {
            "llm": {
                "api_key": os.environ["ANTHROPIC_API_KEY"],
                "model": "anthropic/claude-haiku-4-5-20251001",
                "temperature": 0.1,
            },
            "verbose": False,
            "headless": True,
        }
    print(
        "No LLM key found. Set one of GROQ_API_KEY / GOOGLE_API_KEY / "
        "OPENAI_API_KEY / ANTHROPIC_API_KEY in your shell.",
        file=sys.stderr,
    )
    sys.exit(2)


def scrape_one(name: str, spec: dict, llm_cfg: dict) -> dict:
    print(f"  → {name} ({spec['url']})", flush=True)
    try:
        graph = SmartScraperGraph(prompt=spec["prompt"], source=spec["url"], config=llm_cfg)
        result = graph.run()
        return {
            "ok": True,
            "name": name,
            "source_url": spec["url"],
            "verified_at": datetime.utcnow().isoformat() + "Z",
            "data": result,
        }
    except Exception as e:  # broad on purpose — keep going on the next source
        return {"ok": False, "name": name, "source_url": spec["url"], "error": str(e)}


def main():
    project_root = Path(__file__).resolve().parent.parent
    output_dir = project_root / "scripts" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    date_tag = datetime.utcnow().strftime("%Y-%m-%d")

    llm_cfg = pick_llm()
    print(f"Using LLM model: {llm_cfg['llm']['model']}\n", flush=True)
    print(f"Scraping {len(SOURCES)} sources…\n", flush=True)

    results = []
    for name, spec in SOURCES.items():
        results.append(scrape_one(name, spec, llm_cfg))

    successes = [r for r in results if r.get("ok")]
    failures = [r for r in results if not r.get("ok")]

    # Write raw output
    raw_path = output_dir / f"platform_specs_{date_tag}.json"
    raw_path.write_text(json.dumps(results, indent=2), encoding="utf-8")

    # Write human-readable summary
    md_path = output_dir / f"changes_{date_tag}.md"
    md = [f"# Knowledge refresh · {date_tag}\n"]
    md.append(f"**Sources scraped**: {len(SOURCES)} · **OK**: {len(successes)} · **Failed**: {len(failures)}\n")
    md.append("## Successful pulls\n")
    for r in successes:
        md.append(f"### {r['name']}")
        md.append(f"- Source: <{r['source_url']}>")
        md.append(f"- Verified at: `{r['verified_at']}`")
        md.append("- Data:")
        md.append("  ```json")
        md.append("  " + json.dumps(r["data"], indent=2).replace("\n", "\n  "))
        md.append("  ```\n")
    if failures:
        md.append("## Failures\n")
        for r in failures:
            md.append(f"- **{r['name']}** ({r['source_url']}): {r.get('error', 'unknown')}")
    md_path.write_text("\n".join(md), encoding="utf-8")

    print(f"\nDone.")
    print(f"  Raw JSON:   {raw_path.relative_to(project_root)}")
    print(f"  Summary:    {md_path.relative_to(project_root)}")
    print()
    print("Next: review the summary, then update lib/benchmarks.ts and the prompt files")
    print("in lib/prompts/*.ts where char limits or thresholds need adjusting.")
    print("Update 'last verified' dates in NOTICE.md.")

    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
