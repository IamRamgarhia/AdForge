#!/usr/bin/env node
/**
 * Cross-platform launcher: runs the local-sync sidecar AND the Next.js dev server
 * in parallel. One Ctrl+C kills both cleanly.
 *
 * Used by:  npm run start:all
 *
 * If you'd rather use the OS-native scripts, run start.bat (Windows) or
 * bash start.sh (Mac/Linux) instead — same result, no Node-bookkeeping.
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const isWin = process.platform === "win32";
const npx = isWin ? "npx.cmd" : "npx";

console.log("[adforge] starting local-sync sidecar on http://127.0.0.1:3006");
const sync = spawn(process.execPath, [path.join(__dirname, "local-sync.cjs")], {
  cwd: PROJECT_ROOT,
  stdio: ["ignore", "inherit", "inherit"],
});

console.log("[adforge] starting Next.js dev server on http://localhost:3005");
const next = spawn(npx, ["next", "dev", "-p", "3005"], {
  cwd: PROJECT_ROOT,
  stdio: ["ignore", "inherit", "inherit"],
  shell: isWin,
});

function shutdown(signal) {
  console.log(`\n[adforge] received ${signal} — stopping all processes`);
  try {
    sync.kill();
  } catch {}
  try {
    next.kill();
  } catch {}
  // Give them a moment, then force exit
  setTimeout(() => process.exit(0), 600);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

sync.on("exit", (code) => {
  console.log(`[adforge] local-sync exited with code ${code}`);
});
next.on("exit", (code) => {
  console.log(`[adforge] next dev exited with code ${code}`);
  // If next dies, also stop sync
  try { sync.kill(); } catch {}
  process.exit(code ?? 0);
});
