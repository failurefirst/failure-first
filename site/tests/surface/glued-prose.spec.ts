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
 * or starting with a word character.
 */
async function findGluedProse(page: Page): Promise<Glue[]> {
  return page.evaluate((): { left: string; right: string }[] => {
    const out: { left: string; right: string }[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);

    const WORD = /[A-Za-z0-9\u00C0-\u024F]/; // include Latin-1/Extended letters

    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i];
      const b = nodes[i + 1];
      const ta = a.textContent ?? '';
      const tb = b.textContent ?? '';
      if (!ta || !tb) continue;
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
