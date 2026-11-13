import type { APIRoute } from 'astro';
import { PREVIEW, SITE_URL, data, liveSections } from '../data/site';

/** Lists only pages that exist and are indexable. Sections with no content are never listed. */
export const GET: APIRoute = () => {
  const paths = ['/', ...liveSections.map((s) => `/${s.slug}/`), '/contact/'];
  const urls = PREVIEW
    ? []
    : paths.map(
        (p) =>
          `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${data.lastReviewed}</lastmod>\n  </url>`,
      );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
