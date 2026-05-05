/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
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
        // Routes to pre-render at build time. Add more here as content grows.
        // The list is small so far; once content collections stabilize we'll
        // switch this to a generator that walks src/content/docs/**.
        routes: [
          '/',
          '/docs',
          '/docs/getting-started',
          '/docs/concepts/sd-jwt-vc',
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
