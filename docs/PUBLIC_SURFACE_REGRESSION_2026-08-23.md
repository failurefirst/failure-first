# Public-Surface Regression Receipt — 2026-08-23

## Header provenance

Production document responses for `/`, `/services/`, `/simviz/`,
`/lab-log/`, and `/about/team/` were captured with `curl -sS -D - -o
/dev/null https://failurefirst.org/<path>`. Each ordinary response carried the
enforced `Content-Security-Policy` matching `site/public/_headers`. None of
those captures carried `Content-Security-Policy-Report-Only`.

The separately observed report-only policy with `connect-src 'none'` is the
Cloudflare Client-side Security (formerly Page Shield) sampled monitoring
header. Cloudflare documents that it injects a report-only CSP into a sample of
responses and that the resulting console messages are reports, not enforced
blocks:
<https://developers.cloudflare.com/client-side-security/reference/csp-header/>.
The runtime gate records `SecurityPolicyViolationEvent.disposition` and the
two response headers separately.

The enforced AdSense failures were reproduced against exact live resources:
`ep2.adtrafficquality.google/sodar/sodar2.js` returned 200 and
`pagead2.googlesyndication.com/pagead/gen_204` returned 204. Applying the real
header in the browser gate additionally exposed the `ep2`/Google frame loads
and confirmed that `gen_204` is sometimes dispatched as an image beacon. The
repo policy now allows only those exact origins in the resource directives the
browser actually used. LinkedIn and Cloudflare `ERR_CONNECTION_REFUSED`
are retained as network evidence unless independently reproduced as response or
enforced-CSP failures.

## Asset migration audit

Commit `405a0f7666bdf35833ac07613e9e372d6ca4404a` deleted 424 paths. Of
103 deleted image paths still referenced by current source:

- 50 exact CDN counterparts return 200 (48 byte-identical to history; two
  encoding-different files are pixel-identical);
- 53 exact CDN counterparts return 404 and were restored byte-for-byte from
  `405a0f^`: 36 inline blog assets and 17 companion portraits;
- `favicon.svg` was restored byte-for-byte from the same parent;
- three never-existent research-audio players were withdrawn with an explicit
  page notice;
- 14 existing source WAVs were restored as site-static companion audio; the two
  personas without source recordings expose no audio control.

## Red-before-green browser receipt

Before deployment, the new desktop smoke gate was run against current
production:

```text
SURFACE_BASE_URL=https://failurefirst.org npm run test:surface -- --project=desktop --grep '/services/|/simviz/|/about/team/'
3 failed
/services/ — /favicon.svg expected 200, received 404
/simviz/ — /favicon.svg expected 200, received 404
/about/team/ — 404 portrait responses including adrian2, the-doctor, and river
```

The repaired local build subsequently passed the desktop/mobile runtime suite.
After deployment of `abafaecd12`, the same suite was rerun against
`https://failurefirst.org`: **16/16 passed**. The production observation covered
decoded portraits, favicon 200, explicit renderer ownership, non-background
cyan/coral pixel evidence, reduced-motion identity, site-owned request health,
enforced/report-only CSP separation, and desktop/mobile visual snapshots.
