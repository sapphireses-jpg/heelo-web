// 자동 검사 네 가지. `npm run build` 뒤에 실행합니다. 실패하면 종료 코드 1.
// 버전 불변 검사 기준 커밋: 환경변수 BASE_SHA(CI의 push 이전 커밋), 없으면 HEAD~1.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { site } from '../src/config/site.mjs';

const errors = [];
const warnings = [];
const files = (dir) => readdirSync(dir, { recursive: true }).map((f) => join(dir, String(f)));
const isPublished = (text) => /^status:\s*published\s*$/m.test(text.split(/^---\s*$/m)[1] ?? '');

// 1. 외부 리소스 검사: 불러오는 곳(src, srcset, <link href>, CSS url()·@import 등)에 외부 주소가 있으면 실패. <a href>는 허용.
// 브라우저 자바스크립트 0 규칙도 함께 확인합니다.
const ext = /^\s*(https?:)?\/\//i;
const htmlLoads = [
  /<(?:img|script|iframe|embed|source|video|audio|track|input)\b[^>]*?\ssrc\s*=\s*["']?([^"'\s>]+)/gi,
  /\ssrcset\s*=\s*["']([^"']+)/gi,
  /<link\b[^>]*?\shref\s*=\s*["']?([^"'\s>]+)/gi,
  /<object\b[^>]*?\sdata\s*=\s*["']?([^"'\s>]+)/gi,
  /\sposter\s*=\s*["']?([^"'\s>]+)/gi,
];
const cssLoads = [/url\(\s*["']?([^"')]+)/gi, /@import\s+["']([^"']+)/gi];
for (const f of files('dist')) {
  if (!/\.(html|css|svg)$/.test(f)) continue;
  const text = readFileSync(f, 'utf8');
  const patterns = f.endsWith('.css') ? cssLoads : [...htmlLoads, ...cssLoads];
  for (const re of patterns)
    for (const m of text.matchAll(re))
      for (const u of m[1].split(','))
        if (ext.test(u)) errors.push(`외부 리소스: ${f} → ${u.trim()}`);
  if (/<script\b/i.test(text)) errors.push(`브라우저 자바스크립트: ${f}`);
}
if (files('dist').some((f) => f.endsWith('.js'))) errors.push('브라우저 자바스크립트: dist에 .js 파일이 있습니다');

// 2. 검토 흔적 검사: published 약관에 검토용 표시가 남아 있으면 실패.
const marks = ['[검토', '[개발 확인', '[DPA', '검토용 주석', '법률 검토 쟁점'];
for (const f of files('src/content/legal').filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(f, 'utf8');
  if (!isPublished(text)) continue;
  for (const m of marks) if (text.includes(m)) errors.push(`검토 흔적: ${f} 에 "${m}"`);
}

// 3. 출시 자리표시 검사: 결과물 화면 글자에 [한글…] 자리표시가 남아 있으면 launchReady면 실패, 아니면 경고.
const found = new Map();
for (const f of files('dist').filter((f) => f.endsWith('.html'))) {
  const text = readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' ');
  for (const [p] of text.matchAll(/\[[가-힣][^\]\n]{0,40}\]/g)) found.set(p, (found.get(p) ?? 0) + 1);
}
if (found.size) (site.launchReady ? errors : warnings).push(`남은 자리표시: ${[...found.keys()].join(', ')}`);

// 3-1. 서비스명 조사 검사: 서비스명 바로 뒤에 받침 따라 달라지는 조사(이/가, 은/는, 을/를, 와/과)가 붙으면 실패.
// 페이지 제목·메타 태그도 보도록 태그를 지우지 않은 원문을 봅니다.
const name = site.serviceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const particle = new RegExp(`${name}(이|가|은|는|을|를|와|과)(?![가-힣])`, 'g');
for (const f of files('dist').filter((f) => f.endsWith('.html')))
  for (const [m] of readFileSync(f, 'utf8').matchAll(particle)) errors.push(`서비스명 조사: ${f} → "${m}"`);

// 4. 버전 불변 검사: 기준 커밋에서 published였던 약관 파일이 바뀌거나 지워지면 실패.
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
let base = process.env.BASE_SHA;
if (!base || /^0+$/.test(base)) { try { base = git('rev-parse', 'HEAD~1').trim(); } catch { base = null; } }
if (base) {
  for (const f of git('ls-tree', '-r', '--name-only', base, '--', 'src/content/legal').split('\n').filter((f) => f.endsWith('.md'))) {
    const before = git('show', `${base}:${f}`);
    if (!isPublished(before)) continue;
    if (!existsSync(f)) errors.push(`버전 불변: published 파일이 지워졌습니다 ${f}`);
    else if (readFileSync(f, 'utf8') !== before) errors.push(`버전 불변: published 파일이 바뀌었습니다 ${f} (새 버전 파일을 만드세요)`);
  }
} else warnings.push('버전 불변: 비교할 이전 커밋이 없어 건너뜀');

for (const w of warnings) console.warn(`경고 ${w}`);
for (const e of errors) console.error(`실패 ${e}`);
console.log(errors.length ? `검사 실패 ${errors.length}건` : '검사 통과');
process.exit(errors.length ? 1 : 0);
