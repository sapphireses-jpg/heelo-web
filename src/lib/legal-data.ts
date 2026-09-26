import { getCollection } from 'astro:content';
import { DOCS, sortVersions, ymd } from './legal.mjs';

// draft는 로컬(astro dev)에서만 보입니다. 배포 빌드에는 들어가지 않습니다.
export async function legalByDoc() {
  const all = await getCollection('legal', (e) => import.meta.env.DEV || e.data.status === 'published');
  return Object.fromEntries(
    Object.keys(DOCS).map((doc) => [
      doc,
      sortVersions(
        all
          .filter((e) => e.id.startsWith(`${doc}/`))
          .map((e) => ({ ...e.data, announced: ymd(e.data.announced), effective: ymd(e.data.effective), entry: e })),
      ),
    ]),
  );
}
