import { describe, expect, it } from 'vitest';
import { formatDuration, getDuration } from './duration';

describe('formatDuration', () => {
  it('formats seconds as HH:MM:SS', () => {
    expect(formatDuration(3661)).toBe('01:01:01');
    expect(formatDuration(59)).toBe('00:00:59');
    expect(formatDuration(0)).toBe('00:00:00');
  });
});

describe('getDuration', () => {
  const cache = { 'https://cdn.failurefirst.org/audio/x.m4a': 3661 };

  it('returns a formatted duration when cached', () => {
    expect(getDuration('https://cdn.failurefirst.org/audio/x.m4a', cache)).toBe('01:01:01');
  });

  it('returns undefined when not cached', () => {
    expect(getDuration('https://cdn.failurefirst.org/audio/missing.m4a', cache)).toBeUndefined();
  });
});
