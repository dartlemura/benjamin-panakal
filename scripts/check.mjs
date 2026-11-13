// Post-build SEO validation of dist/. Fails the build on real problems.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSite } from '../site.config.mjs';

// Cross-platform: fileURLToPath handles Windows drive letters (no "/D:/..." or "D:\\D:\\..." paths).
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
if (!existsSync(dist)) { console.error(`ERROR dist folder not found at ${dist}. Run the build first.`); process.exit(1); }
const { origin, base, source } = resolveSite();
const errors = [], warns = [];
// '/repo/contact/' -> '/contact/'  (dist/ has no base folder)
const stripBase = (p) => (base && p.startsWith(base + '/') ? p.slice(base.length) : p);
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(dist).filter((f) => f.endsWith('.html'));
const preview = /noindex/.test(readFileSync(join(dist, 'index.html'), 'utf8')) && /DESIGN PREVIEW/.test(readFileSync(join(dist, 'index.html'), 'utf8'));
const canon = new Set();

for (const f of pages) {
  const rel = f.slice(dist.length).replace(/\\/g, '/'); // forward slashes on every OS
  const h = readFileSync(f, 'utf8');
  const e = (m) => errors.push(`${rel}: ${m}`);
  const is404 = rel === '/404.html';
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const c = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (!title) e('missing <title>'); else if (title.length > 65) e(`title too long (${title.length})`);
  if (!desc) e('missing meta description'); else if (desc.length > 165 || desc.length < 50) e(`description length ${desc.length}`);
  if (!c) e('missing canonical'); else { if (!c.endsWith('/') && !is404) e('canonical lacks trailing slash'); if (canon.has(c)) e('duplicate canonical ' + c); canon.add(c); }
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) e(`expected 1 <h1>, found ${h1}`);
  if (!/<html lang="en"/.test(h)) e('missing lang');
  if (!/property="og:image"/.test(h) || !/name="twitter:card"/.test(h)) e('missing social meta');
  if (/<script[^>]+src=/.test(h)) e('external script tag found');
  for (const m of h.matchAll(/<img\b[^>]*>/g)) { if (!/ alt="/.test(m[0])) e('img without alt'); if (!/ width=/.test(m[0]) || !/ height=/.test(m[0])) e('img without dimensions'); }
  // JSON-LD
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (ld.length !== 1) e('expected 1 JSON-LD block'); else {
    try {
      const g = JSON.parse(ld[0][1])['@graph'];
      const ids = new Set(g.map((n) => n['@id']).filter(Boolean));
      const refs = JSON.stringify(g).match(/"@id":"[^"]+"/g).map((s) => s.slice(7, -1));
      for (const r of new Set(refs)) if (!ids.has(r) && !r.includes('#profilepage')) e('dangling @id ' + r);
      const person = g.find((n) => n['@type'] === 'Person');
      if (!person || person.name !== 'Benjamin Anthony Panakal') e('Person node missing/incorrect');
      if (rel === '/index.html' && !g.some((n) => n['@type'] === 'ProfilePage')) e('home lacks ProfilePage');
    } catch (x) { e('invalid JSON-LD: ' + x.message); }
  }
  // internal links resolve
  for (const m of h.matchAll(/<a [^>]*href="(\/[^"#?]*)"/g)) {
    const t = stripBase(m[1]); const p = join(dist, t.endsWith('/') ? t + 'index.html' : t);
    if (!existsSync(p)) e('broken internal link ' + m[1]);
  }
  // every root-relative reference must carry the base path (GitHub Pages project sites)
  if (base) {
    const refs = [...h.matchAll(/(?:href|src)="(\/[^"\/][^"]*)"/g)].map((m) => m[1])
      .concat([...h.matchAll(/url\(["']?(\/[^)"'\/][^)"']*)/g)].map((m) => m[1]));
    for (const r of new Set(refs)) if (!r.startsWith(base + '/')) e(`reference missing base path "${base}": ${r}`);
  }
  // referenced local assets exist
  for (const m of h.matchAll(/(?:href|src)="(\/[^"\/][^"?#]*\.(?:woff2|png|svg|ico|webp|jpg|jpeg))"/g)) {
    if (!existsSync(join(dist, stripBase(m[1])))) e('missing asset ' + m[1]);
  }
  if (!is404 && !preview && !/index, follow/.test(h)) e('page is not indexable');
  if (source === 'placeholder' && !preview) warns.push('Local build: placeholder address (example.com) is used. GitHub Actions sets the real address automatically; nothing to edit.');
  if (source !== 'placeholder' && !h.includes(origin) && !is404 && !preview) e('production origin not found in page');
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
const sm = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
if (!preview && !robots.includes(`Sitemap: ${origin}${base}/sitemap.xml`)) errors.push('robots.txt Sitemap line does not match the production URL');
if (!preview && !sm.includes(`<loc>${origin}${base}/</loc>`)) errors.push('sitemap.xml does not list the production home URL');
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const path = stripBase(new URL(m[1]).pathname);
  if (!existsSync(join(dist, path, 'index.html'))) errors.push('sitemap URL has no page: ' + m[1]);
  if (!canon.has(m[1])) errors.push('sitemap URL differs from canonical: ' + m[1]);
}
console.log(`Checked ${pages.length} pages${preview ? ' (design preview)' : ''} for ${origin}${base || ''}/`);
[...new Set(warns)].slice(0, 1).forEach((w) => console.warn('WARN ' + w));
if (errors.length) { console.error(errors.map((x) => 'ERROR ' + x).join('\n')); process.exit(1); }
console.log('SEO checks passed.');
