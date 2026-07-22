#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  processEntities: false,
});

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function readItems(path) {
  const xml = readFileSync(resolve(root, path), 'utf8');
  const valid = XMLValidator.validate(xml);
  if (valid !== true) throw new Error(`${path}: not well-formed XML — ${JSON.stringify(valid)}`);
  const channel = parser.parse(xml).rss?.channel;
  if (!channel) throw new Error(`${path}: valid RSS channel not found`);
  const value = channel.item ?? [];
  return { channel, items: Array.isArray(value) ? value : [value] };
}

function sameSet(actual, expected, label) {
  const a = [...actual].sort();
  const e = [...expected].sort();
  if (JSON.stringify(a) !== JSON.stringify(e)) {
    throw new Error(`${label}: set mismatch\nactual=${JSON.stringify(a)}\nexpected=${JSON.stringify(e)}`);
  }
}

const apple = readItems('dist/audio/feed.xml');
const spotify = readItems('dist/audio/podcast.xml');
const sizes = readJson('src/data/enclosure-sizes.json');
const durations = readJson('src/data/audio-durations.json');
const appleAudio = apple.items.filter((i) => i.enclosure?.['@_type'] === 'audio/mp4');
const appleVideo = apple.items.filter((i) => i.enclosure?.['@_type'] === 'video/mp4');
const spotifyAudio = spotify.items.filter((i) => i.enclosure?.['@_type'] === 'audio/mp4');
const urls = (xs) => new Set(xs.map((i) => i.enclosure['@_url']));
const allAppleUrls = urls([...appleAudio, ...appleVideo]);

if (spotify.items.length !== spotifyAudio.length) throw new Error('Spotify feed contains non-audio items');
if (apple.items.length !== urls(appleAudio).size + urls(appleVideo).size) throw new Error('Apple count != uniqAudio + uniqVideo');
if (spotify.items.length !== urls(appleAudio).size) throw new Error('Spotify count != uniqAudio');
sameSet(urls(spotifyAudio), urls(appleAudio), 'Spotify/Apple audio parity');
sameSet(new Set(Object.keys(sizes)), allAppleUrls, 'size cache vs getCollection-derived feed');

for (const item of [...apple.items, ...spotify.items]) {
  const enclosure = item.enclosure;
  const url = String(enclosure['@_url']);
  if (!url.startsWith('https://')) throw new Error(`non-HTTPS enclosure: ${url}`);
  const emitted = Number(enclosure['@_length']);
  if (emitted <= 0) throw new Error(`non-positive enclosure length: ${url}`);
  // Non-tautological: the emitted length must equal the independently-built size
  // cache (Task 3, HEAD+Range validated), not merely be positive. Catches a
  // wrong-but-positive length and duplicate URLs across MIME classes.
  if (sizes[url] !== emitted) throw new Error(`length ${emitted} != size-cache ${sizes[url]} for ${url}`);
}
for (const key of Object.keys(durations)) {
  if (!allAppleUrls.has(key)) throw new Error(`stale duration-cache key: ${key}`);
}
const guids = apple.items.map((i) => typeof i.guid === 'object' ? i.guid['#text'] : i.guid);
if (new Set(guids).size !== guids.length) throw new Error('Apple item GUIDs are not unique');
if (apple.channel['podcast:guid'] !== spotify.channel['podcast:guid']) throw new Error('feed podcast:guid mismatch');
if (apple.channel['podcast:guid'] !== 'c65fd2f5-dbbf-5dc4-8b77-25622663587f') throw new Error('pinned podcast:guid changed');

console.log(JSON.stringify({
  appleItems: apple.items.length,
  spotifyItems: spotify.items.length,
  uniqAudio: urls(appleAudio).size,
  uniqVideo: urls(appleVideo).size,
  sizeCacheKeys: Object.keys(sizes).length,
  durationCacheKeys: Object.keys(durations).length,
}, null, 2));
