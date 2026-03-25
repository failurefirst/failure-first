// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://failurefirst.org',
  base: '/',
  outDir: '../docs',
  build: {
    assets: 'assets'
  },
  integrations: [
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
