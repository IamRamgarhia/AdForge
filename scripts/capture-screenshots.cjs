#!/usr/bin/env node
/**
 * Captures real-browser screenshots of OpenAdKit's key surfaces for the
 * README and the /alternatives page. SEO-friendly: descriptive filenames,
 * keyword-rich alt text in the README, 1600×1000 viewport (good for
 * GitHub display + social sharing), and PNG compression.
 *
 * Usage:
 *   1. npx next start -p 3055   (in another terminal)
 *   2. node scripts/capture-screenshots.cjs
 *
 * Outputs to docs/screenshots/. Idempotent — overwrites existing files.
 *
 * Some pages are gated by ApiKeyGate (no key → redirect to /setup). We
 * seed minimal localStorage to bypass that for capture purposes only —
 * NO real API key is set, so the screenshots show the UI shell with
 * empty-state content. That's actually the right thing to show
 * marketing-page visitors: they see the UI structure before committing
 * any work. Anyone running this script will get the same screenshots.
 */
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:3055";
const VIEWPORT = { width: 1600, height: 1000 };
// public/screenshots so the same files serve both from raw GitHub (for the
// README) and from the hosted Next.js app (for the /alternatives page).
const OUT_DIR = path.join(__dirname, "..", "public", "screenshots");

// (route, filename, description-for-alt, optional setup steps)
const SHOTS = [
  // Public pages — no gate, no setup needed
  {
    route: "/setup",
    file: "01-setup-wizard.png",
    wait: 500,
  },
  {
    route: "/alternatives",
    file: "02-alternatives-comparison.png",
    wait: 800,
  },
  {
    route: "/benchmarks",
    file: "03-benchmarks-industry-data.png",
    wait: 600,
  },
  {
    route: "/platforms",
    file: "04-platforms-hub.png",
    wait: 500,
  },
  {
    route: "/platforms/meta",
    file: "05-platform-meta-detail.png",
    wait: 500,
  },
  {
    route: "/learn/frameworks",
    file: "06-learn-frameworks-trainer.png",
    wait: 500,
  },
  {
    route: "/launch-guide",
    file: "07-launch-guide-walkthrough.png",
    wait: 500,
  },
  // Gated pages — we seed minimal localStorage to bypass the gate so the
  // screenshot shows the actual product UI (empty state). No real key is set.
  {
    route: "/",
    file: "08-cockpit-dashboard.png",
    wait: 800,
    seed: true,
  },
  {
    route: "/settings",
    file: "09-settings-providers.png",
    wait: 800,
    seed: true,
  },
  {
    route: "/generate/meta",
    file: "10-generator-meta-ads.png",
    wait: 800,
    seed: true,
  },
  {
    route: "/optimize/creative-score",
    file: "11-optimizer-creative-score.png",
    wait: 800,
    seed: true,
  },
  {
    route: "/research/competitors",
    file: "12-research-competitors.png",
    wait: 800,
    seed: true,
  },
];

async function main() {
  let chromium;
  try {
    ({ chromium } = require("@playwright/test"));
  } catch {
    console.error("@playwright/test not installed. Run: npm i -D @playwright/test");
    process.exit(1);
  }
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1.5, // crisper screenshots without retina-doubling file size
      colorScheme: "dark", // OpenAdKit is dark-mode-first
    });

    // Seed localStorage by visiting the site once first.
    const seedPage = await ctx.newPage();
    await seedPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await seedPage.evaluate(() => {
      // Mark onboarded + tour-seen so gates pass to the actual product UI.
      // Use a placeholder API key — pages render their structure without
      // making a real LLM call (only Generate clicks trigger that).
      localStorage.setItem("ados.onboarded", "true");
      localStorage.setItem("ados.tour_seen", "true");
      localStorage.setItem("ados.active_provider", "anthropic");
      localStorage.setItem("ados.provider.anthropic.key", "sk-ant-placeholder-for-screenshot-only");
      localStorage.setItem("ados.provider.anthropic.model", "claude-sonnet-4-5");
    });
    await seedPage.close();

    for (const shot of SHOTS) {
      const page = await ctx.newPage();
      const url = `${BASE_URL}${shot.route}`;
      console.log(`→ ${shot.route}`);
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
        await page.waitForTimeout(shot.wait ?? 500);
        // Hide things that look bad in a hero screenshot: scrollbars, loading
        // skeletons that race the screenshot, etc.
        await page.addStyleTag({
          content: `
            ::-webkit-scrollbar { display: none !important; }
            .animate-pulse, .animate-pulse-soft, .caret { animation: none !important; }
          `,
        });
        await page.waitForTimeout(150);
        const outPath = path.join(OUT_DIR, shot.file);
        await page.screenshot({
          path: outPath,
          type: "png",
          fullPage: false,
          clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
        });
        console.log(`   ✓ ${shot.file}`);
      } catch (e) {
        console.warn(`   ✗ failed: ${e?.message ?? e}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
