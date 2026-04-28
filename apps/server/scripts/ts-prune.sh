#!/usr/bin/env sh
# Reports unused exports in apps/server.
# Output format: <file>:<line> - <symbol> [(used in module)]
# Symbols marked "(used in module)" are exported but only consumed internally.
# Run from any directory — the script resolves paths relative to itself.
set -e
cd "$(dirname "$0")/.."
vp dlx ts-prune --project tsconfig.json
