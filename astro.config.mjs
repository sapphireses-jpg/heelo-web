import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { site } from './src/config/site.mjs';

// 약관 본문(마크다운)의 {서비스명}을 설정의 서비스명으로 채웁니다(Astro 기본 처리기 Sätteri의 글자 방문).
const fillServiceName = {
  name: 'fill-service-name',
  text(node, ctx) {
    if (node.value.includes('{서비스명}')) ctx.setProperty(node, 'value', node.value.replaceAll('{서비스명}', site.serviceName));
  },
};

export default defineConfig({
  markdown: { processor: satteri({ mdastPlugins: [fillServiceName] }) },
  site: site.url,
  base: site.base,
  trailingSlash: 'always',
});
