// 앱 저장소 docs/legal/public/의 약관 초안을 src/content/legal/<문서>/preview.md로 가져옵니다(로컬 전용).
// 앱 저장소는 읽기만 하고 git 명령은 쓰지 않습니다. 출처는 원문 경로, SHA-256, 가져온 날짜로 남깁니다.
// 사용: npm run sync-legal-preview
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/config/site.mjs';
import { DOCS, todayKST } from '../src/lib/legal.mjs';

// 게시 규칙(docs/HOMEPAGE_RULES.md 3번 임시 초안)대로 바꿉니다. 바꾼 개수도 돌려줍니다.
export function toPreview(md) {
  const count = { 머리주석: 0, 쟁점절: 0, 검토용주석: 0, 검토: 0, 확인: 0 };
  let s = md.replace(/^\s*<!--[\s\S]*?-->\s*\n/, () => (count.머리주석++, ''));
  s = s.replace(/\n#{1,6} [^\n]*법률 검토 쟁점[\s\S]*$/, () => (count.쟁점절++, '\n'));
  s = s.replace(/[ \t]*\(검토용 주석[^)]*\)/g, () => (count.검토용주석++, ''));
  // 여는 괄호는 [ 또는 &#91;, 안에 [자리표시]가 한 겹 들어 있을 수 있습니다.
  const mark = (head) => new RegExp(`(?:\\[|&#91;)(?:${head})(?:[^\\[\\]]|\\[[^\\]]*\\])*\\]`, 'g');
  s = s.replace(mark('검토'), () => (count.검토++, '(검토 중)'));
  s = s.replace(mark('개발 확인|DPA 확인'), () => (count.확인++, '(확인 중)'));
  const left = s.match(/(\[|&#91;)(검토|개발 확인|DPA)|법률 검토 쟁점|검토용 주석|<!--/);
  if (left) throw new Error(`변환 뒤에도 검토 표지가 남았습니다: "${left[0]}"`);
  return { body: s.replace(/\s+$/, '\n'), count };
}

// 베타 적용판: 첫 줄 HTML 주석만 빼고 그대로 둡니다(게시 검사가 엄격하게 봅니다). 버전은 머리 주석에서 읽습니다.
export function toBeta(md) {
  const version = md.match(/^\s*<!--[^\n]*버전 (v[\d.]+)/)?.[1];
  if (!version) throw new Error('베타 원문 첫 줄 주석에서 버전을 찾지 못했습니다');
  return { version, body: md.replace(/^\s*<!--[\s\S]*?-->\s*\n/, '').replace(/\s+$/, '\n') };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repo = site.appRepoPath.replace(/^~(?=\/)/, homedir());
  const fetched = todayKST();
  const read = (rel) => {
    const raw = readFileSync(join(repo, rel));
    return { text: raw.toString('utf8'), sha256: createHash('sha256').update(raw).digest('hex') };
  };
  const source = (rel, sha256) => ['source:', `  path: "앱 저장소 ${rel}"`, `  sha256: ${sha256}`, `  fetched: "${fetched}"`];
  for (const [doc, title] of Object.entries(DOCS)) {
    // 1) 임시 초안: docs/legal/public/<문서>.md → src/content/legal/<문서>/preview.md
    const rel = `docs/legal/public/${doc}.md`;
    const { text, sha256 } = read(rel);
    const { body, count } = toPreview(text);
    const front = ['---', `title: ${title}`, 'status: preview', ...source(rel, sha256), '---', ''].join('\n');
    mkdirSync(`src/content/legal/${doc}`, { recursive: true });
    writeFileSync(`src/content/legal/${doc}/preview.md`, front + body);
    console.log(`${doc}: sha256 ${sha256.slice(0, 12)}… 변환 ${JSON.stringify(count)}`);

    // 2) 베타 적용판: docs/legal/beta/<문서>-beta.md → src/content/legal/beta/<문서>.md (draft로만 씁니다)
    const brel = `docs/legal/beta/${doc}-beta.md`;
    const out = `src/content/legal/beta/${doc}.md`;
    if (!existsSync(join(repo, brel))) continue;
    if (existsSync(out) && /^status:\s*published\s*$/m.test(readFileSync(out, 'utf8'))) {
      console.log(`beta/${doc}: published라 덮어쓰지 않습니다(새 버전 파일을 만드세요)`);
      continue;
    }
    const b = read(brel);
    const { version, body: bbody } = toBeta(b.text);
    const bfront = ['---', `title: ${title}`, `version: ${version}`, 'status: draft', ...source(brel, b.sha256), '---', ''].join('\n');
    mkdirSync('src/content/legal/beta', { recursive: true });
    writeFileSync(out, bfront + bbody);
    console.log(`beta/${doc}: ${version} sha256 ${b.sha256.slice(0, 12)}… (draft)`);
  }
}
