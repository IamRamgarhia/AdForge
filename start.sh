#!/usr/bin/env bash
# AdForge start — launches the local-sync sidecar + Next.js dev server.
# Run: bash start.sh

set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "node_modules missing. Running install first..."
  bash install.sh
fi

mkdir -p data

echo "Starting AdForge..."
echo
echo "  Sidecar:  http://127.0.0.1:3006   (local data sync to data/snapshot.json)"
echo "  Web app:  http://localhost:3005   (open this in your browser)"
echo

# Start the sidecar in the background, capture PID
node scripts/local-sync.cjs >data/sync.log 2>&1 &
SYNC_PID=$!
echo "$SYNC_PID" > .ados-sync.pid

# Brief pause so the sidecar is up before the app probes it
sleep 1

# Run Next.js dev in the foreground.
# On Ctrl+C we kill the sidecar too.
trap 'echo; echo "Stopping AdForge..."; kill $SYNC_PID 2>/dev/null || true; rm -f .ados-sync.pid; exit 0' INT TERM

npx next dev -p 3005

# If next exits cleanly, also kill the sidecar
kill $SYNC_PID 2>/dev/null || true
rm -f .ados-sync.pid
