import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
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

  const items = [...posts, ...papers]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Failure-First Embodied AI',
    description: 'Research updates, daily paper analyses, and adversarial AI safety findings.',
    site: context.site!,
    items,
  });
}
