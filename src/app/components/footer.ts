import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer>
      <div class="container">
        <div class="brand">
          <span class="logo">G</span>
          <span>Gramota</span>
        </div>
        <p class="tagline">
          The TypeScript SDK for the EU Digital Identity Wallet.
        </p>

        <div class="cols">
          <div>
            <h3>Product</h3>
            <ul>
              <li><a routerLink="/docs/getting-started">Getting started</a></li>
              <li><a routerLink="/docs">Documentation</a></li>
              <li><a routerLink="/blog">Blog</a></li>
              <li>
                <a href="https://www.npmjs.com/org/gramota" target="_blank" rel="noreferrer"
                  >npm packages</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h3>Source</h3>
            <ul>
              <li>
                <a
                  href="https://github.com/gramota-org/gramota"
                  target="_blank"
                  rel="noreferrer"
                  >GitHub</a
                >
              </li>
              <li>
                <a
                  href="https://github.com/gramota-org/gramota/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  >Apache 2.0</a
                >
              </li>
            </ul>
          </div>
        </div>

        <p class="copyright">
          Built in Sofia. Sold to the world in English.
        </p>
      </div>
    </footer>
  `,
  styles: `
    footer {
      border-top: 1px solid rgb(var(--border));
      padding: 3rem 0 4rem;
      margin-top: 4rem;
    }
    .container {
      max-width: 64rem;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin-bottom: 0.5rem;
    }
    .logo {
      display: inline-grid;
      place-items: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      color: white;
      font-weight: 800;
      font-size: 0.95rem;
    }
    .tagline {
      color: rgb(var(--muted));
      margin: 0 0 2rem;
      font-size: 0.95rem;
    }
    .cols {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    h3 {
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgb(var(--muted));
      font-weight: 600;
      margin: 0 0 0.75rem;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    a {
      color: rgb(var(--fg));
      text-decoration: none;
      font-size: 0.9rem;
    }
    a:hover { color: rgb(var(--accent)); }
    .copyright {
      color: rgb(var(--muted));
      font-size: 0.85rem;
      font-style: italic;
      margin: 2rem 0 0;
    }
  `,
})
export class FooterComponent {}
