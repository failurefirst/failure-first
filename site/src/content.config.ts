import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    audio: z.string().optional(),
    video: z.string().optional(),
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
    description: z.string().optional(),
    date: z.coerce.date(),
    arxiv: z.string().optional(),
    arxiv_id: z.string().optional(),
    authors: z.union([z.string(), z.array(z.string())]).optional(),
    author: z.string().optional(),
    paperType: z.enum(['empirical', 'theoretical', 'methods', 'survey', 'position', 'application', 'original-research']).optional(),
    tags: z.array(z.string()).default([]),
    audio: z.string().optional(),
    video: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }).passthrough(),
});

const reports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    reportNumber: z.number(),
    classification: z.enum(['Regulatory Review', 'Standards Development', 'Research — AI Safety Policy', 'Research — Empirical Study', 'Technical Analysis', 'HIGH', 'SAFETY-CRITICAL']),
    status: z.enum(['draft', 'active', 'complete']).default('active'),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    audio: z.string().optional(),
    video: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    memoNumber: z.string(),
    jurisdiction: z.string(),
    status: z.enum(['draft']).default('draft'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const policyDocs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/policy-docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    classification: z.string().default('Policy Brief'),
    status: z.enum(['draft', 'active', 'complete']).default('active'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    authors: z.string(),
    venue: z.string(),
    status: z.enum(['draft', 'submitted', 'preprint', 'published']),
    pdfUrl: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    layout: z.enum(['services', 'service-detail']).default('service-detail'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, docs, dailyPaper, reports, legal, policyDocs, papers, services };
