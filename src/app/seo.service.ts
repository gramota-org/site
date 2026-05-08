import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { filter } from 'rxjs/operators';

/**
 * Per-page SEO meta updater.
 *
 * Without this, every blog post and docs page inherits the global meta
 * description from index.html — duplicate-content territory and bad
 * for click-through diversity in search results.
 *
 * On every NavigationEnd:
 *   1. Look up the current URL against the markdown content files
 *      via injectContentFiles().
 *   2. If found, set Title + meta description + Open Graph + Twitter
 *      tags + canonical to match the frontmatter.
 *   3. Always set canonical to the absolute URL of the current page.
 *
 * Frontmatter shape used:
 *   title: string         (required — used for <title> and og:title)
 *   description: string   (used for description meta + og:description)
 *   image?: string        (relative path or absolute URL — falls back
 *                          to /og-image.png)
 *   author?: string       (used for article:author)
 *   date?: string         (used for article:published_time)
 */
interface ContentMeta {
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  date?: string;
  slug?: string;
}

const SITE_TITLE = 'Gramota';
const DEFAULT_DESCRIPTION =
  'Verify and issue EU Digital Identity Wallet credentials in 20 lines of TypeScript. Open source, MIT licensed.';
const DEFAULT_IMAGE = 'og-image.png';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly contentFiles = injectContentFiles<ContentMeta>();

  private readonly siteOrigin = this.resolveSiteOrigin();

  start(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.update(e.urlAfterRedirects));
  }

  private update(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    const file = this.findContentFor(path);
    const fm = file?.attributes;

    // Frontmatter title stands on its own (og:site_name already brands it).
    // Only add the brand for the home + section landing pages.
    const pageTitle = fm?.title
      ? fm.title
      : `${SITE_TITLE} — TypeScript SDK for the EU Digital Identity Wallet`;
    const description = fm?.description ?? DEFAULT_DESCRIPTION;
    const image = this.absoluteUrl(fm?.image ?? DEFAULT_IMAGE);
    const canonical = `${this.siteOrigin}${this.normalizePath(path)}`;
    const ogType = path.startsWith('/blog/') && path !== '/blog/' && path !== '/blog' ? 'article' : 'website';

    this.title.setTitle(pageTitle);

    this.upsert('name', 'description', description);
    this.upsert('property', 'og:title', pageTitle);
    this.upsert('property', 'og:description', description);
    this.upsert('property', 'og:url', canonical);
    this.upsert('property', 'og:image', image);
    this.upsert('property', 'og:type', ogType);
    this.upsert('name', 'twitter:title', pageTitle);
    this.upsert('name', 'twitter:description', description);
    this.upsert('name', 'twitter:image', image);

    if (ogType === 'article') {
      if (fm?.author) this.upsert('property', 'article:author', fm.author);
      if (fm?.date) this.upsert('property', 'article:published_time', fm.date);
    } else {
      this.meta.removeTag('property="article:author"');
      this.meta.removeTag('property="article:published_time"');
    }

    this.setCanonical(canonical);
  }

  private findContentFor(path: string) {
    const slug = path.replace(/^\//, '').replace(/\/$/, '');
    if (!slug) return undefined;
    // Files come in as { filename: '/src/content/blog/foo.md', slug: 'foo', attributes: {...} }
    // We want to match e.g. /blog/foo → look for blog/foo
    return this.contentFiles.find((f) => {
      const filename = (f.filename ?? '').replace(/^\//, '');
      // strip src/content/ prefix and .md suffix
      const norm = filename
        .replace(/^src\/content\//, '')
        .replace(/\.md$/, '');
      return norm === slug;
    });
  }

  private upsert(key: 'name' | 'property', value: string, content: string): void {
    const selector = `${key}="${value}"`;
    const existing = this.meta.getTag(selector);
    if (existing) {
      this.meta.updateTag({ [key]: value, content }, selector);
    } else {
      this.meta.addTag({ [key]: value, content });
    }
  }

  private setCanonical(href: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  private resolveSiteOrigin(): string {
    // Prefer the deployed origin when available (browser); fall back to a
    // sensible default for SSR. The site can also be deployed at a custom
    // domain — when that lands, change the fallback string.
    if (typeof window !== 'undefined' && window.location?.origin) {
      const base = (this.doc.querySelector('base')?.getAttribute('href') ?? '/').replace(/\/$/, '');
      return `${window.location.origin}${base}`;
    }
    return 'https://gramota-org.github.io/site';
  }

  private normalizePath(path: string): string {
    // Always include a trailing slash on the home, no trailing slash elsewhere.
    if (path === '' || path === '/') return '/';
    return path.replace(/\/$/, '');
  }

  private absoluteUrl(maybeRelative: string): string {
    if (/^https?:\/\//.test(maybeRelative)) return maybeRelative;
    return `${this.siteOrigin}/${maybeRelative.replace(/^\//, '')}`;
  }
}
