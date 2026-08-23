import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const labEvents = (await getCollection('labLog'))
    .filter((event) => !event.data.draft)
    .map((event) => ({
      title: event.data.title,
      description: `${event.data.specimen} · ${event.data.status.replaceAll('-', ' ').toUpperCase()} — ${event.data.summary}`,
      pubDate: event.data.date,
      link: `/lab-log/#${event.id}`,
    }));
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    }));

  const papers = (await getCollection('dailyPaper'))
    .filter((p) => !p.data.draft)
    .map((paper) => ({
      title: `[Daily Paper] ${paper.data.title}`,
      description: paper.data.description,
      pubDate: paper.data.date,
      link: `/daily-paper/${paper.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`,
    }));

  const dailies = (await getCollection('aiSafetyDaily'))
    .filter((post) => !post.data.draft)
    .map((post) => ({
      title: `[AI Safety Daily] ${post.data.title}`,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      link: `/ai-safety-daily/${post.id}/`,
    }));

  const items = [...labEvents, ...posts, ...papers, ...dailies]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Failure-First Embodied AI',
    description: 'Lab events, experiment status, measured findings, autopsies, and external intelligence from Failure-First.',
    site: context.site!,
    items,
  });
}
