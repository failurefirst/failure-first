// IO + classification helpers for build-enclosure-cache.mjs (issue #1221).
//
// Split out of the builder so both behaviours can be tested without network:
//
//   * writeCacheAtomically — a validation gate that refuses to publish must not
//     leave a cache that disagrees with the source set. On 2026-11-20 the
//     builder wrote its cache BEFORE checking failures, so an aborted run that
//     found one unresolvable URL still rewrote site/src/data/enclosure-sizes.json
//     and silently dropped that key (726 -> 725). The file is tracked inside the
//     published pathspec, so the deploy source sat one commit away from a tree
//     that verify-podcast-build.mjs rejects (cache keys must equal the feed set).
//
//   * classifyFailure — tells the operator which failures are worth re-running.
//     On the same day a single HTTP 500 on an already-deployed object aborted
//     Stage 1 with "re-running will not help"; four probes minutes later returned
//     200 / 49,945,694 bytes. A 5xx or a transport error is a different animal
//     from a 404 or a non-media object, and the message should say so.
import { existsSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';

/**
 * Classify one recorded failure line from the builder.
 * @param {string} failure e.g. "HEAD 500 len=0 https://…"
 * @returns {'transient'|'persistent'}
 */
export function classifyFailure(failure) {
  const status = /^(?:HEAD|RANGE)\s+(\d{3})\b/.exec(String(failure));
  if (status) {
    const code = Number(status[1]);
    // 5xx / 429 are server-side or rate-limit answers: the object may well be
    // fine a moment later. Everything else (404, 403, 200-without-ranges…)
    // is a statement about the object itself.
    return code >= 500 || code === 429 ? 'transient' : 'persistent';
  }
  // "ERR …" is a thrown fetch: DNS, TLS, timeout, connection reset.
  if (/^ERR\b/.test(String(failure))) return 'transient';
  // SIZE-DISAGREE and MEDIA are observations about the object's content.
  return 'persistent';
}

/**
 * Write the cache atomically: temp file in the same directory, then rename.
 * Callers must only call this when the run had NO failures — that is the whole
 * point (a refused validation leaves the previous cache byte-identical).
 * @param {string} cachePath absolute path of the real cache file
 * @param {Record<string, number>} cache
 */
export function writeCacheAtomically(cachePath, cache) {
  const tmpPath = `${cachePath}.tmp`;
  try {
    writeFileSync(tmpPath, `${JSON.stringify(cache, Object.keys(cache).sort(), 2)}\n`);
    renameSync(tmpPath, cachePath);
  } catch (error) {
    try {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    } catch {
      // Best effort: the original write error is the one worth reporting.
    }
    throw error;
  }
}
