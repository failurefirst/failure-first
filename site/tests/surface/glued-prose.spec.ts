/**
 * glued-prose.spec.ts
 *
 * Guards a real, live, published defect class: visible prose with a MISSING
 * SPACE at an inline-element boundary.
 *
 * What the browser actually does with
 *
 *     ... You can opt out using the
 *     <a href="...">Google Analytics Opt-out Browser Add-on</a>.
 *
 * is render `...using the` immediately followed by the link text, i.e.
 * `theGoogle Analytics Opt-out Browser Add-on`. A browser collapses a run of
 * whitespace into one space; it NEVER invents a space between a text node and an
 * adjacent inline element. Astro's HTML compressor additionally drops a
 * whitespace run that crosses a source newline next to a tag, so the defect is
 * invisible in source review and only exists in the built, published artifact.
 *
 * Observed live before the fix (production, 2026-09-18):
 *   /simviz/            `pose isDERIVED_VIEW`, `Rendering isDERIVED_VISUALISATION`,
 *                       `THE CONDUCTOR— one sung instruction`
 *   /about/             `lives atForward Threat Lab`
 *   /about/privacy/     `using theGoogle Analytics Opt-out Browser Add-on`,
 *                       `opt out in yourLinkedIn ad preferences`
 *   /404.html           `let us knowso we can fix the broken reference`
 *   /research-directory/ `the companiesbuilding physical AI systems`
 *
 * WHY A DOM RULE AND NOT A REGEX OVER HTML. The first attempt at this test
 * regex-scanned the built HTML and reported 1430 "instances" across 81 files.
 * Almost all of them were false positives: a `<span class="field-k">Use cases
 * </span>` styled `display: block` sits adjacent to its value in the MARKUP but
 * on its OWN LINE on screen, so no missing space is visible to any reader. A
 * gate that fails for reasons unrelated to its question trains people to ignore
 * it (see AGENTS.md on gates that redden on healthy input). So this test asks the
 * only question that matters: are two pieces of visible text, sitting next to
 * each other on the same rendered line, separated by no whitespace at all?
 *
 * ADJACENT PUNCTUATION IS NOT A DEFECT. `<a>tell us</a>. We would rather know.`
 * and `<a>mail@x.com</a>, ` are correct typography — the boundary carries no
 * word character. The rule therefore requires a word character on BOTH sides.
 *
 * MATH IS EXCLUDED, AND THAT EXCLUSION IS LOAD-BEARING. KaTeX splits every glyph
 * into its own element (`mi`, `mn`, `mo`, `mtext` …), so a rule that asks "are
 * these two text nodes geometrically touching with no whitespace between them?"
 * fires on *every formula on the site*: a site-wide run without this exclusion
 * reported 4123 instances on the built site, of which 4031 (98%) were math
 * glyphs. Excluding `.katex` / `math` subtrees leaves the real prose count.
 * Verified on the pre-fix build: math excluded -> 48 instances / 46 pages;
 * math not excluded -> 4171 instances / 169 pages.
 *
 * KNOWN LIMITS OF THIS RULE (raise before claiming site-wide coverage):
 *   * Viewport-dependent. It only sees glue that appears at the viewport running it,
 *     so a defect that shows at one width and not another is caught on one project
 *     (`desktop` / `mobile`) and missed on the other.
 *   * LTR only. In RTL or vertical writing, DOM-adjacent nodes are not
 *     left-right adjacent, so the geometric test never fires.
 *   * Latin-only word class. Glue in Greek, Cyrillic, Arabic, Hebrew or CJK does
 *     not satisfy the word-character requirement and is silently skipped.
 *   * Cannot distinguish "padded" from "fixed". A boundary saved by an element's own
 *     padding (`<code>` here has 6.8px) is not reported: correct for a
 *     VISIBLE-defect gate, but it means a source-level glue can survive unremarked
 *     behind padding.
 *   * Covers the 8 routes in ROUTES, not the whole site. It is a route-level guard,
 *     not a site-wide proof.
 */

import { expect, test, type Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/simviz/',
  '/about/',
  '/about/privacy/',
  '/results/',
  '/research/robotics-incidents/',
  '/research-directory/',
  '/404.html',
];

type Glue = { left: string; right: string };

/**
 * Find pairs of adjacent text nodes that are visually glued: no whitespace at
 * the boundary, on the same line, horizontally touching, and both sides ending
 * or starting with a word character. Math subtrees are skipped — see the file
 * header for why that exclusion is not optional.
 */
async function findGluedProse(page: Page): Promise<Glue[]> {
  return page.evaluate((): { left: string; right: string }[] => {
    const out: { left: string; right: string }[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);

    const WORD = /[A-Za-z0-9\u00C0-\u024F]/; // include Latin-1/Extended letters

    /** KaTeX emits one element per glyph; every formula would otherwise trip this. */
    const isMath = (n: Text) => !!n.parentElement?.closest('.katex, math, .math');

    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i];
      const b = nodes[i + 1];
      const ta = a.textContent ?? '';
      const tb = b.textContent ?? '';
      if (!ta || !tb) continue;
      if (isMath(a) || isMath(b)) continue;
      // A whitespace character on either side separates them: fine.
      if (/\s$/.test(ta) || /^\s/.test(tb)) continue;
      // Both sides must carry a word character (kills `</a>.` and `</a>, `).
      if (!WORD.test(ta.slice(-1)) || !WORD.test(tb.slice(0, 1))) continue;

      const ra = document.createRange();
      ra.selectNodeContents(a);
      const rb = document.createRange();
      rb.selectNodeContents(b);
      const ba = ra.getBoundingClientRect();
      const bb = rb.getBoundingClientRect();
      if (!ba.width || !bb.width) continue;

      const sameLine = Math.abs(ba.top - bb.top) < 2;
      const touching = Math.abs(ba.right - bb.left) < 1.5;
      if (sameLine && touching) {
        out.push({ left: ta.slice(-40), right: tb.slice(0, 40) });
      }
    }
    return out;
  });
}

for (const route of ROUTES) {
  test(`no glued prose on ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    if (response && response.status() >= 400 && route !== '/404.html') {
      test.skip(true, `${route} returned ${response.status()}`);
    }
    // Let dehydrated/hydrated surfaces settle before measuring layout.
    await page.waitForTimeout(750);

    const glued = await findGluedProse(page);
    const rendered = glued.map(g => `${JSON.stringify(g.left)} + ${JSON.stringify(g.right)}`);

    expect(
      rendered,
      `Missing space between inline text on ${route} — a browser never inserts one, ` +
        `so this renders as one run-together word on the live page.`,
    ).toEqual([]);
  });
}

test('detector is real: a synthetic glue is caught', async ({ page }) => {
  // Positive control. A gate that cannot fail proves nothing; this pins that the
  // rule actually fires on the exact shape the routes above are guarding.
  await page.setContent(
    `<p>the companies<strong>building</strong> physical AI systems</p>` +
      `<p>opt out using the<a href="#">Add-on</a>.</p>`,
  );
  const glued = await findGluedProse(page);
  expect(glued.length, 'detector must catch the known-bad shape').toBeGreaterThan(0);
  expect(glued.map(g => g.left + '|' + g.right).join(' ')).toContain('companies|building');
});

test('detector is not a blanket: correct spacing passes', async ({ page }) => {
  // Negative control — the same prose, correctly spaced, must not be flagged.
  await page.setContent(
    `<p>the companies <strong>building</strong> physical AI systems</p>` +
      `<p>opt out using the <a href="#">Add-on</a>.</p>` +
      `<p><a href="#">tell us</a>. We would rather know.</p>` +
      `<p><a href="#">mail@example.com</a>, and more.</p>`,
  );
  expect(await findGluedProse(page)).toEqual([]);
});

test('math is excluded: KaTeX glyph splitting is not prose glue', async ({ page }) => {
  // Regression control for the false-positive class that produced a 4123-instance
  // "finding" on the built site before the exclusion. KaTeX gives every glyph its own
  // element, so these nodes are geometrically touching with no whitespace between
  // them — exactly the shape the rule above hunts for. They must NOT be reported.
  await page.setContent(
    `<p>Let <span class="katex"><span class="katex-mathml">` +
      `<math><mi>p</mi><mi>t</mi></math></span></span> be the value.</p>` +
      `<p class="katex"><span class="mi">x</span><span class="mn">2</span></p>`,
  );
  const glued = await findGluedProse(page);
  expect(
    glued,
    'math glyphs are not glued prose — if this fails, every formula on the site will ' +
      'be reported as a prose defect and the gate becomes noise',
  ).toEqual([]);
});

