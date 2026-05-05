import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="container">
        <a routerLink="/" class="brand" aria-label="Gramota home">
          <span class="logo">G</span>
          <span class="word">Gramota</span>
        </a>

        <nav>
          <a
            routerLink="/docs"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
            >Docs</a
          >
          <a
            href="https://www.npmjs.com/org/gramota"
            target="_blank"
            rel="noreferrer"
            >npm</a
          >
          <a
            href="https://github.com/gramota-org/gramota"
            target="_blank"
            rel="noreferrer"
            class="gh"
            >GitHub →</a
          >
        </nav>
      </div>
    </header>
  `,
  styles: `
    header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      background: rgba(var(--bg), 0.85);
      border-bottom: 1px solid rgb(var(--border));
    }
    .container {
      max-width: 64rem;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: rgb(var(--fg));
      font-weight: 700;
      letter-spacing: -0.01em;
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
    nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      font-size: 0.9rem;
    }
    nav a {
      text-decoration: none;
      color: rgb(var(--muted));
      transition: color 80ms;
    }
    nav a:hover, nav a.active { color: rgb(var(--fg)); }
    nav a.gh {
      color: rgb(var(--fg));
      font-weight: 600;
    }
  `,
})
export class HeaderComponent {}
