#!/usr/bin/env node
// Build src/data/enclosure-sizes.json by validating every build-visible enclosure.
// HEAD supplies size; a one-byte Range GET proves the object is actual media.
// The written key set is exactly the current source set, so stale entries are pruned.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import matter from 'gray-matter';
import { acceptsEnclosureMedia } from './enclosure-validation.mjs';

const CDN_BASE = 'https://cdn.failurefirst.org';
const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const cachePath = resolve(site, 'src/data/enclosure-sizes.json');

function normalize(value) {
  const normalized = String(value).trim();
  if (/^http:\/\//i.test(normalized)) {
    throw new Error(`insecure enclosure URL: ${normalized}`);
  }
  if (/^https:\/\//i.test(normalized)) {
    return new URL(normalized).toString();
  }
  const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return new URL(path, `${CDN_BASE}/`).toString();
}

const files = await glob('src/content/{blog,daily-paper,reports}/**/*.{md,mdx}', {
  cwd: site,
  absolute: true,
});
const urls = new Set();
for (const file of files) {
  const { data } = matter(readFileSync(file, 'utf8'));
  if (data.draft) continue;
  if (data.audio) urls.add(normalize(data.audio));
  if (data.video) urls.add(normalize(data.video));
}

const revalidate = process.argv.includes('--revalidate') || process.env.REVALIDATE === '1';
const previous = revalidate ? {} : JSON.parse(readFileSync(cachePath, 'utf8'));
const cache = Object.fromEntries(
  [...urls]
    .filter((url) => typeof previous[url] === 'number' && previous[url] > 0)
    .map((url) => [url, previous[url]]),
);
const todo = [...urls].filter((url) => typeof cache[url] !== 'number' || cache[url] <= 0);
console.log(
  `${urls.size} enclosure URLs; ${todo.length} to fetch${revalidate ? ' (revalidate: all)' : ''}.`,
);

const CONCURRENCY = 8;
const failures = [];

async function fetchWithRetry(url, init) {
  let response;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetch(url, init);
      if (response.status !== 429 && response.status < 500) return response;
      await response.body?.cancel();
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
  return response;
}

async function probe(url) {
  const expectedClass = /\.m4a(\?|$)/i.test(url)
    ? 'audio'
    : /\.mp4(\?|$)/i.test(url)
      ? 'video'
      : null;
  try {
    const head = await fetchWithRetry(url, { method: 'HEAD', redirect: 'follow' });
    const headLength = Number(head.headers.get('content-length'));
    if (!head.ok || !headLength || headLength <= 0) {
      failures.push(`HEAD ${head.status} len=${headLength} ${url}`);
      return;
    }

    const range = await fetchWithRetry(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-11' },
      redirect: 'follow',
    });
    const contentRange = range.headers.get('content-range') ?? '';
    const contentType = range.headers.get('content-type') ?? '';
    const prefix = Buffer.from(await range.arrayBuffer());
    const match = /^bytes 0-11\/(\d+)$/i.exec(contentRange);
    if (range.status !== 206 || !match) {
      failures.push(`RANGE ${range.status} range=${contentRange} ${url}`);
      return;
    }

    const rangeTotal = Number(match[1]);
    if (rangeTotal !== headLength) {
      failures.push(`SIZE-DISAGREE head=${headLength} range=${rangeTotal} ${url}`);
      return;
    }
    if (!expectedClass || !acceptsEnclosureMedia({ url, contentType, prefix })) {
      const brand = prefix.length >= 12 ? prefix.toString('ascii', 8, 12) : '';
      failures.push(
        `MEDIA expected=${expectedClass} got=${contentType} ftypBrand=${JSON.stringify(brand)} ${url}`,
      );
      return;
    }
    cache[url] = rangeTotal;
  } catch (error) {
    failures.push(`ERR ${error.message} ${url}`);
  }
}

for (let index = 0; index < todo.length; index += CONCURRENCY) {
  await Promise.all(todo.slice(index, index + CONCURRENCY).map(probe));
}

writeFileSync(cachePath, `${JSON.stringify(cache, Object.keys(cache).sort(), 2)}\n`);
if (failures.length) {
  console.error(
    `\n${failures.length} enclosure(s) unresolved; repair or exclude the source, do not ship:`,
  );
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`Wrote ${Object.keys(cache).length} sizes to ${cachePath}`);
