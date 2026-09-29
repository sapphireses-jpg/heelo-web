import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// src/content/legal/<문서>/<버전>.md → id "<문서>/<버전>" (기본 slug는 "v1.0"의 점을 지우므로 직접 만듭니다)
// src/content/legal/<문서>/preview.md → 임시 초안(status: preview). 버전 머리 정보 대신 source를 적습니다.
const version = z.object({
  title: z.string(),
  version: z.string().regex(/^v\d+(\.\d+)*$/),
  announced: z.coerce.date(),
  effective: z.coerce.date(),
  summary: z.string(),
  status: z.enum(['draft', 'published']),
});
// src/content/legal/beta/<문서>.md → 베타 적용판(/legal/beta/<문서>/). 게시(published)할 때는 공고일·시행일이 있어야 합니다.
const source = z.object({ path: z.string(), sha256: z.string().regex(/^[0-9a-f]{64}$/), fetched: z.string() });
const beta = z
  .object({
    title: z.string(),
    version: z.string().regex(/^v\d+(\.\d+)*$/),
    status: z.enum(['draft', 'published']),
    announced: z.coerce.date().optional(),
    effective: z.coerce.date().optional(),
    summary: z.string().optional(),
    source,
  })
  .refine((d) => d.status === 'draft' || (d.announced && d.effective), { message: '게시(published)하려면 announced·effective가 필요합니다' });
const preview = z.object({
  title: z.string(),
  status: z.literal('preview'),
  source,
});

const legal = defineCollection({
  loader: glob({
    pattern: ['*/v*.md', '*/preview.md', 'beta/*.md'],
    base: './src/content/legal',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.union([version, preview, beta]),
});

export const collections = { legal };
