import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import starlightConfig from './starlight.config.mjs';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

// Resolve local library alias to built ESM if available; otherwise fall back to source
const distPath = fileURLToPath(new URL('../dist/automagica11y.esm.js', import.meta.url));
const srcPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));
const libAlias = existsSync(distPath) ? distPath : srcPath;

export default defineConfig({
  site: 'https://automagica11y.dev/docs',
  integrations: [
    starlight(starlightConfig),
    mdx()
  ],
  vite: {
    resolve: {
      alias: {
        automagica11y: libAlias,
        '@core': fileURLToPath(new URL('../src/core', import.meta.url)),
        '@utils': fileURLToPath(new URL('../src/utils', import.meta.url))
      }
    }
  }
});
