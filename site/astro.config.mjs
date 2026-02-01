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
    }),
  ],
});
