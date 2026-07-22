const M4A_FTYP_BRANDS = new Set(['M4A ', 'mp42', 'isom', 'dash']);

function hasAllowedM4aFtyp(prefix) {
  if (!Buffer.isBuffer(prefix) || prefix.length < 12) return false;
  if (prefix.toString('ascii', 4, 8) !== 'ftyp') return false;
  const boxLength = prefix.readUInt32BE(0);
  if (boxLength < 12) return false;
  return M4A_FTYP_BRANDS.has(prefix.toString('ascii', 8, 12));
}

/**
 * Validate an enclosure's declared media class, with a byte-signature fallback
 * for CDN-mislabelled M4A audio. The fallback is deliberately narrow: only
 * `.m4a` + `video/mp4` + an allowed ISO-BMFF `ftyp` brand passes.
 */
export function acceptsEnclosureMedia({ url, contentType, prefix }) {
  const isM4a = /\.m4a(\?|$)/i.test(url);
  const isMp4 = /\.mp4(\?|$)/i.test(url);
  if (isM4a) {
    if (/^audio\//i.test(contentType)) return true;
    return /^video\/mp4(?:;|$)/i.test(contentType) && hasAllowedM4aFtyp(prefix);
  }
  return isMp4 && /^video\//i.test(contentType);
}
