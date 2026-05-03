import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

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
    description: string;
    date: Date;
    audioUrl: string;
    pageUrl: string;
    image?: string;
    category: string;
  };

  const episodes: Episode[] = [
    ...blogs.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      date: e.data.date,
      audioUrl: e.data.audio!,
      pageUrl: `${site}/blog/${e.id}/`,
      image: e.data.image ?? undefined,
      category: 'Blog',
    })),
    ...papers.map((e) => ({
      title: e.data.title,
      description: e.data.description ?? e.data.title,
      date: e.data.date,
      audioUrl: e.data.audio!,
      pageUrl: `${site}/daily-paper/${e.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`,
      image: e.data.image ?? undefined,
      category: 'Daily Paper',
    })),
    ...reports.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      date: e.data.date,
      audioUrl: e.data.audio!,
      pageUrl: `${site}/reports/${e.id}/`,
      image: e.data.image ?? undefined,
      category: 'Report',
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const items = episodes.map((ep) => {
    const epImage = ep.image
      ? ep.image.startsWith('http') ? ep.image : `${site}${ep.image}`
      : podcastCover;

    return `
    <item>
      <title>${escapeXml(`[${ep.category}] ${ep.title}`)}</title>
      <description>${escapeXml(ep.description)}</description>
      <itunes:summary>${escapeXml(ep.description)}</itunes:summary>
      <content:encoded><![CDATA[${ep.description}]]></content:encoded>
      <itunes:author>Failure-First Embodied AI</itunes:author>
      <itunes:image href="${escapeXml(epImage)}" />
      <link>${ep.pageUrl}</link>
      <guid isPermaLink="true">${ep.pageUrl}</guid>
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
