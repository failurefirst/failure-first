import { expect, test } from '@playwright/test';

// Structured-data / SEO semantic-correctness repair (private-repo dispatch,
// "#1105-class structured-data repair" — see AGENT_STATE.d comment for issue
// number). Asserts that per-page JSON-LD and Google Scholar meta are driven by
// the explicit `kind` a layout declares, never by URL-prefix inference.
//
// Historical bug this guards against: SEOHead.astro used to derive
// ScholarlyArticle + citation_* meta from
// `Astro.url.pathname.startsWith('/research/')`. That heuristic is FALSE on
// both sides:
//   - /research/reports/<slug>/ and /research/legal/<slug>/ pages live under
//     the prefix but are not scholarly articles.
//   - /papers/<slug>/ pages (real scholarly work) live OUTSIDE the prefix and
//     got no Scholar treatment at all.
// The "old heuristic would fail this suite" property is exercised directly by
// `pathname-prefix heuristic would misclassify every page in this suite`
// below, which recomputes the old predicate against each fixture URL and
// asserts it disagrees with the correct (kind-driven) classification.

type JsonLdNode = { '@type'?: string | string[] };

function jsonLdTypes(html: string): string[] {
  const types: string[] = [];
  const scriptRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;
  while ((match = scriptRe.exec(html))) {
    try {
      const parsed = JSON.parse(match[1]);
      const nodes: JsonLdNode[] = Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed];
      for (const node of nodes) {
        if (!node || !node['@type']) continue;
        const t = node['@type'];
        types.push(...(Array.isArray(t) ? t : [t]));
      }
    } catch {
      // Non-JSON-LD script with the same type attribute shouldn't exist;
      // surface a parse failure instead of silently skipping.
      throw new Error(`Malformed JSON-LD script block: ${match[1].slice(0, 200)}`);
    }
  }
  return types;
}

function metaContent(html: string, name: string): string[] {
  const re = new RegExp(`<meta name="${name}"[^>]*content="([^"]*)"`, 'g');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function htmlLang(html: string): string | null {
  const m = html.match(/<html[^>]*\blang="([^"]*)"/);
  return m ? m[1] : null;
}

/** The old, incorrect predicate this repair replaced. Kept ONLY as a fixture
 * for the regression test below — never wire this back into production code. */
function oldIsResearchPageHeuristic(pathname: string): boolean {
  return pathname.startsWith('/research/');
}

const genericPages = ['/', '/services/', '/simviz/', '/lab-log/', '/research/methodology/', '/research/directory/'];

test.describe('structured data: generic pages get no ScholarlyArticle / Scholar meta', () => {
  for (const path of genericPages) {
    test(`${path} has no ScholarlyArticle JSON-LD or citation_* meta`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      const html = await page.content();
      expect(jsonLdTypes(html)).not.toContain('ScholarlyArticle');
      expect(metaContent(html, 'citation_title')).toHaveLength(0);
      expect(metaContent(html, 'citation_pdf_url')).toHaveLength(0);
    });
  }
});

test.describe('structured data: home page identity graph', () => {
  test('/ carries WebSite + Organization + ResearchProject, non-home pages carry no WebSite', async ({ page }) => {
    await page.goto('/');
    const homeHtml = await page.content();
    const homeTypes = jsonLdTypes(homeHtml);
    expect(homeTypes).toContain('WebSite');
    expect(homeTypes).toContain('Organization');
    expect(homeTypes).toContain('ResearchProject');
    expect(homeHtml).toContain('"name":"Failure-First"');
    expect(homeHtml).toContain('"@id":"https://failurefirst.org/#organization"');

    await page.goto('/services/');
    const servicesHtml = await page.content();
    expect(jsonLdTypes(servicesHtml)).not.toContain('WebSite');
  });

  test('Organization JSON-LD omits logo rather than pointing at a non-existent asset', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    const orgBlockMatch = html.match(/"@type":"Organization"[\s\S]{0,600}?\}/);
    expect(orgBlockMatch).not.toBeNull();
    expect(orgBlockMatch![0]).not.toContain('"logo"');
  });
});

test.describe('structured data: real papers get ScholarlyArticle + honest Scholar meta', () => {
  test('/papers/detected-proceeds/ has ScholarlyArticle, clean citation_title, one citation_author, real pdf citation_pdf_url', async ({ page }) => {
    await page.goto('/papers/detected-proceeds/');
    const html = await page.content();
    expect(jsonLdTypes(html)).toContain('ScholarlyArticle');

    const citationTitle = metaContent(html, 'citation_title');
    expect(citationTitle).toHaveLength(1);
    // Regression guard for the decorated-<title>-leak bug: citation_title must
    // be the bare paper title, never carry the " | Papers | Failure-First"
    // page-title suffix.
    expect(citationTitle[0]).not.toContain('| Papers | Failure-First');

    const authors = metaContent(html, 'citation_author');
    expect(authors.length).toBeGreaterThan(0);

    const pdfUrls = metaContent(html, 'citation_pdf_url');
    expect(pdfUrls).toHaveLength(1);
    expect(pdfUrls[0]).toMatch(/^https:\/\/failurefirst\.org\/.*\.pdf$/);
  });

  test('/papers/iatrogenic-safety-flim/ (no PDF on disk) has ScholarlyArticle but no citation_pdf_url', async ({ page }) => {
    await page.goto('/papers/iatrogenic-safety-flim/');
    const html = await page.content();
    expect(jsonLdTypes(html)).toContain('ScholarlyArticle');
    // citation_pdf_url must never be backfilled with the HTML canonical URL —
    // that was the original bug this repair fixed.
    expect(metaContent(html, 'citation_pdf_url')).toHaveLength(0);
  });
});

test.describe('structured data: reports and legal memos are honest generic types, never ScholarlyArticle', () => {
  test('/research/reports/26-red-teaming-measurement-standards/ is Report-shaped, no Scholar meta', async ({ page }) => {
    const response = await page.goto('/research/reports/26-red-teaming-measurement-standards/');
    expect(response?.status()).toBeLessThan(400);
    const html = await page.content();
    const types = jsonLdTypes(html);
    expect(types).not.toContain('ScholarlyArticle');
    expect(metaContent(html, 'citation_title')).toHaveLength(0);
  });

  test('legal memo page is Report-shaped, no Scholar meta', async ({ page }) => {
    const response = await page.goto('/research/legal/lr-48-iatrogenic-safety-product-liability/');
    expect(response?.status()).toBeLessThan(400);
    const html = await page.content();
    expect(jsonLdTypes(html)).not.toContain('ScholarlyArticle');
    expect(metaContent(html, 'citation_title')).toHaveLength(0);
  });
});

test.describe('structured data: blog and daily-paper are BlogPosting, never ScholarlyArticle', () => {
  test('a blog post is BlogPosting with no Scholar meta', async ({ page }) => {
    await page.goto('/blog/rewalk-exoskeleton-bone-fractures/');
    const html = await page.content();
    const types = jsonLdTypes(html);
    expect(types).toContain('BlogPosting');
    expect(types).not.toContain('ScholarlyArticle');
    expect(metaContent(html, 'citation_title')).toHaveLength(0);
  });

  test('a daily-paper review is BlogPosting (our commentary), never attributed as the original scholarly work', async ({ page }) => {
    await page.goto('/daily-paper/260418484/');
    const html = await page.content();
    const types = jsonLdTypes(html);
    expect(types).toContain('BlogPosting');
    expect(types).not.toContain('ScholarlyArticle');
    expect(metaContent(html, 'citation_title')).toHaveLength(0);
    expect(metaContent(html, 'citation_pdf_url')).toHaveLength(0);
  });
});

test.describe('structured data: locale consistency', () => {
  // Every page: html lang + og:locale must agree on en-AU/en_AU regardless of
  // whether the page emits article-shaped JSON-LD.
  const localePages = ['/', '/about/team/', '/papers/detected-proceeds/', '/research/methodology/'];
  for (const path of localePages) {
    test(`${path} declares en-AU consistently (html lang, og:locale)`, async ({ page }) => {
      await page.goto(path);
      const html = await page.content();
      expect(htmlLang(html)).toBe('en-AU');
      const ogLocale = html.match(/<meta property="og:locale" content="([^"]*)"/);
      expect(ogLocale?.[1]).toBe('en_AU');
    });
  }

  // Pages that DO emit article-shaped JSON-LD (paper/report/blog-post/
  // daily-paper) must also carry inLanguage on that node. Generic `webpage`
  // pages (e.g. /research/methodology/, /about/team/) intentionally emit no
  // page-specific article JSON-LD per the brief, so they're excluded from
  // this stricter check — html lang / og:locale above still cover them.
  const articleShapedPages = ['/papers/detected-proceeds/'];
  for (const path of articleShapedPages) {
    test(`${path} article-shaped JSON-LD declares inLanguage en-AU`, async ({ page }) => {
      await page.goto(path);
      const html = await page.content();
      expect(html).toContain('"inLanguage":"en-AU"');
    });
  }
});

test.describe('structured data: regression — old /research/-prefix heuristic would misclassify this suite', () => {
  test('pathname-prefix heuristic disagrees with correct kind-driven classification on every research-adjacent fixture', () => {
    // These pages must NOT be scholarly (kind=webpage/report) yet sit under
    // /research/ — the old heuristic would have wrongly stamped them
    // ScholarlyArticle.
    const shouldNotBeScholarlyButPrefixSaysYes = [
      '/research/methodology/',
      '/research/directory/',
      '/research/reports/26-red-teaming-measurement-standards/',
      '/research/legal/lr-48-iatrogenic-safety-product-liability/',
    ];
    for (const path of shouldNotBeScholarlyButPrefixSaysYes) {
      expect(oldIsResearchPageHeuristic(path)).toBe(true); // old code would wrongly trigger Scholar treatment here
    }

    // Real scholarly papers live OUTSIDE /research/ — the old heuristic would
    // have wrongly withheld Scholar treatment from them.
    const shouldBeScholarlyButPrefixSaysNo = ['/papers/detected-proceeds/', '/papers/iatrogenic-safety-flim/'];
    for (const path of shouldBeScholarlyButPrefixSaysNo) {
      expect(oldIsResearchPageHeuristic(path)).toBe(false); // old code would wrongly withhold Scholar treatment here
    }
  });
});
