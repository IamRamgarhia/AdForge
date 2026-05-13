#!/usr/bin/env node
/**
 * AdForge local-sync sidecar.
 *
 * Tiny Node HTTP server (no dependencies — uses only built-ins) that exposes:
 *   GET  /snapshot           → returns data/snapshot.json (or {} if missing)
 *   POST /snapshot           → writes data/snapshot.json with the request body
 *   GET  /health             → liveness probe
 *
 * The Next.js web app probes for this sidecar on http://localhost:3006 and, when
 * available, auto-syncs brand brains + ads + campaigns + checklists into
 * `data/snapshot.json` in the project folder. Zip the folder, move to a new
 * machine, run again — all your work travels with you.
 *
 * Notes:
 *   - API keys are NEVER synced by default (kept in browser localStorage only).
 *     User can opt-in to include keys via a Settings toggle (future work).
 *   - CORS is restricted to localhost.
 *   - Body size limit: 25 MB (plenty for the kind of data AdForge stores).
 *   - No auth — only binds to 127.0.0.1, so only the local machine can reach it.
 *
 * Run:   node scripts/local-sync.cjs
 * Stop:  Ctrl+C   (or use the stop.bat / stop.sh in the repo root)
 */

const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.ADOS_SYNC_PORT || 3006);
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3005",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3005",
]);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data");
const SNAPSHOT_PATH = path.join(DATA_DIR, "snapshot.json");
const MAX_BODY = 25 * 1024 * 1024;

async function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) await fsp.mkdir(DATA_DIR, { recursive: true });
}

function setCors(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3005");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        req.destroy();
        reject(new Error("body too large"));
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCors(req, res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  try {
    const url = req.url || "/";
    if (req.method === "GET" && url === "/health") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true, port: PORT, snapshot_path: SNAPSHOT_PATH }));
      return;
    }
    if (req.method === "GET" && url === "/snapshot") {
      await ensureDataDir();
      let body = "{}";
      if (fs.existsSync(SNAPSHOT_PATH)) {
        body = await fsp.readFile(SNAPSHOT_PATH, "utf8");
      }
      res.setHeader("Content-Type", "application/json");
      res.end(body || "{}");
      return;
    }
    if (req.method === "POST" && url === "/snapshot") {
      await ensureDataDir();
      const body = await readBody(req);
      // Validate it's JSON before writing
      try {
        JSON.parse(body);
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: "invalid json" }));
        return;
      }
      // Atomic-ish write: write to .tmp then rename
      const tmp = SNAPSHOT_PATH + ".tmp";
      await fsp.writeFile(tmp, body, "utf8");
      await fsp.rename(tmp, SNAPSHOT_PATH);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true, bytes: Buffer.byteLength(body) }));
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ ok: false, error: "not found" }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: String(e && e.message ? e.message : e) }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[adforge] local-sync listening on http://127.0.0.1:${PORT}`);
  console.log(`[adforge] snapshot file: ${SNAPSHOT_PATH}`);
});

process.on("SIGINT", () => {
  console.log("[adforge] local-sync shutting down");
  server.close(() => process.exit(0));
});
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
