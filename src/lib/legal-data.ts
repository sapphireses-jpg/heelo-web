import { getCollection } from 'astro:content';
import { DOCS, sortVersions, ymd } from './legal.mjs';

// draft는 로컬(astro dev)에서만 보입니다. 배포 빌드에는 들어가지 않습니다. preview는 버전 목록에 넣지 않습니다.
export async function legalByDoc() {
  const all = await getCollection('legal', (e) => !e.id.startsWith('beta/') && (e.data.status === 'published' || (import.meta.env.DEV && e.data.status === 'draft')));
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

// 임시 초안: { 문서: entry }
export async function previewByDoc() {
  const all = await getCollection('legal', (e) => e.data.status === 'preview');
  return Object.fromEntries(all.map((e) => [e.id.split('/')[0], e]));
}

// 베타 적용판: { 문서: entry }. draft는 로컬(astro dev)에서만 보입니다.
export async function betaByDoc() {
  const all = await getCollection('legal', (e) => e.id.startsWith('beta/') && (e.data.status === 'published' || (import.meta.env.DEV && e.data.status === 'draft')));
  return Object.fromEntries(all.map((e) => [e.id.split('/')[1], e]));
}
