# gramota-site

> **Live:** [gramota-org.github.io/site](https://gramota-org.github.io/site/)

Marketing site + documentation for [Gramota](https://github.com/gramota-org/gramota) —
the TypeScript SDK for the EU Digital Identity Wallet (EUDIW).

Built with [Analog.js](https://analogjs.org) (Angular 21 + Vite + SSG),
[Tailwind v4](https://tailwindcss.com), and [Shiki](https://shiki.matsu.io)
syntax highlighting. Auto-deploys to GitHub Pages on every push to `main`.

## Layout

```
src/
├── app/
│   ├── pages/                      file-based routes (Analog.js)
│   │   ├── (home).page.ts          /
│   │   ├── docs/index.page.ts      /docs   — table of contents
│   │   └── blog/index.page.ts      /blog   — post list
│   ├── components/                 header, footer
│   ├── doc-attributes.ts           frontmatter type for /content/docs/**
│   ├── post-attributes.ts          frontmatter type for /content/blog/**
│   ├── app.ts                      shell
│   └── app.config.ts               providers — router, content, Shiki
├── content/                        markdown — Analog auto-routes each .md
│   ├── docs/
│   │   ├── getting-started.md
│   │   ├── concepts/{sd-jwt-vc,oid4vci,oid4vp,dcql,dpop}.md
│   │   ├── guides/{verifier,issuer,batch-issuance}.md
│   │   ├── recipes/{verifying-eu-pid,one-time-use-credentials}.md
│   │   └── api/<pkg>.md            (generated; see below)
│   └── blog/
│       └── 2026-05-end-to-end-eu-wallet.md
└── styles.css                      Tailwind v4 entry + global typography

scripts/
└── generate-api-docs.mjs           TypeDoc → Markdown for every @gramota/*
                                    package. Output: src/content/docs/api/<pkg>.md
public/
├── logo.svg                        gradient-G brand mark
└── favicon.png                     same, rasterised at 64×64
```

## Run

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Build

```bash
pnpm build        # gen:api + vite build → dist/analog/public/
pnpm preview      # serves the production build via Node SSR fallback
pnpm gen:api      # regenerate the API reference (TypeDoc)
```

`vite.config.ts` walks `src/content/{docs,blog}/**` to populate
`prerender.routes`, so adding a new `.md` file picks up automatically
on the next build.

## Deploy

**Default — GitHub Pages.** `.github/workflows/deploy.yml` builds on
every push to `main` and deploys via Pages. The workflow sets
`BASE_HREF=/site/` so asset URLs and the Angular `<base href>` line
up under the project URL. Drop the env when you point a custom domain
at the Pages site.

**Alternate — Cloudflare Pages.** `.github/workflows/deploy-cloudflare.yml`
is disabled by default. To switch:
1. Create a Pages project in the Cloudflare dashboard.
2. Add `CLOUDFLARE_API_TOKEN` (Pages:Edit) and `CLOUDFLARE_ACCOUNT_ID`
   repo secrets.
3. Change the workflow trigger from `workflow_dispatch` to `push`.
4. Disable / delete `deploy.yml`.

Build output is fully static (`dist/analog/public/`); the Node server
in `dist/analog/server/` is only needed for routes that opt into SSR
(none yet).

## Content workflow

1. Write a Markdown file under `src/content/docs/` (or `blog/`) with
   YAML frontmatter — `title`, `slug`, `description`, `section`, `order`
   for docs; `title`, `slug`, `description`, `date` for posts.
2. Start the body with `# {title}` so the rendered page has a visible
   h1 (Analog auto-routes content but doesn't synthesize a heading
   from the frontmatter).
3. `pnpm dev` to preview, `pnpm build` to ship. Push to `main` →
   GitHub Pages picks it up automatically.

## API reference

`pnpm gen:api` introspects every `@gramota/*` package's published
`.d.ts` and emits one Markdown page per package at
`src/content/docs/api/<pkg>.md`. The generated files are committed —
that way builds don't need all 12 OSS packages installed at deploy
time, and PR diffs surface API changes. Refresh after a release:

```bash
pnpm install        # picks up the new @gramota/* version
pnpm gen:api
git add src/content/docs/api && git commit -m "docs: refresh API reference"
```

Dependabot bumps the `@gramota/*` lockfile entries automatically;
the API ref refresh becomes a follow-up commit on the same branch.
