import type { APIContext } from 'astro';
import durations from '../../data/audio-durations.json';
import sizes from '../../data/enclosure-sizes.json';
import { buildPodcastFeed } from '../../lib/podcast-feed';
import { loadEpisodes } from '../../lib/podcast-source';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const episodes = await loadEpisodes(site);
  const xml = buildPodcastFeed(episodes, {
    audioOnly: true,
    site,
    selfPath: '/audio/podcast.xml',
    sizes: sizes as Record<string, number>,
    durations: durations as Record<string, number>,
    copyrightYear: new Date().getUTCFullYear(),
  });
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
