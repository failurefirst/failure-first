import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { plainSummary, richHtml } from './podcast-feed';
import type { Episode } from './podcast-items';

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../public');

function squareCoverUrl(site: string, category: string, slug: string): string | undefined {
  const relative = `/images/infographic/square/${category}/${slug}.jpg`;
  if (existsSync(resolve(publicDir, `.${relative}`))) return `${site}${relative}`;
  return undefined;
}

/** Load non-draft blog, daily-paper, and report entries that have live media. */
export async function loadEpisodes(site: string): Promise<Episode[]> {
  const [blogs, papers, reports] = await Promise.all([
    getCollection('blog').then((all) =>
      all.filter((entry) => !entry.data.draft && (!!entry.data.audio || !!entry.data.video)),
    ),
    getCollection('dailyPaper').then((all) =>
      all.filter((entry) => !entry.data.draft && (!!entry.data.audio || !!entry.data.video)),
    ),
    getCollection('reports').then((all) =>
      all.filter((entry) => !entry.data.draft && (!!entry.data.audio || !!entry.data.video)),
    ),
  ]);

  return [
    ...blogs.map((entry) => {
      const pageUrl = `${site}/blog/${entry.id}/`;
      const tags: string[] = Array.isArray(entry.data.tags) ? entry.data.tags : [];
      return {
        title: entry.data.title,
        summary: plainSummary(entry.data.description ?? '', entry.body ?? ''),
        contentHtml: richHtml(entry.data.description ?? '', entry.body ?? '', pageUrl, 'Blog', tags),
        date: entry.data.date,
        audioUrl: entry.data.audio ?? undefined,
        videoUrl: entry.data.video ?? undefined,
        pageUrl,
        guid: pageUrl,
        image: squareCoverUrl(site, 'blog', entry.id) ?? (entry.data.image ?? undefined),
        category: 'Blog',
      } satisfies Episode;
    }),
    ...papers.map((entry) => {
      const slug = entry.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const pageUrl = `${site}/daily-paper/${slug}/`;
      const tags: string[] = Array.isArray(entry.data.tags) ? entry.data.tags : [];
      return {
        title: entry.data.title,
        summary: plainSummary(entry.data.description ?? entry.data.title, entry.body ?? ''),
        contentHtml: richHtml(
          entry.data.description ?? entry.data.title,
          entry.body ?? '',
          pageUrl,
          'Daily Paper',
          tags,
        ),
        date: entry.data.date,
        audioUrl: entry.data.audio ?? undefined,
        videoUrl: entry.data.video ?? undefined,
        pageUrl,
        guid: `${site}/daily-paper/${entry.id}/`,
        image: squareCoverUrl(site, 'daily-paper', slug) ?? (entry.data.image ?? undefined),
        category: 'Daily Paper',
      } satisfies Episode;
    }),
    ...reports.map((entry) => {
      const pageUrl = `${site}/reports/${entry.id}/`;
      const tags: string[] = Array.isArray(entry.data.tags) ? entry.data.tags : [];
      return {
        title: entry.data.title,
        summary: plainSummary(entry.data.description ?? '', entry.body ?? ''),
        contentHtml: richHtml(
          entry.data.description ?? '',
          entry.body ?? '',
          pageUrl,
          'Report',
          tags,
        ),
        date: entry.data.date,
        audioUrl: entry.data.audio ?? undefined,
        videoUrl: entry.data.video ?? undefined,
        pageUrl,
        guid: pageUrl,
        image: squareCoverUrl(site, 'reports', entry.id) ?? (entry.data.image ?? undefined),
        category: 'Report',
      } satisfies Episode;
    }),
  ];
}
