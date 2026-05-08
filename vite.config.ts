/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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

/** Strip the YAML frontmatter and parse the keys we care about. */
function readFrontmatter(filepath: string): Record<string, string> {
  const src = readFileSync(filepath, 'utf-8');
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return out;
}

const SITE_URL = process.env.SITE_URL ?? 'https://gramota.eu';

/** Emit sitemap.xml, robots.txt, and rss.xml into dist/client at build end. */
function seoArtifacts() {
  return {
    name: 'seo-artifacts',
    apply: 'build' as const,
    closeBundle() {
      const out = join(__dirname, 'dist/client');
      try { mkdirSync(out, { recursive: true }); } catch {}
      // /blog/index and /docs/index are the section landing pages — already
      // covered by /blog and /docs above. Filter them out so the sitemap
      // doesn't double-list.
      const isIndex = (r: string) => r.endsWith('/index');
      const blogRoutes = contentRoutes('blog').filter((r) => !isIndex(r));
      const docsRoutes = contentRoutes('docs').filter((r) => !isIndex(r));
      const all = ['/', '/blog', '/docs', ...blogRoutes, ...docsRoutes];

      // sitemap.xml
      const today = new Date().toISOString().slice(0, 10);
      const urls = all
        .map((p) => {
          const loc = `${SITE_URL}${p === '/' ? '/' : p}`;
          const priority = p === '/' ? '1.0' : p.startsWith('/blog/') ? '0.8' : '0.7';
          return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
        })
        .join('\n');
      writeFileSync(
        join(out, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );

      // robots.txt
      writeFileSync(
        join(out, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      );

      // rss.xml — published blog posts only, newest first
      const blogRoot = join(__dirname, 'src/content/blog');
      const items = blogRoutes
        .map((route) => {
          const slug = route.replace('/blog/', '');
          const fm = readFrontmatter(join(blogRoot, `${slug}.md`));
          if (!fm.title) return null;
          const link = `${SITE_URL}/blog/${slug}`;
          const date = fm.date ? new Date(fm.date).toUTCString() : new Date().toUTCString();
          return {
            slug,
            title: fm.title,
            description: fm.description ?? '',
            link,
            date,
            sortKey: fm.date ?? '',
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

      const rssItems = items
        .map(
          (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <description>${escapeXml(i.description)}</description>
      <pubDate>${i.date}</pubDate>
    </item>`,
        )
        .join('\n');
      writeFileSync(
        join(out, 'rss.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Gramota Blog</title>\n    <link>${SITE_URL}/blog</link>\n    <description>Notes from building Gramota — protocol deep dives, end-to-end verification reports, and release notes.</description>\n    <language>en</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${rssItems}\n  </channel>\n</rss>\n`,
      );

      console.log(`✓ wrote sitemap.xml (${all.length} urls), robots.txt, rss.xml (${items.length} items)`);
    },
  };
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;',
  );
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
    seoArtifacts(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
