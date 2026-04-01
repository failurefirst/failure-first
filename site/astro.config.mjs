// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://failurefirst.org',
  base: '/',
  outDir: '../docs',
  build: {
    assets: 'assets'
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    sentry({
      dsn: 'https://dae8d5e1210ff8aeb35006a7d443415f@o4510818923053056.ingest.de.sentry.io/4511138848505936',
      sourceMapsUploadOptions: {
        project: 'failurefirst',
        org: 'adrian-wedd',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sitemap({
      filter: (page) => !page.includes('/moltbook/') || page.includes('/research/moltbook/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Customize priority based on page type
        if (item.url === 'https://failurefirst.org/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/research/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/policy/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/framework/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/docs/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/about/')) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
});
