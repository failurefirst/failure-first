import { normalizeEnclosureUrl } from './enclosure-url';

export type Episode = {
  title: string;
  summary: string;
  contentHtml: string;
  date: Date;
  audioUrl?: string;
  videoUrl?: string;
  pageUrl: string;
  guid: string;
  image?: string;
  category: string;
};

export type FeedItem = {
  title: string;
  summary: string;
  contentHtml: string;
  date: Date;
  enclosureUrl: string;
  mimeType: 'audio/mp4' | 'video/mp4';
  pageUrl: string;
  guid: string;
  guidIsPermalink: boolean;
  image?: string;
  category: string;
};

/** Expand episodes into one RSS item per enclosure, newest first and deduplicated. */
export function expandToItems(
  episodes: Episode[],
  opts: { audioOnly: boolean },
): FeedItem[] {
  const items: FeedItem[] = [];
  const seen = new Set<string>();

  const push = (item: FeedItem) => {
    if (seen.has(item.enclosureUrl)) return;
    seen.add(item.enclosureUrl);
    items.push(item);
  };

  const newestFirst = [...episodes].sort(
    (a, b) => b.date.getTime() - a.date.getTime() || a.guid.localeCompare(b.guid),
  );
  for (const episode of newestFirst) {
    if (episode.audioUrl) {
      push({
        title: `[${episode.category}] ${episode.title}`,
        summary: episode.summary,
        contentHtml: episode.contentHtml,
        date: episode.date,
        enclosureUrl: normalizeEnclosureUrl(episode.audioUrl),
        mimeType: 'audio/mp4',
        pageUrl: episode.pageUrl,
        guid: episode.guid,
        guidIsPermalink: false,
        image: episode.image,
        category: episode.category,
      });
    }
    if (episode.videoUrl && !opts.audioOnly) {
      push({
        title: `[Video] [${episode.category}] ${episode.title}`,
        summary: episode.summary,
        contentHtml: episode.contentHtml,
        date: episode.date,
        enclosureUrl: normalizeEnclosureUrl(episode.videoUrl),
        mimeType: 'video/mp4',
        pageUrl: episode.pageUrl,
        guid: `${episode.guid}#video`,
        guidIsPermalink: false,
        image: episode.image,
        category: episode.category,
      });
    }
  }
  return items;
}
