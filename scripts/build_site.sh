#!/usr/bin/env bash
# build_site.sh — Media-aware Astro site build script
#
# Problem: Astro wipes docs/ on every build (outDir). Large media files
# (.m4a audio, .mp4 video) live in docs/audio/ and docs/video/ but can't
# be in public/ during build or they cause ENOSPC (10GB+ disk fill).
#
# Solution: Stash media to /tmp before build, restore after.
#
# Usage:
#   bash scripts/build_site.sh              # Build only
#   bash scripts/build_site.sh --dry-run    # Log what would happen, no changes
#   bash scripts/build_site.sh --push       # Build + git add/commit/push docs/
#
# Requires: npm, git
# Site dir: ./site/ (Astro project with outDir: ../docs)
# Resolves: https://github.com/adrianwedd/failure-first-embodied-ai/issues/146

set -euo pipefail

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SITE_DIR="${REPO_ROOT}/site"
DOCS_DIR="${REPO_ROOT}/docs"
STASH_DIR="/tmp/site_media_stash_$$"
MIN_FREE_MB=500
DRY_RUN=false
PUSH=false

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log() {
    echo "[$(date '+%H:%M:%S')] $*"
}

die() {
    echo "[$(date '+%H:%M:%S')] ERROR: $*" >&2
    exit 1
}

check_disk_space() {
    local avail_kb
    avail_kb=$(df -k "${REPO_ROOT}" | awk 'NR==2 {print $4}')
    local avail_mb=$(( avail_kb / 1024 ))
    log "Disk space available: ${avail_mb}MB (minimum required: ${MIN_FREE_MB}MB)"
    if [[ "${avail_mb}" -lt "${MIN_FREE_MB}" ]]; then
        die "Insufficient disk space: ${avail_mb}MB available, ${MIN_FREE_MB}MB required"
    fi
}

find_media_files() {
    # Print all .m4a and .mp4 files under docs/
    find "${DOCS_DIR}" \( -name "*.m4a" -o -name "*.mp4" \) 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
for arg in "$@"; do
    case "${arg}" in
        --dry-run) DRY_RUN=true ;;
        --push)    PUSH=true ;;
        --help|-h)
            grep '^#' "$0" | grep -v '#!/' | sed 's/^# \?//'
            exit 0
            ;;
        *) die "Unknown argument: ${arg}" ;;
    esac
done

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
log "=== build_site.sh starting (dry-run=${DRY_RUN}, push=${PUSH}) ==="
log "Repo root : ${REPO_ROOT}"
log "Site dir  : ${SITE_DIR}"
log "Docs dir  : ${DOCS_DIR}"
log "Stash dir : ${STASH_DIR}"

# Verify required directories exist
[[ -d "${SITE_DIR}" ]] || die "Site directory not found: ${SITE_DIR}"
[[ -f "${SITE_DIR}/package.json" ]] || die "No package.json in ${SITE_DIR}"

# Step 1: Disk space check
check_disk_space

# Step 2: Find media files to stash (Bash 3.2 compatible — no mapfile)
MEDIA_LIST_FILE="/tmp/site_media_list_$$"
find_media_files > "${MEDIA_LIST_FILE}"
MEDIA_COUNT=$(wc -l < "${MEDIA_LIST_FILE}" | tr -d ' ')

if [[ "${MEDIA_COUNT}" -gt 0 ]]; then
    log "Found ${MEDIA_COUNT} media file(s) to stash before build:"
    while IFS= read -r f; do
        log "  ${f}"
    done < "${MEDIA_LIST_FILE}"
else
    log "No media files found in docs/ — nothing to stash"
fi

if "${DRY_RUN}"; then
    rm -f "${MEDIA_LIST_FILE}"
    log "[DRY-RUN] Would stash ${MEDIA_COUNT} file(s) to ${STASH_DIR}"
    log "[DRY-RUN] Would run: cd ${SITE_DIR} && npm run build"
    log "[DRY-RUN] Would restore ${MEDIA_COUNT} file(s) from ${STASH_DIR} to ${DOCS_DIR}"
    if "${PUSH}"; then
        log "[DRY-RUN] Would run: git add docs/ && git commit -m '...' && git push"
    fi
    log "[DRY-RUN] Would remove stash dir ${STASH_DIR}"
    log "=== DRY-RUN complete — no files moved, no build run ==="
    exit 0
fi

# Step 3: Stash media files
if [[ "${MEDIA_COUNT}" -gt 0 ]]; then
    log "Stashing ${MEDIA_COUNT} media file(s) to ${STASH_DIR} ..."
    mkdir -p "${STASH_DIR}"
    while IFS= read -r f; do
        # Preserve relative path structure under docs/
        rel="${f#${DOCS_DIR}/}"
        dest_dir="${STASH_DIR}/$(dirname "${rel}")"
        mkdir -p "${dest_dir}"
        mv "${f}" "${dest_dir}/"
        log "  Stashed: ${rel}"
    done < "${MEDIA_LIST_FILE}"
    log "Stash complete."
else
    log "No media to stash — skipping stash step."
fi
rm -f "${MEDIA_LIST_FILE}"

# Cleanup trap: always restore media and remove stash on exit (success or error)
cleanup() {
    local exit_code=$?
    rm -f "/tmp/site_media_list_$$"
    if [[ -d "${STASH_DIR}" ]]; then
        log "Restoring stashed media from ${STASH_DIR} ..."
        cp -r "${STASH_DIR}/." "${DOCS_DIR}/" || { log "ERROR: Failed to restore media from stash at ${STASH_DIR} — check ${DOCS_DIR}"; exit 1; }
        rm -rf "${STASH_DIR}"
        log "Stash restored and temp dir removed."
    fi
    exit "${exit_code}"
}
trap cleanup EXIT

# Step 4: Run Astro build
log "Running npm run build in ${SITE_DIR} ..."
cd "${SITE_DIR}"
npm run build
log "Build complete."

# Step 5: Restore happens in cleanup trap (EXIT signal)
# (cleanup will fire here on normal exit)

# Step 6: Optional git push
if "${PUSH}"; then
    cd "${REPO_ROOT}"
    COMMIT_MSG="chore(site): rebuild docs/ $(date '+%Y-%m-%d %H:%M')"
    log "Staging docs/ for commit ..."
    git add docs/
    if git diff --cached --quiet; then
        log "No changes to commit in docs/ — skipping push."
    else
        log "Committing: ${COMMIT_MSG}"
        git commit -m "${COMMIT_MSG}"
        log "Pushing to origin ..."
        git push
        log "Push complete."
    fi
fi

log "=== build_site.sh finished successfully ==="
