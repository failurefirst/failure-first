import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    last_updated: z.coerce.date(),
    category: z.enum(['methodology', 'data', 'taxonomy', 'evaluation']),
    related: z.array(z.string()).default([]),
    toc: z.boolean().default(true),
  }),
});

const dailyPaper = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily-paper' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    arxiv: z.string(),
    authors: z.string(),
    paperType: z.enum(['empirical', 'theoretical', 'methods', 'survey', 'position']),
    tags: z.array(z.string()).default([]),
    audio: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, docs, dailyPaper };
