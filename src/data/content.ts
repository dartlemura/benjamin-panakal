/**
 * THE SINGLE SOURCE OF TRUTH for everything the site says about Benjamin.
 *
 * Rules this site follows:
 *  - Only facts that are verified go in here. Nothing is invented or inferred.
 *  - A section with no entries is NOT published: no page, no nav link,
 *    no sitemap entry, no structured data. It appears automatically
 *    (page + nav + sitemap + schema) the moment you add entries below.
 *  - Run `npm run status` to see which pages are live.
 */

export type Entry = {
  title: string;
  org?: string;      // company / school / awarding body
  period?: string;   // e.g. "2019 – 2023"
  summary?: string;  // one or two factual sentences
  url?: string;      // optional link to a real source
};

export type Article = {
  title: string;
  url: string;          // where it was actually published
  publisher?: string;
  date?: string;        // ISO date, e.g. "2025-03-14"
  summary?: string;
};

export type Photo = {
  src: string;          // e.g. "/images/gallery/name.webp" (file in /public)
  alt: string;          // describe what is actually in the photo
  width: number;        // real pixel dimensions (prevents layout shift)
  height: number;
  caption?: string;
};

export const content = {
  /** Update when you change anything below. Drives sitemap <lastmod> and dateModified. */
  lastReviewed: '2026-11-12',

  profile: {
    /** Optional. One factual sentence shown under the name and used in schema `description`. */
    description: '' as string,
    /** Optional. Only set if it is accurate, e.g. "Photographer". Used as schema `jobTitle`. */
    jobTitle: '' as string,
    /** Optional portrait. Used on the site, as the social-share image and in schema `image`. */
    photo: null as null | { src: string; alt: string; width: number; height: number },
  },

  contact: {
    /** Optional. Add a public email only if you want it published. */
    email: '' as string,
  },

  /** Paragraphs of prose. */
  biography: [] as string[],
  about: [] as string[],

  /** Timeline-style sections. */
  background: [] as Entry[],
  education: [] as Entry[],
  achievements: [] as Entry[],

  /** Card-style section. */
  projects: [] as Entry[],

  /** Things published elsewhere, each with a real link. */
  articles: [] as Article[],

  /** Photographs. */
  gallery: [] as Photo[],
};

export type Content = typeof content;
