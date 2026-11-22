// Tests for tools/enclosure-cache-io.mjs — the atomic write and the
// transient/persistent classification behind build-enclosure-cache.mjs
// (issue #1221).
//
// Why these exist, in one line each:
//   * On 2026-11-20 an aborted Stage 1 (one HTTP 500 on an already-deployed
//     object) still rewrote site/src/data/enclosure-sizes.json, dropping the
//     unresolved key (726 -> 725). The cache is tracked inside the published
//     pathspec and verify-podcast-build.mjs requires its key set to equal the
//     feed's, so the deploy source was one commit away from failing the build.
//   * The same abort told the operator "re-running will not help", while four
//     probes minutes later returned 200 with a 49,945,694-byte body.
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { classifyFailure, writeCacheAtomically } from './enclosure-cache-io.mjs';

const tempDirs = [];

function tempCache(contents = null) {
  const dir = mkdtempSync(join(tmpdir(), 'enclosure-cache-'));
  tempDirs.push(dir);
  const path = join(dir, 'enclosure-sizes.json');
  if (contents !== null) writeFileSync(path, contents);
  return path;
}

afterEach(() => {
  while (tempDirs.length) {
    const dir = tempDirs.pop();
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // ignore cleanup failures
    }
  }
});

describe('classifyFailure', () => {
  it('treats a 5xx as transient (server may recover)', () => {
    expect(classifyFailure('HEAD 500 len=0 https://cdn.example/a.m4a')).toBe('transient');
    expect(classifyFailure('HEAD 503 len=0 https://cdn.example/a.m4a')).toBe('transient');
    expect(classifyFailure('RANGE 502 range= https://cdn.example/a.m4a')).toBe('transient');
  });

  it('treats 429 as transient (rate limit, not a dead object)', () => {
    expect(classifyFailure('HEAD 429 len=0 https://cdn.example/a.m4a')).toBe('transient');
  });

  it('treats a thrown fetch as transient (DNS/TLS/timeout/reset)', () => {
    expect(classifyFailure('ERR fetch failed https://cdn.example/a.m4a')).toBe('transient');
  });

  it('treats 4xx as persistent (the object is not there, or not ours)', () => {
    expect(classifyFailure('HEAD 404 len=0 https://cdn.example/a.m4a')).toBe('persistent');
    expect(classifyFailure('HEAD 403 len=0 https://cdn.example/a.m4a')).toBe('persistent');
  });

  it('treats content observations as persistent', () => {
    expect(classifyFailure('SIZE-DISAGREE head=1 range=2 https://cdn.example/a.m4a')).toBe(
      'persistent',
    );
    expect(
      classifyFailure('MEDIA expected=audio got=text/html ftypBrand="" https://cdn.example/a.m4a'),
    ).toBe('persistent');
  });

  it('treats an unrecognised 200-range answer as persistent', () => {
    expect(classifyFailure('RANGE 200 range= https://cdn.example/a.m4a')).toBe('persistent');
  });
});

describe('writeCacheAtomically', () => {
  it('replaces the cache and leaves no temp file behind', () => {
    const path = tempCache('{"old":1}\n');
    writeCacheAtomically(path, { b: 2, a: 1 });
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ a: 1, b: 2 });
    expect(readFileSync(path, 'utf8')).toMatch(/\n$/);
    expect(() => statSync(`${path}.tmp`)).toThrow();
  });

  it('writes sorted keys so the file is stable across runs', () => {
    const path = tempCache('{}\n');
    writeCacheAtomically(path, { z: 26, m: 13, a: 1 });
    expect(readFileSync(path, 'utf8')).toBe('{\n  "a": 1,\n  "m": 13,\n  "z": 26\n}\n');
  });

  it('leaves an existing cache untouched when the write fails', () => {
    const path = tempCache('{"keep":1}\n');
    // A directory where the temp file must go makes writeFileSync fail.
    const blocker = `${path}.tmp`;
    // Make the parent unwritable only for the temp path by turning it into a
    // directory: EISDIR on write, and the rename must never happen.
    mkdirSync(blocker);
    expect(() => writeCacheAtomically(path, { replaced: 1 })).toThrow();
    expect(readFileSync(path, 'utf8')).toBe('{"keep":1}\n');
  });
});
