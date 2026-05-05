/**
 * Frontmatter shape for `src/content/docs/**`.
 *
 * `slug` is the route under `/docs/`. We compute it from the filename
 * by default but allow the frontmatter to override (so we can rename
 * a file without breaking existing links).
 */
export default interface DocAttributes {
  /** Page title — shown in <h1>, in the sidebar, and as the OG title. */
  title: string;
  /** URL slug under /docs/. e.g. `getting-started`, `concepts/sd-jwt-vc`. */
  slug: string;
  /** Short description — used as the OG description and the sidebar caption. */
  description: string;
  /** Section grouping for the sidebar. e.g. "Getting started", "Concepts". */
  section: string;
  /** Sort order within a section. Lower = higher in the list. */
  order: number;
}
