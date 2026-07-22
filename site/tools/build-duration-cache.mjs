#!/usr/bin/env node
// Build src/data/audio-durations.json by ffprobe-ing every build-visible
// audio and video enclosure. Missing durations are non-fatal and omitted.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import matter from 'gray-matter';

const CDN_BASE = 'https://cdn.failurefirst.org';
const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const cachePath = resolve(site, 'src/data/audio-durations.json');

function normalize(value) {
  const normalized = String(value).trim();
  if (/^http:\/\//i.test(normalized)) {
    throw new Error(`insecure enclosure URL: ${normalized}`);
  }
  if (/^https:\/\//i.test(normalized)) return new URL(normalized).toString();
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

const previous = JSON.parse(readFileSync(cachePath, 'utf8'));
const cache = Object.fromEntries(
  [...urls]
    .filter((url) => typeof previous[url] === 'number' && previous[url] > 0)
    .map((url) => [url, previous[url]]),
);
const todo = [...urls].filter((url) => typeof cache[url] !== 'number' || cache[url] <= 0);
console.log(`${urls.size} URLs; ${todo.length} to probe.`);

if (spawnSync('ffprobe', ['-version'], { stdio: 'ignore' }).status !== 0) {
  writeFileSync(cachePath, `${JSON.stringify(cache, Object.keys(cache).sort(), 2)}\n`);
  console.warn('ffprobe unavailable; pruned stale keys but added no durations.');
  process.exit(0);
}

let probed = 0;
for (const url of todo) {
  try {
    const output = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        url,
      ],
      { encoding: 'utf8', timeout: 60000 },
    );
    const seconds = Math.round(Number.parseFloat(output.trim()));
    if (seconds > 0) {
      cache[url] = seconds;
      probed += 1;
    }
  } catch {
    console.warn(`omit (probe failed): ${url}`);
  }
}

writeFileSync(cachePath, `${JSON.stringify(cache, Object.keys(cache).sort(), 2)}\n`);
console.log(`Probed ${probed}/${todo.length}; ${Object.keys(cache).length} total durations.`);
