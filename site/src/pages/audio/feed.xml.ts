import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { APIContext } from 'astro';

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../public');

function squareCoverUrl(site: string, category: string, slug: string): string | undefined {
  const rel = `/images/infographic/square/${category}/${slug}.jpg`;
  if (existsSync(resolve(publicDir, `.${rel}`))) return `${site}${rel}`;
  return undefined;
}

/** Strip markdown syntax and return clean prose text. */
function markdownToText(md: string, maxChars = 4800): string {
  return md
    .replace(/^---[\s\S]*?---\n/, '')        // frontmatter
    .replace(/```[\s\S]*?```/gm, '')          // fenced code blocks
    .replace(/`[^`]+`/g, '')                  // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')          // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/^#{1,6}\s+.+$/gm, '')           // headings
    .replace(/^[-*_]{3,}$/gm, '')             // horizontal rules
    .replace(/[*_]{1,3}([^*\n_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/<[^>]+>/g, '')                  // HTML tags
    .replace(/\n{2,}/g, ' ')                  // paragraph breaks → space
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

/** Plain-text summary for <description> and <itunes:summary> (~490 chars). */
function plainSummary(fmDesc: string, body: string): string {
  const base = fmDesc.trim();
  if (base.length >= 450) return base.slice(0, 490);
  const preview = markdownToText(body, 490 - base.length - 3);
  if (!preview || preview.startsWith(base.slice(0, 30))) return base;
  return `${base} — ${preview}`.slice(0, 490);
}

/** Rich HTML for <content:encoded>: full description + body prose + links. */
function richHtml(
  fmDesc: string,
  body: string,
  pageUrl: string,
  category: string,
  tags: string[],
): string {
  const bodyText = markdownToText(body, 4200);
  const tagList = tags.length ? `<p><strong>Tags:</strong> ${tags.join(', ')}</p>` : '';
  const categoryLabel = { Blog: 'Blog Post', 'Daily Paper': 'Daily Research Paper', Report: 'Research Report' }[category] ?? category;
  return [
    `<p><em>${escapeHtml(fmDesc.trim())}</em></p>`,
    bodyText ? `<p>${escapeHtml(bodyText)}</p>` : '',
    tagList,
    `<hr/>`,
    `<p>📄 <a href="${pageUrl}">Read the full ${categoryLabel} on Failure-First →</a></p>`,
    `<p>🔬 <a href="https://failurefirst.org">Failure-First Embodied AI Research</a> — adversarial evaluation of embodied and agentic AI systems.</p>`,
    `<p>🎙️ <a href="https://failurefirst.org/research/podcasts/">Browse all episodes</a> | <a href="https://failurefirst.org/audio/feed.xml">RSS Feed</a></p>`,
  ].filter(Boolean).join('\n').slice(0, 5000);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const podcastCover = `${site}/podcast-cover.png`;

  const [blogs, papers, reports] = await Promise.all([
    getCollection('blog').then((all) => all.filter((e) => !e.data.draft && !!e.data.audio)),
    getCollection('dailyPaper').then((all) => all.filter((e) => !e.data.draft && !!e.data.audio)),
    getCollection('reports').then((all) => all.filter((e) => !e.data.draft && !!e.data.audio)),
  ]);

  type Episode = {
    title: string;
    summary: string;
    contentHtml: string;
    date: Date;
    audioUrl: string;
    pageUrl: string;
    guid: string;
    image?: string;
    category: string;
  };

  const episodes: Episode[] = [
    ...blogs.map((e) => {
      const pageUrl = `${site}/blog/${e.id}/`;
      const tags: string[] = Array.isArray(e.data.tags) ? e.data.tags : [];
      return {
        title: e.data.title,
        summary: plainSummary(e.data.description ?? '', e.body ?? ''),
        contentHtml: richHtml(e.data.description ?? '', e.body ?? '', pageUrl, 'Blog', tags),
        date: e.data.date,
        audioUrl: e.data.audio!,
        pageUrl,
        guid: pageUrl,
        image: squareCoverUrl(site, 'blog', e.id) ?? (e.data.image ?? undefined),
        category: 'Blog',
      };
    }),
    ...papers.map((e) => {
      const pageUrl = `${site}/daily-paper/${e.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`;
      const tags: string[] = Array.isArray(e.data.tags) ? e.data.tags : [];
      return {
        title: e.data.title,
        summary: plainSummary(e.data.description ?? e.data.title, e.body ?? ''),
        contentHtml: richHtml(e.data.description ?? e.data.title, e.body ?? '', pageUrl, 'Daily Paper', tags),
        date: e.data.date,
        audioUrl: e.data.audio!,
        pageUrl,
        guid: `${site}/daily-paper/${e.id}/`,
        image: squareCoverUrl(site, 'daily-paper', e.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')) ?? (e.data.image ?? undefined),
        category: 'Daily Paper',
      };
    }),
    ...reports.map((e) => {
      const pageUrl = `${site}/reports/${e.id}/`;
      const tags: string[] = Array.isArray(e.data.tags) ? e.data.tags : [];
      return {
        title: e.data.title,
        summary: plainSummary(e.data.description ?? '', e.body ?? ''),
        contentHtml: richHtml(e.data.description ?? '', e.body ?? '', pageUrl, 'Report', tags),
        date: e.data.date,
        audioUrl: e.data.audio!,
        pageUrl,
        guid: pageUrl,
        image: squareCoverUrl(site, 'reports', e.id) ?? (e.data.image ?? undefined),
        category: 'Report',
      };
    }),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const items = episodes.map((ep) => {
    const epImage = ep.image
      ? ep.image.startsWith('http') ? ep.image : `${site}${ep.image}`
      : podcastCover;

    return `
    <item>
      <title>${escapeXml(`[${ep.category}] ${ep.title}`)}</title>
      <description>${escapeXml(ep.summary)}</description>
      <itunes:summary>${escapeXml(ep.summary)}</itunes:summary>
      <content:encoded><![CDATA[${ep.contentHtml}]]></content:encoded>
      <itunes:author>Failure-First Embodied AI</itunes:author>
      <itunes:image href="${escapeXml(epImage)}" />
      <link>${ep.pageUrl}</link>
      <guid isPermaLink="false">${ep.guid}</guid>
      <pubDate>${ep.date.toUTCString()}</pubDate>
      <enclosure url="${escapeXml(ep.audioUrl)}" type="audio/mp4" length="0" />
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:podcast="https://podcastindex.org/namespace/1.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Failure-First Embodied AI</title>
    <description>Research audio from Failure-First: adversarial evaluation of embodied AI, jailbreak archaeology, policy analysis, and daily paper summaries from the AI safety frontier.</description>
    <itunes:summary>Research audio from Failure-First: adversarial evaluation of embodied AI, jailbreak archaeology, policy analysis, and daily paper summaries from the AI safety frontier.</itunes:summary>
    <link>${site}/research/podcasts/</link>
    <atom:link href="${site}/audio/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-AU</language>
    <copyright>© ${new Date().getFullYear()} Failure-First Embodied AI Research</copyright>
    <itunes:author>Failure-First Embodied AI</itunes:author>
    <itunes:owner>
      <itunes:name>Adrian Wedd</itunes:name>
      <itunes:email>adrianwedd@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:type>episodic</itunes:type>
    <itunes:category text="Technology" />
    <itunes:category text="Science">
      <itunes:category text="Social Sciences" />
    </itunes:category>
    <itunes:category text="Education" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${podcastCover}" />
    <podcast:locked>no</podcast:locked>
    ${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
