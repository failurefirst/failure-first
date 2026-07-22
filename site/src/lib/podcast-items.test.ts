import { describe, expect, it } from 'vitest';
import { expandToItems, type Episode } from './podcast-items';

const base = {
  title: 'T',
  summary: 's',
  contentHtml: '<p>x</p>',
  date: new Date('2026-01-01'),
  pageUrl: 'https://failurefirst.org/daily-paper/x/',
  category: 'Daily Paper',
};

const dual: Episode = {
  ...base,
  guid: 'https://failurefirst.org/daily-paper/2026-01-01-x/',
  audioUrl: 'https://cdn.failurefirst.org/audio/x.m4a',
  videoUrl: '/video/daily-paper/x.mp4',
};

describe('expandToItems', () => {
  it('expands a dual episode into distinct audio and video items', () => {
    const items = expandToItems([dual], { audioOnly: false });
    expect(items).toHaveLength(2);
    const audio = items.find((item) => item.mimeType === 'audio/mp4')!;
    const video = items.find((item) => item.mimeType === 'video/mp4')!;
    expect(audio.enclosureUrl).toBe('https://cdn.failurefirst.org/audio/x.m4a');
    expect(video.enclosureUrl).toBe(
      'https://cdn.failurefirst.org/video/daily-paper/x.mp4',
    );
    expect(video.title.startsWith('[Video]')).toBe(true);
    expect(video.guid).toBe(`${dual.guid}#video`);
    expect(video.guidIsPermalink).toBe(false);
    expect(audio.guidIsPermalink).toBe(false);
  });

  it('drops video items from an audio-only feed', () => {
    const items = expandToItems([dual], { audioOnly: true });
    expect(items).toHaveLength(1);
    expect(items[0].mimeType).toBe('audio/mp4');
  });

  it('sorts before dedup so the newest episode wins', () => {
    const older: Episode = {
      ...dual,
      title: 'older',
      date: new Date('2025-01-01'),
      videoUrl: undefined,
    };
    const newer: Episode = {
      ...dual,
      title: 'newer',
      date: new Date('2026-01-01'),
      guid: `${dual.guid}2`,
      videoUrl: undefined,
    };
    const items = expandToItems([older, newer], { audioOnly: true });
    expect(items).toHaveLength(1);
    expect(items[0].title).toContain('newer');
  });

  it('uses the GUID as a deterministic tie-break for equal dates', () => {
    const z: Episode = { ...dual, title: 'z', guid: 'z', videoUrl: undefined };
    const a: Episode = { ...dual, title: 'a', guid: 'a', videoUrl: undefined };
    expect(expandToItems([z, a], { audioOnly: true })[0].guid).toBe('a');
    expect(expandToItems([a, z], { audioOnly: true })[0].guid).toBe('a');
  });

  it('emits a video-only episode only in the mixed feed', () => {
    const videoOnly: Episode = {
      ...base,
      guid: 'g',
      videoUrl: 'https://cdn.failurefirst.org/video/y.mp4',
    };
    expect(expandToItems([videoOnly], { audioOnly: false })).toHaveLength(1);
    expect(expandToItems([videoOnly], { audioOnly: true })).toHaveLength(0);
  });
});
