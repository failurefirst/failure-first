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
    slides: z.string().optional(),
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
    authors: z
      .union([z.string(), z.array(z.string())])
      .refine(
        (v) => {
          const bad = (s: string) => s === '' || s.toLowerCase() === 'null' || s.toLowerCase() === 'none';
          return Array.isArray(v) ? v.length > 0 && !v.some(bad) : !bad(v);
        },
        { message: 'authors must be omitted rather than set to "", "null", or "none" — the generator is stringifying a null author list' },
      )
      .optional(),
    author: z.string().optional(),
    paperType: z.enum(['empirical', 'theoretical', 'methods', 'survey', 'position', 'application', 'original-research', 'systematization']).optional(),
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
    // Cover fields
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    refId: z.string().optional(),
    product: z.string().optional(),
    scope: z.string().optional(),
    probeVersions: z.string().optional(),
    probeCount: z.number().optional(),
    harmClasses: z.number().optional(),
    testingPeriod: z.string().optional(),
    // Scoreboard
    sevCritical: z.number().optional(),
    sevHigh: z.number().optional(),
    sevMedium: z.number().optional(),
    sevLow: z.number().optional(),
    sevInfo: z.number().optional(),
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
    // Optional (#1043 DD-03): a paper entry may exist before its PDF does.
    // Required-with-no-file shipped a "Download PDF" link that 404'd; callers
    // must render the link conditionally rather than assume a URL resolves.
    pdfUrl: z.string().optional(),
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

const aiSafetyDaily = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ai-safety-daily' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    audio: z.string().optional(),
    video: z.string().optional(),
    draft: z.boolean().default(false),
  }).passthrough(),
});

const labLog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab-log' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(['measured', 'active-experiment', 'instrument-validation', 'programme-bet', 'foundation']),
    specimen: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

// A specimen is a standing research entity: the question it exists to answer and
// the caveat that stays attached until evidence retires it. Deliberately holds NO
// current-state field. Status, "as of" date, and the card's link are derived at
// build time from the newest labLog event naming the same specimen, so the
// homepage cannot claim a state the lab log does not record. The homepage used to
// hand-write both — it shipped "AS OF 00:08 UTC" for two days, a timestamp with
// its date filed off, which reads as this morning to anyone who has not memorised
// the log.
const specimens = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/specimens' }),
  schema: z.object({
    // Must match a labLog entry's `specimen` string exactly; the join is by name.
    name: z.string(),
    question: z.string(),
    caveat: z.string(),
    cta: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, docs, dailyPaper, aiSafetyDaily, reports, legal, policyDocs, papers, services, labLog, specimens };
