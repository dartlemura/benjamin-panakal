import { content as realContent } from './content';
import { preview } from './preview';
import { resolveSite } from '../../site.config.mjs';

export const PREVIEW = process.env.PREVIEW_DESIGN === '1';

// Production origin + base path, detected automatically (see /site.config.mjs).
const resolved = resolveSite();
export const ORIGIN = resolved.origin;          // e.g. https://name.github.io
export const BASE = resolved.base;              // '' or '/repo-name'
export const SITE_URL = `${ORIGIN}${BASE}`;     // site root, no trailing slash
export const IS_PLACEHOLDER_DOMAIN = resolved.source === 'placeholder';

export const data = PREVIEW ? preview : realContent;

/** Verified facts supplied by the site owner. Do not add anything here that is not verified. */
export const person = {
  name: 'Benjamin Anthony Panakal',
  givenName: 'Benjamin',
  additionalName: 'Anthony',
  familyName: 'Panakal',
  locality: 'Visakhapatnam',
  country: 'India',
  countryCode: 'IN',
  /** Genuine profiles only. Each must be a profile that belongs to Benjamin. */
  profiles: [
    { label: 'Instagram', handle: '@being_.benji', url: 'https://www.instagram.com/being_.benji/' },
  ],
};

export const locationLabel = `${person.locality}, ${person.country}`;

export type SectionKind = 'prose' | 'timeline' | 'cards' | 'articles' | 'gallery';

export type Section = {
  key: 'biography' | 'about' | 'background' | 'education' | 'achievements' | 'projects' | 'articles' | 'gallery';
  slug: string;
  label: string;
  kind: SectionKind;
  /** Generic, claim-free description of what the page is for. */
  blurb: string;
};

export const sections: Section[] = [
  { key: 'biography',    slug: 'biography',    label: 'Biography',     kind: 'prose',    blurb: 'The full story, in order.' },
  { key: 'about',        slug: 'about',        label: 'About',         kind: 'prose',    blurb: 'A short, direct introduction.' },
  { key: 'background',   slug: 'background',   label: 'Background',    kind: 'timeline', blurb: 'Experience and the path so far.' },
  { key: 'education',    slug: 'education',    label: 'Education',     kind: 'timeline', blurb: 'Schools, courses and qualifications.' },
  { key: 'achievements', slug: 'achievements', label: 'Achievements',  kind: 'timeline', blurb: 'Recognition and milestones.' },
  { key: 'projects',     slug: 'projects',     label: 'Projects',      kind: 'cards',    blurb: 'Things made and shipped.' },
  { key: 'articles',     slug: 'articles',     label: 'Articles',      kind: 'articles', blurb: 'Writing and publications, with sources.' },
  { key: 'gallery',      slug: 'gallery',      label: 'Gallery',       kind: 'gallery',  blurb: 'Photographs.' },
];

export function isLive(key: Section['key']): boolean {
  const v = data[key] as unknown[];
  return Array.isArray(v) && v.length > 0;
}

export const liveSections = sections.filter((s) => isLive(s.key));

/** Absolute URL, for canonicals, sitemap, Open Graph and structured data. */
export const url = (path = '/') => `${SITE_URL}${path}`;
/** Root-relative link that respects the base path, for hrefs and src attributes. */
export const link = (path = '/') => `${BASE}${path}`;

/** Trim text to a meta-description length at a word boundary. */
export function clip(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–—-]\s*$/, '') + '…';
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
