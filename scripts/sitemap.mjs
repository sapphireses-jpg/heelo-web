// 빌드 뒤 dist/sitemap.xml을 만듭니다: noindex가 아닌 페이지만(초대 · 카드 · 제휴 감사 · 베타 약관 등은 빠짐). 설정값 site.url 기준.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../src/config/site.mjs';

const urls = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html' && !/<meta name="robots" content="[^"]*noindex/.test(readFileSync(p, 'utf8')))
      urls.push(p.replace(/^dist/, '').replace(/index\.html$/, ''));
  }
};
walk('dist');
urls.sort();
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml: ${urls.length}개`);
