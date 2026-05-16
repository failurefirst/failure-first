#!/usr/bin/env bash
# build_site.sh — thin wrapper around `npm run build`.
#
# History: this script used to stash media out of `docs/` before each Astro
# build because the old outDir was `../docs` and Astro wipes outDir on build.
# After the Cloudflare Pages migration (commit db8e6fac9d) the outDir is
# `site/dist`, Cloudflare builds from source, and the stash logic was both
# obsolete and silently destructive of any local-only files dropped into the
# gitignored docs/audio + docs/video directories. The wrapper now just runs
# a disk-space precheck and the npm build.
#
# Usage:
#   bash scripts/build_site.sh

set -euo pipefail

[[ $# -gt 0 ]] && { echo "ERROR: Arguments no longer supported (--dry-run, --push removed in CF Pages migration). Run without arguments." >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SITE_DIR="${REPO_ROOT}/site"
MIN_FREE_MB=500

log() { echo "[$(date '+%H:%M:%S')] $*"; }
die() { echo "[$(date '+%H:%M:%S')] ERROR: $*" >&2; exit 1; }

[[ -f "${SITE_DIR}/package.json" ]] || die "No package.json in ${SITE_DIR}"

avail_mb=$(( $(df -k "${REPO_ROOT}" | awk 'NR==2 {print $4}') / 1024 ))
log "Disk space available: ${avail_mb}MB (minimum: ${MIN_FREE_MB}MB)"
[[ "${avail_mb}" -ge "${MIN_FREE_MB}" ]] || die "Insufficient disk space"

cd "${SITE_DIR}"
log "Running npm run build ..."
npm run build
log "Build complete."
