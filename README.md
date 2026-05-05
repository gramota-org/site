# gramota-site

Marketing site + documentation for [Gramota](https://github.com/gramota-org/gramota) —
the TypeScript SDK for the EU Digital Identity Wallet (EUDIW).

Built with [Analog.js](https://analogjs.org) (Angular + Vite + SSG),
[Tailwind v4](https://tailwindcss.com), and [Shiki](https://shiki.matsu.io)
syntax highlighting. Deploys to Cloudflare Pages.

## Layout

```
src/
├── app/
│   ├── pages/                      file-based routes (Analog.js)
│   │   ├── (home).page.ts          /
│   │   ├── docs/
│   │   │   ├── index.page.ts       /docs
│   │   │   └── [...slug].page.ts   /docs/<slug>  (markdown renderer)
│   │   └── blog/                   (added when first post lands)
│   ├── components/                 site chrome — header, footer, hero, etc.
│   ├── doc-attributes.ts           frontmatter type for /content/docs/**
│   ├── app.ts                      shell
│   └── app.config.ts               providers — router, content, Shiki
├── content/
│   └── docs/                       markdown source for the docs site
│       ├── getting-started.md
│       └── concepts/
│           └── sd-jwt-vc.md
└── styles.css                      Tailwind v4 entry
```

## Run

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Build

```bash
pnpm build        # SSG → dist/analog/public
pnpm preview      # serves the production build via Node SSR fallback
```

`vite.config.ts` lists the routes to pre-render. As content grows, this
will switch to a globbed generator.

## Deploy

Two options:

**1. GitHub Pages** (default, zero secrets). `.github/workflows/deploy.yml`
builds on every push to `main` and deploys to GitHub Pages. Enable
Pages in repo settings → Pages → Source: "GitHub Actions". The site
goes live at `https://<owner>.github.io/<repo>/` (the workflow sets
`BASE_HREF=/site/` so asset URLs and the Angular base href line up).
When you point a custom domain at it, drop `BASE_HREF` from the
workflow.

**2. Cloudflare Pages** (better edge perf, custom-domain-first).
`.github/workflows/deploy-cloudflare.yml` is disabled by default;
to switch:
1. Create a Pages project in the Cloudflare dashboard.
2. Add `CLOUDFLARE_API_TOKEN` (Pages:Edit) and `CLOUDFLARE_ACCOUNT_ID`
   as repo secrets.
3. Change the workflow trigger from `workflow_dispatch` to `push`.
4. Disable / delete `deploy.yml`.

Build command for either path: `pnpm build` (which runs
`pnpm gen:api && vite build`). Output: `dist/analog/public/`. The
site is statically pre-rendered — the Node server in
`dist/analog/server/` is only needed for routes that opt into SSR
(none yet).

## Content workflow

1. Write a Markdown file under `src/content/docs/` with YAML frontmatter.
2. Add the route to the `prerender.routes` list in `vite.config.ts` (or
   wait for the globbed generator).
3. `pnpm dev` to preview, `pnpm build` to ship.

API reference pages are generated from JSDoc on `@gramota/*` packages —
see `scripts/generate-api-docs.mjs` (planned).
