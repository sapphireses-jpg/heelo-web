// 홈 장면 ③ 일기 종이를 SVG 글자 모양(글꼴 파일 없이)으로 만듭니다. 사이트는 외부 글꼴·큰 글꼴 파일을 쓰지 않으므로 Gaegu(SIL OFL)를 글자 윤곽으로 한 번만 바꿔 저장합니다.
// 사용: node scripts/diary-svg.mjs  (원본 글꼴은 앱 저장소 docs/design/homepage-v10/export/fonts/Gaegu-Regular.ttf, 읽기만)
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { create } from 'fontkitten';
import { site } from '../src/config/site.mjs';

const repo = site.appRepoPath.replace(/^~(?=\/)/, homedir());
const font = create(readFileSync(`${repo}/docs/design/homepage-v10/export/fonts/Gaegu-Regular.ttf`));
const date = '10월 18일 토요일';
const body = '오늘은 한강까지 걸었다. 바람이 좋아서 자꾸 멈춰 섰다. 아빠가 간식을 두 번이나 줬다.';
const sign = '— 보리';
const W = 360, PAD = 24, LH = 36;

// 글자 윤곽: 줄 맞춰 이어 붙이기(커닝 없음)
function glyphs(text, size) {
  const k = size / font.unitsPerEm; let x = 0; const out = [];
  for (const ch of text) { const g = font.glyphForCodePoint(ch.codePointAt(0)); out.push({ ch, g, x }); x += g.advanceWidth * k; }
  return { items: out, width: x, k };
}
const path = (items, k, ox, oy) => items.map(({ g, x }) => { const d = g.path.toSVG().replace(/-?\d+(\.\d+)?/g, (n) => Math.round(Number(n))); return d ? `<path transform="translate(${(ox + x).toFixed(2)} ${oy}) scale(${k} ${-k})" d="${d}"/>` : ''; }).join('');
// 줄바꿈(단어 단위)
const words = body.split(' '); const lines = []; let cur = '';
for (const w of words) { const t = cur ? `${cur} ${w}` : w; if (glyphs(t, 24).width > W - PAD * 2 && cur) { lines.push(cur); cur = w; } else cur = t; }
lines.push(cur);
const top = PAD + 12; // 날짜 줄
let y = top + 14; let shapes = ''; let rules = '';
const d1 = glyphs(date, 15); shapes += `<g fill="#6d756f">${path(d1.items, d1.k, PAD, y)}</g>`;
const bodyTop = y + 16; // 첫 본문 기준선은 줄 간격 격자 위
const baselines = lines.map((_, i) => bodyTop + LH * (i + 1) - 9);
lines.forEach((l, i) => { const gl = glyphs(l, 24); shapes += `<g fill="#222826">${path(gl.items, gl.k, PAD, baselines[i])}</g>`; });
const signY = baselines[baselines.length - 1] + LH;
const gs = glyphs(sign, 17); shapes += `<g fill="#1c7d41">${path(gs.items, gs.k, W - PAD - gs.width, signY)}</g>`;
const H = signY + PAD;
for (let r = bodyTop + LH; r <= signY + 9; r += LH) rules += `<line x1="0" x2="${W}" y1="${r - 0.5}" y2="${r - 0.5}" stroke="#222826" stroke-opacity=".1"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><title>${date} ${body} ${sign}</title><rect width="${W}" height="${H}" rx="6" fill="#fffdf8"/>${rules}${shapes}</svg>\n`;
writeFileSync('public/images/diary.svg', svg);
console.log(`public/images/diary.svg ${W}x${H} 줄 ${lines.length}개 ${(svg.length / 1024).toFixed(1)}KB`);
