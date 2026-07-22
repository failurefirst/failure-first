import { describe, expect, it } from 'vitest';
import { normalizeEnclosureUrl } from './enclosure-url';

describe('normalizeEnclosureUrl', () => {
  it('passes absolute https URLs through unchanged', () => {
    const u = 'https://cdn.failurefirst.org/audio/daily-paper/x.m4a';
    expect(normalizeEnclosureUrl(u)).toBe(u);
  });

  it('prefixes site-relative paths with the CDN base', () => {
    expect(normalizeEnclosureUrl('/video/daily-paper/2511.18397-video-overview.mp4')).toBe(
      'https://cdn.failurefirst.org/video/daily-paper/2511.18397-video-overview.mp4',
    );
  });

  it('prefixes bare paths with the CDN base and a slash', () => {
    expect(normalizeEnclosureUrl('video/daily-paper/x.mp4')).toBe(
      'https://cdn.failurefirst.org/video/daily-paper/x.mp4',
    );
  });

  it('throws on empty input', () => {
    expect(() => normalizeEnclosureUrl('')).toThrow();
  });

  it('rejects insecure http URLs despite being absolute', () => {
    expect(() => normalizeEnclosureUrl('http://cdn.failurefirst.org/audio/x.m4a')).toThrow(
      /https/i,
    );
  });

  it('URL-encodes filenames containing spaces', () => {
    expect(normalizeEnclosureUrl('/audio/daily-paper/file name.m4a')).toBe(
      'https://cdn.failurefirst.org/audio/daily-paper/file%20name.m4a',
    );
  });
});
