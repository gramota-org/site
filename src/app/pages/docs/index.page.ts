import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';

import DocAttributes from '../../doc-attributes';

/**
 * Docs index — `/docs`. Lists all pages grouped by `section`.
 *
 * Pages live in `src/content/docs/**`. Sections come from frontmatter and
 * are rendered in the order they're discovered (ordering becomes
 * deterministic when we add a `sectionOrder` map; for now we're
 * alphabetic by section name, then by `order` within each section).
 */
@Component({
  selector: 'app-docs-index',
  imports: [RouterLink],
  template: `
    <article>
      <h1>Documentation</h1>
      <p class="lede">
        Quick links to the guides, concepts, and API reference. The fastest
        path to a working integration is the
        <a routerLink="/docs/getting-started">5-minute verifier</a>.
      </p>

      @for (section of sections(); track section.name) {
        <section class="section">
          <h2>{{ section.name }}</h2>
          <ul>
            @for (page of section.pages; track page.attributes.slug) {
              <li>
                <a [routerLink]="['/docs', page.attributes.slug]">
                  <span class="title">{{ page.attributes.title }}</span>
                  <span class="desc">{{ page.attributes.description }}</span>
                </a>
              </li>
            }
          </ul>
        </section>
      }
    </article>
  `,
  styles: `
    article {
      max-width: 48rem;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    h1 {
      font-size: 2.25rem;
      letter-spacing: -0.02em;
      font-weight: 700;
      margin: 0 0 0.75rem;
    }
    .lede {
      color: rgb(var(--muted));
      margin: 0 0 3rem;
      font-size: 1.0625rem;
    }
    /* Inline link inside the lede — keep it inline (not a card). */
    .lede a {
      color: rgb(var(--accent));
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }
    .lede a:hover { text-decoration-thickness: 2px; }

    .section { margin-bottom: 3rem; }
    h2 {
      font-size: 0.875rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgb(var(--muted));
      font-weight: 600;
      margin: 0 0 1rem;
    }
    .section ul { list-style: none; padding: 0; margin: 0; }
    .section li { margin-bottom: 0.5rem; }
    /* Card-style links — scoped to the section list, NOT bare `a`,
       so inline anchors elsewhere in the component (e.g. inside .lede)
       stay inline and don't break across lines. */
    .section a {
      display: block;
      padding: 0.875rem 1rem;
      border: 1px solid rgb(var(--border));
      border-radius: 0.5rem;
      text-decoration: none;
      color: rgb(var(--fg));
      transition: border-color 80ms, transform 80ms;
    }
    .section a:hover {
      border-color: rgb(var(--accent));
      transform: translateY(-1px);
    }
    .title { display: block; font-weight: 600; margin-bottom: 0.125rem; }
    .desc { display: block; color: rgb(var(--muted)); font-size: 0.9rem; }
  `,
})
export default class DocsIndex {
  private readonly pages = injectContentFiles<DocAttributes>((file) =>
    file.filename.startsWith('/src/content/docs/'),
  );

  readonly sections = computed(() => {
    const groups = new Map<string, typeof this.pages>();
    for (const page of this.pages) {
      const name = page.attributes.section ?? 'Other';
      const list = groups.get(name) ?? [];
      list.push(page);
      groups.set(name, list);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, pages]) => ({
        name,
        pages: pages.sort(
          (a, b) =>
            (a.attributes.order ?? 99) - (b.attributes.order ?? 99),
        ),
      }));
  });
}
