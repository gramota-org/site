/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

/** Walk `src/content/<area>/**` and turn each .md file into a `/<area>/<slug>` route. */
function contentRoutes(area: 'docs' | 'blog'): string[] {
  const root = join(__dirname, `src/content/${area}`);
  const out: string[] = [];
  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        const slug = relative(root, full).replace(/\.md$/, '');
        out.push(`/${area}/${slug}`);
      }
    }
  }
  walk(root);
  return out;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for asset URLs. Set BASE_HREF=/site/ when deploying to a
  // GitHub Pages project URL (gramota-org.github.io/site/); leave unset
  // (defaults to "/") for a custom domain (e.g. gramota.dev) or
  // Cloudflare Pages.
  base: process.env.BASE_HREF ?? '/',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    // Patch <base href="/" /> in index.html when BASE_HREF is set, so
    // Angular's router resolves routes against the right path prefix
    // when deployed under a GitHub Pages project URL.
    {
      name: 'rewrite-base-href',
      transformIndexHtml: {
        order: 'pre',
        handler(html: string): string {
          const base = process.env.BASE_HREF ?? '/';
          if (base === '/') return html;
          return html.replace(
            /<base\s+href="[^"]*"\s*\/?>/,
            `<base href="${base}" />`,
          );
        },
      },
    },
    analog({
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlighter: {
            // Default langs: json, ts, tsx, js, jsx, html, css, angular-html,
            // angular-ts. Add the ones the docs use in fenced code blocks.
            additionalLangs: ['bash', 'yaml', 'md'],
          },
        },
      },
      prerender: {
        // Statically: the home page + section indexes. Everything under
        // /docs/<slug> and /blog/<slug> is discovered by walking
        // src/content/<area>/**.
        routes: [
          '/',
          '/docs',
          ...contentRoutes('docs'),
          '/blog',
          ...contentRoutes('blog'),
        ],
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
