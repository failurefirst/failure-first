import { getDuration } from './duration';
import { getEnclosureSize } from './enclosure-size';
import { expandToItems, type Episode } from './podcast-items';
import { PODCAST_GUID } from './podcast-guid';

export function escapeCdata(html: string): string {
  return html.replace(/]]>/g, ']]]]><![CDATA[>');
}

export function markdownToText(md: string, maxChars = 4800): string {
  return md
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/```[\s\S]*?```/gm, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/^[-*_]{3,}$/gm, '')
    .replace(/[*_]{1,3}([^*\n_]+)[*_]{1,3}/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

export function plainSummary(frontmatterDescription: string, body: string): string {
  const base = frontmatterDescription.trim();
  if (base.length >= 450) return base.slice(0, 490);
  const preview = markdownToText(body, 490 - base.length - 3);
  if (!preview || preview.startsWith(base.slice(0, 30))) return base;
  return `${base} — ${preview}`.slice(0, 490);
}

export function richHtml(
  frontmatterDescription: string,
  body: string,
  pageUrl: string,
  category: string,
  tags: string[],
): string {
  const bodyText = markdownToText(body, 4200);
  const tagList = tags.length ? `<p><strong>Tags:</strong> ${tags.join(', ')}</p>` : '';
  const categoryLabel =
    {
      Blog: 'Blog Post',
      'Daily Paper': 'Daily Research Paper',
      Report: 'Research Report',
    }[category] ?? category;
  return [
    `<p><em>${escapeHtml(frontmatterDescription.trim())}</em></p>`,
    bodyText ? `<p>${escapeHtml(bodyText)}</p>` : '',
    tagList,
    '<hr/>',
    `<p>📄 <a href="${pageUrl}">Read the full ${categoryLabel} on Failure-First →</a></p>`,
    '<p>🔬 <a href="https://failurefirst.org">Failure-First Embodied AI Research</a> — adversarial evaluation of embodied and agentic AI systems.</p>',
    '<p>🎙️ <a href="https://failurefirst.org/research/podcasts/">Browse all episodes</a> | <a href="https://failurefirst.org/audio/feed.xml">RSS Feed</a></p>',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 5000);
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');
}

export function buildPodcastFeed(
  episodes: Episode[],
  opts: {
    audioOnly: boolean;
    site: string;
    selfPath: string;
    sizes: Record<string, number>;
    durations: Record<string, number>;
    copyrightYear: number;
  },
): string {
  const { audioOnly, site, selfPath, sizes, durations, copyrightYear } = opts;
  const podcastCover = `${site}/podcast-cover.jpg`;

  const items = expandToItems(episodes, { audioOnly }).map((item) => {
    const rawImage = item.image
      ? item.image.startsWith('http')
        ? item.image
        : `${site}${item.image}`
      : '';
    const episodeImage = /\.(jpe?g|png)(\?|$)/i.test(rawImage) ? rawImage : podcastCover;
    const length = getEnclosureSize(item.enclosureUrl, sizes);
    const duration = getDuration(item.enclosureUrl, durations);
    return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.summary)}</description>
      <itunes:summary>${escapeXml(item.summary)}</itunes:summary>
      <content:encoded><![CDATA[${escapeCdata(item.contentHtml)}]]></content:encoded>
      <itunes:author>Failure-First Embodied AI</itunes:author>
      <itunes:image href="${escapeXml(episodeImage)}" />
      <link>${escapeXml(item.pageUrl)}</link>
      <guid isPermaLink="${item.guidIsPermalink}">${escapeXml(item.guid)}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <enclosure url="${escapeXml(item.enclosureUrl)}" type="${item.mimeType}" length="${length}" />${
        duration ? `\n      <itunes:duration>${duration}</itunes:duration>` : ''
      }
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
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
    <atom:link href="${site}${selfPath}" rel="self" type="application/rss+xml" />
    <language>en-AU</language>
    <copyright>&#xA9; ${copyrightYear} Failure-First Embodied AI Research</copyright>
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
    <podcast:guid>${PODCAST_GUID}</podcast:guid>
    <podcast:locked>no</podcast:locked>
    ${items.join('\n')}
  </channel>
</rss>`.trim();
}
