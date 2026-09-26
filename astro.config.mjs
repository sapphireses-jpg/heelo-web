import { defineConfig } from 'astro/config';
import { site } from './src/config/site.mjs';

export default defineConfig({
  site: site.url,
  base: site.base,
  trailingSlash: 'always',
});
