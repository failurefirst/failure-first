/**
 * Cache-only enclosure byte-size lookup. Missing or zero sizes are fatal so a
 * build can never emit Spotify-invalid `length="0"` enclosures.
 */
export function getEnclosureSize(url: string, cache: Record<string, number>): number {
  const size = cache[url];
  if (typeof size !== 'number' || size <= 0) {
    throw new Error(
      `getEnclosureSize: no positive size for ${url} in enclosure-sizes.json; ` +
        're-run tools/build-enclosure-cache.mjs',
    );
  }
  return size;
}
