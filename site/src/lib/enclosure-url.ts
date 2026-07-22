const CDN_BASE = 'https://cdn.failurefirst.org';

/**
 * Resolve episode audio/video frontmatter to an absolute CDN URL.
 * Media lives on the CDN even when frontmatter uses a site-relative path.
 */
export function normalizeEnclosureUrl(value: string): string {
  if (!value || !value.trim()) {
    throw new Error('normalizeEnclosureUrl: empty enclosure value');
  }

  const normalized = value.trim();
  if (/^http:\/\//i.test(normalized)) {
    throw new Error('normalizeEnclosureUrl: enclosure URL must use https');
  }
  if (/^https:\/\//i.test(normalized)) {
    return new URL(normalized).toString();
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(normalized)) {
    throw new Error(`normalizeEnclosureUrl: unsupported URL scheme in ${normalized}`);
  }

  const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return new URL(path, `${CDN_BASE}/`).toString();
}
