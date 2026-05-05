import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';

import PostAttributes from '../../post-attributes';

/**
 * Blog index — `/blog`. Lists posts from `src/content/blog/**`,
 * newest first.
 */
@Component({
  selector: 'app-blog-index',
  imports: [RouterLink],
  template: `
    <article>
      <h1>Blog</h1>
      <p class="lede">
        Notes from building Gramota — protocol deep dives, end-to-end
        verification reports, and the occasional release announcement.
      </p>

      <ul class="posts">
        @for (post of posts(); track post.attributes.slug) {
          <li>
            <a [routerLink]="['/blog', post.attributes.slug]">
              <time>{{ formatDate(post.attributes.date) }}</time>
              <span class="title">{{ post.attributes.title }}</span>
              <span class="desc">{{ post.attributes.description }}</span>
            </a>
          </li>
        }
      </ul>
    </article>
  `,
  styles: `
    article {
      max-width: 48rem;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    h1 { font-size: 2.25rem; letter-spacing: -0.02em; font-weight: 700; margin: 0 0 0.75rem; }
    .lede { color: rgb(var(--muted)); margin: 0 0 3rem; font-size: 1.0625rem; }

    .posts { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .posts a {
      display: grid;
      grid-template-columns: 8rem 1fr;
      align-items: baseline;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid rgb(var(--border));
      border-radius: 0.5rem;
      text-decoration: none;
      color: rgb(var(--fg));
      transition: border-color 80ms, transform 80ms;
    }
    .posts a:hover { border-color: rgb(var(--accent)); transform: translateY(-1px); }
    time { color: rgb(var(--muted)); font-size: 0.85rem; font-variant-numeric: tabular-nums; }
    .title { font-weight: 600; grid-column: 2; }
    .desc { color: rgb(var(--muted)); font-size: 0.9rem; grid-column: 2; }

    @media (max-width: 40rem) {
      .posts a { grid-template-columns: 1fr; }
      .title, .desc { grid-column: 1; }
    }
  `,
})
export default class BlogIndex {
  private readonly all = injectContentFiles<PostAttributes>((file) =>
    file.filename.startsWith('/src/content/blog/'),
  );
  readonly posts = computed(() =>
    [...this.all].sort((a, b) =>
      b.attributes.date.localeCompare(a.attributes.date),
    ),
  );

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
