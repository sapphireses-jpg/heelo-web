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
// 브라우저 자바스크립트 0 규칙도 함께 확인합니다(예외: /invite/ 한 페이지의 인라인 스크립트).
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
  const scripts = [...text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  if (scripts.length && !/[\\/]invite[\\/]index\.html$/.test(f)) errors.push(`브라우저 자바스크립트: ${f}`);
  // 초대 페이지 한 곳만 허용(오너 2026-10-04, 코드 복사 2026-10-05): 인라인만, 네트워크·저장·추적 호출 없음(navigator는 clipboard만)
  if (scripts.length && /[\\/]invite[\\/]index\.html$/.test(f))
    for (const [, attrs, body] of scripts) {
      if (/\ssrc\s*=/i.test(attrs)) errors.push(`초대 페이지 스크립트: 외부 파일을 불러올 수 없습니다 ${f}`);
      for (const bad of /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|localStorage|sessionStorage|indexedDB|import\s*\(|document\.cookie|navigator\.(?!clipboard\b))/g[Symbol.matchAll](body))
        errors.push(`초대 페이지 스크립트: 금지된 호출 "${bad[0]}" ${f}`);
    }
}
if (files('dist').some((f) => f.endsWith('.js'))) errors.push('브라우저 자바스크립트: dist에 .js 파일이 있습니다');

// 2. 검토 흔적 검사: published 약관에 [자리표시], 「검토용 주석」「법률 검토 쟁점」「개발 확인」「DPA 확인」, HTML 주석이 남아 있으면 실패.
// 마크다운 링크 [글자](주소)는 자리표시로 보지 않습니다. [검토: …]는 [ 검사로 잡힙니다.
const marks = [/\[[^\]\n]*\](?!\()/g, /검토용 주석/g, /법률 검토 쟁점/g, /개발 확인/g, /DPA 확인/g, /<!--/g];
for (const f of files('src/content/legal').filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(f, 'utf8');
  if (!isPublished(text)) continue;
  for (const re of marks) for (const [m] of text.matchAll(re)) errors.push(`검토 흔적: ${f} 에 "${m}"`);
}

// 2-1. 임시 초안(preview.md) 검사: ① 같은 문서에 published와 함께 있으면 실패 ② launchReady인데 남아 있으면 실패
// ③ 초안을 보여 주는 페이지에 noindex가 없으면 실패
for (const doc of readdirSync('src/content/legal', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const dir = `src/content/legal/${doc}`;
  if (!existsSync(`${dir}/preview.md`)) continue;
  const published = readdirSync(dir).filter((f) => /^v.*\.md$/.test(f) && isPublished(readFileSync(`${dir}/${f}`, 'utf8')));
  if (published.length) errors.push(`임시 초안: ${dir}/preview.md 와 published(${published.join(', ')})가 함께 있습니다. preview를 지우세요`);
  if (site.launchReady) errors.push(`임시 초안: launchReady인데 ${dir}/preview.md 가 남아 있습니다`);
  const page = `dist/legal/${doc}/index.html`;
  if (!published.length && !/<meta name="robots" content="noindex[^"]*">/.test(readFileSync(page, 'utf8'))) errors.push(`임시 초안: ${page} 에 noindex가 없습니다`);
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

// 3-2. 남의 상표 검사: 결과물에 「TAILORY」가 남아 있으면 실패(대소문자 그대로. 소문자 주소 등은 해당 없음).
for (const f of files('dist').filter((f) => f.endsWith('.html')))
  if (readFileSync(f, 'utf8').includes('TAILORY')) errors.push(`남의 상표: ${f} 에 "TAILORY"가 있습니다`);

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
