#!/usr/bin/env node
/**
 * Stamp the service worker with the current git SHA so each deploy invalidates
 * the previous shell cache. Without this, sw.js ships with a hardcoded VERSION
 * string that never changes across deploys → the activate-phase cleanup never
 * deletes the old cache and users get stale UI shells. (Audit finding #38.)
 *
 * Wired into package.json `postbuild` so it runs automatically after `next build`.
 * Reads the SHA from NEXT_PUBLIC_BUILD_ID (Vercel sets this), falling back to
 * `git rev-parse --short HEAD`. Writes back to public/sw.js in place.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SW_PATH = path.join(__dirname, "..", "public", "sw.js");

function resolveBuildId() {
  if (process.env.NEXT_PUBLIC_BUILD_ID) return process.env.NEXT_PUBLIC_BUILD_ID;
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 12);
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return String(Date.now());
  }
}

function main() {
  const buildId = resolveBuildId();
  const sw = fs.readFileSync(SW_PATH, "utf8");
  if (!sw.includes("__BUILD_ID__")) {
    // Already stamped (e.g. running twice). Leave as-is.
    console.log(`[sw-stamp] no __BUILD_ID__ token in ${SW_PATH}, skipping.`);
    return;
  }
  const stamped = sw.replace(/__BUILD_ID__/g, buildId);
  fs.writeFileSync(SW_PATH, stamped, "utf8");
  console.log(`[sw-stamp] sw.js VERSION → openadkit-${buildId}`);
}

main();
