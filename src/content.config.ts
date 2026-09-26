import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// src/content/legal/<문서>/<버전>.md → id "<문서>/<버전>" (기본 slug는 "v1.0"의 점을 지우므로 직접 만듭니다)
const legal = defineCollection({
  loader: glob({
    pattern: '*/v*.md',
    base: './src/content/legal',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    version: z.string().regex(/^v\d+(\.\d+)*$/),
    announced: z.coerce.date(),
    effective: z.coerce.date(),
    summary: z.string(),
    status: z.enum(['draft', 'published']),
  }),
});

export const collections = { legal };
