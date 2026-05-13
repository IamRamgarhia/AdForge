#!/usr/bin/env bash
# AdForge one-click installer for Mac / Linux.
# Run:  bash install.sh

set -e
cd "$(dirname "$0")"

echo
echo "=================================================="
echo " AdForge installer"
echo " by Dicecodes"
echo "=================================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed."
  echo
  echo "Install Node 20+ from https://nodejs.org/en/download"
  echo "Or with a version manager:"
  echo "    macOS:        brew install node"
  echo "    Ubuntu/Deb:   sudo apt install nodejs npm"
  echo "    nvm:          nvm install 20 && nvm use 20"
  echo
  exit 1
fi

NODE_VER=$(node --version)
echo "Found Node $NODE_VER"
echo

echo "Installing dependencies (this may take a few minutes the first time)..."
echo
npm install --no-audit --no-fund

mkdir -p data
chmod +x start.sh stop.sh 2>/dev/null || true

echo
echo "=================================================="
echo " Install complete."
echo "=================================================="
echo
echo "Next steps:"
echo "  1. Run:  bash start.sh"
echo "  2. Open: http://localhost:3005"
echo "  3. Follow the 5-step onboarding wizard"
echo
echo "Your data lives in:"
echo "  $(pwd)/data/snapshot.json"
echo "Zip this folder to move AdForge + your work to another machine."
echo
