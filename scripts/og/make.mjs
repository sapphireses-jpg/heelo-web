// 링크 미리보기 이미지 만들기: node scripts/og/make.mjs (sharp는 Astro가 이미 씁니다)
import sharp from 'sharp';
await sharp('scripts/og/invite.svg').png().toFile('public/og/invite.png');
