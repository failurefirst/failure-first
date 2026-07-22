import { createHash } from 'node:crypto';

function uuidToBytes(uuid: string): Buffer {
  const hex = uuid.replace(/-/g, '');
  if (hex.length !== 32) {
    throw new Error(`bad UUID: ${uuid}`);
  }
  return Buffer.from(hex, 'hex');
}

/** Compute an RFC 4122 name-based UUIDv5 using SHA-1. */
export function computePodcastGuid(namespaceUuid: string, name: string): string {
  const hash = createHash('sha1')
    .update(uuidToBytes(namespaceUuid))
    .update(Buffer.from(name, 'utf8'))
    .digest();
  const bytes = hash.subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Committed lifetime identity. If its reproduction test fails, repair the
 * UUIDv5 helper; the namespace and seed are authoritative.
 */
export const PODCAST_GUID = 'c65fd2f5-dbbf-5dc4-8b77-25622663587f' as const;
