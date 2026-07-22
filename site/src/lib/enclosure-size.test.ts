import { describe, expect, it } from 'vitest';
import { getEnclosureSize } from './enclosure-size';

const cache = { 'https://cdn.failurefirst.org/audio/x.m4a': 12345 };

describe('getEnclosureSize', () => {
  it('returns the cached byte size', () => {
    expect(getEnclosureSize('https://cdn.failurefirst.org/audio/x.m4a', cache)).toBe(12345);
  });

  it('throws when the URL is not cached instead of returning zero', () => {
    expect(() =>
      getEnclosureSize('https://cdn.failurefirst.org/audio/missing.m4a', cache),
    ).toThrow(/enclosure-sizes/i);
  });

  it('throws when a cached size is zero', () => {
    expect(() => getEnclosureSize('https://z', { 'https://z': 0 })).toThrow();
  });
});
