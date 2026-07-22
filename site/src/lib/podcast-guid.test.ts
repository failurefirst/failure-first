import { describe, expect, it } from 'vitest';
import { computePodcastGuid, PODCAST_GUID } from './podcast-guid';

const PC20_NAMESPACE = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';

describe('computePodcastGuid', () => {
  it('reproduces the pinned Podcasting 2.0 GUID for the feed seed', () => {
    expect(computePodcastGuid(PC20_NAMESPACE, 'failurefirst.org/audio/feed.xml')).toBe(
      'c65fd2f5-dbbf-5dc4-8b77-25622663587f',
    );
  });

  it('keeps the committed lifetime identity equal to the reproduced value', () => {
    expect(PODCAST_GUID).toBe('c65fd2f5-dbbf-5dc4-8b77-25622663587f');
    expect(computePodcastGuid(PC20_NAMESPACE, 'failurefirst.org/audio/feed.xml')).toBe(
      PODCAST_GUID,
    );
  });

  it('sets the version nibble to 5', () => {
    const guid = computePodcastGuid(PC20_NAMESPACE, 'failurefirst.org/audio/feed.xml');
    expect(guid[14]).toBe('5');
  });
});
