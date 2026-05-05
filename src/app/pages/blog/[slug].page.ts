import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { injectContent, MarkdownComponent } from '@analogjs/content';

import PostAttributes from '../../post-attributes';

@Component({
  selector: 'app-blog-post',
  imports: [AsyncPipe, MarkdownComponent],
  template: `
    @if (post$ | async; as post) {
      <article class="prose">
        <header>
          <time>{{ formatDate(post.attributes.date) }}</time>
          <h1>{{ post.attributes.title }}</h1>
          @if (post.attributes.author) {
            <p class="byline">by {{ post.attributes.author }}</p>
          }
        </header>
        <analog-markdown [content]="post.content" />
      </article>
    }
  `,
  styles: `
    article { max-width: 48rem; margin: 0 auto; padding: 3rem 1.5rem; }
    header { margin-bottom: 2rem; }
    time { display: block; color: rgb(var(--muted)); font-size: 0.875rem; margin-bottom: 0.5rem; }
    h1 { font-size: 2.25rem; letter-spacing: -0.02em; font-weight: 700; margin: 0 0 0.5rem; }
    .byline { color: rgb(var(--muted)); margin: 0; font-size: 0.95rem; }
  `,
})
export default class BlogPost {
  readonly post$ = injectContent<PostAttributes>({
    param: 'slug',
    subdirectory: 'src/content/blog',
  });
  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
