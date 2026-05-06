#!/usr/bin/env bash
# build_site.sh — Media-aware Astro site build script
#
# Problem: Astro wipes docs/ on every build (outDir). Large media files
# (.m4a audio, .mp4 video) live in site/public/audio/ and site/public/video/
# AND docs/audio/ and docs/video/. Astro copies from site/public/ to docs/
# during build, causing ENOSPC (~7GB fill on builds).
#
# Solution: Stash ALL media (both site/public/ and docs/) to /tmp before
# build, run the lean Astro build, then restore everything after.
# This keeps local copies safe while allowing the build to complete.
#
# Migration note: These files should eventually move to cdn.failurefirst.org
# (Cloudflare R2). Once that migration is complete, this stash logic can be
# removed and site/public/audio/ + site/public/video/ deleted from the repo.
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
    # Print all .m4a, .mp4, and .wav files from BOTH site/public/ and docs/
    # (Astro copies site/public/ → docs/ during build; stashing both prevents ENOSPC)
    find "${SITE_DIR}/public" "${DOCS_DIR}" \
        \( -name "*.m4a" -o -name "*.mp4" -o -name "*.wav" \) 2>/dev/null || true
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
    log "Found ${MEDIA_COUNT} media file(s) to stash before build (both site/public/ and docs/):"
    while IFS= read -r f; do
        log "  ${f#${REPO_ROOT}/}"
    done < "${MEDIA_LIST_FILE}"
else
    log "No media files found — nothing to stash"
fi

if "${DRY_RUN}"; then
    rm -f "${MEDIA_LIST_FILE}"
    log "[DRY-RUN] Would stash ${MEDIA_COUNT} file(s) to ${STASH_DIR}"
    log "[DRY-RUN] Would run: cd ${SITE_DIR} && npm run build"
    log "[DRY-RUN] Would restore site/public/ media from stash (docs/ media excluded — stays in git tree)"
    if "${PUSH}"; then
        log "[DRY-RUN] Would run: git add docs/ (excluding *.m4a *.mp4 *.wav) && git commit -m '...' && git push"
    fi
    log "[DRY-RUN] Would remove stash dir ${STASH_DIR}"
    log "=== DRY-RUN complete — no files moved, no build run ==="
    exit 0
fi

# Step 3: Stash media files — preserve absolute path relative to REPO_ROOT
# so we can restore each file to its exact original location
if [[ "${MEDIA_COUNT}" -gt 0 ]]; then
    log "Stashing ${MEDIA_COUNT} media file(s) to ${STASH_DIR} ..."
    mkdir -p "${STASH_DIR}"
    while IFS= read -r f; do
        # Store under stash using repo-root-relative path (preserves site/public/ vs docs/ distinction)
        rel="${f#${REPO_ROOT}/}"
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

# Cleanup trap: on any exit (including errors), restore site/public/ media from stash
# so the local source tree is never left in a broken state.
cleanup() {
    local exit_code=$?
    rm -f "/tmp/site_media_list_$$"
    if [[ -d "${STASH_DIR}" ]]; then
        log "Cleanup: restoring site/public/ media from stash ..."
        find "${STASH_DIR}/site" -type f 2>/dev/null | while IFS= read -r stashed; do
            rel="${stashed#${STASH_DIR}/}"
            dest="${REPO_ROOT}/${rel}"
            mkdir -p "$(dirname "${dest}")"
            mv "${stashed}" "${dest}"
        done
        rm -rf "${STASH_DIR}"
        log "Cleanup complete."
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

# Step 6: Restore site/public/ media from stash (preserves local files)
# NOTE: docs/ media is intentionally NOT restored here.
# - docs/ audio/video is excluded from git staging (step 7) so blobs from the
#   previous commit remain in the tree — GitHub Pages continues serving them.
# - New audio episodes should be added to git separately, not via this script.
# - Once cdn.failurefirst.org (R2) is set up, remove this block and delete
#   site/public/audio/ and site/public/video/ from the repo entirely.
if [[ -d "${STASH_DIR}" ]]; then
    log "Restoring site/public/ media from stash ..."
    find "${STASH_DIR}/site" -type f 2>/dev/null | while IFS= read -r stashed; do
        rel="${stashed#${STASH_DIR}/}"
        dest="${REPO_ROOT}/${rel}"
        mkdir -p "$(dirname "${dest}")"
        mv "${stashed}" "${dest}"
    done
    # Remove any remaining stash dirs (docs/ media stays stashed — not needed on disk
    # since git serves from the committed tree, not the working directory)
    rm -rf "${STASH_DIR}"
    log "site/public/ media restored."
fi

# Step 7: Optional git push
# Exclude media from staging: docs/audio and docs/video blobs stay referenced
# from the PREVIOUS commit in the git tree — no need to re-push ~7GB each build.
if "${PUSH}"; then
    cd "${REPO_ROOT}"
    COMMIT_MSG="chore(site): rebuild docs/ $(date '+%Y-%m-%d %H:%M')"
    log "Staging docs/ for commit (excluding audio/video) ..."
    git add -- 'docs/' ':!docs/**/*.m4a' ':!docs/**/*.mp4' ':!docs/**/*.wav' ':!docs/**/*.mp3' \
               ':!docs/*.m4a' ':!docs/*.mp4' ':!docs/*.wav' ':!docs/*.mp3'
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
