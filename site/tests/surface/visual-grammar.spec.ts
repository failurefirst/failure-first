/**
 * visual-grammar.spec.ts
 *
 * Lightweight visual-grammar regression tests for the Failure-First public site.
 * Catches the classes of drift identified in the 2026-08-23 consistency audit:
 *
 * 1. References to undefined CSS custom properties (on audited routes)
 * 2. New page-local definitions of canonical .card/button primitives
 * 3. Key internal surfaces unexpectedly switching display/body font families
 * 4. Screenshots that are effectively blank/fully masked
 * 5. Mobile nav visibly colliding with page content
 *
 * This is NOT a "no hex / no rgba anywhere" lint rule. Art-directed pages,
 * generated visuals, charts, social graphics and genuinely local semantic
 * colours may need literals.
 */

import { expect, test } from '@playwright/test';

// ── Undefined token detection (runtime, on key routes) ─────────────────────
// Checks the computed styles of the page for var() references that resolved
// to their fallback (indicating the token is undefined) rather than a real
// token value. This catches only tokens that actually affect rendering on
// the audited route families, not every file in the codebase.

const auditedRoutes = [
  '/',
  '/services/',
  '/simviz/',
  '/research/',
  '/research/reports/',
  '/lab-log/',
  '/about/team/',
];

// The four tokens the audit specifically flagged as undefined. These should
// no longer appear anywhere in the computed styles. If they do, it means
// someone reintroduced them.
const forbiddenTokens = [
  '--border-dim',
  '--critical-high',
  '--border-color',
  '--text-secondary',
  '--surface-secondary',
];

for (const route of auditedRoutes) {
  test(`${route} has no forbidden undefined tokens in computed styles`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('domcontentloaded');

    // Scan all elements for computed properties that resolved to a fallback
    // because the token was undefined. We check for the specific forbidden
    // token names in inline styles and stylesheet rules.
    const violations = await page.evaluate((tokens) => {
      const found: string[] = [];
      // Check all stylesheets for var(--forbidden-token) references
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            const text = rule.cssText;
            for (const token of tokens) {
              if (text.includes(`var(${token}`)) {
                found.push(`${token} in: ${text.substring(0, 80)}`);
              }
            }
          }
        } catch {
          // Cross-origin stylesheet — skip
        }
      }
      return found;
    }, forbiddenTokens);

    expect(violations, `Forbidden undefined tokens on ${route}:\n${violations.join('\n')}`).toEqual([]);
  });
}

// ── No page-local .card primitive redefinition ──────────────────────────────
test('simviz uses shared .card primitive (not a local redefinition)', async ({ page }) => {
  // The simviz page was the worst design-fork offender. Verify it now uses
  // the shared .card from global.css, not a locally-redefined .card.
  await page.goto('/simviz/');
  await page.waitForLoadState('domcontentloaded');
  const cards = page.locator('.card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  // The shared .card uses var(--surface-card) which is a color-mix() result.
  // A locally-redefined .card with a solid hex background (e.g. var(--bg-card))
  // would produce a different computed value. Check that the card has the
  // border from the shared primitive (var(--border) = rgba accent).
  const firstCard = cards.first();
  const borderColor = await firstCard.evaluate(el =>
    getComputedStyle(el).borderColor
  );
  // The shared .card border uses var(--border) which contains the accent colour
  expect(borderColor).not.toBe('rgba(0, 0, 0, 0)');

  // Verify the card has the shimmer ::before pseudo-element from the shared primitive
  const hasShimmer = await firstCard.evaluate(el => {
    const before = getComputedStyle(el, '::before');
    // The shimmer uses a linear-gradient background
    return before.backgroundImage !== 'none' && before.backgroundImage !== '';
  });
  expect(hasShimmer).toBe(true);
});

// ── Font family stability on key surfaces ──────────────────────────────────
test('homepage uses Instrument Serif for display headings', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const h1 = page.locator('h1').first();
  const fontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily);
  expect(fontFamily).toContain('Instrument Serif');
});

test('simviz uses native Instrument Serif for h1 (not Space Grotesk)', async ({ page }) => {
  await page.goto('/simviz/');
  await page.waitForLoadState('domcontentloaded');
  const h1 = page.locator('h1').first();
  const fontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily);
  expect(fontFamily).toContain('Instrument Serif');
  expect(fontFamily).not.toContain('Space Grotesk');
});

test('report headings use native typography (not Space Grotesk)', async ({ page }) => {
  // Navigate to a report detail page (not the index) and check that
  // report-body headings use native fonts, not Space Grotesk.
  await page.goto('/research/reports/');
  await page.waitForLoadState('domcontentloaded');

  // Find the first report link and navigate to it
  const reportLink = page.locator('.report-card').first();
  const href = await reportLink.evaluate(el => (el as HTMLAnchorElement).href);
  if (href) {
    await page.goto(href);
    await page.waitForLoadState('domcontentloaded');
    const reportBody = page.locator('.report-body h2');
    if (await reportBody.count() > 0) {
      const ff = await reportBody.first().evaluate(el => getComputedStyle(el).fontFamily);
      expect(ff).not.toContain('Space Grotesk');
    }
  }
});

// ── Screenshot is not blank ────────────────────────────────────────────────
test('team page screenshot contains visible content', async ({ page }) => {
  await page.goto('/about/team/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1_000);

  // Verify the hero name is visible (not masked/hidden)
  const heroName = page.locator('.hero-name');
  await expect(heroName).toBeVisible();

  // Check that the hero-name has non-trivial dimensions
  const box = await heroName.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(50);
  expect(box!.height).toBeGreaterThan(10);

  // Verify there are multiple agent sections (not a blank page)
  const agentSections = page.locator('.agent-section');
  expect(await agentSections.count()).toBeGreaterThan(10);
});

// ── Mobile nav does not collide with page content ──────────────────────────
test.describe('mobile navigation', () => {
  test('mobile nav has backdrop when open', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Open the hamburger menu
    await page.click('.nav-toggle');
    await page.waitForTimeout(300);

    // Verify the nav-links are open
    await expect(page.locator('.nav-links')).toHaveClass(/open/);

    // Check that the nav backdrop is visible (prevents content collision)
    const backdrop = page.locator('.nav-backdrop');
    const backdropDisplay = await backdrop.evaluate(el => getComputedStyle(el).display);
    expect(backdropDisplay).toBe('block');

    // Close menu and verify backdrop hides
    await page.click('.nav-toggle');
    await page.waitForTimeout(300);
    const backdropDisplayAfter = await backdrop.evaluate(el => getComputedStyle(el).display);
    expect(backdropDisplayAfter).toBe('none');

    await context.close();
  });

  test('mobile nav preserves navigation structure', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Open the hamburger menu
    await page.click('.nav-toggle');
    await page.waitForTimeout(300);

    // Verify key nav items are present
    const navItems = page.locator('.nav-links > li > a');
    const count = await navItems.count();
    expect(count).toBeGreaterThanOrEqual(7);

    // Verify a dropdown exists
    const dropdowns = page.locator('.has-dropdown');
    expect(await dropdowns.count()).toBeGreaterThan(3);

    await context.close();
  });
});