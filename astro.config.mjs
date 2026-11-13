import { defineConfig } from 'astro/config';
import { resolveSite } from './site.config.mjs';

// URL and base path are detected automatically (see site.config.mjs).
// On GitHub Actions they come from the repository name; no editing needed.
const { origin, base } = resolveSite();

export default defineConfig({
  site: origin,
  base: base || '/',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
});
