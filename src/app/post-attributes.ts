/**
 * Frontmatter shape for `src/content/blog/**`.
 */
export default interface PostAttributes {
  /** Post title — h1 + OG title. */
  title: string;
  /** URL slug under /blog/. */
  slug: string;
  /** Short description — sidebar caption + OG description. */
  description: string;
  /** ISO 8601 date string — used for sorting + display. */
  date: string;
  /** Optional author byline. */
  author?: string;
}
