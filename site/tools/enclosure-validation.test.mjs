import { describe, expect, it } from 'vitest';
import { acceptsEnclosureMedia } from './enclosure-validation.mjs';

function ftyp(brand) {
  const bytes = Buffer.alloc(12);
  bytes.writeUInt32BE(24, 0);
  bytes.write('ftyp', 4, 'ascii');
  bytes.write(brand, 8, 'ascii');
  return bytes;
}

describe('acceptsEnclosureMedia', () => {
  it('accepts normal audio MIME without signature fallback', () => {
    expect(
      acceptsEnclosureMedia({
        url: 'https://cdn.failurefirst.org/audio/x.m4a',
        contentType: 'audio/mp4',
        prefix: Buffer.alloc(0),
      }),
    ).toBe(true);
  });

  it('accepts a mislabelled M4A only when its ftyp brand is allowed', () => {
    for (const brand of ['M4A ', 'mp42', 'isom', 'dash']) {
      expect(
        acceptsEnclosureMedia({
          url: 'https://cdn.failurefirst.org/audio/x.m4a',
          contentType: 'video/mp4',
          prefix: ftyp(brand),
        }),
      ).toBe(true);
    }
  });

  it('rejects HTML or an unrecognised body behind a mislabelled M4A URL', () => {
    expect(
      acceptsEnclosureMedia({
        url: 'https://cdn.failurefirst.org/audio/x.m4a',
        contentType: 'video/mp4',
        prefix: Buffer.from('<!doctype ht'),
      }),
    ).toBe(false);
    expect(
      acceptsEnclosureMedia({
        url: 'https://cdn.failurefirst.org/audio/x.m4a',
        contentType: 'video/mp4',
        prefix: ftyp('avc1'),
      }),
    ).toBe(false);
  });

  it('does not apply the M4A fallback to an MP4 video URL', () => {
    expect(
      acceptsEnclosureMedia({
        url: 'https://cdn.failurefirst.org/video/x.mp4',
        contentType: 'video/mp4',
        prefix: ftyp('dash'),
      }),
    ).toBe(true);
    expect(
      acceptsEnclosureMedia({
        url: 'https://cdn.failurefirst.org/video/x.mp4',
        contentType: 'audio/mp4',
        prefix: ftyp('dash'),
      }),
    ).toBe(false);
  });
});
