import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const enforcedCsp = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8')
  .split('\n').find(line => line.includes('Content-Security-Policy:'))!
  .split('Content-Security-Policy:')[1].trim();

const paths = ['/', '/services/', '/simviz/', '/lab-log/', '/about/team/', '/about/people/amy-pond/'];
const atmosphere: Record<string, string> = {
  '/': 'cascade',
  '/services/': 'pulse',
  '/simviz/': 'signal',
  '/lab-log/': 'signal',
};

type Violation = { disposition: string; blockedURI: string; directive: string };

async function installEvidenceCollectors(page: Page) {
  await page.addInitScript(() => {
    (window as Window & { __cspViolations?: Violation[] }).__cspViolations = [];
    document.addEventListener('securitypolicyviolation', (event) => {
      (window as Window & { __cspViolations?: Violation[] }).__cspViolations!.push({
        disposition: event.disposition,
        blockedURI: event.blockedURI,
        directive: event.effectiveDirective,
      });
    });
  });
}

async function canvasPixelEvidence(canvas: Locator) {
  return canvas.evaluate(node => {
    const c = node as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    if (!ctx || !c.width || !c.height) return { painted: 0, cyan: 0, coral: 0 };
    const pixels = ctx.getImageData(0, 0, c.width, c.height).data;
    let painted = 0, cyan = 0, coral = 0;
    const stride = Math.max(4, Math.floor(pixels.length / 4096 / 4) * 4);
    for (let i = 0; i < pixels.length; i += stride) {
      if (pixels[i + 3] !== 0) painted++;
      if (pixels[i + 1] + pixels[i + 2] > 80 && pixels[i + 2] > pixels[i] * 1.25 && pixels[i + 1] > pixels[i] * 1.25) cyan++;
      if (pixels[i] > 60 && pixels[i] > pixels[i + 1] * 1.25 && pixels[i] > pixels[i + 2] * 1.25) coral++;
    }
    return { painted, cyan, coral };
  });
}

test.describe('public surface', () => {
  for (const path of paths) {
    test(`${path} preserves runtime contracts`, async ({ page }, testInfo) => {
      const badSiteResponses: string[] = [];
      const failedSiteRequests: string[] = [];
      const base = new URL(testInfo.project.use.baseURL as string);
      if (base.hostname === '127.0.0.1') {
        await page.route(`${base.origin}/**`, async route => {
          if (route.request().resourceType() !== 'document') return route.continue();
          const response = await route.fetch();
          await route.fulfill({
            response,
            headers: { ...response.headers(), 'content-security-policy': enforcedCsp },
          });
        });
      }

      page.on('response', response => {
        const url = new URL(response.url());
        const siteOwned = url.origin === base.origin || url.hostname === 'cdn.failurefirst.org';
        if (siteOwned && response.status() >= 400) badSiteResponses.push(`${response.status()} ${url.href}`);
      });
      page.on('requestfailed', request => {
        const url = new URL(request.url());
        const siteOwned = url.origin === base.origin || url.hostname === 'cdn.failurefirst.org';
        if (siteOwned) failedSiteRequests.push(`${request.failure()?.errorText} ${url.href}`);
      });

      await installEvidenceCollectors(page);
      const documentResponse = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(documentResponse?.headers()['content-security-policy']).toContain("default-src 'self'");
      await page.waitForTimeout(1_000);

      if (path !== '/about/team/') {
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < height; y += 700) {
          await page.evaluate(scrollY => scrollTo(0, scrollY), y);
          await page.waitForTimeout(50);
        }
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(300);
      } else {
        for (const portrait of await page.locator('.agent-photo').all()) {
          await portrait.scrollIntoViewIfNeeded();
          await expect.poll(() => portrait.evaluate(img =>
            (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0
          )).toBe(true);
        }
      }

      const favicon = await page.request.get(new URL('/favicon.svg', base).href);
      expect(favicon.status()).toBe(200);

      const brokenVisibleImages = await page.locator('img').evaluateAll(images =>
        images.filter(image => {
          const style = getComputedStyle(image);
          const rect = image.getBoundingClientRect();
          const visible = style.display !== 'none' && style.visibility !== 'hidden' &&
            Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
          return visible && (!(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0);
        }).map(image => (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src)
      );
      expect(brokenVisibleImages).toEqual([]);

      if (path === '/about/team/') {
        await expect(page.locator('#sensor-grid-bg')).toHaveCount(1);
        await expect(page.locator('#sensor-grid-bg')).toHaveAttribute('data-renderer-owner', 'team-signal-canvas');
        await expect(page.locator('#sensor-grid-bg')).toHaveAttribute('data-animation', 'signal');
        await expect(page.locator('#sensor-grid-bg')).toHaveAttribute('data-renderer-state', 'running');
        await expect.poll(async () => {
          const evidence = await canvasPixelEvidence(page.locator('#sensor-grid-bg'));
          return evidence.cyan + evidence.coral;
        }).toBeGreaterThan(0);
        const portraits = page.locator('.agent-photo');
        expect(await portraits.count()).toBeGreaterThan(10);
        for (const portrait of await portraits.all()) {
          await portrait.scrollIntoViewIfNeeded();
          await expect.poll(() => portrait.evaluate(img =>
            (img as HTMLImageElement).complete &&
            (img as HTMLImageElement).naturalWidth > 0 &&
            getComputedStyle(img).display !== 'none'
          )).toBe(true);
        }
      }

      if (atmosphere[path]) {
        const canvas = page.locator('#sensor-grid-bg');
        await expect(canvas).toHaveAttribute('data-renderer-owner', 'generative-background');
        await expect(canvas).toHaveAttribute('data-animation', atmosphere[path]);
        await expect(canvas).toHaveAttribute('data-renderer-state', 'running');
        await expect.poll(async () => {
          const evidence = await canvasPixelEvidence(canvas);
          return evidence.cyan + evidence.coral;
        }).toBeGreaterThan(0);
        const pixelEvidence = await canvasPixelEvidence(canvas);
        expect(pixelEvidence.painted).toBeGreaterThan(0);
        if (path === '/services/') {
          expect(pixelEvidence.cyan).toBeGreaterThan(0);
          expect(pixelEvidence.coral).toBeGreaterThan(0);
          await expect(canvas).toHaveCSS('opacity', '0.7');
          await expect(canvas).toHaveCSS('z-index', '0');
        }
      }

      const csp = await page.evaluate(() => (window as Window & { __cspViolations?: Violation[] }).__cspViolations || []);
      const enforced = csp.filter(v => v.disposition === 'enforce');
      const reportOnly = csp.filter(v => v.disposition === 'report');
      await testInfo.attach('csp-evidence.json', {
        body: JSON.stringify({
          enforcedHeader: documentResponse?.headers()['content-security-policy'] || null,
          reportOnlyHeader: documentResponse?.headers()['content-security-policy-report-only'] || null,
          enforced,
          reportOnly,
          networkFailures: failedSiteRequests,
        }, null, 2),
        contentType: 'application/json',
      });
      expect(enforced, `enforced CSP violations; report-only findings: ${JSON.stringify(reportOnly)}`).toEqual([]);
      await expect.poll(() => badSiteResponses).toEqual([]);
      expect(failedSiteRequests.filter(failure => !failure.startsWith('net::ERR_ABORTED '))).toEqual([]);

      if (path === '/about/team/') {
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(300);
      }
      await expect(page).toHaveScreenshot(`${path.replaceAll('/', '-') || 'home'}-${testInfo.project.name}.png`, {
        fullPage: path !== '/about/team/',
        animations: 'disabled',
        mask: [page.locator('#sensor-grid-bg')],
        maskColor: '#050810',
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});

test('a page without an atmosphere request stays transparent', async ({ page }) => {
  await page.goto('/research/jailbreak-leaderboard/');
  const canvas = page.locator('#sensor-grid-bg');
  await expect(canvas).toHaveAttribute('data-animation', 'none');
  await expect(canvas).toHaveAttribute('data-renderer-state', 'disabled');
  expect(await canvas.evaluate(node => {
    const c = node as HTMLCanvasElement;
    return c.width === 0 || c.height === 0 ||
      !Array.from(c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data).some(Boolean);
  })).toBe(true);
});

test('reduced motion pauses the global renderer without losing ownership', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/services/');
  const canvas = page.locator('#sensor-grid-bg');
  await expect(canvas).toHaveAttribute('data-renderer-owner', 'generative-background');
  await expect(canvas).toHaveAttribute('data-animation', 'pulse');
  await expect(canvas).toHaveAttribute('data-renderer-state', 'paused-reduced-motion');
  await context.close();
});
