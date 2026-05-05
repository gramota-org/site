import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { injectContent, MarkdownComponent } from '@analogjs/content';

import DocAttributes from '../../doc-attributes';

/**
 * Catch-all docs route — `/docs/<anything/here>`. Resolves the URL
 * suffix to a markdown file under `src/content/docs/<slug>.md` and
 * renders it through Analog's `<analog-markdown>` (which runs Shiki
 * for code blocks and the GFM heading-id plugin for anchors).
 */
@Component({
  selector: 'app-docs-page',
  imports: [AsyncPipe, MarkdownComponent],
  template: `
    @if (post$ | async; as post) {
      <article class="prose">
        <header>
          <h1>{{ post.attributes.title }}</h1>
          @if (post.attributes.description) {
            <p class="lede">{{ post.attributes.description }}</p>
          }
        </header>
        <analog-markdown [content]="post.content" />
      </article>
    }
  `,
  styles: `
    article {
      max-width: 48rem;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    header { margin-bottom: 2rem; }
    h1 {
      font-size: 2.25rem;
      letter-spacing: -0.02em;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }
    .lede {
      color: rgb(var(--muted));
      font-size: 1.0625rem;
      margin: 0;
    }
  `,
})
export default class DocsPage {
  readonly post$ = injectContent<DocAttributes>('slug');
}
