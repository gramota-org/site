#!/usr/bin/env node
/**
 * generate-api-docs — TypeDoc → Markdown for every @gramota/* package.
 *
 * Reads the published .d.ts files in node_modules and emits one
 * Markdown file per package at src/content/docs/api/<pkg>.md.
 *
 * Run via `pnpm gen:api` (which the build script chains in front of vite).
 *
 * The output is overwriting — never hand-edit the generated files; edit
 * the JSDoc on the OSS source instead, ship a release, then re-run.
 */
import { Application } from 'typedoc';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  existsSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/**
 * Packages to document, in the order they appear in the API section.
 * `order` controls the position within the section sidebar.
 *
 * High-level (start here) come first; protocol/transport next;
 * cryptography + credentials; trust/revocation last.
 */
const PACKAGES = [
  // Top-level facade
  { name: 'sdk', order: 0, blurb: 'Top-level Stripe-shaped facade. One config, one import, lazy-instantiated clients.' },
  // High-level
  { name: 'verifier', order: 1, blurb: 'Relying-party verifier — 12 named security checks, IETF SD-JWT-VC + KB-JWT + OID4VP-compliant.' },
  { name: 'issuer', order: 2, blurb: 'Issuer for SD-JWT-VC, with single + batch issuance for one-time-use credential pools.' },
  { name: 'holder', order: 3, blurb: 'Headless wallet — credential store + import/present/refill operations.' },
  { name: 'qr', order: 4, blurb: 'QR-code rendering for EUDIW deep links — Strategy-pluggable renderer, lazy / memoised result class.' },
  // Protocol & transport
  { name: 'oid4vp', order: 5, blurb: 'OID4VP wire format — request, response, signed JAR (RFC 9101), x509_san_dns cert helpers.' },
  { name: 'oid4vci', order: 6, blurb: 'OID4VCI client + server — Draft 13/15 normalized, PAR, DPoP both sides.' },
  { name: 'presentation-exchange', order: 7, blurb: 'DIF Presentation Exchange v2 — legacy OID4VP 1.0 query format.' },
  { name: 'dcql', order: 8, blurb: 'Digital Credentials Query Language — OID4VP 2.0 query format.' },
  // Crypto / credentials
  { name: 'jose', order: 9, blurb: 'JWS sign + verify, x5c chain validation, pluggable Signer Strategy.' },
  { name: 'sd-jwt', order: 10, blurb: 'SD-JWT-VC parser, hash binding, KB-JWT issuance / verification.' },
  { name: 'credential-format', order: 11, blurb: 'Pluggable format-handler registry (SD-JWT-VC ships; mDoc plugs in).' },
  // Trust / revocation
  { name: 'trust', order: 12, blurb: 'TrustResolver Strategy — Static, JwksUrl, SdJwtVcIssuer (.well-known/jwt-vc-issuer).' },
  { name: 'status-list', order: 13, blurb: 'IETF Token Status List + StatusResolver Strategy for revocation / suspension.' },
  // Foundation
  { name: 'core', order: 14, blurb: 'Foundation primitives — Fetcher transport interface, GramotaError base class. Imported by every other @gramota/* package.' },
];

const OUT_DIR = join(ROOT, 'src/content/docs/api');
const TYPEDOC_TMP = join(ROOT, '.tmp-typedoc');

async function generatePackage({ name, order, blurb }) {
  const entry = join(ROOT, `node_modules/@gramota/${name}/dist/index.d.ts`);
  if (!existsSync(entry)) {
    console.warn(`  ⚠ skipping ${name}: ${entry} missing`);
    return;
  }
  const tmpOut = join(TYPEDOC_TMP, name);
  rmSync(tmpOut, { recursive: true, force: true });

  const app = await Application.bootstrapWithPlugins(
    {
      entryPoints: [entry],
      out: tmpOut,
      plugin: ['typedoc-plugin-markdown'],
      readme: 'none',
      hideGenerator: true,
      githubPages: false,
      // typedoc-plugin-markdown options
      hidePageHeader: true,
      hideBreadcrumbs: true,
      hidePageTitle: true,
      useCodeBlocks: true,
      expandObjects: true,
      expandParameters: true,
      // Keep everything in one file per package — easier to read,
      // simpler for the docs site to host.
      outputFileStrategy: 'modules',
      mergeReadme: false,
      flattenOutputFiles: true,
      // We're feeding it .d.ts; skip the TS-source-only checks.
      skipErrorChecking: true,
      sort: ['source-order'],
      // No TSConfigReader: the site's tsconfig only includes src/**, but
      // entry points live in node_modules/@gramota/**. Letting TypeDoc
      // run with its defaults sidesteps the include-mismatch error.
      tsconfig: undefined,
    },
    [],
  );

  const project = await app.convert();
  if (!project) {
    console.warn(`  ⚠ ${name}: typedoc returned no project`);
    return;
  }
  await app.generateOutputs(project);

  // Combine the generated files into one Markdown blob with frontmatter.
  // typedoc-plugin-markdown produces a tree like <pkg>/<symbol>.md;
  // we glue them into one for the docs site.
  const merged = stitchMarkdown(tmpOut, name);
  const frontmatter = [
    '---',
    `title: "@gramota/${name}"`,
    `slug: api/${name}`,
    `description: ${JSON.stringify(blurb)}`,
    'section: API reference',
    `order: ${order}`,
    '---',
  ].join('\n');
  const intro = [
    // h1 in the body — Analog auto-routes content/**/*.md but doesn't
    // render the frontmatter title as h1; the markdown body has to
    // include it itself.
    `# @gramota/${name}`,
    '',
    `> ${blurb}`,
    '',
    `Install: \`pnpm add @gramota/${name}\``,
    '',
    `Source: [github.com/gramota-org/gramota/tree/main/packages/${name}](https://github.com/gramota-org/gramota/tree/main/packages/${name})`,
    '',
  ].join('\n');

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, `${name}.md`),
    `${frontmatter}\n\n${intro}\n${merged}\n`,
    'utf8',
  );
  console.log(`  ✓ ${name}`);
}

/**
 * Walk the typedoc-plugin-markdown output and concatenate every .md file
 * into one document, with the package's index.md first if present.
 */
function stitchMarkdown(root, pkgName) {
  const sections = [];

  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (entry.endsWith('.md')) {
        const body = readFileSync(full, 'utf8').trim();
        if (body) sections.push(body);
      }
    }
  }
  walk(root);

  // Drop typedoc's internal cross-reference links — they point at file
  // paths in the temp dir that don't survive into the published site.
  const stitched = sections
    .join('\n\n---\n\n')
    .replace(/\]\([^)]*\.md(#[^)]*)?\)/g, ']$1')
    .replace(/\]\(\)/g, ']');

  return stitched;
}

console.log(`Generating API docs for ${PACKAGES.length} packages...`);
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TYPEDOC_TMP, { recursive: true });

for (const pkg of PACKAGES) {
  await generatePackage(pkg);
}

rmSync(TYPEDOC_TMP, { recursive: true, force: true });
console.log('Done.');
