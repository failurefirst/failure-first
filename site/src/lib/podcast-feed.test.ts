import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { describe, expect, it } from 'vitest';
import { buildPodcastFeed, escapeCdata, escapeXml } from './podcast-feed';
import type { Episode } from './podcast-items';

const episode: Episode = {
  title: 'Test',
  summary: 'sum',
  contentHtml: '<p>x</p>',
  date: new Date('2026-01-01'),
  audioUrl: 'https://cdn.failurefirst.org/audio/x.m4a',
  videoUrl: '/video/daily-paper/x.mp4',
  pageUrl: 'https://failurefirst.org/daily-paper/x/',
  guid: 'https://failurefirst.org/daily-paper/2026-01-01-x/',
  category: 'Daily Paper',
};
const sizes = {
  'https://cdn.failurefirst.org/audio/x.m4a': 111,
  'https://cdn.failurefirst.org/video/daily-paper/x.mp4': 222,
};
const durations = { 'https://cdn.failurefirst.org/audio/x.m4a': 3661 };
const opts = { site: 'https://failurefirst.org', sizes, durations, copyrightYear: 2026 };
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  processEntities: false,
});

function channel(xml: string) {
  return parser.parse(xml).rss.channel;
}

function items(xml: string): any[] {
  const value = channel(xml).item ?? [];
  return Array.isArray(value) ? value : [value];
}

describe('buildPodcastFeed', () => {
  it('produces Apple XML with audio/video enclosures and real byte lengths', () => {
    const xml = buildPodcastFeed([episode], {
      ...opts,
      audioOnly: false,
      selfPath: '/audio/feed.xml',
    });
    const feedItems = items(xml);
    expect(feedItems.map((item) => item.enclosure['@_type']).sort()).toEqual([
      'audio/mp4',
      'video/mp4',
    ]);
    expect(feedItems.map((item) => item.enclosure['@_length']).sort()).toEqual(['111', '222']);
    expect(feedItems.some((item) => item.enclosure['@_length'] === '0')).toBe(false);
    expect(
      feedItems.find((item) => item.enclosure['@_type'] === 'audio/mp4')['itunes:duration'],
    ).toBe('01:01:01');
  });

  it('produces audio-only Spotify XML with the pinned identity', () => {
    const xml = buildPodcastFeed([episode], {
      ...opts,
      audioOnly: true,
      selfPath: '/audio/podcast.xml',
    });
    const feedChannel = channel(xml);
    expect(items(xml).map((item) => item.enclosure['@_type'])).toEqual(['audio/mp4']);
    expect(feedChannel['podcast:guid']).toBe('c65fd2f5-dbbf-5dc4-8b77-25622663587f');
    expect(feedChannel['atom:link']['@_href']).toBe(
      'https://failurefirst.org/audio/podcast.xml',
    );
    expect(feedChannel['itunes:image']['@_href']).toBe(
      'https://failurefirst.org/podcast-cover.jpg',
    );
  });

  it('uses a non-permalink #video GUID for the video item', () => {
    const xml = buildPodcastFeed([episode], {
      ...opts,
      audioOnly: false,
      selfPath: '/audio/feed.xml',
    });
    const video = items(xml).find((item) => item.enclosure['@_type'] === 'video/mp4');
    expect(video.guid['#text']).toBe(
      'https://failurefirst.org/daily-paper/2026-01-01-x/#video',
    );
    expect(video.guid['@_isPermaLink']).toBe('false');
  });

  it('emits unique GUIDs for every item', () => {
    const xml = buildPodcastFeed([episode], {
      ...opts,
      audioOnly: false,
      selfPath: '/audio/feed.xml',
    });
    const guids = items(xml).map((item) => item.guid['#text']);
    expect(new Set(guids).size).toBe(guids.length);
  });

  it('escapes both XML quote characters', () => {
    expect(escapeXml(`'"`)).toBe('&apos;&quot;');
  });

  it('emits well-formed XML according to XMLValidator', () => {
    const xml = buildPodcastFeed([episode], {
      ...opts,
      audioOnly: false,
      selfPath: '/audio/feed.xml',
    });
    expect(XMLValidator.validate(xml)).toBe(true);
  });

  it('prevents a CDATA terminator in body content from corrupting the feed', () => {
    const hostile: Episode = { ...episode, contentHtml: '<p>danger ]]> after</p>' };
    const xml = buildPodcastFeed([hostile], {
      ...opts,
      audioOnly: false,
      selfPath: '/audio/feed.xml',
    });
    expect(XMLValidator.validate(xml)).toBe(true);
    expect(escapeCdata('a]]>b')).toBe('a]]]]><![CDATA[>b');
  });
});
